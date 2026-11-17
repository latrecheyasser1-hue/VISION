const datasetIds = ['81olP2CoNPvx9fs3A', 'eZNXocmkuC3Qyw9ef', 'MFLlcQiIw1W84MAPY', 'OtkxmXvMXEHvdjpxU', 'nifoSRosssetrMvrG'];

async function checkWebsitesDetailed() {
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

  const gte10k = Array.from(allProfiles.values()).filter(p => (p.followersCount || 0) >= 10000);

  const realWebsites = [];
  const socialLinks = [];
  const waOrLinktree = [];
  const noLink = [];

  for (const p of gte10k) {
    const url = (p.externalUrl || '').trim();
    if (!url) {
      noLink.push(p);
      continue;
    }

    const u = url.toLowerCase();
    if (u.includes('tiktok.com') || u.includes('facebook.com') || u.includes('fb.com') || u.includes('instagram.com') || u.includes('goo.gl/maps') || u.includes('maps.google') || u.includes('maps.app.goo.gl')) {
      socialLinks.push({ username: p.username, url, followers: p.followersCount });
    } else if (u.includes('wa.me') || u.includes('whatsapp.com') || u.includes('linktr.ee') || u.includes('bio.link') || u.includes('taplink') || u.includes('direct.me') || u.includes('heylink.me') || u.includes('beacons.ai')) {
      waOrLinktree.push({ username: p.username, url, followers: p.followersCount });
    } else {
      realWebsites.push({ username: p.username, url, followers: p.followersCount });
    }
  }

  console.log('--- STATS ---');
  console.log('Total >=10k:', gte10k.length);
  console.log('Real E-commerce / Web Sites:', realWebsites.length);
  console.log('Social Media links (TikTok/FB/Maps):', socialLinks.length);
  console.log('WhatsApp / Linktree links:', waOrLinktree.length);
  console.log('Ma 3ndhom 7ta lien (Walou):', noLink.length);
  
  console.log('\n--- REAL WEBSITES LIST (Total: ' + realWebsites.length + ') ---');
  realWebsites.forEach(r => console.log(`@${r.username} (${r.followers.toLocaleString()} followers) -> ${r.url}`));
}

checkWebsitesDetailed();
