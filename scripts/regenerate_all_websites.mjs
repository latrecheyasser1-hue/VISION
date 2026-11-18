import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { generateTailoredProposal } from './generator_core.mjs';

const sql = neon(process.env.DATABASE_URL);

async function regenerateAll() {
  const rows = await sql`
    SELECT id, business_name, business_type, wilaya, notes, instagram_url 
    FROM outreach 
    ORDER BY id ASC
  `;
  console.log(`Regenerating proposals for all ${rows.length} stores to strictly use Website (Site web / المتجر الإلكتروني) and eliminate "كتالوج"...`);

  let count = 0;
  for (const r of rows) {
    const proposal = generateTailoredProposal(r);
    await sql`
      UPDATE outreach 
      SET custom_proposal = ${proposal},
          updated_at = NOW() 
      WHERE id = ${r.id}
    `;
    count++;
  }

  console.log(`Successfully updated ${count} stores in database!`);
}

regenerateAll().catch(console.error);
