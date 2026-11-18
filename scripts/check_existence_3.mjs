import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function checkExistence() {
  const usernames = ['case.phone06', 'lavillafemme02', 'dreams_shopdz'];
  for (const u of usernames) {
    const rows = await sql`SELECT id, business_name, instagram_url FROM outreach WHERE instagram_url ILIKE ${'%' + u + '%'}`;
    console.log(`Checking ${u}:`, rows.length ? `FOUND: ${rows[0].business_name}` : 'NOT FOUND');
  }
}

checkExistence().catch(console.error);
