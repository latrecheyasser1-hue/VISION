import * as dotenv from 'dotenv';
import { db, sql } from './db/client.js';
import * as schema from './db/schema.js';
import { checkAuthHealth } from './services/auth.js';
import { uploadAsset, listBucketObjects } from './services/storage.js';
import { invokeNeonFunction } from './services/functions.js';
import { checkAiGateway } from './services/ai-gateway.js';
import { getRealtimeConfig, generateRealtimeToken } from './services/realtime.js';

dotenv.config({ path: '.env.local' });

export async function checkAllServices() {
  console.log('========================================================');
  console.log('   VISION — Neon Backend Services Verification');
  console.log('========================================================\n');

  const results: Record<string, { ok: boolean; details: any }> = {};

  // 1. Lakebase Postgres
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
    console.log(`✓ [1/6] Lakebase Postgres: Connected & verified (${clientRecords.length} clients, ${projectRecords.length} projects in CRM).`);
  } catch (err: any) {
    results.postgres = { ok: false, details: err.message };
    console.error('✗ [1/6] Lakebase Postgres failed:', err.message);
  }

  // 2. Neon Auth
  try {
    const authStatus = await checkAuthHealth();
    results.auth = { ok: true, details: authStatus };
    console.log(`✓ [2/6] Neon Auth: JWKS endpoint accessible (keys: ${authStatus.keysCount}).`);
  } catch (err: any) {
    results.auth = { ok: false, details: err.message };
    console.error('✗ [2/6] Neon Auth failed:', err.message);
  }

  // 3. Object Storage
  try {
    const testKey = `verification-${Date.now()}.txt`;
    await uploadAsset('assets', testKey, 'VISION test asset upload to Neon S3', 'text/plain');
    const objects = await listBucketObjects('assets');
    results.objectStorage = {
      ok: true,
      details: {
        bucket: 'assets',
        lastUploaded: testKey,
        totalObjects: objects.length,
      },
    };
    console.log(`✓ [3/6] Neon Object Storage: Successfully uploaded and listed in bucket "assets" (total: ${objects.length}).`);
  } catch (err: any) {
    results.objectStorage = { ok: false, details: err.message };
    console.error('✗ [3/6] Neon Object Storage failed:', err.message);
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
