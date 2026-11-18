import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function checkAllTables() {
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `;
  console.log('Tables in database:', tables.map(t => t.table_name));

  for (const t of tables) {
    const tableName = t.table_name;
    const cols = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = ${tableName}
    `;
    console.log(`Columns in ${tableName}:`, cols.map(c => c.column_name));
  }
}

checkAllTables().catch(console.error);
