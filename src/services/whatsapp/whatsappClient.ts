import * as baileys from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { sql } from '../../db/client.js';
import { WhatsAppConnectionStatus, ChunkedMessage } from './types.js';

// Resolve Baileys imports safely across Node ESM / CJS bundles
const baileysObj = baileys as any;
const makeWASocket = baileysObj.default || baileysObj.makeWASocket || baileysObj;
const useMultiFileAuthState = baileysObj.useMultiFileAuthState || baileysObj.default?.useMultiFileAuthState;
const DisconnectReason = baileysObj.DisconnectReason || baileysObj.default?.DisconnectReason;
const fetchLatestBaileysVersion = baileysObj.fetchLatestBaileysVersion || baileysObj.default?.fetchLatestBaileysVersion;
const delay = baileysObj.delay || baileysObj.default?.delay || ((ms: number) => new Promise(res => setTimeout(res, ms)));


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
  private messageCache = new Map<string, any>();

  private constructor() {
    // On Vercel / AWS Lambda, process.cwd() is read-only (/var/task).
    // The only writable directory is os.tmpdir() (/tmp).
    const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
    const baseDir = isServerless ? os.tmpdir() : path.resolve(process.cwd(), 'data');
    this.sessionDir = path.resolve(baseDir, 'whatsapp_session');
    try {
      if (!fs.existsSync(this.sessionDir)) {
        fs.mkdirSync(this.sessionDir, { recursive: true });
      }
    } catch (err) {
      console.error('Failed to create session directory in constructor:', err);
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
   * Checks if a persistent WhatsApp session exists in Neon Postgres
   */
  public async hasSavedSessionInDb(): Promise<boolean> {
    try {
      const rows: any[] = await sql.query(`
        SELECT 1 FROM whatsapp_settings WHERE key = 'session_auth_data' AND value IS NOT NULL AND LENGTH(value) > 100 LIMIT 1
      `);
      return Boolean(rows && rows.length > 0);
    } catch {
      return false;
    }
  }

  /**
   * Ensures the WhatsApp socket is active and connected.
   * If credentials exist in DB or local disk, it restores and connects automatically.
   */
  public async ensureConnected(): Promise<void> {
    if (this.sock && this.status === 'connected') {
      return;
    }

    console.log('[WhatsApp] ensureConnected triggered. Current status:', this.status);
    await this.connect();

    // If currently connecting, wait up to 12 seconds for the connection to finalize
    if (this.status === 'connecting') {
      await new Promise<void>((resolve) => {
        const start = Date.now();
        const check = setInterval(() => {
          if (this.status === 'connected' || this.status === 'disconnected' || this.status === 'qr_ready' || Date.now() - start > 12000) {
            clearInterval(check);
            resolve();
          }
        }, 300);
      });
    }

    if (this.status !== 'connected') {
      if (this.status === 'qr_ready') {
        throw new Error('يرجى مسح رمز QR Code في لوحة التحكم لربط الواتساب أولاً.');
      }
      throw new Error('تعذر إكمال الاتصال بـ WhatsApp. يرجى الضغط على Connect WhatsApp والتأكد من فتح تطبيق الواتساب.');
    }
  }

  /**
   * Restores Baileys session files from Neon Postgres into local session directory
   */
  private async restoreSessionFromDb(): Promise<void> {
    try {
      const rows: any[] = await sql.query(`
        SELECT value FROM whatsapp_settings WHERE key = 'session_auth_data' LIMIT 1
      `);
      if (rows && rows.length > 0 && rows[0].value) {
        const fileMap = JSON.parse(rows[0].value);
        if (!fs.existsSync(this.sessionDir)) {
          fs.mkdirSync(this.sessionDir, { recursive: true });
        }
        for (const [filename, content] of Object.entries(fileMap)) {
          const filePath = path.join(this.sessionDir, filename);
          fs.writeFileSync(filePath, String(content), 'utf-8');
        }
        console.log(`Restored WhatsApp session (${Object.keys(fileMap).length} files) from Postgres`);
      }
    } catch (e) {
      console.error('Failed to restore WhatsApp session from DB:', e);
    }
  }

  /**
   * Persists Baileys session files to Neon Postgres for durability across serverless restarts
   */
  private async persistSessionToDb(): Promise<void> {
    try {
      if (!fs.existsSync(this.sessionDir)) return;
      const files = fs.readdirSync(this.sessionDir);
      const fileMap: Record<string, string> = {};
      for (const file of files) {
        const filePath = path.join(this.sessionDir, file);
        if (fs.statSync(filePath).isFile()) {
          fileMap[file] = fs.readFileSync(filePath, 'utf-8');
        }
      }
      if (Object.keys(fileMap).length > 0) {
        await sql.query(`
          INSERT INTO whatsapp_settings (key, value, updated_at)
          VALUES ('session_auth_data', $1, NOW())
          ON CONFLICT (key) DO UPDATE
          SET value = EXCLUDED.value, updated_at = NOW()
        `, [JSON.stringify(fileMap)]);
      }
    } catch (e) {
      console.error('Failed to persist WhatsApp session to DB:', e);
    }
  }

  /**
   * Cleans and normalizes Algerian phone numbers into international WhatsApp JID format
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

    if (this.isConnecting && this.status === 'qr_ready') {
      return;
    }

    this.isConnecting = true;
    this.status = 'connecting';

    try {
      if (!fs.existsSync(this.sessionDir)) {
        fs.mkdirSync(this.sessionDir, { recursive: true });
      }

      // Check if local session exists, otherwise restore from Neon database
      const credsFile = path.join(this.sessionDir, 'creds.json');
      if (!fs.existsSync(credsFile)) {
        await this.restoreSessionFromDb();
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.sessionDir);
      const { version } = await fetchLatestBaileysVersion();

      this.sock = makeWASocket({
        version,
        logger: this.logger,
        printQRInTerminal: false,
        auth: state,
        browser: ['VISION Digital Agency', 'Chrome', '1.0.0'],
        syncFullHistory: false,
        markOnlineOnConnect: true,
        getMessage: async (key: any) => {
          if (key?.id && this.messageCache.has(key.id)) {
            return this.messageCache.get(key.id);
          }
          return undefined;
        }
      });

      this.sock.ev.on('creds.update', async () => {
        await saveCreds();
        await this.persistSessionToDb();
      });

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
            try {
              fs.rmSync(this.sessionDir, { recursive: true, force: true });
              fs.mkdirSync(this.sessionDir, { recursive: true });
              await sql.query(`DELETE FROM whatsapp_settings WHERE key = 'session_auth_data'`);
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
          await this.persistSessionToDb();
        }
      });

      // Listen for incoming messages to automatically detect replies & handle handoff!
      this.sock.ev.on('messages.upsert', async ({ messages, type }: any) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
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

      // Wait up to 6 seconds for QR code or open connection so the HTTP response returns it immediately
      await new Promise<void>((resolve) => {
        const timeout = setTimeout(() => resolve(), 6000);
        const checkInterval = setInterval(() => {
          if (this.status === 'qr_ready' || this.status === 'connected') {
            clearInterval(checkInterval);
            clearTimeout(timeout);
            resolve();
          }
        }, 150);
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

        await sql.query(`
          UPDATE outreach
          SET status = 'responded',
              notes = $1,
              updated_at = NOW()
          WHERE id = $2
        `, [updatedNotes, prospect.id]);

        await sql.query(`
          INSERT INTO whatsapp_logs (outreach_id, phone, direction, message_type, content, status, created_at)
          VALUES ($1, $2, 'inbound', 'reply', $3, 'received', NOW())
        `, [prospect.id, prospect.phone, text]);
      } else {
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
      await this.ensureConnected();
    }

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

      await this.sock.sendPresenceUpdate('composing', jid);
      await delay(chunk.typingDelayMs);

      const sent = await this.sock.sendMessage(jid, { text: chunk.text });
      chunksSent++;
      if (sent?.key?.id && sent.message) {
        this.messageCache.set(sent.key.id, sent.message);
      }

      if (onProgress) {
        onProgress(chunk.partIndex, chunk.totalParts);
      }

      await this.sock.sendPresenceUpdate('paused', jid);

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
      await sql.query(`DELETE FROM whatsapp_settings WHERE key = 'session_auth_data'`);
    } catch (e) {
      // Ignore
    }
  }
}
