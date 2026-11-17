import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function run() {
  const rows = await sql`SELECT id, business_name, business_type, wilaya, notes, custom_proposal FROM outreach ORDER BY id ASC LIMIT 10`;
  for (const r of rows) {
    console.log(`ID: ${r.id} | Name: ${r.business_name} | Wilaya: ${r.wilaya} | Type: ${r.business_type}`);
    console.log(`  Notes: ${r.notes}`);
    console.log(`  Proposal part 1: ${(r.custom_proposal || '').split('---')[0]?.trim()?.substring(0, 80)}...`);
  }
}

run().catch(console.error);
