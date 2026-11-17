import 'dotenv/config';

async function checkAllRuns() {
  const token = process.env.APIFY_TOKEN;
  const runsRes = await fetch(`https://api.apify.com/v2/actor-runs?token=${token}&limit=100&desc=true`);
  const runsData = await runsRes.json();
  const items = runsData.data?.items || [];
  
  let totalSpent = 0;
  console.log(`Total runs found: ${items.length}`);
  
  for (const r of items) {
    const cost = r.usageTotalUsd || 0;
    totalSpent += cost;
    
    // Check dataset count
    let itemCount = 0;
    if (r.defaultDatasetId) {
      const dsRes = await fetch(`https://api.apify.com/v2/datasets/${r.defaultDatasetId}?token=${token}`);
      if (dsRes.ok) {
        const dsData = await dsRes.json();
        itemCount = dsData.data?.itemCount || 0;
      }
    }
    console.log(`Run ${r.id} | Act: ${r.actId} | Status: ${r.status} | Cost: $${cost.toFixed(3)} | Items scraped: ${itemCount}`);
  }
  
  console.log(`\n==========================================`);
  console.log(`TOTAL SPENT SO FAR: $${totalSpent.toFixed(3)}`);
  console.log(`REMAINING IN $5.00 FREE TIER: $${(5.00 - totalSpent).toFixed(3)}`);
}

checkAllRuns().catch(console.error);
