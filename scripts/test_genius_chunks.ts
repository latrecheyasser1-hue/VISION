import { generateChunkedProposal } from '../src/services/whatsapp/messageGenerator.js';

const text = "السلام عليكم خويا، شفت la boutique تاعكم في سوريكال باب الزوار ما شاء الله les smartwatches و les airpods توب ربي يبارك. في le domaine تاع l'high-tech كل زبون يسقسي نفس 10 أسئلة في les messages: شحال تشد la batterie، تمشي مع iPhone، فيها garantie؟ والرد يستهلكلك 4 ساعات يوميا. حنا شركة VISION لتطوير les sites web وأنظمة l'intelligence artificielle، نخدمولكم site e-commerce يعرض كل ساعة بـ fiche technique ومقارنة بالفيديو مع زر commande مباشر، يوفر عليك وقت الشات ويضاعف وتيرة البيع. تفضل le site تاعنا: digitalvisiondz.com بالتوفيق خويا.";

const res = generateChunkedProposal({
  businessName: 'Genius Watch 16',
  businessType: 'ساعات ذكية',
  customProposal: text
});

console.log('Chunks count:', res.chunks.length);
res.chunks.forEach((c, i) => {
  console.log(`[Chunk ${i+1}] (${c.partName}) length=${c.text.length}:`);
  console.log(c.text);
});

process.exit(0);
