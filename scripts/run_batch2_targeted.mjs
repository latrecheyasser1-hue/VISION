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
  if (t.includes('robe') || t.includes('caftan') || t.includes('mariage') || t.includes('قفطان') || t.includes('فساتين') || t.includes('سهرة')) {
    return 'فساتين سهرة وقفطان';
  }
  if (t.includes('femme') || t.includes('fille') || t.includes('نسائي') || t.includes('بناتي')) {
    return 'ألبسة نسائية جاهزة';
  }
  return 'ملابس جاهزة وتجارة تجزئة';
}

async function runBatch2() {
  const query = 'sneakers algerie, abaya algerie, hijab algerie, caftan algerie, robe soiree algerie, parfum algerie, montres algerie, sac femme algerie, vetement enfant algerie, streetwear algerie';
  console.log(`[Batch 2] Starting Apify search run...`);

  const res = await fetch(`https://api.apify.com/v2/acts/apify~instagram-search-scraper/runs?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      search: query,
      searchType: 'user',
      searchLimit: 30
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Run start failed: ${JSON.stringify(data)}`);

  const runId = data.data.id;
  const datasetId = data.data.defaultDatasetId;
  console.log(`Run started: ${runId}, Dataset: ${datasetId}`);

  // Monitor until at least 250 items or status changed
  let itemsCount = 0;
  let status = 'RUNNING';
  const startTime = Date.now();

  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(r => setTimeout(r, 6000));
    
    // Check items count
    const dsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}?token=${token}`);
    const dsData = await dsRes.json();
    itemsCount = dsData.data?.itemCount || 0;
    process.stdout.write(`[${itemsCount} items] `);

    // If we have >= 280 items or ran for 6 minutes, abort to conserve credits!
    if (itemsCount >= 280 || (Date.now() - startTime > 360000)) {
      console.log(`\nTarget reached (${itemsCount} items). Aborting run to lock dataset and conserve balance...`);
      await fetch(`https://api.apify.com/v2/actor-runs/${runId}/abort?token=${token}`, { method: 'POST' });
      break;
    }

    const poll = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const pollData = await poll.json();
    status = pollData.data?.status;
  }

  console.log(`\nRun finished. Downloading items from ${datasetId}...`);
  const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&format=json&limit=1000`);
  const items = await itemsRes.json();
  console.log(`Downloaded ${items.length} items from dataset.`);

  // Load existing records from DB
  const existingRows = await sql`SELECT phone, instagram_url, business_name FROM outreach`;
  const existingPhones = new Set(existingRows.map(r => (r.phone || '').replace(/\D/g, '')).filter(Boolean));
  const existingNames = new Set(existingRows.map(r => (r.business_name || '').toLowerCase().trim()));
  const existingUsernames = new Set(existingRows.map(r => {
    const url = r.instagram_url || '';
    const m = url.match(/instagram\.com\/([^/?#]+)/);
    return m ? m[1].toLowerCase() : '';
  }).filter(Boolean));

  console.log(`Existing in DB: ${existingRows.length} rows.`);

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

  console.log(`Fresh qualified leads found in Batch 2: ${qualified.length}`);

  let inserted = 0;
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
      inserted++;
    } catch (e) {
      console.error(`Error inserting ${q.businessName}:`, e.message);
    }
  }

  console.log(`Successfully inserted ${inserted} leads from Batch 2 into Neon Postgres!`);
  const finalCount = await sql`SELECT COUNT(*) FROM outreach`;
  console.log(`Total in database now: ${finalCount[0].count}`);
}

runBatch2().catch(console.error);
