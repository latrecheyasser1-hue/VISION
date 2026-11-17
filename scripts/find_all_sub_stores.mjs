const datasetIds = ['81olP2CoNPvx9fs3A', 'eZNXocmkuC3Qyw9ef', 'MFLlcQiIw1W84MAPY', 'OtkxmXvMXEHvdjpxU', 'nifoSRosssetrMvrG'];
const token = process.env.APIFY_TOKEN;

function extractPhoneRelaxed(text) {
  if (!text) return null;
  const match = text.match(/(?:\+?213|00213|0)\s*([567])(?:[\s\.\-_/]*\d){8}/);
  if (match) {
    const raw = match[0].replace(/\D/g, '');
    if (raw.startsWith('213') && raw.length === 12) return '0' + raw.slice(3);
    if (raw.startsWith('00213') && raw.length === 14) return '0' + raw.slice(5);
    if (raw.startsWith('0') && raw.length === 10) return raw;
  }
  return null;
}

async function findSubs() {
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

  for (const p of allProfiles.values()) {
    const u = (p.externalUrl || '').toLowerCase();
    if (u.includes('shopify') || u.includes('flexdz') || u.includes('youcan') || u.includes('dzbuild') || u.includes('dropdizer') || u.includes('lightfunnels')) {
      let ph = extractPhoneRelaxed(`${p.biography || ''} ${p.externalUrl || ''}`);
      if (!ph) {
        // try to fetch from site
        try {
          const controller = new AbortController();
          const t = setTimeout(() => controller.abort(), 4000);
          const r = await fetch(p.externalUrl, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
          clearTimeout(t);
          const html = await r.text();
          ph = extractPhoneRelaxed(html);
        } catch(e) {}
      }
      console.log(`@${p.username} | Followers: ${p.followersCount} | URL: ${p.externalUrl} | Phone: ${ph || 'NOT_FOUND'}`);
    }
  }
}
findSubs();
