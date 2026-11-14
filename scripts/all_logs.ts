import { sql } from '../src/db/client.js';

async function allLogs() {
  const rows = await sql.query('SELECT id, phone, direction, message_type, status, created_at, content FROM whatsapp_logs ORDER BY created_at DESC');
  console.log(`Total whatsapp_logs rows: ${rows.length}`);
  for (const r of rows) {
    console.log(`[${r.created_at}] to: ${r.phone} | status: ${r.status} | content: ${r.content.substring(0, 40)}...`);
  }
}

allLogs().catch(console.error);
