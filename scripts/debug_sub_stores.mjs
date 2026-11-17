const datasetIds = ['81olP2CoNPvx9fs3A', 'eZNXocmkuC3Qyw9ef', 'MFLlcQiIw1W84MAPY', 'OtkxmXvMXEHvdjpxU', 'nifoSRosssetrMvrG'];
const token = process.env.APIFY_TOKEN;

async function checkSub() {
  const users = ['boutique.sem', 'parfuma_algerie', 'lolitajeweldz', 'djowmir', 'unibrandzstore', 'refresh__clothes', 'actionwear.dz', 'cosmekarn', 'beautybay_parfumerie', 'assra_fashion111'];
  for (const id of datasetIds) {
    const res = await fetch(`https://api.apify.com/v2/datasets/${id}/items?token=${token}&limit=1000`);
    const items = await res.json();
    for (const item of items) {
      if (users.includes(item.username)) {
        console.log(item.username, '-> bio:', JSON.stringify(item.biography), 'externalUrl:', item.externalUrl, 'followers:', item.followersCount);
      }
    }
  }
}
checkSub();
