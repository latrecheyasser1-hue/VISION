import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

export function getAiGatewayConfig() {
  const token = process.env.NEON_AI_GATEWAY_TOKEN;
  const baseUrl = process.env.NEON_AI_GATEWAY_BASE_URL;

  if (!token || !baseUrl) {
    throw new Error('Neon AI Gateway environment variables (NEON_AI_GATEWAY_TOKEN, NEON_AI_GATEWAY_BASE_URL) are missing');
  }

  return { token, baseUrl };
}

export async function checkAiGateway() {
  const { token, baseUrl } = getAiGatewayConfig();
  // Query available models endpoint
  const url = `${baseUrl.replace(/\/$/, '')}/v1/models`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));
  return {
    status: response.status,
    ok: response.ok,
    data,
  };
}
