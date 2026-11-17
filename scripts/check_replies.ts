import { db } from '../src/db/client.js';
import { outreach, whatsappLogs } from '../src/db/schema.js';
import { eq, desc } from 'drizzle-orm';

async function main() {
  const replies = await db.select().from(whatsappLogs).where(eq(whatsappLogs.direction, 'inbound')).orderBy(desc(whatsappLogs.createdAt));
  console.log(`--- Inbound WhatsApp Logs (${replies.length}) ---`);
  replies.forEach(r => {
    console.log(`[${r.createdAt}] Phone: ${r.phone} | Content: "${r.content}"`);
  });

  const responded = await db.select({
    businessName: outreach.businessName,
    phone: outreach.phone,
    status: outreach.status,
    notes: outreach.notes,
    lastContactedAt: outreach.lastContactedAt
  }).from(outreach).where(eq(outreach.status, 'responded'));

  console.log(`--- Responded Prospects (${responded.length}) ---`);
  console.log(JSON.stringify(responded, null, 2));

  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
