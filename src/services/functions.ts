import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export function getFunctionUrl(functionName: string = 'hello') {
  const branchId = process.env.NEON_BRANCH_ID;
  const hostSuffix = process.env.NEON_FUNCTION_HOST_SUFFIX;

  if (!branchId || !hostSuffix) {
    throw new Error('Neon Functions environment variables (NEON_BRANCH_ID, NEON_FUNCTION_HOST_SUFFIX) are missing');
  }

  const cleanSuffix = hostSuffix.startsWith('.') ? hostSuffix.slice(1) : hostSuffix;
  return `https://${branchId}-${functionName}.${cleanSuffix}/`;
}

export async function invokeNeonFunction(functionName: string = 'hello') {
  const url = getFunctionUrl(functionName);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Neon Function ${functionName} returned HTTP ${response.status}: ${response.statusText}`);
  }
  const body = await response.text();
  return { status: response.status, body, url };
}
