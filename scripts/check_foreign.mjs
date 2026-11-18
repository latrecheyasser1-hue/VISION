import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function checkForeign() {
  const rows = await sql`
    SELECT id, business_name, instagram_url, phone, notes, wilaya 
    FROM outreach 
    WHERE business_name ILIKE '%Loja%' 
       OR instagram_url ILIKE '%skyerose%'
       OR business_name ILIKE '%Nalouti%'
       OR business_name ILIKE '%MEHDI SHOP%'
       OR business_name ILIKE '%KOUB%'
       OR business_name ILIKE '%SUNRISE%'
  `;

  for (const r of rows) {
    console.log(r);
  }
}

checkForeign().catch(console.error);
