import { sql } from '../src/db/client.js';

async function check() {
  const logs = await sql.query('SELECT * FROM whatsapp_logs ORDER BY created_at DESC LIMIT 5');
  console.log('--- Recent WhatsApp Logs ---');
  console.log(logs);

  const statusCounts = await sql.query('SELECT status, count(*) FROM outreach GROUP BY status');
  console.log('\n--- Outreach Status Counts ---');
  console.log(statusCounts);
}

check().catch(console.error);
