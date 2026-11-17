import 'dotenv/config';

async function checkApifyUser() {
  const token = process.env.APIFY_TOKEN;
  const res = await fetch(`https://api.apify.com/v2/users/me?token=${token}`);
  const data = await res.json();
  console.log('User info:', {
    username: data.data?.username,
    plan: data.data?.plan,
    limits: data.data?.limits,
    currentUsage: data.data?.currentBillingCycleUsageUsd
  });

  // Also check recent actor runs to see exact cost per run
  const runsRes = await fetch(`https://api.apify.com/v2/actor-runs?token=${token}&limit=10&desc=true`);
  const runsData = await runsRes.json();
  console.log('Recent runs:');
  for (const r of runsData.data?.items || []) {
    console.log(`- Run ${r.id} | Status: ${r.status} | Usage USD: $${r.usageUsd?.toFixed(4)} | Compute: ${r.stats?.computeUnits?.toFixed(4)} CU | Duration: ${r.stats?.durationMillis / 1000}s`);
  }
}

checkApifyUser().catch(console.error);
