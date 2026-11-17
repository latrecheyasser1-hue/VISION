function extractPhone(text) {
  if (!text) return null;
  const cleaned = text.replace(/[\s\.\-\(\)]/g, '');
  const match = cleaned.match(/(?:\+?213|00213|0)([567]\d{8})/);
  if (match) {
    return '0' + match[1];
  }
  return null;
}

async function testFetchPhone(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    const text = await res.text();
    const phone = extractPhone(text);
    console.log(url, '-> found phone:', phone);
  } catch (e) {
    console.log(url, '-> error:', e.message);
  }
}

async function run() {
  await testFetchPhone('https://sem.flexdz.store/');
  await testFetchPhone('https://profumooo.myshopify.com');
  await testFetchPhone('https://lolitajewel.flexdz.store/');
  await testFetchPhone('https://banatbio.dzbuild.app/product/20393');
  await testFetchPhone('https://actionwear.dz/');
}

run();
