import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function deepAudit() {
  const rows = await sql`SELECT id, business_name, business_type, phone, instagram_url, notes, wilaya FROM outreach ORDER BY id ASC`;
  console.log(`Total rows: ${rows.length}`);

  console.log('\n--- NON-ALGERIAN OR WEIRD PHONES ---');
  for (const r of rows) {
    const p = (r.phone || '').trim();
    const clean = p.replace(/\D/g, '');
    if (p !== 'PRIVEE' && !clean.startsWith('05') && !clean.startsWith('06') && !clean.startsWith('07') && !clean.startsWith('2135') && !clean.startsWith('2136') && !clean.startsWith('2137')) {
      console.log(`ID: ${r.id} | Name: ${r.business_name} | Phone: ${r.phone} | Notes: ${r.notes}`);
    }
  }

  console.log('\n--- CHECKING ALL STORE TYPES AND CLASSIFICATIONS ---');
  for (const r of rows) {
    const name = r.business_name.toLowerCase();
    const url = (r.instagram_url || '').toLowerCase();
    const type = (r.business_type || '').toLowerCase();

    // Check if name has phone/tech/apple/ipad but type does not
    if ((name.includes('phone') || name.includes('tech') || name.includes('apple') || name.includes('ipad') || url.includes('phone') || url.includes('tech') || url.includes('ipad')) && !type.includes('هاتف') && !type.includes('tech') && !type.includes('أجهزة') && !type.includes('آيباد') && !type.includes('إلكتروني')) {
      console.log(`[Tech Mismatch] ID: ${r.id} | Name: ${r.business_name} | URL: ${r.instagram_url} | Current Type: ${r.business_type}`);
    }

    // Check if type is TECH but name is clothing
    if (type.includes('tech') && (name.includes('taille') || name.includes('robe') || name.includes('ritaj') || name.includes('mode') || name.includes('vetement'))) {
      console.log(`[Clothing wrongly typed as Tech] ID: ${r.id} | Name: ${r.business_name} | URL: ${r.instagram_url} | Current Type: ${r.business_type}`);
    }
  }
}

deepAudit().catch(console.error);
