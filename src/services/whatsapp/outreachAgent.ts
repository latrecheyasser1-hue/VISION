import { WhatsAppClient } from './whatsappClient.js';
import { generateChunkedProposal, generateFollowUp1, generateFollowUp2 } from './messageGenerator.js';
import { WhatsAppAgentSettings, GeneratedOutreachContent } from './types.js';
import { sql } from '../../db/client.js';

export class WhatsAppOutreachAgent {
  private static instance: WhatsAppOutreachAgent | null = null;
  private client: WhatsAppClient;
  private isProcessingQueue: boolean = false;
  private intervalTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.client = WhatsAppClient.getInstance();
  }

  public static getInstance(): WhatsAppOutreachAgent {
    if (!WhatsAppOutreachAgent.instance) {
      WhatsAppOutreachAgent.instance = new WhatsAppOutreachAgent();
    }
    return WhatsAppOutreachAgent.instance;
  }

  /**
   * Retrieves persistent settings from PostgreSQL
   */
  public async getSettings(): Promise<WhatsAppAgentSettings> {
    const rows: any[] = await sql.query(`SELECT key, value FROM whatsapp_settings`);
    const map = new Map<string, string>();
    for (const r of rows) {
      map.set(r.key, r.value);
    }

    return {
      executionEnabled: map.get('execution_enabled') === 'true',
      testPhone: map.get('test_phone') || '0771335039',
      dailyLimit: parseInt(map.get('daily_limit') || '30', 10),
      workHoursStart: parseInt(map.get('work_hours_start') || '10', 10),
      workHoursEnd: parseInt(map.get('work_hours_end') || '21', 10),
      minDelayProspectSeconds: parseInt(map.get('min_delay_prospect_seconds') || '180', 10),
      maxDelayProspectSeconds: parseInt(map.get('max_delay_prospect_seconds') || '360', 10)
    };
  }

  /**
   * Updates execution toggle or other settings
   */
  public async updateSetting(key: string, value: string): Promise<void> {
    await sql.query(`
      INSERT INTO whatsapp_settings (key, value, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = NOW()
    `, [key, value]);
  }

  /**
   * Generates a preview of the chunked proposal for a specific prospect
   */
  public async previewProposal(outreachId: string): Promise<GeneratedOutreachContent> {
    const rows: any[] = await sql.query(`
      SELECT business_name, business_type, wilaya, phone, instagram_url, custom_proposal
      FROM outreach
      WHERE id = $1
    `, [outreachId]);

    if (!rows || rows.length === 0) {
      throw new Error('Prospect not found');
    }

    const prospect = {
      businessName: rows[0].business_name,
      businessType: rows[0].business_type,
      wilaya: rows[0].wilaya,
      phone: rows[0].phone,
      instagramUrl: rows[0].instagram_url,
      customProposal: rows[0].custom_proposal
    };

    return generateChunkedProposal(prospect);
  }

  /**
   * Sends a real chunked test message to the specified test phone (or default)
   * This allows the user to test typing indicators, delays, and 4-chunk layout on their own WhatsApp.
   */
  public async sendTestMessage(targetPhone?: string): Promise<{ success: boolean; jid: string; chunksSent: number }> {
    const settings = await this.getSettings();
    const phone = (targetPhone || settings.testPhone).trim();

    if (!phone) {
      throw new Error('Please provide a valid test phone number.');
    }

    // Build mock proposal for preview/test
    const testContent = generateChunkedProposal({
      businessName: 'Boutique Test Vision',
      businessType: 'Streetwear & Vêtements',
      wilaya: 'Alger',
      phone: phone
    });

    console.log(`Sending WhatsApp Test Chunks to: ${phone}`);

    const result = await this.client.sendChunkedMessage(phone, testContent.chunks);

    // Audit log
    await sql.query(`
      INSERT INTO whatsapp_logs (phone, direction, message_type, content, status, created_at)
      VALUES ($1, 'outbound', 'test', $2, 'sent', NOW())
    `, [phone, testContent.fullText]);

    return {
      success: true,
      jid: result.jid,
      chunksSent: result.totalChunksSent
    };
  }

  /**
   * Summary metrics for the WhatsApp agent dashboard
   */
  public async getAgentStats() {
    const settings = await this.getSettings();
    const clientStatus = this.client.getStatus();

    const todayDateStr = new Date().toISOString().split('T')[0];

    const sentTodayRows: any[] = await sql.query(`
      SELECT COUNT(DISTINCT outreach_id) as count
      FROM whatsapp_logs
      WHERE direction = 'outbound'
        AND created_at >= CURRENT_DATE
    `);

    const respondedRows: any[] = await sql.query(`
      SELECT COUNT(*) as count
      FROM outreach
      WHERE status = 'responded'
    `);

    const queuedRows: any[] = await sql.query(`
      SELECT COUNT(*) as count
      FROM outreach
      WHERE status = 'no_reply'
        AND phone IS NOT NULL
        AND phone != ''
        AND last_contacted_at IS NULL
    `);

    const followUpPendingRows: any[] = await sql.query(`
      SELECT COUNT(*) as count
      FROM outreach
      WHERE status = 'message_sent'
        AND follow_up_count < 2
    `);

    return {
      connection: clientStatus,
      executionEnabled: settings.executionEnabled,
      testPhone: settings.testPhone,
      dailyLimit: settings.dailyLimit,
      sentToday: parseInt(sentTodayRows[0]?.count || '0', 10),
      respondedTotal: parseInt(respondedRows[0]?.count || '0', 10),
      queuedInitialTotal: parseInt(queuedRows[0]?.count || '0', 10),
      queuedFollowUpTotal: parseInt(followUpPendingRows[0]?.count || '0', 10)
    };
  }

  /**
   * Checks if current time is within Algerian working hours (default 10:00 - 21:00)
   */
  private isWithinBusinessHours(startHour: number, endHour: number): boolean {
    const now = new Date();
    // Get hour in Algiers timezone (UTC+1)
    const algiersTime = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Algiers',
      hour: 'numeric',
      hour12: false
    }).format(now);
    const hour = parseInt(algiersTime, 10);
    return hour >= startHour && hour < endHour;
  }

  /**
   * Starts background monitoring queue.
   * SAFETY GATE: When executionEnabled is false, this loop runs NO-OP and sends zero messages!
   */
  public startBackgroundWorker(intervalMs: number = 60000): void {
    if (this.intervalTimer) return;

    this.intervalTimer = setInterval(async () => {
      try {
        await this.processQueueTick();
      } catch (err) {
        console.error('Error in WhatsApp background worker tick:', err);
      }
    }, intervalMs);

    console.log('WhatsApp Outreach background worker initialized (Safety Gate Active).');
  }

  /**
   * Processes a single prospective dispatch if gates permit
   */
  public async processQueueTick(): Promise<void> {
    const settings = await this.getSettings();

    // 1. SAFETY GATE CHECK: If execution is paused or disabled, DO NOTHING!
    if (!settings.executionEnabled) {
      return;
    }

    // 2. Client connection check
    const clientStatus = this.client.getStatus();
    if (clientStatus.status !== 'connected') {
      return;
    }

    // 3. Work hours check
    if (!this.isWithinBusinessHours(settings.workHoursStart, settings.workHoursEnd)) {
      return;
    }

    if (this.isProcessingQueue) {
      return;
    }

    // 4. Daily quota check
    const sentTodayRows: any[] = await sql.query(`
      SELECT COUNT(DISTINCT outreach_id) as count
      FROM whatsapp_logs
      WHERE direction = 'outbound'
        AND created_at >= CURRENT_DATE
    `);
    const sentToday = parseInt(sentTodayRows[0]?.count || '0', 10);
    if (sentToday >= settings.dailyLimit) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      // First priority: Follow-ups that are due
      const followUpSent = await this.checkAndSendDueFollowUp();
      if (followUpSent) {
        return;
      }

      // Second priority: Send next fresh proposal
      await this.sendNextFreshProposal();
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Sends next initial proposal from the queue
   */
  private async sendNextFreshProposal(): Promise<boolean> {
    // Pick 1 prospect who has not been contacted yet
    const candidateRows: any[] = await sql.query(`
      SELECT id, business_name, business_type, wilaya, phone, instagram_url, custom_proposal
      FROM outreach
      WHERE status = 'no_reply'
        AND phone IS NOT NULL
        AND LENGTH(TRIM(phone)) >= 9
        AND last_contacted_at IS NULL
      ORDER BY created_at ASC
      LIMIT 1
    `);

    if (!candidateRows || candidateRows.length === 0) {
      return false;
    }

    const prospect = candidateRows[0];
    const generated = generateChunkedProposal({
      businessName: prospect.business_name,
      businessType: prospect.business_type,
      wilaya: prospect.wilaya,
      phone: prospect.phone,
      instagramUrl: prospect.instagram_url,
      customProposal: prospect.custom_proposal
    });

    console.log(`[OUTREACH AGENT] Dispatching Proposal Chunks to: ${prospect.business_name} (${prospect.phone})`);

    const result = await this.client.sendChunkedMessage(prospect.phone, generated.chunks);

    // Update status in database
    await sql.query(`
      UPDATE outreach
      SET status = 'message_sent',
          last_contacted_at = NOW(),
          follow_up_count = 0,
          whatsapp_chat_jid = $1,
          updated_at = NOW()
      WHERE id = $2
    `, [result.jid, prospect.id]);

    // Audit log
    await sql.query(`
      INSERT INTO whatsapp_logs (outreach_id, phone, direction, message_type, content, status, created_at)
      VALUES ($1, $2, 'outbound', 'proposal', $3, 'sent', NOW())
    `, [prospect.id, prospect.phone, generated.fullText]);

    return true;
  }

  /**
   * Checks and sends due follow-up (48h or 4 days)
   */
  private async checkAndSendDueFollowUp(): Promise<boolean> {
    // 1. Follow-up 1: last_contacted_at <= NOW() - 48 hours AND follow_up_count = 0
    const fu1Rows: any[] = await sql.query(`
      SELECT id, business_name, business_type, wilaya, phone, last_contacted_at
      FROM outreach
      WHERE status = 'message_sent'
        AND follow_up_count = 0
        AND last_contacted_at <= NOW() - INTERVAL '48 hours'
        AND phone IS NOT NULL
      ORDER BY last_contacted_at ASC
      LIMIT 1
    `);

    if (fu1Rows && fu1Rows.length > 0) {
      const prospect = fu1Rows[0];
      const fu1 = generateFollowUp1(prospect);

      console.log(`[OUTREACH AGENT] Dispatching Follow-up 1 to: ${prospect.business_name} (${prospect.phone})`);
      const result = await this.client.sendChunkedMessage(prospect.phone, fu1.chunks);

      await sql.query(`
        UPDATE outreach
        SET follow_up_count = 1,
            last_contacted_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
      `, [prospect.id]);

      await sql.query(`
        INSERT INTO whatsapp_logs (outreach_id, phone, direction, message_type, content, status, created_at)
        VALUES ($1, $2, 'outbound', 'followup_1', $3, 'sent', NOW())
      `, [prospect.id, prospect.phone, fu1.fullText]);

      return true;
    }

    // 2. Follow-up 2: last_contacted_at <= NOW() - 4 days AND follow_up_count = 1
    const fu2Rows: any[] = await sql.query(`
      SELECT id, business_name, business_type, wilaya, phone, last_contacted_at
      FROM outreach
      WHERE status = 'message_sent'
        AND follow_up_count = 1
        AND last_contacted_at <= NOW() - INTERVAL '4 days'
        AND phone IS NOT NULL
      ORDER BY last_contacted_at ASC
      LIMIT 1
    `);

    if (fu2Rows && fu2Rows.length > 0) {
      const prospect = fu2Rows[0];
      const fu2 = generateFollowUp2(prospect);

      console.log(`[OUTREACH AGENT] Dispatching Follow-up 2 (Final) to: ${prospect.business_name} (${prospect.phone})`);
      const result = await this.client.sendChunkedMessage(prospect.phone, fu2.chunks);

      await sql.query(`
        UPDATE outreach
        SET follow_up_count = 2,
            last_contacted_at = NOW(),
            updated_at = NOW()
      WHERE id = $1
      `, [prospect.id]);

      await sql.query(`
        INSERT INTO whatsapp_logs (outreach_id, phone, direction, message_type, content, status, created_at)
        VALUES ($1, $2, 'outbound', 'followup_2', $3, 'sent', NOW())
      `, [prospect.id, prospect.phone, fu2.fullText]);

      return true;
    }

    return false;
  }
}
