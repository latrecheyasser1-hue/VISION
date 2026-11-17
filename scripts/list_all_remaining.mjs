import dotenv from 'dotenv';
dotenv.config();
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

async function listAllRemaining() {
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

  const results = [];
  const excluded = [];

  for (const p of gte10k) {
    const uName = p.username.toLowerCase();
    if (existingInstas.has(uName)) continue;

    const full = `${p.biography || ''} ${p.externalUrl || ''}`;
    const phone = extractPhoneRelaxed(full);
    if (!phone || existingPhones.has(phone)) continue;

    const ext = (p.externalUrl || '').trim();
    const u = ext.toLowerCase();

    // Check if subscription platform
    const isSub = u.includes('myshopify.com') || u.includes('shopify') || 
                  u.includes('flexdz.store') || u.includes('dzbuild.app') || 
                  u.includes('youcan.shop') || u.includes('youcan') || 
                  u.includes('ecwid') || u.includes('dropdizer') || 
                  u.includes('lightfunnels');

    if (isSub) {
      results.push({
        profile: p,
        phone,
        type: 'SUBSCRIPTION_PLATFORM',
        url: ext
      });
      continue;
    }

    // Check if social or none
    const isSocialOrNone = !ext || 
      u.includes('tiktok.com') || u.includes('facebook.com') || u.includes('fb.com') || 
      u.includes('instagram.com') || u.includes('goo.gl') || u.includes('maps.google') || 
      u.includes('maps.app') || u.includes('youtube.com') || u.includes('t.me') || 
      u.includes('wa.me') || u.includes('whatsapp') || u.includes('linktr.ee') || 
      u.includes('bio.link') || u.includes('taplink') || u.includes('direct.me') || 
      u.includes('heylink.me') || u.includes('beacons.ai') || u.includes('gmail.com');

    if (isSocialOrNone) {
      results.push({
        profile: p,
        phone,
        type: 'NO_SITE',
        url: ext || null
      });
      continue;
    }

    // Custom domain
    const check = await isSiteDown(ext);
    if (check.down) {
      results.push({
        profile: p,
        phone,
        type: 'BROKEN_SITE',
        url: ext,
        reason: check.status || check.error
      });
    } else {
      excluded.push({
        username: p.username,
        url: ext,
        followers: p.followersCount
      });
    }
  }

  console.log(`Total valid to insert: ${results.length}`);
  console.log(`- Subscription platforms: ${results.filter(r => r.type === 'SUBSCRIPTION_PLATFORM').length}`);
  console.log(`- Broken sites: ${results.filter(r => r.type === 'BROKEN_SITE').length}`);
  console.log(`- No site / Social only: ${results.filter(r => r.type === 'NO_SITE').length}`);
  console.log(`- Excluded active custom sites: ${excluded.length}`);

  for (const r of results) {
    console.log(`[${r.type}] @${r.profile.username} | ${r.phone} | ${r.profile.followersCount} followers | ${r.url || 'No URL'}`);
  }
}

listAllRemaining();
