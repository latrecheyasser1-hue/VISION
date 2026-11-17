const token = process.env.APIFY_TOKEN;

async function main() {
  const query = 'boutique annaba, boutique tlemcen, vetement femme algerie, algerie shopping';
  console.log(`Starting query: "${query}"...`);
  const res = await fetch(`https://api.apify.com/v2/acts/apify~instagram-search-scraper/runs?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      search: query,
      searchType: 'user',
      searchLimit: 40
    })
  });
  const data = await res.json();
  const runId = data.data?.id;
  const datasetId = data.data?.defaultDatasetId;
  console.log(`Run started: ${runId}, Dataset: ${datasetId}`);

  while (true) {
    await new Promise(r => setTimeout(r, 4000));
    const poll = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const pollData = await poll.json();
    const status = pollData.data.status;
    console.log(`Run status: ${status}`);
    if (['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(status)) {
      break;
    }
  }

  console.log(`Dataset ready: ${datasetId}`);
}

main().catch(console.error);
