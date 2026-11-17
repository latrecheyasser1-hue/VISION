const token = process.env.APIFY_TOKEN;

async function main() {
  console.log('Starting test search run on Apify...');
  const startRes = await fetch('https://api.apify.com/v2/acts/apify~instagram-search-scraper/runs?token=' + token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      search: 'boutique alger',
      searchType: 'user',
      searchLimit: 5
    })
  });

  const startJson = await startRes.json();
  if (!startRes.ok) {
    console.error('Failed to start run:', startJson);
    return;
  }

  const runId = startJson.data.id;
  const datasetId = startJson.data.defaultDatasetId;
  console.log(`Run started: ${runId}, Dataset: ${datasetId}`);

  // Poll
  while (true) {
    await new Promise(r => setTimeout(r, 4000));
    const pollRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const pollJson = await pollRes.json();
    const status = pollJson.data.status;
    console.log(`Run status: ${status}`);
    if (['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
      break;
    }
  }

  // Fetch dataset items
  const dataRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&format=json`);
  const items = await dataRes.json();
  console.log(`Fetched ${items.length} items. First item:`);
  console.log(JSON.stringify(items[0], null, 2));
}

main().catch(console.error);
