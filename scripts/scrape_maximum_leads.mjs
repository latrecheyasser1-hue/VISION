import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { generateTailoredProposal, resolveTrueWilaya, cleanBusinessName } from './generator_core.mjs';

const sql = neon(process.env.DATABASE_URL);
const token = process.env.APIFY_TOKEN;

function normalizeAllDigits(text) {
  if (!text) return '';
  const arabic = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  const mathBold = ['𝟎','𝟏','𝟐','𝟑','𝟒','𝟓','𝟔','𝟕','𝟖','𝟗'];
  const mathSans = ['𝟬','𝟭','𝟮','𝟯','𝟰','𝟱','𝟲','𝟳','𝟴','𝟵'];

  let res = text;
  for (let i = 0; i < 10; i++) {
    res = res.replaceAll(arabic[i], String(i));
    res = res.replaceAll(mathBold[i], String(i));
    res = res.replaceAll(mathSans[i], String(i));
  }
  return res;
}

function extractPhoneComprehensive(text) {
  if (!text) return null;
  const norm = normalizeAllDigits(text);

  const waMatch = norm.match(/(?:wa\.me\/|whatsapp\.com\/send\?phone=|wa\.link\/)(?:213|00213)?([567]\d{8})/i);
  if (waMatch) return '0' + waMatch[1];

  const match = norm.match(/(?:\+?213|00213|0)\s*([567])(?:[\s\.\-_/]*\d){8}/);
  if (match) {
    const raw = match[0].replace(/\D/g, '');
    if (raw.startsWith('213') && raw.length === 12) return '0' + raw.slice(3);
    if (raw.startsWith('00213') && raw.length === 14) return '0' + raw.slice(5);
    if (raw.startsWith('0') && raw.length === 10) return raw;
  }
  return null;
}

function detectNiche(username, fullName, bio) {
  const t = `${username || ''} ${fullName || ''} ${bio || ''}`.toLowerCase();
  if (t.includes('abaya') || t.includes('عباية') || t.includes('عبايات') || t.includes('hijab') || t.includes('حجاب') || t.includes('voile')) {
    return 'عبايات وألبسة محجبات';
  }
  if (t.includes('chaussure') || t.includes('sneaker') || t.includes('shoes') || t.includes('basket') || t.includes('sabbat') || t.includes('حذاء') || t.includes('أحذية')) {
    return 'أحذية وسنيكرز';
  }
  if (t.includes('costume') || t.includes('homme') || t.includes('men') || t.includes('بدلات') || t.includes('كلاسيك') || t.includes('ملابس رجالية')) {
    return 'ملابس رجالية وكلاسيك';
  }
  if (t.includes('streetwear') || t.includes('hoodie') || t.includes('oversize') || t.includes('ستريتوير')) {
    return 'ستريتوير وملابس شبابية';
  }
  if (t.includes('cosmet') || t.includes('beaute') || t.includes('parfum') || t.includes('soin') || t.includes('عطور') || t.includes('تجميل')) {
    return 'مستحضرات تجميل وعطور';
  }
  if (t.includes('bijoux') || t.includes('accessoire') || t.includes('montre') || t.includes('watch') || t.includes('مجوهرات') || t.includes('ساعات')) {
    return 'مجوهرات وإكسسوارات';
  }
  if (t.includes('robe') || t.includes('caftan') || t.includes('mariage') || t.includes('karakou') || t.includes('قفطان') || t.includes('كراكو') || t.includes('فساتين') || t.includes('سهرة')) {
    return 'فساتين سهرة وقفطان وكراكو';
  }
  if (t.includes('maroquinerie') || t.includes('sac') || t.includes('valise') || t.includes('حقائب')) {
    return 'حقائب وحقائب سفر';
  }
  if (t.includes('cadeau') || t.includes('box') || t.includes('chocolat') || t.includes('fleur') || t.includes('هدايا')) {
    return 'هدايا وباقات مناسبات';
  }
  if (t.includes('femme') || t.includes('fille') || t.includes('pyjama') || t.includes('lingerie') || t.includes('نسائي')) {
    return 'ألبسة نسائية وبيجامات';
  }
  return 'ملابس وتجارة تجزئة';
}

async function runSearchBatch(query, targetItems = 90) {
  console.log(`\n------------------------------------------------------`);
  console.log(`[Search] Starting run for:\n"${query}"`);
  console.log(`------------------------------------------------------`);

  const res = await fetch(`https://api.apify.com/v2/acts/apify~instagram-search-scraper/runs?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      search: query,
      searchType: 'user',
      searchLimit: 25
    })
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(`Failed to start run:`, data);
    return [];
  }

  const runId = data.data.id;
  const datasetId = data.data.defaultDatasetId;
  console.log(`Run started: ${runId}, Dataset: ${datasetId}`);

  let itemsCount = 0;
  let status = 'RUNNING';
  const startTime = Date.now();

  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(r => setTimeout(r, 5000));
    
    try {
      const dsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}?token=${token}`);
      const dsData = await dsRes.json();
      itemsCount = dsData.data?.itemCount || 0;
      process.stdout.write(`[${itemsCount} items] `);
    } catch(e) {}

    // Abort when reached target items or 3 minutes
    if (itemsCount >= targetItems || (Date.now() - startTime > 180000)) {
      console.log(`\nTarget reached (${itemsCount} items). Aborting to save balance...`);
      await fetch(`https://api.apify.com/v2/actor-runs/${runId}/abort?token=${token}`, { method: 'POST' });
      break;
    }

    const poll = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const pollData = await poll.json();
    status = pollData.data?.status;
  }

  console.log(`\nDownloading items from dataset ${datasetId}...`);
  const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&format=json&limit=1000`);
  const items = await itemsRes.json();
  console.log(`Got ${items.length} items from run.`);
  return items;
}

async function main() {
  console.log('Loading existing records from Neon Postgres...');
  const existingRows = await sql`SELECT phone, instagram_url, business_name FROM outreach`;
  const existingPhones = new Set(existingRows.map(r => (r.phone || '').replace(/\D/g, '')).filter(Boolean));
  const existingNames = new Set(existingRows.map(r => (r.business_name || '').toLowerCase().trim()));
  const existingUsernames = new Set(existingRows.map(r => {
    const url = r.instagram_url || '';
    const m = url.match(/instagram\.com\/([^/?#]+)/);
    return m ? m[1].toLowerCase() : '';
  }).filter(Boolean));

  console.log(`Existing in DB: ${existingRows.length} rows.`);

  const searchBatches = [
    // Batch 1: Commercial Algiers communes & Eastern hubs
    'boutique cheraga, boutique kouba, boutique hydra, boutique sidi yahia, boutique rouiba, boutique el eulma, boutique jijel, boutique skikda, boutique tizi ouzou, boutique bouira',
    // Batch 2: High-ticket Algerian specialties
    'karakou algerie, robe mariee algerie, caftan moderne algerie, maroquinerie algerie, valises algerie, pyjama femme algerie, lingerie algerie, survetement algerie, lunettes algerie, box cadeau algerie',
    // Batch 3: Southern & Western commercial cities
    'boutique el oued, boutique ghardaia, boutique ouargla, boutique biskra, boutique tiaret, boutique medea, boutique bordj bou arreridj, boutique mascara, boutique relizane, boutique souk ahras'
  ];

  let totalNewInserted = 0;

  for (let b = 0; b < searchBatches.length; b++) {
    console.log(`\n======================================================`);
    console.log(`PROCESSING BATCH ${b + 1} OF ${searchBatches.length}`);
    console.log(`======================================================`);

    const items = await runSearchBatch(searchBatches[b], 90);

    const qualified = [];
    const seenUsernames = new Set();

    for (const item of items) {
      const username = (item.username || '').toLowerCase().trim();
      if (!username || seenUsernames.has(username) || existingUsernames.has(username)) continue;
      seenUsernames.add(username);

      const followers = item.followersCount || 0;
      if (followers < 5000) continue;

      const bio = item.biography || '';
      const fullName = item.fullName || '';

      const phone = extractPhoneComprehensive(`${bio} ${item.externalUrl || ''}`);
      if (!phone) continue;

      const cleanPhone = phone.replace(/\D/g, '');
      if (existingPhones.has(cleanPhone)) continue;

      const bName = cleanBusinessName(fullName || username);
      if (existingNames.has(bName.toLowerCase())) continue;

      const wilaya = resolveTrueWilaya('', bName, `${bio} ${fullName}`);
      const niche = detectNiche(username, fullName, bio);

      const ext = (item.externalUrl || '').trim();
      let siteNote = '';
      const u = ext.toLowerCase();
      if (u.includes('shopify') || u.includes('flexdz') || u.includes('dzbuild') || u.includes('youcan')) {
        siteNote = `Site: ${ext} (Platform subscription)`;
      } else if (ext) {
        siteNote = `Site: ${ext}`;
      } else {
        siteNote = 'No URL';
      }

      const followersStr = followers >= 1000 ? `${(followers / 1000).toFixed(1)}k` : `${followers}`;
      const notes = `Followers: ${followersStr}. ${siteNote}`;

      qualified.push({
        businessName: bName,
        businessType: niche,
        phone: phone,
        instagramUrl: `https://www.instagram.com/${username}/`,
        wilaya: wilaya,
        notes: notes
      });
    }

    console.log(`Batch ${b + 1} produced ${qualified.length} fresh qualified stores.`);

    let insertedInBatch = 0;
    for (const q of qualified) {
      try {
        const proposal = generateTailoredProposal({
          business_name: q.businessName,
          business_type: q.businessType,
          wilaya: q.wilaya,
          notes: q.notes
        });

        await sql`
          INSERT INTO outreach (
            business_name,
            business_type,
            phone,
            instagram_url,
            status,
            notes,
            wilaya,
            custom_proposal,
            created_at,
            updated_at
          ) VALUES (
            ${q.businessName},
            ${q.businessType},
            ${q.phone},
            ${q.instagramUrl},
            'pending',
            ${q.notes},
            ${q.wilaya},
            ${proposal},
            NOW(),
            NOW()
          )
        `;

        existingPhones.add(q.phone.replace(/\D/g, ''));
        existingNames.add(q.businessName.toLowerCase());
        existingUsernames.add(q.instagramUrl.replace(/.*instagram\.com\/([^/?#]+).*/, '$1').toLowerCase());
        insertedInBatch++;
        totalNewInserted++;
      } catch (e) {
        console.error(`Error inserting ${q.businessName}:`, e.message);
      }
    }

    console.log(`Inserted ${insertedInBatch} stores from Batch ${b + 1}. Running total inserted this session: ${totalNewInserted}`);
  }

  console.log(`\n======================================================`);
  console.log(`ALL 3 BATCHES COMPLETE!`);
  console.log(`TOTAL NEW STORES INSERTED: ${totalNewInserted}`);
  const finalCount = await sql`SELECT COUNT(*) FROM outreach`;
  console.log(`FINAL TOTAL BUSINESSES IN DATABASE: ${finalCount[0].count}`);
  console.log(`======================================================`);
}

main().catch(console.error);
