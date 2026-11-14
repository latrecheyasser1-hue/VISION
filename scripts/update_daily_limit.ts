import { sql } from '../src/db/client.js';

async function updateDaily() {
  await sql.query("UPDATE whatsapp_settings SET value = '9999' WHERE key = 'daily_limit'");
  console.log('Successfully updated daily_limit to 9999 in whatsapp_settings');
}

updateDaily().catch(console.error);
