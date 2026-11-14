import { sql } from '../src/db/client.js';

async function checkAuth() {
  const rows: any[] = await sql.query("SELECT value FROM whatsapp_settings WHERE key = 'session_auth_data'");
  if (rows.length && rows[0].value) {
    try {
      const parsed = JSON.parse(rows[0].value);
      console.log('Session Auth Keys in DB:', Object.keys(parsed));
      console.log('Has creds.json:', !!parsed['creds.json']);
      if (parsed['creds.json']) {
        const creds = JSON.parse(parsed['creds.json']);
        console.log('Creds me:', creds.me);
        console.log('Creds registered:', creds.registered);
      }
    } catch (e: any) {
      console.log('Error parsing session data:', e.message);
    }
  } else {
    console.log('No session_auth_data found in DB!');
  }
}

checkAuth().catch(console.error);
