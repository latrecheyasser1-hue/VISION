import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { generateTailoredProposal, resolveTrueWilaya } from './generator_core.mjs';

const sql = neon(process.env.DATABASE_URL);

async function updateAllProposals() {
  console.log('Fetching all rows from outreach table...');
  const rows = await sql`SELECT id, business_name, business_type, wilaya, notes FROM outreach ORDER BY id ASC`;
  console.log(`Fetched ${rows.length} rows.`);

  let updated = 0;
  for (const r of rows) {
    const newProposal = generateTailoredProposal(r);
    const resolvedWilaya = resolveTrueWilaya(r.wilaya, r.business_name, r.notes);

    // Update custom_proposal and normalize wilaya if needed
    await sql`
      UPDATE outreach 
      SET custom_proposal = ${newProposal},
          wilaya = ${resolvedWilaya},
          updated_at = NOW()
      WHERE id = ${r.id}
    `;
    updated++;
    if (updated % 25 === 0 || updated === rows.length) {
      console.log(`Updated ${updated}/${rows.length} records...`);
    }
  }

  console.log(`All ${updated} records successfully updated in Neon Postgres!`);
}

updateAllProposals().catch(console.error);
