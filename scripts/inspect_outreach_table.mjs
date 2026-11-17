import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function run() {
  const rows = await sql`SELECT * FROM outreach LIMIT 2`;
  console.log('Columns:', Object.keys(rows[0]));
  const countRes = await sql`SELECT COUNT(*) FROM outreach`;
  console.log('Total count:', countRes[0].count);
}

run().catch(console.error);
