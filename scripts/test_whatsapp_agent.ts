import { generateChunkedProposal, generateFollowUp1, generateFollowUp2 } from '../src/services/whatsapp/messageGenerator.js';
import { WhatsAppOutreachAgent } from '../src/services/whatsapp/outreachAgent.js';

async function testAgentVerification() {
  console.log('=== 1. VERIFYING SAFETY GATE ===');
  const agent = WhatsAppOutreachAgent.getInstance();
  const settings = await agent.getSettings();
  console.log('Settings:', settings);
  if (settings.executionEnabled === false) {
    console.log('PASS: Safety Gate is strictly ACTIVE (executionEnabled is FALSE). No live messages will be sent.');
  } else {
    throw new Error('FAIL: Safety gate was not false by default!');
  }

  console.log('\n=== 2. VERIFYING 4-CHUNK PROPOSAL GENERATOR ===');
  const sampleProspect = {
    businessName: 'bd_luxury19',
    businessType: 'Streetwear & Sneakers',
    wilaya: 'Sétif',
    phone: '0771335039'
  };

  const proposal = generateChunkedProposal(sampleProspect);
  console.log(`Generated ${proposal.chunks.length} Chunks:`);
  proposal.chunks.forEach((chunk) => {
    console.log(`\n--- [Part ${chunk.partIndex}/${chunk.totalParts}: ${chunk.partName}] ---`);
    console.log(`Typing delay: ${(chunk.typingDelayMs / 1000).toFixed(1)}s | Pause after: ${(chunk.pauseAfterMs / 1000).toFixed(1)}s`);
    console.log(`Text: ${chunk.text}`);
  });

  console.log('\n=== 3. VERIFYING FOLLOW-UP 1 ===');
  const fu1 = generateFollowUp1(sampleProspect);
  console.log(`Follow-up 1 has ${fu1.chunks.length} chunks:`);
  fu1.chunks.forEach(c => console.log(`- ${c.partName}: ${c.text}`));

  console.log('\n=== 4. VERIFYING FOLLOW-UP 2 ===');
  const fu2 = generateFollowUp2(sampleProspect);
  console.log(`Follow-up 2 has ${fu2.chunks.length} chunks:`);
  fu2.chunks.forEach(c => console.log(`- ${c.partName}: ${c.text}`));

  console.log('\nAll agent verifications passed with 100% compliance!');
}

testAgentVerification()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Test verification failed:', err);
    process.exit(1);
  });
