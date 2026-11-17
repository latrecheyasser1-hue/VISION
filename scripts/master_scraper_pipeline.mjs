import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { generateTailoredProposal, resolveTrueWilaya, cleanBusinessName } from './generator_core.mjs';

const sql = neon(process.env.DATABASE_URL);
const token = process.env.APIFY_TOKEN;

// Digit normalization (Arabic & Math Unicode digits)
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

// Comprehensive phone extraction
function extractPhoneComprehensive(text) {
  if (!text) return null;
  const norm = normalizeAllDigits(text);

  // 1. WhatsApp link match
  const waMatch = norm.match(/(?:wa\.me\/|whatsapp\.com\/send\?phone=|wa\.link\/)(?:213|00213)?([567]\d{8})/i);
  if (waMatch) return '0' + waMatch[1];

  // 2. Standard Algerian mobile phone pattern
  const match = norm.match(/(?:\+?213|00213|0)\s*([567])(?:[\s\.\-_/]*\d){8}/);
  if (match) {
    const raw = match[0].replace(/\D/g, '');
    if (raw.startsWith('213') && raw.length === 12) return '0' + raw.slice(3);
    if (raw.startsWith('00213') && raw.length === 14) return '0' + raw.slice(5);
    if (raw.startsWith('0') && raw.length === 10) return raw;
  }
  return null;
}

// Detect Niche
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

// Start Apify search run
async function runApifySearch(query, limit = 35) {
  console.log(`[Apify] Launching search run for: "${query}" (limit: ${limit} per term)...`);
  const res = await fetch(`https://api.apify.com/v2/acts/apify~instagram-search-scraper/runs?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      search: query,
      searchType: 'user',
      searchLimit: limit
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Failed to start run: ${JSON.stringify(data)}`);
  }

  const runId = data.data.id;
  const datasetId = data.data.defaultDatasetId;
  console.log(`[Apify] Run ${runId} started. Dataset: ${datasetId}. Waiting for completion...`);

  // Poll run status
  let status = 'RUNNING';
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(r => setTimeout(r, 5000));
    const poll = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const pollData = await poll.json();
    status = pollData.data?.status;
    process.stdout.write(`.`);
  }
  console.log(`\n[Apify] Run ${runId} finished with status: ${status}`);

  if (status !== 'SUCCEEDED' && status !== 'ABORTED') {
    console.warn(`[Apify] Run did not succeed: ${status}`);
    return [];
  }

  // Fetch dataset items
  const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&format=json&limit=1000`);
  const items = await itemsRes.json();
  console.log(`[Apify] Fetched ${items.length} items from dataset ${datasetId}.`);
  return items;
}

// Pipeline execution
async function main() {
  // 1. Load existing records to deduplicate
  console.log('Loading existing records from Neon Postgres...');
  const existingRows = await sql`SELECT phone, instagram_url, business_name FROM outreach`;
  const existingPhones = new Set(existingRows.map(r => (r.phone || '').replace(/\D/g, '')).filter(Boolean));
  const existingNames = new Set(existingRows.map(r => (r.business_name || '').toLowerCase().trim()));
  const existingUsernames = new Set(existingRows.map(r => {
    const url = r.instagram_url || '';
    const m = url.match(/instagram\.com\/([^/?#]+)/);
    return m ? m[1].toLowerCase() : '';
  }).filter(Boolean));

  console.log(`Loaded ${existingRows.length} existing records in DB. (Unique phones: ${existingPhones.size}, usernames: ${existingUsernames.size})`);

  // 2. Define search batches
  const batches = [
    // Batch 1: Wilayas & general boutiques
    'boutique algerie, boutique homme alger, boutique femme oran, boutique constantine, boutique setif, boutique tlemcen, boutique blida, boutique batna, boutique chlef, boutique annaba',
    // Batch 2: Niches
    'streetwear algerie, sneakers algerie, chaussures alger, abaya algerie, hijab algerie, caftan algerie, robe soiree algerie, cosmetique algerie, parfum algerie, montres algerie',
    // Batch 3: More wilayas and stores
    'boutique bejaia, boutique mostaganem, boutique bba, boutique msila, boutique biskra, boutique djelfa, boutique skikda, vetement homme algerie, vetement enfant algerie, sac femme algerie'
  ];

  let totalScrapedProfiles = 0;
  let allItems = [];

  for (let i = 0; i < batches.length; i++) {
    console.log(`\n======================================================`);
    console.log(`STARTING BATCH ${i + 1} of ${batches.length}`);
    console.log(`======================================================`);
    try {
      const items = await runApifySearch(batches[i], 30);
      allItems.push(...items);
      totalScrapedProfiles += items.length;
    } catch (e) {
      console.error(`Error in batch ${i + 1}:`, e.message);
    }
  }

  console.log(`\n======================================================`);
  console.log(`TOTAL RAW ITEMS COLLECTED: ${allItems.length}`);
  console.log(`======================================================`);

  // 3. Deduplicate and filter qualified leads
  const qualified = [];
  const seenUsernames = new Set();

  for (const item of allItems) {
    const username = (item.username || '').toLowerCase().trim();
    if (!username || seenUsernames.has(username) || existingUsernames.has(username)) continue;
    seenUsernames.add(username);

    // Rule: Followers >= 5000
    const followers = item.followersCount || 0;
    if (followers < 5000) continue;

    // Must be Algerian
    const bio = item.biography || '';
    const fullName = item.fullName || '';
    const fullText = `${username} ${fullName} ${bio}`.toLowerCase();

    // Check phone
    const phone = extractPhoneComprehensive(`${bio} ${item.externalUrl || ''}`);
    if (!phone) continue;

    const cleanPhone = phone.replace(/\D/g, '');
    if (existingPhones.has(cleanPhone)) continue;

    // Check business name
    const bName = cleanBusinessName(fullName || username);
    if (existingNames.has(bName.toLowerCase())) continue;

    // Detect wilaya
    const wilaya = resolveTrueWilaya('', bName, `${bio} ${fullName}`);

    // Detect niche
    const niche = detectNiche(username, fullName, bio);

    // Check website & subscription platform in bio/externalUrl
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
      notes: notes,
      status: 'pending'
    });
  }

  console.log(`\nQualified fresh leads found: ${qualified.length}`);

  // 4. Generate custom proposals and insert into Neon Postgres
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
      if (inserted % 10 === 0 || inserted === qualified.length) {
        console.log(`Inserted ${inserted}/${qualified.length} into database...`);
      }
    } catch (e) {
      console.error(`Error inserting ${q.businessName}:`, e.message);
    }
  }

  console.log(`\n======================================================`);
  console.log(`SUCCESSFULLY INSERTED ${inserted} NEW QUALIFIED STORES!`);
  const finalCount = await sql`SELECT COUNT(*) FROM outreach`;
  console.log(`TOTAL BUSINESSES NOW IN DATABASE: ${finalCount[0].count}`);
  console.log(`======================================================`);
}

main().catch(console.error);
