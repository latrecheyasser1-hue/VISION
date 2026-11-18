import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function inspectStores() {
  const names = [
    'Grande taille homme',
    '🎀🛍 Boutique Ritaj 🛍🎀',
    'i Store',
    'Rhino Phone El Achour',
    'SUNRISE Bab Ezzouar',
    'Mercerie Crystal setif',
    'Yass Store',
    'Cadeau Biba',
    'Dari Belle'
  ];

  for (const n of names) {
    const rows = await sql`SELECT id, business_name, business_type, phone, instagram_url, notes FROM outreach WHERE business_name ILIKE ${'%' + n.replace(/[^a-zA-Z0-9]/g, '') + '%'}`;
    if (rows.length) {
      console.log('--- STORE ---');
      console.log(rows[0]);
    }
  }
}

inspectStores().catch(console.error);
