import dotenv from 'dotenv';
dotenv.config();
import { db } from '../dist/src/db/client.js';
import { outreach } from '../dist/src/db/schema.js';

const datasetIds = ['81olP2CoNPvx9fs3A', 'eZNXocmkuC3Qyw9ef', 'MFLlcQiIw1W84MAPY', 'OtkxmXvMXEHvdjpxU', 'nifoSRosssetrMvrG'];
const token = process.env.APIFY_TOKEN;

function extractPhone(text) {
  if (!text) return null;
  const cleaned = text.replace(/[\s\.\-\(\)]/g, '');
  const match = cleaned.match(/(?:\+?213|00213|0)([567]\d{8})/);
  if (match) {
    return '0' + match[1];
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
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(target, { 
      signal: controller.signal, 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } 
    });
    clearTimeout(timeout);
    if (!res.ok) return { down: true, status: res.status };
    return { down: false, status: res.status };
  } catch (err) {
    return { down: true, error: err.message };
  }
}

async function fetchSitePhone(url) {
  let target = url;
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = 'https://' + target;
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(target, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const text = await res.text();
    return extractPhone(text);
  } catch (e) {
    return null;
  }
}

async function analyzeAll() {
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

  const gte10k = Array.from(allProfiles.values()).filter(p => (p.followersCount || 0) >= 10000);

  const subscriptionCandidates = [];
  const brokenSiteCandidates = [];
  const noSiteCandidates = [];
  const excludedActiveCustom = [];

  for (const p of gte10k) {
    const username = p.username.toLowerCase();
    if (existingInstas.has(username)) continue;

    let phone = extractPhone(`${p.biography || ''} ${p.externalUrl || ''}`);

    const extUrl = (p.externalUrl || '').trim();
    const u = extUrl.toLowerCase();

    const isSub = u.includes('myshopify.com') || u.includes('shopify') || 
                  u.includes('flexdz.store') || u.includes('dzbuild.app') || 
                  u.includes('youcan.shop') || u.includes('youcan') || 
                  u.includes('ecwid') || u.includes('dropdizer') || 
                  u.includes('lightfunnels');

    if (isSub) {
      if (!phone) {
        // try to fetch phone from the store site!
        phone = await fetchSitePhone(extUrl);
      }
      if (phone && !existingPhones.has(phone)) {
        subscriptionCandidates.push({
          username: p.username,
          name: p.fullName || p.username,
          bio: p.biography,
          followers: p.followersCount,
          phone,
          url: extUrl,
          category: 'SUBSCRIPTION_PLATFORM'
        });
      }
      continue;
    }

    const isSocialOrMapsOrNone = !extUrl || 
      u.includes('tiktok.com') || u.includes('facebook.com') || u.includes('fb.com') || 
      u.includes('instagram.com') || u.includes('goo.gl') || u.includes('maps.google') || 
      u.includes('maps.app') || u.includes('youtube.com') || u.includes('t.me') || 
      u.includes('wa.me') || u.includes('whatsapp') || u.includes('linktr.ee') || 
      u.includes('bio.link') || u.includes('taplink') || u.includes('direct.me') || 
      u.includes('heylink.me') || u.includes('beacons.ai') || u.includes('gmail.com');

    if (isSocialOrMapsOrNone) {
      if (phone && !existingPhones.has(phone)) {
        noSiteCandidates.push({
          username: p.username,
          name: p.fullName || p.username,
          bio: p.biography,
          followers: p.followersCount,
          phone,
          url: extUrl || null,
          category: 'NO_SITE_OR_SOCIAL'
        });
      }
      continue;
    }

    // Otherwise, it is a custom domain (.com, .net, etc.)
    const checkDown = await isSiteDown(extUrl);
    if (checkDown.down) {
      if (!phone) {
        phone = await fetchSitePhone(extUrl);
      }
      if (phone && !existingPhones.has(phone)) {
        brokenSiteCandidates.push({
          username: p.username,
          name: p.fullName || p.username,
          bio: p.biography,
          followers: p.followersCount,
          phone,
          url: extUrl,
          reason: checkDown.status || checkDown.error,
          category: 'BROKEN_SITE'
        });
      }
    } else {
      excludedActiveCustom.push({
        username: p.username,
        followers: p.followersCount,
        url: extUrl
      });
    }
  }

  console.log(`\n================ SUMMARY ================`);
  console.log(`1. Subscription Platform Candidates (Shopify/Flexdz): ${subscriptionCandidates.length}`);
  console.log(`2. Broken Custom Domain Candidates: ${brokenSiteCandidates.length}`);
  console.log(`3. No Site / Social Only Candidates: ${noSiteCandidates.length}`);
  console.log(`4. Excluded Active Custom Sites: ${excludedActiveCustom.length}`);
  console.log(`Total Qualified Candidates: ${subscriptionCandidates.length + brokenSiteCandidates.length + noSiteCandidates.length}`);

  console.log('\n--- DETAILED SUBSCRIPTION STORES ---');
  console.log(JSON.stringify(subscriptionCandidates, null, 2));

  console.log('\n--- DETAILED BROKEN SITES ---');
  console.log(JSON.stringify(brokenSiteCandidates, null, 2));

  console.log('\n--- DETAILED NO SITE (first 10) ---');
  console.log(JSON.stringify(noSiteCandidates.slice(0, 10), null, 2));
}

analyzeAll();
