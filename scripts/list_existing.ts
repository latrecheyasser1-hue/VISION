import { db } from '../src/db/client.js';
import { outreach } from '../src/db/schema.js';

async function main() {
  const rows = await db.select({
    id: outreach.id,
    businessName: outreach.businessName,
    businessType: outreach.businessType,
    wilaya: outreach.wilaya,
    phone: outreach.phone,
    instagramUrl: outreach.instagramUrl
  }).from(outreach);

  console.log(`Current existing businesses in DB: ${rows.length}`);
  const names = rows.map(r => r.businessName.trim().toLowerCase());
  const igs = rows.map(r => (r.instagramUrl || '').toLowerCase());
  console.log(JSON.stringify({ count: rows.length, sample: rows.slice(0, 5) }, null, 2));

  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
