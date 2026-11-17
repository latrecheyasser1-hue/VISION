import { db } from '../src/db/client.js';
import { outreach } from '../src/db/schema.js';
import { generateChunkedProposal } from '../src/services/whatsapp/messageGenerator.js';

async function main() {
  const all = await db.select().from(outreach);
  let issues = 0;

  for (const p of all) {
    const res = generateChunkedProposal({
      businessName: p.businessName,
      businessType: p.businessType,
      wilaya: p.wilaya,
      phone: p.phone,
      instagramUrl: p.instagramUrl,
      customProposal: p.customProposal
    });

    if (res.chunks.length !== 4) {
      console.log(`[WRONG COUNT: ${res.chunks.length}] ${p.businessName}`);
      issues++;
      continue;
    }

    for (let i = 0; i < res.chunks.length; i++) {
      const c = res.chunks[i];
      if (!c.text || c.text.trim().length < 10) {
        console.log(`[EMPTY CHUNK ${i+1}] ${p.businessName}: "${c.text}"`);
        issues++;
      }
    }
  }

  console.log(`Audit complete: ${issues} chunk issues found across ${all.length} prospects.`);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
