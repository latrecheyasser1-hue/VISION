const token = process.env.APIFY_TOKEN;

async function main() {
  const res = await fetch('https://api.apify.com/v2/acts/apify~instagram-profile-scraper/builds?token=' + token);
  const json = await res.json();
  const latestBuildId = json?.data?.items?.[0]?.id;
  const buildRes = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/builds/${latestBuildId}?token=${token}`);
  const buildJson = await buildRes.json();
  const schemaStr = buildJson?.data?.inputSchema;
  if (schemaStr) {
    const schema = JSON.parse(schemaStr);
    console.log('Profile Scraper Properties:', Object.keys(schema.properties || {}));
  }
}

main().catch(console.error);
