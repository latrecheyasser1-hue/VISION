import { sql } from '../src/db/client.js';

async function find() {
  const rows = await sql.query("SELECT * FROM outreach WHERE phone LIKE '%540219106%' OR phone LIKE '%540 21 91 06%'");
  console.log(rows);
}

find().catch(console.error);
