import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function run() {
  const rows = await sql`SELECT id, business_name, wilaya, notes, business_type FROM outreach ORDER BY id ASC`;
  for (const r of rows) {
    const n = (r.notes || '').toLowerCase();
    if (n.includes('site:') || n.includes('shopify') || n.includes('flexdz') || n.includes('http') || n.includes('broken')) {
      console.log(`[SITE/PLATFORM] ${r.business_name} | Wilaya: ${r.wilaya} | Notes: ${r.notes}`);
    }
  }
}

run().catch(console.error);
