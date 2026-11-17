import { sql } from '../src/db/client.js';
import { generateChunkedProposal } from '../src/services/whatsapp/messageGenerator.js';

async function checkGenius() {
  const row = await sql.query("SELECT * FROM outreach WHERE phone = '0559838422'");
  if (row.length) {
    console.log('Genius Watch 16 row:', row[0]);
    const gen = generateChunkedProposal({
      businessName: row[0].business_name,
      businessType: row[0].business_type,
      wilaya: row[0].wilaya,
      phone: row[0].phone,
      customProposal: row[0].custom_proposal
    });
    console.log(`Chunks count: ${gen.chunks.length}`);
    gen.chunks.forEach((c, i) => {
      console.log(`[Chunk ${i+1}]: ${c.text}`);
    });
  }
}

checkGenius().catch(console.error);
