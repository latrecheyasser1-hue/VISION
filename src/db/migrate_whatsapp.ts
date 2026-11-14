import * as dotenv from 'dotenv';
import { sql } from './client.js';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
dotenv.config();

async function migrateWhatsapp() {
  console.log('Running safe WhatsApp Outreach migration on Neon Postgres...');

  // 1. Add WhatsApp tracking columns to outreach table
  await sql`
    ALTER TABLE outreach 
    ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS follow_up_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS custom_proposal TEXT,
    ADD COLUMN IF NOT EXISTS whatsapp_chat_jid VARCHAR(100);
  `;

  // 2. Create whatsapp_settings table
  await sql`
    CREATE TABLE IF NOT EXISTS whatsapp_settings (
      key VARCHAR(100) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // 3. Insert default settings with SAFETY GATE DISABLED BY DEFAULT (execution_enabled = false)
  await sql`
    INSERT INTO whatsapp_settings (key, value, updated_at)
    VALUES 
      ('execution_enabled', 'false', NOW()),
      ('test_phone', '0771335039', NOW()),
      ('daily_limit', '30', NOW()),
      ('work_hours_start', '10', NOW()),
      ('work_hours_end', '21', NOW()),
      ('min_delay_prospect_seconds', '180', NOW()),
      ('max_delay_prospect_seconds', '360', NOW())
    ON CONFLICT (key) DO NOTHING;
  `;

  // 4. Create whatsapp_logs table
  await sql`
    CREATE TABLE IF NOT EXISTS whatsapp_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      outreach_id UUID REFERENCES outreach(id) ON DELETE SET NULL,
      phone VARCHAR(50) NOT NULL,
      direction VARCHAR(20) NOT NULL,
      message_type VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      status VARCHAR(30) DEFAULT 'sent' NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  console.log('WhatsApp migration completed successfully!');
}

migrateWhatsapp()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('WhatsApp migration failed:', e);
    process.exit(1);
  });
