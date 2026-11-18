import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function findBadLeads() {
  const rows = await sql`SELECT id, business_name, instagram_url, phone, notes, wilaya FROM outreach ORDER BY id ASC`;
  console.log(`Checking ${rows.length} rows...`);

  const foreignOrBad = [];

  for (const r of rows) {
    const p = (r.phone || '').trim();
    const clean = p.replace(/\D/g, '');
    const notes = (r.notes || '').toLowerCase();
    const name = (r.business_name || '').toLowerCase();
    const url = (r.instagram_url || '').toLowerCase();

    // Check non-Algerian
    const isMorocco = p.startsWith('+212') || notes.includes('maroc') || notes.includes('rabat') || r.wilaya === 'RABAT';
    const isTunisia = p.startsWith('+216') || notes.includes('tunis') || notes.includes('تونس');
    const isBrazil = notes.includes('5584') || name.includes('loja de roupas');
    const isUK = url.includes('.co.uk') || url.includes('skyerosecouk');
    const isCafe = name.includes('coffee') || name.includes('مقهى') || name.includes('restaurant');
    
    // Check weird phone length or format
    const isWeirdPhone = p !== 'PRIVEE' && p !== 'PRIVE' && (!clean.startsWith('05') && !clean.startsWith('06') && !clean.startsWith('07') && !clean.startsWith('2135') && !clean.startsWith('2136') && !clean.startsWith('2137'));

    if (isMorocco || isTunisia || isBrazil || isUK || isCafe || isWeirdPhone) {
      foreignOrBad.push({
        id: r.id,
        name: r.business_name,
        phone: r.phone,
        reason: isMorocco ? 'Morocco' : isTunisia ? 'Tunisia' : isBrazil ? 'Brazil' : isUK ? 'UK' : isCafe ? 'Cafe' : 'Weird phone'
      });
    }
  }

  console.log(`Found ${foreignOrBad.length} bad rows:`);
  console.log(foreignOrBad);
}

findBadLeads().catch(console.error);
