const token = process.env.APIFY_TOKEN;

async function main() {
  const res = await fetch('https://api.apify.com/v2/acts/apify~instagram-search-scraper?token=' + token);
  const json = await res.json();
  console.log('Search Scraper exists:', res.status, json?.data?.name);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
