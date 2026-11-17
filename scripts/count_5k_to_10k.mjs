import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import { db } from '../dist/src/db/client.js';
import { outreach } from '../dist/src/db/schema.js';

const datasetIds = ['81olP2CoNPvx9fs3A', 'eZNXocmkuC3Qyw9ef', 'MFLlcQiIw1W84MAPY', 'OtkxmXvMXEHvdjpxU', 'nifoSRosssetrMvrG'];
const token = process.env.APIFY_TOKEN;

function extractPhoneRelaxed(text) {
  if (!text) return null;
  const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  let normalized = text;
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replaceAll(arabicDigits[i], String(i));
  }
  
  const waMatch = normalized.match(/(?:wa\.me\/|whatsapp\.com\/send\?phone=)(?:213|00213)?([567]\d{8})/i);
  if (waMatch) return '0' + waMatch[1];

  const match = normalized.match(/(?:\+?213|00213|0)\s*([567])(?:[\s\.\-_/]*\d){8}/);
  if (match) {
    const raw = match[0].replace(/\D/g, '');
    if (raw.startsWith('213') && raw.length === 12) return '0' + raw.slice(3);
    if (raw.startsWith('00213') && raw.length === 14) return '0' + raw.slice(5);
    if (raw.startsWith('0') && raw.length === 10) return raw;
  }
  return null;
}

async function isSiteDown(url) {
  let target = url;
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = 'https://' + target;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(target, { 
      signal: controller.signal, 
      headers: { 'User-Agent': 'Mozilla/5.0' } 
    });
    clearTimeout(timeout);
    if (!res.ok) return { down: true, status: res.status };
    return { down: false, status: res.status };
  } catch (err) {
    return { down: true, error: err.message };
  }
}

async function count5kTo10k() {
  const existing = await db.select({
    phone: outreach.phone,
    name: outreach.businessName,
    insta: outreach.instagramUrl
  }).from(outreach);

  const existingInstas = new Set(existing.map(e => {
    if (!e.insta) return '';
    const parts = e.insta.toLowerCase().split('/').filter(Boolean);
    return parts.pop() || '';
  }).filter(Boolean));

  let allProfiles = new Map();
  for (const id of datasetIds) {
    try {
      const res = await fetch(`https://api.apify.com/v2/datasets/${id}/items?token=${token}&limit=1000`);
      const items = await res.json();
      for (const item of items) {
        if (item.username && !allProfiles.has(item.username.toLowerCase())) {
          allProfiles.set(item.username.toLowerCase(), item);
        }
      }
    } catch(e) {}
  }

  const between5kAnd10k = Array.from(allProfiles.values()).filter(p => {
    const f = p.followersCount || 0;
    return f >= 5000 && f < 10000;
  });

  console.log(`Total profiles with 5k to 10k followers: ${between5kAnd10k.length}`);

  let noSite = 0;
  let socialOnly = 0;
  let subPlatform = 0;
  let brokenSite = 0;
  let activeCustom = 0;

  let withPhone = 0;
  let notInDb = 0;

  const validTargetList = [];

  for (const p of between5kAnd10k) {
    const ext = (p.externalUrl || '').trim();
    const u = ext.toLowerCase();

    const isSub = u.includes('myshopify.com') || u.includes('shopify') || 
                  u.includes('flexdz.store') || u.includes('dzbuild.app') || 
                  u.includes('youcan.shop') || u.includes('youcan') || 
                  u.includes('ecwid') || u.includes('dropdizer') || 
                  u.includes('lightfunnels');

    const isSocialOrNone = !ext || 
      u.includes('tiktok.com') || u.includes('facebook.com') || u.includes('fb.com') || 
      u.includes('instagram.com') || u.includes('goo.gl') || u.includes('maps.google') || 
      u.includes('maps.app') || u.includes('youtube.com') || u.includes('t.me') || 
      u.includes('wa.me') || u.includes('whatsapp') || u.includes('linktr.ee') || 
      u.includes('bio.link') || u.includes('taplink') || u.includes('direct.me') || 
      u.includes('heylink.me') || u.includes('beacons.ai') || u.includes('gmail.com');

    let category = '';
    if (isSub) {
      subPlatform++;
      category = 'SUBSCRIPTION_PLATFORM';
    } else if (!ext) {
      noSite++;
      category = 'NO_SITE';
    } else if (isSocialOrNone) {
      socialOnly++;
      category = 'SOCIAL_OR_MAPS';
    } else {
      const check = await isSiteDown(ext);
      if (check.down) {
        brokenSite++;
        category = 'BROKEN_SITE';
      } else {
        activeCustom++;
        category = 'ACTIVE_CUSTOM';
      }
    }

    const full = `${p.biography || ''} ${p.externalUrl || ''}`;
    const phone = extractPhoneRelaxed(full);
    const inDb = existingInstas.has(p.username.toLowerCase());

    if (category !== 'ACTIVE_CUSTOM') {
      validTargetList.push({
        username: p.username,
        followers: p.followersCount,
        category,
        url: ext || null,
        phone,
        inDb
      });
      if (phone) withPhone++;
      if (!inDb) notInDb++;
    }
  }

  console.log(`\n--- BREAKDOWN ---`);
  console.log(`Total between 5k and 10k: ${between5kAnd10k.length}`);
  console.log(`- Ma 3ndhomch site ga3 (No URL): ${noSite}`);
  console.log(`- Dayrin ghi Social / Maps / Linktree / WhatsApp: ${socialOnly}`);
  console.log(`- Dayrin Plateforme d'abonnement (Shopify / Dzbuild / Flexdz): ${subPlatform}`);
  console.log(`- Dayrin site custom bssh HABES / Down: ${brokenSite}`);
  console.log(`- Dayrin site custom .com/.net KHEDAM (Excluded): ${activeCustom}`);
  console.log(`\nTotal Qualified (No site + Social + Sub + Broken): ${validTargetList.length}`);
  console.log(`- Menhom li 3ndhom numéro de téléphone f la bio: ${withPhone}`);
  console.log(`- Menhom li machi f la base de données deja: ${notInDb}`);

  console.log('\n--- SAMPLE QUALIFIED (first 15) ---');
  validTargetList.slice(0, 15).forEach(v => {
    console.log(`@${v.username} (${v.followers}) [${v.category}] Phone: ${v.phone || 'NONE'} | In DB: ${v.inDb}`);
  });
}

count5kTo10k();
