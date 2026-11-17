import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

const datasetIds = ['81olP2CoNPvx9fs3A', 'eZNXocmkuC3Qyw9ef', 'MFLlcQiIw1W84MAPY', 'OtkxmXvMXEHvdjpxU', 'nifoSRosssetrMvrG'];
const token = process.env.APIFY_TOKEN;

function extractPhoneRelaxed(text) {
  if (!text) return null;
  const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  let normalized = text;
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replaceAll(arabicDigits[i], String(i));
  }
  
  const waMatch = normalized.match(/(?:wa\.me\/|whatsapp\.com\/send\?phone=|wa\.link\/)(?:213|00213)?([567]\d{8})/i);
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

async function inspectAll() {
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

  const qualifiedWithPhone = [];
  const qualifiedNoPhone = [];

  for (const p of between5kAnd10k) {
    const ext = (p.externalUrl || '').trim();
    const u = ext.toLowerCase();

    // Check if custom active site
    const isSub = u.includes('shopify') || u.includes('flexdz') || u.includes('dzbuild') || u.includes('youcan') || u.includes('ecwid');
    const isSocialOrNone = !ext || u.includes('tiktok.com') || u.includes('facebook.com') || u.includes('fb.com') || u.includes('instagram.com') || u.includes('goo.gl') || u.includes('maps') || u.includes('youtube.com') || u.includes('t.me') || u.includes('wa.me') || u.includes('whatsapp') || u.includes('linktr.ee') || u.includes('bio.link') || u.includes('taplink') || u.includes('gmail.com');

    let isDown = false;
    if (!isSub && !isSocialOrNone) {
      try {
        const c = new AbortController();
        const t = setTimeout(() => c.abort(), 3000);
        let target = ext.startsWith('http') ? ext : 'https://' + ext;
        const r = await fetch(target, { signal: c.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
        clearTimeout(t);
        if (!r.ok) isDown = true;
      } catch (err) {
        isDown = true;
      }
      if (!isDown) continue; // Exclude working custom
    }

    let phone = extractPhoneRelaxed(`${p.biography || ''} ${p.externalUrl || ''}`);
    
    // Check if external url is a wa.link or similar that redirects to a phone
    if (!phone && ext && (ext.includes('wa.link') || ext.includes('bit.ly') || ext.includes('linktr.ee'))) {
      try {
        const c = new AbortController();
        const t = setTimeout(() => c.abort(), 3000);
        const r = await fetch(ext, { signal: c.signal, redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
        clearTimeout(t);
        const redUrl = r.url;
        phone = extractPhoneRelaxed(redUrl);
        if (!phone) {
          const body = await r.text();
          phone = extractPhoneRelaxed(body);
        }
      } catch(e) {}
    }

    if (phone) {
      qualifiedWithPhone.push({
        profile: p,
        phone,
        extUrl: ext,
        isSub,
        isDown
      });
    } else {
      qualifiedNoPhone.push({
        profile: p,
        extUrl: ext
      });
    }
  }

  console.log(`With phone: ${qualifiedWithPhone.length}`);
  console.log(`Without phone: ${qualifiedNoPhone.length}`);
  console.log('\n--- LIST WITH PHONE ---');
  qualifiedWithPhone.forEach((q, idx) => {
    console.log(`${idx + 1}. @${q.profile.username} (${q.profile.followersCount}) | Phone: ${q.phone} | URL: ${q.extUrl || 'None'} | Bio: ${JSON.stringify(q.profile.biography.slice(0, 70))}`);
  });
}

inspectAll();
