import { sql } from '../src/db/client.js';

async function checkRecentActivity() {
  const logs = await sql.query(`
    SELECT l.id, l.outreach_id, l.phone, l.status, l.created_at, o.business_name, o.business_type, o.status as o_status, o.last_contacted_at, o.custom_proposal
    FROM whatsapp_logs l
    LEFT JOIN outreach o ON l.outreach_id = o.id
    ORDER BY l.created_at DESC
    LIMIT 15
  `);

  console.log(`--- Recent WhatsApp Logs (${logs.length}) ---`);
  for (const l of logs) {
    console.log(`[${l.created_at}] to: ${l.phone} (${l.business_name}) | status: ${l.status}`);
  }

  const recentlyContacted = await sql.query(`
    SELECT id, business_name, business_type, wilaya, phone, status, last_contacted_at, custom_proposal
    FROM outreach
    WHERE last_contacted_at IS NOT NULL
    ORDER BY last_contacted_at DESC
    LIMIT 10
  `);

  console.log(`\n--- Recently Contacted Prospects (${recentlyContacted.length}) ---`);
  for (const p of recentlyContacted) {
    console.log(`[${p.last_contacted_at}] ${p.business_name} (${p.phone}) status: ${p.status}`);
  }
}

checkRecentActivity().catch(console.error);
