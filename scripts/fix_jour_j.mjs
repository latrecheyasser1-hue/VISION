import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { generateTailoredProposal, cleanBusinessName } from './generator_core.mjs';

const sql = neon(process.env.DATABASE_URL);

async function fixJourJ() {
  const rows = await sql`SELECT id, business_name, business_type, wilaya, notes FROM outreach WHERE business_name LIKE '%Jour J%'`;
  for (const r of rows) {
    const cleanName = cleanBusinessName(r.business_name).replace(/[®©™]/g, '').trim();
    const newProp = generateTailoredProposal({
      business_name: cleanName,
      business_type: r.business_type,
      wilaya: r.wilaya,
      notes: r.notes
    });

    await sql`
      UPDATE outreach
      SET business_name = ${cleanName},
          custom_proposal = ${newProp}
      WHERE id = ${r.id}
    `;
    console.log(`Fixed store: ${cleanName}`);
  }
}

fixJourJ().catch(console.error);
