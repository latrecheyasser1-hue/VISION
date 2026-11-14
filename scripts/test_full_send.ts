import { WhatsAppClient } from '../src/services/whatsapp/whatsappClient.js';
import { generateChunkedProposal } from '../src/services/whatsapp/messageGenerator.js';

async function testFullSend() {
  const client = WhatsAppClient.getInstance();
  console.log('Ensuring connected...');
  await client.ensureConnected();
  console.log('Client status:', client.getStatus());

  const generated = generateChunkedProposal({
    businessName: 'Test Business',
    businessType: 'Streetwear',
    phone: '0771335039',
    wilaya: 'Alger'
  });

  console.log(`Sending ${generated.chunks.length} chunks to 0771335039...`);
  for (let i = 0; i < generated.chunks.length; i++) {
    console.log(`Sending chunk ${i + 1}: "${generated.chunks[i].text.substring(0, 30)}..."`);
  }

  const res = await client.sendChunkedMessage('0771335039', generated.chunks, (idx, total) => {
    console.log(`Progress: ${idx}/${total}`);
  });

  console.log('Result:', res);
  process.exit(0);
}

testFullSend().catch(err => {
  console.error('TestFullSend Error:', err);
  process.exit(1);
});
