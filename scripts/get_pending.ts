import { db } from '../src/db/client.js';
import { outreach } from '../src/db/schema.js';
import { eq, isNull, and } from 'drizzle-orm';

async function main() {
  const pending = await db.select({
    id: outreach.id,
    businessName: outreach.businessName,
    businessType: outreach.businessType,
    phone: outreach.phone
  })
  .from(outreach)
  .where(and(eq(outreach.status, 'no_reply'), isNull(outreach.lastContactedAt)));

  console.log(`Pending uncontacted prospects: ${pending.length}`);
  pending.slice(0, 10).forEach((p, i) => {
    console.log(`${i+1}. ${p.businessName} (${p.phone}) - ${p.businessType}`);
  });

  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
