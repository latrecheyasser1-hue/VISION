import 'dotenv/config';

const token = process.env.APIFY_TOKEN;

async function scrapeProfiles() {
  const usernames = ['case.phone06', 'lavillafemme02', 'dreams_shopdz'];
  console.log(`Querying Apify profile scraper for:`, usernames);

  const res = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      usernames: usernames
    })
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('Failed to start profile scraper:', data);
    return;
  }

  const runId = data.data.id;
  const datasetId = data.data.defaultDatasetId;
  console.log(`Run started: ${runId}, Dataset: ${datasetId}`);

  let status = 'RUNNING';
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise(r => setTimeout(r, 4000));
    const poll = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const pollData = await poll.json();
    status = pollData.data?.status;
    process.stdout.write(`[${status}] `);
  }

  console.log(`\nFetching items...`);
  const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&format=json`);
  const items = await itemsRes.json();
  console.log(`Got ${items.length} items:`);
  for (const item of items) {
    console.log('----------------------------------------------------');
    console.log(`Username: ${item.username}`);
    console.log(`Full Name: ${item.fullName}`);
    console.log(`Bio: ${item.biography}`);
    console.log(`External URL: ${item.externalUrl}`);
    console.log(`Followers: ${item.followersCount}`);
    console.log(`Business Category: ${item.businessCategoryName}`);
    console.log(`Latest Posts:`, (item.latestPosts || []).slice(0, 3).map(p => p.caption?.slice(0, 80)));
  }
}

scrapeProfiles().catch(console.error);
