import 'dotenv/config';

const token = process.env.APIFY_TOKEN;

async function checkDreamsDetails() {
  const datasetId = 'j8GD7sepGgnqylpRb';
  const res = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&format=json`);
  const items = await res.json();
  const dreams = items.find(i => i.username === 'dreams_shopdz');
  if (dreams && dreams.latestPosts) {
    for (const p of dreams.latestPosts) {
      console.log('POST CAPTION:');
      console.log(p.caption);
    }
  }
}

checkDreamsDetails().catch(console.error);
