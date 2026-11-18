import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function checkCatalogueEverywhere() {
  console.log('1. Checking whatsapp_logs...');
  const logs = await sql`
    SELECT id, content 
    FROM whatsapp_logs 
    WHERE content ILIKE '%كتالوج%' 
       OR content ILIKE '%catalogue%'
  `;
  console.log(`Found in whatsapp_logs: ${logs.length}`);

  console.log('2. Checking whatsapp_settings...');
  const settings = await sql`
    SELECT key, value 
    FROM whatsapp_settings 
    WHERE value ILIKE '%كتالوج%' 
       OR value ILIKE '%catalogue%'
  `;
  console.log(`Found in whatsapp_settings: ${settings.length}`);

  console.log('3. Checking outreach table all columns...');
  const outreachNotes = await sql`
    SELECT id, business_name, notes, custom_proposal 
    FROM outreach 
    WHERE notes ILIKE '%كتالوج%' 
       OR notes ILIKE '%catalogue%'
       OR custom_proposal ILIKE '%كتالوج%'
       OR custom_proposal ILIKE '%catalogue%'
  `;
  console.log(`Found in outreach: ${outreachNotes.length}`);
  for (const r of outreachNotes) {
    console.log(`- ${r.business_name} | Notes: ${r.notes}`);
  }

  console.log('4. Checking codebase files for "كتالوج" or "catalogue"...');
}

checkCatalogueEverywhere().catch(console.error);
