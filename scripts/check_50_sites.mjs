import dotenv from 'dotenv';
dotenv.config();
import { db } from '../dist/src/db/client.js';
import { outreach } from '../dist/src/db/schema.js';
import { desc } from 'drizzle-orm';

const datasetIds = ['81olP2CoNPvx9fs3A', 'eZNXocmkuC3Qyw9ef', 'MFLlcQiIw1W84MAPY', 'OtkxmXvMXEHvdjpxU', 'nifoSRosssetrMvrG'];

async function check() {
  const token = process.env.APIFY_TOKEN;
  let profileMap = new Map();
  for (const id of datasetIds) {
    try {
      const res = await fetch(`https://api.apify.com/v2/datasets/${id}/items?token=${token}&limit=1000`);
      const items = await res.json();
      for (const item of items) {
        if (item.username && !profileMap.has(item.username.toLowerCase())) {
          profileMap.set(item.username.toLowerCase(), item);
        }
      }
    } catch(e) {}
  }

  const records = await db.select().from(outreach).orderBy(desc(outreach.id)).limit(50);

  let countWithSite = 0;
  let countWithSocialOnly = 0;
  let countNoLink = 0;
  let listWithSite = [];

  for (const r of records) {
    const username = (r.instagramUrl || '').split('/').filter(Boolean).pop()?.toLowerCase();
    const p = profileMap.get(username);
    if (!p || !p.externalUrl) {
      countNoLink++;
    } else {
      const u = p.externalUrl.toLowerCase();
      if (u.includes('tiktok.com') || u.includes('facebook.com') || u.includes('maps') || u.includes('wa.me') || u.includes('youtube.com') || u.includes('gmail.com')) {
        countWithSocialOnly++;
      } else {
        countWithSite++;
        listWithSite.push({ name: r.businessName, username, url: p.externalUrl, followers: p.followersCount });
      }
    }
  }

  console.log('--- 50 INSERTED BREAKDOWN ---');
  console.log('Real website:', countWithSite);
  console.log('Social / Maps only:', countWithSocialOnly);
  console.log('No link (Instagram DM / Phone only):', countNoLink);
  console.log('Sites:', listWithSite);
}

check();
