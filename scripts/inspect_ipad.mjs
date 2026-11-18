import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function inspectIpad() {
  const rows = await sql`SELECT * FROM outreach WHERE business_name ILIKE '%ipad%'`;
  console.log(rows[0]);
}

inspectIpad().catch(console.error);
