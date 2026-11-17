import 'dotenv/config';

async function checkRunDetail() {
  const token = process.env.APIFY_TOKEN;
  const runsRes = await fetch(`https://api.apify.com/v2/actor-runs?token=${token}&limit=3&desc=true`);
  const runsData = await runsRes.json();
  const run1 = runsData.data?.items?.[0];
  console.log('Run keys:', Object.keys(run1 || {}));
  console.log('Run details:', {
    id: run1.id,
    actId: run1.actId,
    usageUsd: run1.usageUsd,
    usageTotalUsd: run1.usageTotalUsd,
    pricingInfo: run1.pricingInfo,
    stats: run1.stats
  });

  // Also check billing/usage endpoint
  const billingRes = await fetch(`https://api.apify.com/v2/users/me/usage?token=${token}`);
  if (billingRes.ok) {
    const billing = await billingRes.json();
    console.log('Billing usage:', billing);
  } else {
    console.log('Billing status:', billingRes.status);
  }
}

checkRunDetail().catch(console.error);
