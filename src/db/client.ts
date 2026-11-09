import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import * as schema from './schema.js';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || '';

if (!connectionString) {
  console.warn('WARNING: DATABASE_URL is not set in environment variables.');
}

const sql = neon(connectionString || 'postgresql://neondb_owner:dummy@ep-dummy.neon.tech/neondb');
export const db = drizzle(sql, { schema });
export { sql };
