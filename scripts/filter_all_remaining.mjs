import dotenv from 'dotenv';
dotenv.config();
import { db } from '../dist/src/db/client.js';
import { outreach } from '../dist/src/db/schema.js';

const datasetIds = ['81olP2CoNPvx9fs3A', 'eZNXocmkuC3Qyw9ef', 'MFLlcQiIw1W84MAPY', 'OtkxmXvMXEHvdjpxU', 'nifoSRosssetrMvrG'];

function extractPhone(text) {
  if (!text) return null;
  const cleaned = text.replace(/[\s\.\-\(\)]/g, '');
  const match = cleaned.match(/(?:\+?213|00213|0)([567]\d{8})/);
  if (match) {
    return '0' + match[1];
  }
  return null;
}

function classifyUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') return { type: 'NONE' };
  const u = url.toLowerCase().trim();
  if (u.includes('tiktok.com') || u.includes('facebook.com') || u.includes('fb.com') || 
      u.includes('instagram.com') || u.includes('goo.gl') || u.includes('maps.google') || 
      u.includes('maps.app') || u.includes('youtube.com') || u.includes('t.me') || 
      u.includes('wa.me') || u.includes('whatsapp') || u.includes('linktr.ee') || 
      u.includes('bio.link') || u.includes('taplink') || u.includes('direct.me') || 
      u.includes('heylink.me') || u.includes('beacons.ai') || u.includes('gmail.com')) {
    return { type: 'SOCIAL_OR_MAPS', url };
  }
  if (u.includes('myshopify.com') || u.includes('shopify') || u.includes('flexdz.store') || 
      u.includes('dzbuild.app') || u.includes('youcan.shop') || u.includes('youcan') || 
      u.includes('ecwid') || u.includes('dropdizer') || u.includes('lightfunnels')) {
    return { type: 'SUBSCRIPTION_PLATFORM', url };
  }
  return { type: 'CUSTOM_DOMAIN', url };
}

async function isSiteDown(url) {
  let target = url;
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = 'https://' + target;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(target, { 
      signal: controller.signal, 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } 
    });
    clearTimeout(timeout);
    // If status is >= 400, considered broken/down
    if (!res.ok) return true;
    return false; // working
  } catch (err) {
    return true; // network error, down, SSL error, domain expired
  }
}

async function main() {
  const existing = await db.select({
    phone: outreach.phone,
    name: outreach.businessName,
    insta: outreach.instagramUrl
  }).from(outreach);

  const existingPhones = new Set(existing.map(e => e.phone).filter(Boolean));
  const existingInstas = new Set(existing.map(e => {
    if (!e.insta) return '';
    const parts = e.insta.toLowerCase().split('/').filter(Boolean);
    return parts.pop() || '';
  }).filter(Boolean));

  console.log(`Existing DB: ${existing.length} records, ${existingPhones.size} phones, ${existingInstas.size} handles.`);

  const token = process.env.APIFY_TOKEN;
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

  console.log(`Total unique profiles scraped: ${allProfiles.size}`);

  const candidates = [];
  const excludedWorkingCustom = [];
  const noPhone = [];

  for (const p of allProfiles.values()) {
    const username = p.username.toLowerCase();
    if (existingInstas.has(username)) continue;

    const followers = p.followersCount || 0;
    if (followers < 10000) continue;

    const fullText = `${p.biography || ''} ${p.externalUrl || ''}`;
    const phone = extractPhone(fullText);
    if (!phone || existingPhones.has(phone)) {
      if (!phone) noPhone.push(username);
      continue;
    }

    const classification = classifyUrl(p.externalUrl);

    if (classification.type === 'CUSTOM_DOMAIN') {
      const down = await isSiteDown(classification.url);
      if (!down) {
        excludedWorkingCustom.push({ username, url: classification.url, followers });
        continue; // exclude active custom site
      } else {
        // Site is down! Keep it and mark as BROKEN_SITE
        candidates.push({
          profile: p,
          phone,
          followers,
          siteType: 'BROKEN_SITE',
          url: classification.url
        });
        continue;
      }
    }

    // Either NONE, SOCIAL_OR_MAPS, or SUBSCRIPTION_PLATFORM
    candidates.push({
      profile: p,
      phone,
      followers,
      siteType: classification.type,
      url: classification.url || null
    });
  }

  console.log(`\nResults:`);
  console.log(`- Candidates found with phone & >=10k: ${candidates.length}`);
  console.log(`  - Subscription platforms (Shopify/Flexdz/etc.): ${candidates.filter(c => c.siteType === 'SUBSCRIPTION_PLATFORM').length}`);
  console.log(`  - Broken custom domain: ${candidates.filter(c => c.siteType === 'BROKEN_SITE').length}`);
  console.log(`  - Social/Maps only: ${candidates.filter(c => c.siteType === 'SOCIAL_OR_MAPS').length}`);
  console.log(`  - No link at all: ${candidates.filter(c => c.siteType === 'NONE').length}`);
  console.log(`- Excluded active custom websites: ${excludedWorkingCustom.length}`);
  console.log(`- >=10k accounts with no phone in bio: ${noPhone.length}`);

  console.log('\n--- SUBSCRIPTION PLATFORMS FOUND ---');
  candidates.filter(c => c.siteType === 'SUBSCRIPTION_PLATFORM').forEach(c => {
    console.log(`@${c.profile.username} (${c.followers.toLocaleString()}) -> ${c.url} | Phone: ${c.phone}`);
  });

  console.log('\n--- BROKEN SITES FOUND ---');
  candidates.filter(c => c.siteType === 'BROKEN_SITE').forEach(c => {
    console.log(`@${c.profile.username} (${c.followers.toLocaleString()}) -> ${c.url} | Phone: ${c.phone}`);
  });

  console.log('\n--- EXCLUDED WORKING SITES ---');
  excludedWorkingCustom.forEach(c => {
    console.log(`@${c.username} (${c.followers.toLocaleString()}) -> ${c.url}`);
  });
}

main();
