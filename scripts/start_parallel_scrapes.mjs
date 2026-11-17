const token = process.env.APIFY_TOKEN;

const searches = [
  'mode homme algerie, boutique oran, chaussures algerie, sneakers algerie',
  'cosmetique algerie, parfum algerie, bijoux algerie, accessoires algerie',
  'boutique constantine, boutique setif, boutique batna, boutique blida'
];

async function startOne(query) {
  console.log(`Starting run for: "${query}"...`);
  const res = await fetch(`https://api.apify.com/v2/acts/apify~instagram-search-scraper/runs?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      search: query,
      searchType: 'user',
      searchLimit: 35
    })
  });
  const data = await res.json();
  console.log(`Started: ${data.data?.id}, Dataset: ${data.data?.defaultDatasetId}`);
  return data.data?.id;
}

async function main() {
  for (const s of searches) {
    await startOne(s);
    await new Promise(r => setTimeout(r, 1000));
  }
}

main().catch(console.error);
