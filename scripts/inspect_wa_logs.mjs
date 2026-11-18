import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function inspectWhatsappLogs() {
  const rows = await sql`SELECT * FROM whatsapp_logs WHERE content ILIKE '%كتالوج%' OR content ILIKE '%catalogue%'`;
  for (const r of rows) {
    console.log(r);
  }
}

inspectWhatsappLogs().catch(console.error);
