import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function auditAllDB() {
  const rows = await sql`SELECT id, business_name, custom_proposal, phone, wilaya FROM outreach`;
  console.log(`Auditing all ${rows.length} rows in outreach table...`);

  let errors = 0;
  let tabarekCount = 0;
  const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  for (const r of rows) {
    const prop = r.custom_proposal || '';
    const chunks = prop.split('---');
    if (chunks.length !== 4) {
      console.error(`Store ${r.business_name} (${r.id}) has ${chunks.length} chunks!`);
      errors++;
    }
    if (emojiRegex.test(prop)) {
      console.error(`Store ${r.business_name} contains emoji!`);
      errors++;
    }
    if (prop.includes('تبارك الله')) {
      console.error(`Store ${r.business_name} contains 'تبارك الله'!`);
      tabarekCount++;
      errors++;
    }
  }

  console.log(`Audit complete:`);
  console.log(`- Total stores: ${rows.length}`);
  console.log(`- Chunk errors: ${errors - tabarekCount}`);
  console.log(`- "تبارك الله" count: ${tabarekCount}`);
  console.log(`- Total errors: ${errors}`);
}

auditAllDB().catch(console.error);
