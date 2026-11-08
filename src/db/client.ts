import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import * as schema from './schema.js';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing in environment variables (.env.local)');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
export { sql };
