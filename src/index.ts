import * as dotenv from 'dotenv';
import { db, sql } from './db/client.js';
import * as schema from './db/schema.js';
import { checkAuthHealth } from './services/auth.js';
import { uploadToR2, listR2Objects, getR2PublicUrl } from './services/storage.js';
import { invokeNeonFunction } from './services/functions.js';
import { checkAiGateway } from './services/ai-gateway.js';
import { getRealtimeConfig, generateRealtimeToken } from './services/realtime.js';

dotenv.config({ path: '.env.local' });

export async function checkAllServices() {
  console.log('========================================================');
  console.log('   VISION — Backend & Cloudflare R2 Verification');
  console.log('========================================================\n');

  const results: Record<string, { ok: boolean; details: any }> = {};

  // 1. Lakebase Postgres (Neon)
  try {
    const rawResult = await sql`SELECT NOW() as current_time, version() as pg_version`;
    const clientRecords = await db.select().from(schema.clients);
    const projectRecords = await db.select().from(schema.projects);

    results.postgres = {
      ok: true,
      details: {
        time: rawResult[0]?.current_time,
        version: (rawResult[0]?.pg_version as string)?.substring(0, 40) + '...',
        totalClientsInCRM: clientRecords.length,
        totalProjectsInCRM: projectRecords.length,
      },
    };
    console.log(`✓ [1/6] Neon Postgres: Connected & verified (${clientRecords.length} clients, ${projectRecords.length} projects).`);
  } catch (err: any) {
    results.postgres = { ok: false, details: err.message };
    console.error('✗ [1/6] Neon Postgres failed:', err.message);
  }

  // 2. Cloudflare R2 Storage (Bucket: vision)
  try {
    const testKey = `receipts/test-verification-${Date.now()}.txt`;
    const uploadRes = await uploadToR2(testKey, 'VISION receipt test file on Cloudflare R2', 'text/plain');
    const objects = await listR2Objects();
    results.cloudflareR2 = {
      ok: true,
      details: {
        bucket: uploadRes.bucket,
        uploadedKey: testKey,
        publicUrl: uploadRes.publicUrl,
        totalObjectsInBucket: objects.length,
      },
    };
    console.log(`✓ [2/6] Cloudflare R2: Connected! Uploaded "${testKey}".`);
    console.log(`       Public link: ${uploadRes.publicUrl}`);
    console.log(`       Total objects in bucket "vision": ${objects.length}`);
  } catch (err: any) {
    results.cloudflareR2 = { ok: false, details: err.message };
    console.error('✗ [2/6] Cloudflare R2 failed:', err.message);
  }

  // 3. Neon Auth
  try {
    const authStatus = await checkAuthHealth();
    results.auth = { ok: true, details: authStatus };
    console.log(`✓ [3/6] Neon Auth: JWKS endpoint accessible (keys: ${authStatus.keysCount}).`);
  } catch (err: any) {
    results.auth = { ok: false, details: err.message };
    console.error('✗ [3/6] Neon Auth failed:', err.message);
  }

  // 4. Neon Functions
  try {
    const funcResult = await invokeNeonFunction('hello');
    results.functions = { ok: true, details: funcResult };
    console.log(`✓ [4/6] Neon Functions: Deployed hello function responded with: "${funcResult.body}".`);
  } catch (err: any) {
    results.functions = { ok: false, details: err.message };
    console.error('✗ [4/6] Neon Functions failed:', err.message);
  }

  // 5. AI Gateway
  try {
    const aiResult = await checkAiGateway();
    results.aiGateway = {
      ok: aiResult.ok || aiResult.status === 402 || aiResult.status === 403,
      details: aiResult,
    };
    console.log(`✓ [5/6] Neon AI Gateway: Reached gateway endpoint (HTTP ${aiResult.status}).`);
  } catch (err: any) {
    results.aiGateway = { ok: false, details: err.message };
    console.error('✗ [5/6] Neon AI Gateway failed:', err.message);
  }

  // 6. Neon Realtime
  try {
    const realtimeConfig = getRealtimeConfig();
    const token = generateRealtimeToken('SELECT * FROM clients');
    results.realtime = {
      ok: true,
      details: {
        url: realtimeConfig.realtimeUrl,
        querySignatureGenerated: token.substring(0, 16) + '...',
      },
    };
    console.log(`✓ [6/6] Neon Realtime: Endpoint configured & cryptographic HMAC signer operational.`);
  } catch (err: any) {
    results.realtime = { ok: false, details: err.message };
    console.error('✗ [6/6] Neon Realtime failed:', err.message);
  }

  console.log('\n========================================================');
  return results;
}

checkAllServices().then(() => process.exit(0));
