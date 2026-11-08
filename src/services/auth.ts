import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export function getAuthConfig() {
  const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
  const jwksUrl = process.env.NEON_AUTH_JWKS_URL;

  if (!authBaseUrl || !jwksUrl) {
    throw new Error('Neon Auth environment variables (NEON_AUTH_BASE_URL, NEON_AUTH_JWKS_URL) are missing');
  }

  return { authBaseUrl, jwksUrl };
}

export async function checkAuthHealth() {
  const { jwksUrl } = getAuthConfig();
  const response = await fetch(jwksUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS from Neon Auth (${response.status}: ${response.statusText})`);
  }
  const jwks = await response.json();
  return { status: 'healthy', keysCount: Array.isArray(jwks.keys) ? jwks.keys.length : 0 };
}
