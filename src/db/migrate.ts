import * as dotenv from 'dotenv';
import { sql } from './client.js';

dotenv.config({ path: '.env.local' });

async function migrate() {
  console.log('Running safe migration on Neon Postgres...');

  // Update projects table with milestones
  await sql`
    ALTER TABLE projects 
    ADD COLUMN IF NOT EXISTS domain_included BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS hosting_included BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS m1_amount_dzd NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS m1_paid BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS m1_receipt_url TEXT,
    ADD COLUMN IF NOT EXISTS m1_paid_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS m2_amount_dzd NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS m2_paid BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS m2_receipt_url TEXT,
    ADD COLUMN IF NOT EXISTS m2_paid_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS m3_amount_dzd NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS m3_paid BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS m3_receipt_url TEXT,
    ADD COLUMN IF NOT EXISTS m3_paid_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS notes TEXT;
  `;

  // Update clients table
  await sql`
    ALTER TABLE clients 
    ADD COLUMN IF NOT EXISTS email VARCHAR(150);
  `;

  // Update invoices table
  await sql`
    ALTER TABLE invoices 
    ALTER COLUMN amount_dzd DROP NOT NULL,
    ADD COLUMN IF NOT EXISTS total_amount_dzd NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS m1_deposit_dzd NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS m2_design_dzd NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS m3_delivery_dzd NUMERIC(12, 2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS domain_included BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS hosting_included BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS pdf_url TEXT;
  `;

  // Calculate m1 (50%), m2 (20%), m3 (30%) for existing seeded projects
  await sql`
    UPDATE projects
    SET 
      m1_amount_dzd = price_total_dzd * 0.50,
      m2_amount_dzd = price_total_dzd * 0.20,
      m3_amount_dzd = price_total_dzd * 0.30,
      m1_paid = TRUE,
      m2_paid = TRUE,
      m3_paid = TRUE
    WHERE stage = 'delivered' AND m1_amount_dzd = 0;
  `;

  // Create meetings table
  await sql`
    CREATE TABLE IF NOT EXISTS meetings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(200) NOT NULL,
      client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
      project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
      lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
      type VARCHAR(50) NOT NULL DEFAULT 'discovery',
      meeting_date VARCHAR(20) NOT NULL,
      start_time VARCHAR(10) NOT NULL,
      end_time VARCHAR(10),
      platform VARCHAR(50) DEFAULT 'google_meet',
      link TEXT,
      location VARCHAR(200),
      agenda TEXT,
      notes TEXT,
      status VARCHAR(30) DEFAULT 'scheduled' NOT NULL,
      created_at TIMESTAMP DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW() NOT NULL
    );
  `;

  // Update outreach table with wilaya
  await sql`
    ALTER TABLE outreach
    ADD COLUMN IF NOT EXISTS wilaya VARCHAR(100);
  `;

  console.log('Migration completed successfully!');
}

migrate()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  });
