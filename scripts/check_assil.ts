import { db } from '../src/db/client.js';
import { outreach } from '../src/db/schema.js';
import { ilike } from 'drizzle-orm';

async function main() {
  const rows = await db.select().from(outreach).where(ilike(outreach.phone, '%540%21%91%06%'));
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
