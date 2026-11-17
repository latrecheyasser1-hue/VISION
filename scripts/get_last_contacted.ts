import { db } from '../src/db/client.js';
import { outreach } from '../src/db/schema.js';
import { desc, isNotNull } from 'drizzle-orm';

async function main() {
  const rows = await db.select({
    id: outreach.id,
    businessName: outreach.businessName,
    businessType: outreach.businessType,
    phone: outreach.phone,
    status: outreach.status,
    lastContactedAt: outreach.lastContactedAt,
    customProposal: outreach.customProposal
  })
  .from(outreach)
  .where(isNotNull(outreach.lastContactedAt))
  .orderBy(desc(outreach.lastContactedAt))
  .limit(10);

  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
