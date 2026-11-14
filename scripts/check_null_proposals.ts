import { sql } from '../src/db/client.js';

async function checkProposals() {
  const nullRows = await sql.query("SELECT id, business_name, business_type, wilaya, phone, custom_proposal FROM outreach WHERE custom_proposal IS NULL");
  console.log(`Total rows with custom_proposal IS NULL: ${nullRows.length}`);
  for (const r of nullRows) {
    console.log(`- [${r.business_name}] (${r.business_type} in ${r.wilaya}) phone: ${r.phone}`);
  }
}

checkProposals().catch(console.error);
