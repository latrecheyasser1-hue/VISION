import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { generateTailoredProposal } from './generator_core.mjs';

const sql = neon(process.env.DATABASE_URL);

async function fixAndRegenerate() {
  console.log('1. Removing 7 foreign / non-boutique / invalid phone records...');
  const badIds = [
    '0db26ec0-89be-4acd-a98d-bdaa11989ffc', // MEHDI SHOP (Morocco)
    '6e943a01-3da5-4acb-bb25-8809ab4d0b27', // Nalouti Store (Tunisia)
    'd7cfae70-5dcf-4b79-b469-6f429a23a6a8', // Loja de roupas (Brazil)
    'f9535dac-644a-4a65-822a-66963672b769', // SkyeRose Baby Boutique (UK)
    '34e51a00-01f0-426c-8ea3-10f40c155c0a', // KOUB Coffee Shop (Cafe)
    'd5ed464c-cdee-4e75-9bd3-87f9b6d8ee19', // SUNRISE Bab Ezzouar (Cafe)
    '15d85117-d543-4eae-b76c-9e8a717bb833'  // Nessma Boutique (Landline)
  ];

  for (const id of badIds) {
    await sql`DELETE FROM outreach WHERE id = ${id}`;
  }
  console.log(`Deleted ${badIds.length} invalid rows.`);

  console.log('\n2. Updating misclassified store business_types...');
  await sql`
    UPDATE outreach 
    SET business_type = 'ملابس رجالية مقاسات كبيرة' 
    WHERE id = 'b7fac7cc-2a6a-4ed9-b563-6aaee6ad4a8d'
  `;
  await sql`
    UPDATE outreach 
    SET business_type = 'ألبسة نسائية جاهزة' 
    WHERE id = '47c7956a-d533-4be2-b9e5-f32add665ee7'
  `;
  await sql`
    UPDATE outreach 
    SET business_type = 'هواتف ذكية وصيانة وإكسسوارات' 
    WHERE id = '02219f01-6854-4184-a37b-6785bf58bb8c'
  `;
  await sql`
    UPDATE outreach 
    SET business_type = 'أجهزة إلكترونية وإكسسوارات ذكية' 
    WHERE id = '6d4a676b-1156-487e-a416-3266b087e66c'
  `;
  console.log('Updated types for misclassified stores.');

  console.log('\n3. Regenerating custom_proposal for ALL remaining rows in outreach...');
  const rows = await sql`
    SELECT id, business_name, business_type, wilaya, notes, instagram_url 
    FROM outreach 
    ORDER BY id ASC
  `;
  console.log(`Processing ${rows.length} valid Algerian stores...`);

  let count = 0;
  for (const r of rows) {
    const proposal = generateTailoredProposal(r);
    await sql`
      UPDATE outreach 
      SET custom_proposal = ${proposal},
          updated_at = NOW() 
      WHERE id = ${r.id}
    `;
    count++;
  }

  console.log(`Successfully regenerated all ${count} proposals!`);
}

fixAndRegenerate().catch(console.error);
