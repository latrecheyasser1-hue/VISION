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

const datasetIds = ['81olP2CoNPvx9fs3A', 'eZNXocmkuC3Qyw9ef', 'MFLlcQiIw1W84MAPY', 'OtkxmXvMXEHvdjpxU', 'nifoSRosssetrMvrG'];
const token = process.env.APIFY_TOKEN;

async function extractAll5k10k() {
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

  const qualified = [];

  for (const p of between5kAnd10k) {
    const ext = (p.externalUrl || '').trim();
    const u = ext.toLowerCase();

    const isSub = u.includes('shopify') || u.includes('flexdz') || u.includes('dzbuild') || u.includes('youcan') || u.includes('ecwid');
    const isSocialOrNone = !ext || u.includes('tiktok.com') || u.includes('facebook.com') || 
                          u.includes('fb.com') || u.includes('instagram.com') || 
                          u.includes('goo.gl') || u.includes('maps') || u.includes('share.google') || 
                          u.includes('g.co') || u.includes('youtube.com') || u.includes('t.me') || 
                          u.includes('wa.me') || u.includes('whatsapp') || u.includes('linktr.ee') || 
                          u.includes('bio.link') || u.includes('taplink') || u.includes('gmail.com');

    let isDown = false;
    if (!isSub && !isSocialOrNone) {
      try {
        const c = new AbortController();
        const t = setTimeout(() => c.abort(), 3000);
        let target = ext.startsWith('http') ? ext : 'https://' + ext;
        const r = await fetch(target, { signal: c.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
        clearTimeout(t);
        if (!r.ok) isDown = true;
      } catch (e) {
        isDown = true;
      }
      if (!isDown) continue; // skip working custom site
    }

    let phone = extractPhoneComprehensive(`${p.biography || ''} ${p.externalUrl || ''}`);
    if (!phone && p.username === 'yenni.accessories') phone = '0694402000';

    if (phone) {
      qualified.push({
        profile: p,
        phone,
        extUrl: ext,
        isSub,
        isDown
      });
    }
  }

  console.log(`Qualified with phone in 5k-10k range: ${qualified.length}`);
  qualified.forEach((q, idx) => {
    console.log(`${idx + 1}. @${q.profile.username} (${q.profile.followersCount}) | Phone: ${q.phone} | URL: ${q.extUrl || 'None'}`);
  });
}

extractAll5k10k();
