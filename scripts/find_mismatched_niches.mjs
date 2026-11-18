import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function findMismatchedNiches() {
  const rows = await sql`
    SELECT id, business_name, business_type, notes, custom_proposal 
    FROM outreach 
    ORDER BY id ASC
  `;

  console.log(`Auditing all ${rows.length} rows for niche-proposal mismatch...`);

  const clothingKeywords = [
    'ملابس', 'لباس', 'ألبسة', 'robe', 'vetement', 'abaya', 'hijab', 'caftan', 
    'costume', 'streetwear', 'pantalon', 'chaussure', 'sneaker', 'escarpin', 
    'tissu', 'قماش', 'حجاب', 'عباية', 'قفطان', 'بدلات', 'حذاء', 'أحذية', 'بوتات',
    'lingerie', 'pyjama', 'بيجامات', 'سهرة', 'mariage', 'gandoura', 'قندورة', 'كراكو'
  ];

  const mismatches = [];

  for (const r of rows) {
    const bt = (r.business_type || '').toLowerCase();
    const isFashion = clothingKeywords.some(k => bt.includes(k));

    const p = r.custom_proposal || '';
    const mentionsClothingInPain = p.includes('تجارة الملابس الجاهزة') || p.includes('ملابس الرجال');

    if (!isFashion && mentionsClothingInPain) {
      mismatches.push({
        id: r.id,
        name: r.business_name,
        type: r.business_type,
        notes: r.notes
      });
    }
  }

  console.log(`Found ${mismatches.length} stores misclassified into clothing pain points:`);
  for (const m of mismatches) {
    console.log(`- [${m.name}] Type: "${m.type}" (Notes: ${m.notes})`);
  }
}

findMismatchedNiches().catch(console.error);
