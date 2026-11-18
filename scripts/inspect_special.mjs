import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function inspectSpecial() {
  const r = await sql`SELECT * FROM outreach WHERE business_name ILIKE '%Grande taille homme%'`;
  console.log(r[0]);
}

inspectSpecial().catch(console.error);
