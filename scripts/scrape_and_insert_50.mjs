import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import { db } from '../dist/src/db/client.js';
import { outreach } from '../dist/src/db/schema.js';
import { eq, or, ilike } from 'drizzle-orm';

const APIFY_TOKEN = process.env.APIFY_TOKEN;

// Algerian wilayas list for detection in bio
const WILAYAS = [
  'ALGER', 'ORAN', 'CONSTANTINE', 'SETIF', 'ANNABA', 'BATNA', 'BLIDA',
  'TLEMCEN', 'CHLEF', 'DJELFA', 'BEJAIA', 'BOUIRA', 'TIZI OUZOU', 'MEDEA',
  'MOSTAGANEM', 'M\'SILA', 'MASCARA', 'BORDJ BOU ARRERIDJ', 'BOUMERDES',
  'TIPAZA', 'SKIKDA', 'SIDI BEL ABBES', 'GUELMA', 'OUARGLA', 'BISKRA',
  'EL OUED', 'GHARDAIA', 'JIJEL', 'RELIZANE', 'SAIDA', 'TEBESSA', 'TIARET'
];

function extractPhone(text) {
  if (!text) return null;
  const normalized = text.replace(/[\.\-_/]/g, ' ');
  const m = normalized.match(/(?:(?:\+?213)|0)\s*([567]\d(?:\s*\d){7})/);
  if (m) {
    const digits = m[1].replace(/\s+/g, '');
    if (digits.length === 8) {
      return '0' + digits;
    }
  }
  const m2 = normalized.match(/\b(0[567]\d{8})\b/);
  if (m2) {
    return m2[1];
  }
  return null;
}

function detectWilaya(text) {
  if (!text) return 'ALGER';
  const upper = text.toUpperCase();
  for (const w of WILAYAS) {
    if (upper.includes(w)) return w;
  }
  if (text.includes('الجزائر') || text.includes('العاصمة')) return 'ALGER';
  if (text.includes('وهران')) return 'ORAN';
  if (text.includes('قسنطينة')) return 'CONSTANTINE';
  if (text.includes('سطيف')) return 'SETIF';
  if (text.includes('عنابة')) return 'ANNABA';
  if (text.includes('باتنة')) return 'BATNA';
  if (text.includes('البليدة')) return 'BLIDA';
  if (text.includes('تلمسان')) return 'TLEMCEN';
  if (text.includes('الشلف')) return 'CHLEF';
  if (text.includes('الجلفة')) return 'DJELFA';
  if (text.includes('بجاية')) return 'BEJAIA';
  if (text.includes('البويرة')) return 'BOUIRA';
  if (text.includes('تيزي')) return 'TIZI OUZOU';
  if (text.includes('المدية')) return 'MEDEA';
  if (text.includes('مستغانم')) return 'MOSTAGANEM';
  if (text.includes('المسيلة')) return 'M\'SILA';
  if (text.includes('معسكر')) return 'MASCARA';
  if (text.includes('البرج') || text.includes('برج بوعريريج')) return 'BORDJ BOU ARRERIDJ';
  if (text.includes('بومرداس')) return 'BOUMERDES';
  if (text.includes('تيبازة')) return 'TIPAZA';
  return 'ALGER';
}

function detectNiche(username, fullName, bio) {
  const t = `${username} ${fullName} ${bio}`.toLowerCase();
  if (t.includes('femme') || t.includes('robe') || t.includes('abaya') || t.includes('hijab') || t.includes('caftan') || t.includes('fille')) {
    return 'VETEMENT FEMME';
  }
  if (t.includes('streetwear') || t.includes('hoodie') || t.includes('sportswear') || t.includes('oversize')) {
    return 'STREETWEAR';
  }
  if (t.includes('chaussure') || t.includes('sneaker') || t.includes('shoes') || t.includes('basket') || t.includes('sabbat')) {
    return 'CHAUSSURES';
  }
  if (t.includes('cosmet') || t.includes('beaute') || t.includes('skin') || t.includes('parfum') || t.includes('maquillage')) {
    return 'COSMETIQUE';
  }
  if (t.includes('montre') || t.includes('watch') || t.includes('bijoux') || t.includes('accessoire') || t.includes('lunette')) {
    return 'ACCESSOIRES & MONTRES';
  }
  if (t.includes('phone') || t.includes('tech') || t.includes('apple') || t.includes('informatique') || t.includes('iphone')) {
    return 'TECH & SMARTPHONE';
  }
  if (t.includes('homme') || t.includes('men') || t.includes('classic') || t.includes('costume')) {
    return 'VETEMENT HOMME';
  }
  return 'BOUTIQUE E-COMMERCE';
}

function generateProposal(name, niche, wilaya) {
  const wilayaStr = wilaya ? ` في ${wilaya}` : '';
  let part1 = `السلام عليكم خويا، شفت la page تاعكم ما شاء الله وسلعة ${name}${wilayaStr} باينة نقية ربي يبارك.`;
  let part2 = '';
  let part3 = '';
  let part4 = '';

  if (niche === 'VETEMENT FEMME') {
    part2 = `المشكل في les tenues والموضة النسائية أن الزبونات يسقسوا بكثرة في les messages على المقاسات والألوان المتوفرة، والانتظار يخليهم يشوفوا باجات أخرى وتضيعلكم مبيعات كل سهرة.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne أنيقة تعرض كل موديل بالمقاس والألوان المتوفرة، توفر تعب الرد وترفع مبيعاتكم بـ 30%.`;
    part4 = `تفرج le site تاعنا: digitalvisiondz.com وخويا حبيت نسقسيك برك، واش هو أكثر مشكل يديكم الوقت كل ليلة: كثرة الأسئلة على المقاسات ولا تأكيد الشحن مع الكليونات؟`;
  } else if (niche === 'STREETWEAR') {
    part2 = `علابالي بلي streetwear يتباع بالسرعة و l'impulsion، وتأخر الرد في les messages بساعتين يخلي le client يبرد ويروح يشري من عند باج أخرى، وتضيعلك ما لا يقل عن 2 إلى 3 ملايين مبيعات كل سهرة.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne ذكية تخلي le client يشوف les tailles disponibles ويكوموندي فالحين، توفر 3 سوايع كل ليلة وترفع les ventes تاعك بـ 30%.`;
    part4 = `تفرج le site تاعنا: digitalvisiondz.com وخويا حبيت نسقسيك برك، شحال يضيعلكم وقت كل ليلة في الرد على les messages وتأكيد طلبيات التوصيل؟`;
  } else if (niche === 'CHAUSSURES') {
    part2 = `أكبر مشكل في الأحذية و les chaussures هو تكرار les questions على les pointures و les retours كي تجيه ماشي قيسو، والرد اليدوي في les messages يدي 4 سوايع في النهار وتخسرو حق التوصيل.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم plateforme خاصة بالأحذية تخلي الزبون يخير la pointure المتوفرة في le stock بالضبط، تقضي على les retours وترفع مبيعاتكم بـ 35%.`;
    part4 = `تفرج le site تاعنا: digitalvisiondz.com وخويا حبيت نسقسيك، شحال نسبة les retours تاع المقاسات لي راهي تصرالكم في التوصيل؟`;
  } else if (niche === 'COSMETIQUE') {
    part2 = `في le domaine تاع cosmétique أكبر ضياع وقت في les messages هو تكرار نفس الأسئلة على نوع البشرة و mode d'utilisation، و le client إذا ما لقاش رد فوري يتردد وما يشريش.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne ذكية تعرض كل produit مع les bienfaits وطريقة الاستعمال وفورمير كوند سريعة، ترفع نسبة الثقة و les commandes بـ 40%.`;
    part4 = `تفرج le site تاعنا: digitalvisiondz.com وخويا نسقسيك، إذا حبيت نديرو مكالمة تاع دقيقتين في الهاتف نوريلك ديمو كيفاش تخدم لمتجركم؟`;
  } else if (niche === 'TECH & SMARTPHONE' || niche === 'ACCESSOIRES & MONTRES') {
    part2 = `في مجال الهواتف والإكسسوارات الزبون يسقسي بزاف على l'état و la garantie ومدة التوصيل، والرد اليدوي في les messages يدي نص نهار ويبقى الكليون متردد.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم متجر احترافي يعرض كل منتج بـ fiche technique وفاتورة واضحة وزر commande مباشر في 10 ثواني، ترفع وتيرة البيع.`;
    part4 = `تفرج le site تاعنا: digitalvisiondz.com وخويا نسقسيك، شكون المسؤول أو مسير المتجر (Le Gérant) لي نقدر نحكي معاه دقيقة بخصوص هذا النظام؟`;
  } else {
    // VETEMENT HOMME / GENERAL
    part2 = `علابالي بلي خدمة les messages وضياع الوقت في شرح المقاسات والأسعار وتأكيد طلبيات التوصيل تدي ما لا يقل عن 3 إلى 4 سوايع كل يوم وتضيعلك زبائن مستعجلين يروحوا للمنافسين.`;
    part3 = `حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم boutique en ligne سريعة تخلي الكليون يشري مباشرة في 10 ثواني، توفر التعب وتضاعف مبيعاتك بنظام أوتوماتيكي كامل.`;
    part4 = `تفرج le site تاعنا: digitalvisiondz.com وخويا حبيت نسقسيك، واش هو أكثر مشكل يعييكم في خدمة الشات وتأكيد طلبيات الشحن كل ليلة؟`;
  }

  return `${part1}\n\n${part2}\n\n${part3}\n\n${part4}`;
}

async function runSearch(query, limit = 40) {
  console.log(`[Apify Scraper] Running search for: "${query}"...`);
  const res = await fetch(`https://api.apify.com/v2/acts/apify~instagram-search-scraper/runs?token=${APIFY_TOKEN}`, {
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
    console.error('Failed to start run:', data);
    return [];
  }

  const runId = data.data.id;
  const datasetId = data.data.defaultDatasetId;

  // Poll
  let status = 'RUNNING';
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(r => setTimeout(r, 4000));
    const poll = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`);
    const pollData = await poll.json();
    status = pollData.data.status;
  }

  if (status !== 'SUCCEEDED') {
    console.warn(`Run ${runId} ended with status: ${status}`);
    return [];
  }

  const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=json`);
  return await itemsRes.json();
}

async function main() {
  // Load existing names, phones and usernames
  const existingRows = await db.select().from(outreach);
  const existingPhones = new Set(existingRows.map(r => (r.phone || '').replace(/\D/g, '')).filter(Boolean));
  const existingNames = new Set(existingRows.map(r => (r.businessName || '').toLowerCase().trim()));
  const existingUsernames = new Set(existingRows.map(r => {
    const url = r.instagramUrl || '';
    const m = url.match(/instagram\.com\/([^/?#]+)/);
    return m ? m[1].toLowerCase() : '';
  }).filter(Boolean));

  console.log(`Loaded ${existingRows.length} existing businesses from database.`);

  const searchQueries = [
    'boutique alger, streetwear algerie, vetement femme alger',
    'robe soiree algerie, mode homme algerie, abaya algerie',
    'chaussures algerie, sneakers algerie, cosmetique algerie',
    'boutique oran, boutique constantine, boutique setif, boutique blida',
    'montre algerie, bijoux algerie, accessoires femme algerie, iphone algerie'
  ];

  const candidateProfiles = new Map();

  for (const q of searchQueries) {
    const results = await runSearch(q, 50);
    console.log(`Query "${q}" returned ${results.length} profiles.`);
    for (const item of results) {
      const u = (item.username || '').toLowerCase();
      if (!u || candidateProfiles.has(u)) continue;
      candidateProfiles.set(u, item);
    }
  }

  console.log(`Total unique scraped profiles: ${candidateProfiles.size}`);

  const qualifiedLeads = [];

  for (const [username, p] of candidateProfiles.entries()) {
    if (existingUsernames.has(username)) continue;

    const followers = p.followersCount || 0;
    // Condition: At least 10K followers
    if (followers < 10000) continue;

    const bio = p.biography || '';
    const phone = extractPhone(bio);
    if (!phone) continue;

    const cleanPhone = phone.replace(/\D/g, '');
    if (existingPhones.has(cleanPhone)) continue;

    const rawName = p.fullName && p.fullName.trim().length > 2 ? p.fullName.trim() : username;
    const name = rawName.replace(/[\n\r\t]/g, ' ').slice(0, 80);

    if (existingNames.has(name.toLowerCase())) continue;

    const wilaya = detectWilaya(bio);
    const niche = detectNiche(username, name, bio);
    const customProposal = generateProposal(name, niche, wilaya);

    qualifiedLeads.push({
      businessName: name,
      businessType: niche,
      wilaya: wilaya,
      phone: phone,
      instagramUrl: `https://www.instagram.com/${username}/`,
      status: 'no_reply',
      customProposal: customProposal,
      followersCount: followers
    });

    existingPhones.add(cleanPhone);
    existingUsernames.add(username);
    existingNames.add(name.toLowerCase());

    if (qualifiedLeads.length >= 50) break;
  }

  console.log(`Found ${qualifiedLeads.length} qualified leads meeting all criteria (>=10k followers, valid phone, non-duplicate).`);

  if (qualifiedLeads.length === 0) {
    console.log('No qualified leads found in this batch.');
    process.exit(0);
  }

  // Insert into Neon Postgres
  let inserted = 0;
  for (const lead of qualifiedLeads) {
    await db.insert(outreach).values({
      businessName: lead.businessName,
      businessType: lead.businessType,
      wilaya: lead.wilaya,
      phone: lead.phone,
      instagramUrl: lead.instagramUrl,
      status: lead.status,
      customProposal: lead.customProposal
    });
    inserted++;
  }

  console.log(`Successfully inserted ${inserted} brand-new verified leads into Neon Postgres outreach database!`);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error in scraper pipeline:', err);
  process.exit(1);
});
