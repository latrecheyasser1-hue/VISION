import { splitCustomProposalIntoChunks } from '../src/services/whatsapp/messageGenerator.js';

const p = "السلام عليكم، شفت les cadeaux وباقات الهدايا عند Cadeau Biba في CHLEF ما شاء الله خدمة نقية وتفتح النفس ربي يبارك. في مجال الهدايا أكثر مشكل يدي الوقت في les messages هو شرح تفاصيل الباقة وتأكيد التوصيل في المناسبة، والزبون يحب يشوف الخيارات بوضوح باه يثق ويكوموندي فالحين. حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم متجر إلكتروني راقي يعرض كل باقة هدايا بتفاصيلها وسعرها وفورمير طلب سريعة، تضاعف مبيعاتكم وتريحكم من تعب الشات. تفرج le site تاعنا: digitalvisiondz.com بالتوفيق خويا العزيز.";

const chunks = splitCustomProposalIntoChunks(p, 'Cadeau Biba');
console.log('Total chunks:', chunks.length);
chunks.forEach((c, i) => {
  console.log(`--- Chunk ${i+1} (${c.partName}) ---`);
  console.log(c.text);
});
process.exit(0);
