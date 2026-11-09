import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import * as schema from './schema.js';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required to connect to the database.');
}

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
export { sql };
