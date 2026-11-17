import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

// Import the generator logic or copy
import { generateTailoredProposal, resolveTrueWilaya } from './generator_core.mjs';

async function showSamples() {
  const targets = [
    'Jouriya',
    'Walid Luxury',
    'Gresley',
    'Sem',
    'MS Boutique',
    'Wolf',
    'Shopman',
    'istanbul',
    'Kami',
    'Yakoubi'
  ];

  for (const t of targets) {
    const rows = await sql`SELECT id, business_name, business_type, wilaya, notes FROM outreach WHERE business_name ILIKE ${'%' + t + '%'} LIMIT 1`;
    if (rows.length > 0) {
      const r = rows[0];
      const prop = generateTailoredProposal(r);
      console.log(`\n======================================================`);
      console.log(`STORE: ${r.business_name} | WILAYA: ${resolveTrueWilaya(r.wilaya, r.business_name, r.notes)}`);
      console.log(prop);
    }
  }
}

showSamples().catch(console.error);
