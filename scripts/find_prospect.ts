import { sql } from '../src/db/client.js';

async function findProspect() {
  const rows = await sql.query("SELECT * FROM outreach WHERE phone LIKE '%542%' OR phone LIKE '%0294%' OR business_name ILIKE '%biba%'");
  console.log('Matching rows:', rows);
}

findProspect().catch(console.error);
