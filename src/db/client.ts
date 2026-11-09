import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';
import * as schema from './schema.js';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
dotenv.config();

const DEFAULT_DB_URL = "postgresql://neondb_owner:npg_cPiFTD7Bf6rl@ep-shiny-silence-bakg5l1v-pooler.c-8.eu-central-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
const connectionString = process.env.DATABASE_URL || DEFAULT_DB_URL;

const sql = neon(connectionString);
export const db = drizzle(sql, { schema });
export { sql };
