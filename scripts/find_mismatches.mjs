import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function findMismatches() {
  const rows = await sql`
    SELECT id, business_name, business_type, custom_proposal, notes, wilaya, instagram_url 
    FROM outreach 
    ORDER BY id ASC
  `;

  console.log(`Total rows: ${rows.length}`);

  const ipadRows = rows.filter(r => 
    r.business_name.toLowerCase().includes('ipad') || 
    r.business_name.toLowerCase().includes('upad') ||
    r.instagram_url.toLowerCase().includes('ipad')
  );

  console.log('\n--- IPAD STORE FOUND ---');
  for (const r of ipadRows) {
    console.log(`ID: ${r.id} | Name: ${r.business_name} | Type: ${r.business_type} | Notes: ${r.notes}`);
    console.log(`Proposal snippet: \n${r.custom_proposal.split('\n---\n')[1]}`);
  }

  // Let's also look for any other tech/phone/cosmetic/shoes stores misclassified as clothing!
  console.log('\n--- OTHER POTENTIAL MISMATCHES ---');
  const techKeywords = ['phone', 'tech', 'informatique', 'apple', 'gsm', 'mobile', 'store', 'electr', 'pc', 'gamer', 'accessoire', 'gaming'];
  for (const r of rows) {
    const nameLow = r.business_name.toLowerCase();
    const typeLow = (r.business_type || '').toLowerCase();
    const isTechName = techKeywords.some(k => nameLow.includes(k));
    if (isTechName && (typeLow.includes('ملابس') || typeLow.includes('ألبسة'))) {
      console.log(`Potential Tech misclassified: ID ${r.id} | "${r.business_name}" | Current type: "${r.business_type}"`);
    }
  }
}

findMismatches().catch(console.error);
