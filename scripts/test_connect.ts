import { WhatsAppClient } from '../src/services/whatsapp/whatsappClient.js';

async function testConnect() {
  const client = WhatsAppClient.getInstance();
  console.log('Connecting client...');
  await client.connect();
  console.log('Client status:', client.getStatus());
  
  // Wait 10 seconds to see if connection opens
  await new Promise(r => setTimeout(r, 10000));
  console.log('Client status after 10s:', client.getStatus());
  process.exit(0);
}

testConnect().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
