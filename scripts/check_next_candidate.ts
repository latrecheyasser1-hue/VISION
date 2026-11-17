import { sql } from '../src/db/client.js';
import { generateChunkedProposal } from '../src/services/whatsapp/messageGenerator.js';

async function checkNextCandidate() {
  const candidateRows: any[] = await sql.query(`
    SELECT id, business_name, business_type, wilaya, phone, instagram_url, custom_proposal
    FROM outreach
    WHERE status = 'no_reply'
      AND phone IS NOT NULL
      AND LENGTH(TRIM(phone)) >= 9
      AND last_contacted_at IS NULL
    ORDER BY created_at ASC
    LIMIT 3
  `);

  console.log(`--- Next candidates (${candidateRows.length}) ---`);
  for (const c of candidateRows) {
    console.log(`[${c.id}] ${c.business_name} (${c.phone}) | type: ${c.business_type} | wilaya: ${c.wilaya}`);
    console.log(`custom_proposal:\n${c.custom_proposal}\n`);
    const generated = generateChunkedProposal({
      businessName: c.business_name,
      businessType: c.business_type,
      wilaya: c.wilaya,
      phone: c.phone,
      instagramUrl: c.instagram_url,
      customProposal: c.custom_proposal
    });
    console.log(`Generated chunks count: ${generated.chunks.length}`);
    generated.chunks.forEach((chunk, i) => {
      console.log(`Chunk ${i + 1} (${chunk.partName}): ${chunk.text.substring(0, 40)}...`);
    });
  }
}

checkNextCandidate().catch(console.error);
