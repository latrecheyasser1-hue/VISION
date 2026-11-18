import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function checkTypes() {
  const rows = await sql`SELECT business_type, count(*) as cnt FROM outreach GROUP BY business_type ORDER BY cnt DESC`;
  console.log('Distinct business types in DB:');
  for (const r of rows) {
    console.log(`- "${r.business_type}": ${r.cnt}`);
  }
}

checkTypes().catch(console.error);
