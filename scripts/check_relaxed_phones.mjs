const datasetIds = ['81olP2CoNPvx9fs3A', 'eZNXocmkuC3Qyw9ef', 'MFLlcQiIw1W84MAPY', 'OtkxmXvMXEHvdjpxU', 'nifoSRosssetrMvrG'];
const token = process.env.APIFY_TOKEN;

function extractPhoneRelaxed(text) {
  if (!text) return null;
  // Convert arabic digits to english
  const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  let normalized = text;
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replaceAll(arabicDigits[i], String(i));
  }
  
  // match wa.me links
  const waMatch = normalized.match(/(?:wa\.me\/|whatsapp\.com\/send\?phone=)(?:213|00213)?([567]\d{8})/i);
  if (waMatch) return '0' + waMatch[1];

  // match common algerian mobile patterns
  const match = normalized.match(/(?:\+?213|00213|0)\s*([567])(?:[\s\.\-_/]*\d){8}/);
  if (match) {
    const raw = match[0].replace(/\D/g, '');
    if (raw.startsWith('213') && raw.length === 12) return '0' + raw.slice(3);
    if (raw.startsWith('00213') && raw.length === 14) return '0' + raw.slice(5);
    if (raw.startsWith('0') && raw.length === 10) return raw;
  }
  return null;
}

async function checkMore() {
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
  console.log('Total >=10k:', gte10k.length);

  let foundCount = 0;
  for (const p of gte10k) {
    const full = `${p.biography || ''} ${p.externalUrl || ''}`;
    const ph = extractPhoneRelaxed(full);
    if (ph) {
      foundCount++;
    }
  }
  console.log('Found with relaxed phone:', foundCount);
}

checkMore();
