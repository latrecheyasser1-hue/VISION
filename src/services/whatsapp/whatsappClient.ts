import baileysPkg from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import { sql } from '../../db/client.js';
import { WhatsAppConnectionStatus, ChunkedMessage } from './types.js';

// Resolve Baileys imports safely for Node ESM / CommonJS compatibility
const makeWASocket = (baileysPkg as any).default || baileysPkg;
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  delay
} = baileysPkg as any;

export class WhatsAppClient {
  private static instance: WhatsAppClient | null = null;
  private sock: any = null;
  private status: WhatsAppConnectionStatus = 'disconnected';
  private qrCodeDataUrl: string | null = null;
  private connectedPhone: string | null = null;
  private sessionDir: string;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private logger = pino({ level: 'silent' });

  private constructor() {
    this.sessionDir = path.resolve(process.cwd(), 'data', 'whatsapp_session');
    if (!fs.existsSync(this.sessionDir)) {
      fs.mkdirSync(this.sessionDir, { recursive: true });
    }
  }

  public static getInstance(): WhatsAppClient {
    if (!WhatsAppClient.instance) {
      WhatsAppClient.instance = new WhatsAppClient();
    }
    return WhatsAppClient.instance;
  }

  public getStatus() {
    return {
      status: this.status,
      connectedPhone: this.connectedPhone,
      hasQr: !!this.qrCodeDataUrl,
      qrCodeDataUrl: this.qrCodeDataUrl
    };
  }

  /**
   * Cleans and normalizes Algerian phone numbers into international WhatsApp JID format
   * Examples: '0771335039' -> '213771335039@s.whatsapp.net'
   *           '+213 550 12 34 56' -> '213550123456@s.whatsapp.net'
   */
  public normalizePhoneToJid(phone: string): string | null {
    if (!phone) return null;
    let cleaned = phone.replace(/[^0-9]/g, '');

    if (cleaned.startsWith('00213')) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 10) {
      cleaned = '213' + cleaned.substring(1);
    } else if (!cleaned.startsWith('213') && cleaned.length === 9) {
      cleaned = '213' + cleaned;
    }

    if (cleaned.length < 11 || cleaned.length > 15) {
      return null;
    }

    return `${cleaned}@s.whatsapp.net`;
  }

  /**
   * Cleans JID back to an Algerian phone representation for database lookup
   * '213771335039@s.whatsapp.net' -> '0771335039'
   */
  public cleanJidToLocalPhone(jid: string): string {
    const digits = jid.split('@')[0].replace(/[^0-9]/g, '');
    if (digits.startsWith('213') && digits.length === 12) {
      return '0' + digits.substring(3);
    }
    return digits;
  }

  /**
   * Initializes Baileys WhatsApp Web session and generates QR code if needed
   */
  public async connect(): Promise<void> {
    if (this.sock && this.status === 'connected') {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    this.isConnecting = true;
    this.status = 'connecting';

    try {
      const { state, saveCreds } = await useMultiFileAuthState(this.sessionDir);
      const { version } = await fetchLatestBaileysVersion();

      this.sock = makeWASocket({
        version,
        logger: this.logger,
        printQRInTerminal: false,
        auth: state,
        browser: ['VISION Digital Agency', 'Chrome', '1.0.0'],
        syncFullHistory: false,
        markOnlineOnConnect: true
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            this.qrCodeDataUrl = await QRCode.toDataURL(qr, { margin: 2, scale: 7 });
            this.status = 'qr_ready';
          } catch (err) {
            console.error('Failed to generate QR data URL:', err);
          }
        }

        if (connection === 'close') {
          this.isConnecting = false;
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          console.log(`WhatsApp connection closed. Code: ${statusCode}, Reconnect: ${shouldReconnect}`);

          if (statusCode === DisconnectReason.loggedOut) {
            this.status = 'disconnected';
            this.connectedPhone = null;
            this.qrCodeDataUrl = null;
            this.sock = null;
            // Clean up session directory if logged out
            try {
              fs.rmSync(this.sessionDir, { recursive: true, force: true });
              fs.mkdirSync(this.sessionDir, { recursive: true });
            } catch (e) {
              console.error('Error clearing session dir:', e);
            }
          } else if (shouldReconnect) {
            this.status = 'connecting';
            this.reconnectAttempts++;
            const backoff = Math.min(30000, 3000 * this.reconnectAttempts);
            setTimeout(() => {
              this.connect().catch(console.error);
            }, backoff);
          } else {
            this.status = 'disconnected';
            this.sock = null;
          }
        } else if (connection === 'open') {
          this.isConnecting = false;
          this.status = 'connected';
          this.qrCodeDataUrl = null;
          this.reconnectAttempts = 0;

          const rawId = this.sock?.user?.id || '';
          this.connectedPhone = this.cleanJidToLocalPhone(rawId);
          console.log(`WhatsApp Bot connected successfully as: ${this.connectedPhone}`);
        }
      });

      // Listen for incoming messages to automatically detect replies & handle handoff!
      this.sock.ev.on('messages.upsert', async ({ messages, type }: any) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
          // Ignore own messages or system broadcasts
          if (msg.key.fromMe) continue;
          const remoteJid = msg.key.remoteJid;
          if (!remoteJid || remoteJid.includes('@g.us') || remoteJid.includes('broadcast')) continue;

          const rawText = msg.message?.conversation || 
                          msg.message?.extendedTextMessage?.text || 
                          msg.message?.imageMessage?.caption || '';

          if (!rawText.trim()) continue;

          await this.handleIncomingClientMessage(remoteJid, rawText.trim());
        }
      });

    } catch (err) {
      this.isConnecting = false;
      this.status = 'disconnected';
      console.error('Error establishing WhatsApp connection:', err);
      throw err;
    }
  }

  /**
   * When an incoming message arrives from a prospect:
   * 1. Matches the prospect by phone in the outreach ledger
   * 2. Sets outreach.status = 'responded'
   * 3. Appends note about the response
   * 4. Logs to whatsapp_logs
   * 5. The bot STOPS contacting this person immediately!
   */
  private async handleIncomingClientMessage(remoteJid: string, text: string): Promise<void> {
    try {
      const localPhone = this.cleanJidToLocalPhone(remoteJid);
      const internationalDigits = remoteJid.split('@')[0];

      // Query database for matching prospect by phone
      const matchingRows: any[] = await sql.query(`
        SELECT id, business_name, status, notes, phone
        FROM outreach
        WHERE phone IS NOT NULL
          AND (
            phone LIKE $1
            OR REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE $2
            OR REPLACE(REPLACE(phone, ' ', ''), '-', '') LIKE $3
          )
        LIMIT 1
      `, [`%${localPhone}%`, `%${localPhone}%`, `%${internationalDigits}%`]);

      if (matchingRows && matchingRows.length > 0) {
        const prospect = matchingRows[0];
        console.log(`[HANDOFF DETECTED] Prospect "${prospect.business_name}" (${prospect.phone}) replied on WhatsApp!`);

        const timeStampStr = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Algiers' });
        const updatedNotes = `${prospect.notes ? prospect.notes + '\n' : ''}[Client Replied on WhatsApp ${timeStampStr}]: "${text.substring(0, 150)}"`;

        // Update status to responded and mark handoff
        await sql.query(`
          UPDATE outreach
          SET status = 'responded',
              notes = $1,
              updated_at = NOW()
          WHERE id = $2
        `, [updatedNotes, prospect.id]);

        // Audit log
        await sql.query(`
          INSERT INTO whatsapp_logs (outreach_id, phone, direction, message_type, content, status, created_at)
          VALUES ($1, $2, 'inbound', 'reply', $3, 'received', NOW())
        `, [prospect.id, prospect.phone, text]);
      } else {
        // Unknown prospect response, log anyway
        await sql.query(`
          INSERT INTO whatsapp_logs (phone, direction, message_type, content, status, created_at)
          VALUES ($1, 'inbound', 'reply', $2, 'received', NOW())
        `, [localPhone, text]);
      }
    } catch (err) {
      console.error('Error handling incoming WhatsApp client message:', err);
    }
  }

  /**
   * Sends a chunked message simulating authentic human typing and delays
   */
  public async sendChunkedMessage(
    targetPhone: string,
    chunks: ChunkedMessage[],
    onProgress?: (partIndex: number, totalParts: number) => void
  ): Promise<{ success: boolean; jid: string; totalChunksSent: number }> {
    if (!this.sock || this.status !== 'connected') {
      throw new Error('WhatsApp Bot is not connected. Please scan the QR Code first.');
    }

    const jid = this.normalizePhoneToJid(targetPhone);
    if (!jid) {
      throw new Error(`Invalid phone number: ${targetPhone}`);
    }

    let chunksSent = 0;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // 1. Send "composing..." (typing presence indicator)
      await this.sock.sendPresenceUpdate('composing', jid);

      // 2. Wait typing delay
      await delay(chunk.typingDelayMs);

      // 3. Send text message chunk
      await this.sock.sendMessage(jid, { text: chunk.text });
      chunksSent++;

      if (onProgress) {
        onProgress(chunk.partIndex, chunk.totalParts);
      }

      // 4. Return presence to paused
      await this.sock.sendPresenceUpdate('paused', jid);

      // 5. If there is a subsequent chunk, wait pauseAfterMs
      if (i < chunks.length - 1 && chunk.pauseAfterMs > 0) {
        await delay(chunk.pauseAfterMs);
      }
    }

    return {
      success: true,
      jid,
      totalChunksSent: chunksSent
    };
  }

  /**
   * Disconnects and purges active session
   */
  public async disconnect(): Promise<void> {
    if (this.sock) {
      try {
        await this.sock.logout();
      } catch (err) {
        // Ignore logout error
      }
      this.sock = null;
    }
    this.status = 'disconnected';
    this.connectedPhone = null;
    this.qrCodeDataUrl = null;

    try {
      fs.rmSync(this.sessionDir, { recursive: true, force: true });
      fs.mkdirSync(this.sessionDir, { recursive: true });
    } catch (e) {
      // Ignore
    }
  }
}
