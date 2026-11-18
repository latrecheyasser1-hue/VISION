import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function verifyNoCatalogue() {
  const rows = await sql`
    SELECT id, business_name, custom_proposal 
    FROM outreach 
    WHERE custom_proposal ILIKE '%كتالوج%' 
       OR custom_proposal ILIKE '%catalogue%'
  `;

  console.log(`Checking for "كتالوج" in outreach table...`);
  console.log(`Found: ${rows.length} rows.`);
  if (rows.length > 0) {
    for (const r of rows) {
      console.log(`- ${r.business_name} (${r.id})`);
    }
  } else {
    console.log('PERFECT! ZERO instances of "كتالوج" in the entire database!');
  }
}

verifyNoCatalogue().catch(console.error);
