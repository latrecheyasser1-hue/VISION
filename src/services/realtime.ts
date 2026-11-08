import * as dotenv from 'dotenv';
import { createHmac } from 'node:crypto';

dotenv.config({ path: '.env.local' });

export function getRealtimeConfig() {
  const realtimeUrl = process.env.NEON_REALTIME_URL;
  const realtimeSecret = process.env.NEON_REALTIME_SECRET;

  if (!realtimeUrl || !realtimeSecret) {
    throw new Error('Neon Realtime environment variables (NEON_REALTIME_URL, NEON_REALTIME_SECRET) are missing');
  }

  return { realtimeUrl, realtimeSecret };
}

export function generateRealtimeToken(query: string) {
  const { realtimeSecret } = getRealtimeConfig();
  return createHmac('sha256', realtimeSecret).update(query).digest('hex');
}
