import { generateChunkedProposal } from '../src/services/whatsapp/messageGenerator.js';

const res = generateChunkedProposal({
  businessName: 'Cadeau Biba',
  businessType: 'CADEAU',
  wilaya: 'CHLEF',
  phone: '0542 54 02 94',
  instagramUrl: 'https://www.instagram.com/cadeau_biba02/',
  customProposal: null
});

console.log('Total chunks:', res.chunks.length);
res.chunks.forEach((c, i) => {
  console.log(`\n--- Chunk ${i + 1} (${c.partName}) ---`);
  console.log(c.text);
  console.log(`Typing: ${c.typingDelayMs}ms, Pause after: ${c.pauseAfterMs}ms`);
});
