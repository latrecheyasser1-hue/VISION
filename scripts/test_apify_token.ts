const token = process.env.APIFY_TOKEN;

async function main() {
  const res = await fetch('https://api.apify.com/v2/users/me?token=' + token);
  const json = await res.json();
  console.log('Status:', res.status);
  console.log('User username:', json?.data?.username);
  console.log('User plan:', json?.data?.plan);
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
