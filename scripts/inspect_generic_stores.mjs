import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function inspectGeneric() {
  const rows = await sql`
    SELECT id, business_name, instagram_url, business_type, notes 
    FROM outreach 
    WHERE business_type = 'BOUTIQUE E-COMMERCE' 
       OR business_type = 'ملابس جاهزة وتجارة تجزئة'
       OR business_type = 'ملابس وتجارة تجزئة'
       OR business_type = 'TECH'
       OR business_type = 'TECH & SMARTPHONE'
    ORDER BY id ASC
  `;

  console.log(`Found ${rows.length} generic/tech rows. Listing:`);
  for (const r of rows) {
    console.log(`ID: ${r.id} | Name: "${r.business_name}" | URL: ${r.instagram_url} | Type: "${r.business_type}"`);
  }
}

inspectGeneric().catch(console.error);
