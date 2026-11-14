import { sql } from '../src/db/client.js';

async function run() {
  const logs = await sql.query("SELECT * FROM whatsapp_logs ORDER BY created_at DESC LIMIT 5");
  console.log('Recent logs:', logs);
}

run().catch(console.error);
