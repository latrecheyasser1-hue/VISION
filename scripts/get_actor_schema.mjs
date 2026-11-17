const token = process.env.APIFY_TOKEN;

async function main() {
  const res = await fetch('https://api.apify.com/v2/acts/apify~instagram-search-scraper/builds?token=' + token);
  const json = await res.json();
  // Get latest build
  const latestBuildId = json?.data?.items?.[0]?.id;
  const buildRes = await fetch(`https://api.apify.com/v2/acts/apify~instagram-search-scraper/builds/${latestBuildId}?token=${token}`);
  const buildJson = await buildRes.json();
  const schemaStr = buildJson?.data?.inputSchema;
  if (schemaStr) {
    const schema = JSON.parse(schemaStr);
    console.log('Properties:', Object.keys(schema.properties || {}));
    console.log('Sample properties:', JSON.stringify(schema.properties, null, 2));
  } else {
    console.log('No schema string found in build');
  }
}

main().catch(console.error);
