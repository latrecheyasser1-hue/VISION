import 'dotenv/config';

const token = process.env.APIFY_TOKEN || process.env.APIFY_TOKEN;

async function diagnose() {
  const res = await fetch(`https://api.apify.com/v2/datasets/st0ZF38h1fMRrlPps/items?token=${token}&format=json&limit=1000`);
  const items = await res.json();
  
  let under5k = 0;
  let over5k = 0;
  let over5kNoPhone = 0;
  let over5kWithPhone = 0;
  
  const sampleNoPhone = [];

  for (const item of items) {
    const f = item.followersCount || 0;
    if (f < 5000) {
      under5k++;
    } else {
      over5k++;
      const bio = `${item.biography || ''} ${item.externalUrl || ''}`;
      // Basic check
      const hasDigits = (bio.match(/\d{8,}/) || bio.includes('+213') || bio.includes('05') || bio.includes('06') || bio.includes('07'));
      if (hasDigits) {
        over5kWithPhone++;
      } else {
        over5kNoPhone++;
        if (sampleNoPhone.length < 5) {
          sampleNoPhone.push({ username: item.username, followers: f, bio: item.biography?.substring(0, 80), url: item.externalUrl });
        }
      }
    }
  }

  console.log({
    totalItems: items.length,
    under5k,
    over5k,
    over5kWithPhone,
    over5kNoPhone
  });
  console.log('Sample over 5k without phone in bio:');
  console.log(sampleNoPhone);
}

diagnose().catch(console.error);
