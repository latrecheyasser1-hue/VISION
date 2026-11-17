import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function run() {
  const rows = await sql`SELECT wilaya, COUNT(*) as count FROM outreach GROUP BY wilaya ORDER BY count DESC`;
  console.log(rows);
}

run().catch(console.error);
