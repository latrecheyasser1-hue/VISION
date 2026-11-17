import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function run() {
  const rows = await sql`SELECT id, business_name, custom_proposal FROM outreach ORDER BY id ASC LIMIT 5`;
  for (const r of rows) {
    console.log(`=== ${r.business_name} ===`);
    console.log(r.custom_proposal);
    console.log('-----------------------------');
  }
}

run().catch(console.error);
