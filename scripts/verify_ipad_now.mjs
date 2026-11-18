import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function checkIpadNow() {
  const r = await sql`SELECT id, business_name, business_type, custom_proposal FROM outreach WHERE business_name ILIKE '%ipad%'`;
  console.log(r[0]);
}

checkIpadNow().catch(console.error);
