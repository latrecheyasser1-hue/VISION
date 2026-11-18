import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function inspectStores() {
  const ids = [
    'b7fac7cc-2a6a-4ed9-b563-6aaee6ad4a8d', // Grande taille homme
  ];

  const rows = await sql`
    SELECT id, business_name, business_type, phone, instagram_url, notes 
    FROM outreach 
    WHERE business_name ILIKE '%Ritaj%' 
       OR business_name ILIKE '%i Store%' 
       OR business_name ILIKE '%Rhino%' 
       OR business_name ILIKE '%SUNRISE%'
       OR business_name ILIKE '%Grande taille%'
       OR business_name ILIKE '%Biba%'
       OR business_name ILIKE '%Dari Belle%'
       OR business_name ILIKE '%Yass%'
  `;

  for (const r of rows) {
    console.log(r);
  }
}

inspectStores().catch(console.error);
