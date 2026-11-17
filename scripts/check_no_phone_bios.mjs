import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

const datasetIds = ['81olP2CoNPvx9fs3A', 'eZNXocmkuC3Qyw9ef', 'MFLlcQiIw1W84MAPY', 'OtkxmXvMXEHvdjpxU', 'nifoSRosssetrMvrG'];
const token = process.env.APIFY_TOKEN;

async function check() {
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

  for (const p of between5kAnd10k) {
    const full = `${p.biography || ''} ${p.externalUrl || ''}`;
    // check if it has any numbers or contact
    console.log(`@${p.username} (${p.followersCount}) -> BIO: ${JSON.stringify(p.biography)} | URL: ${p.externalUrl}`);
  }
}

check();
