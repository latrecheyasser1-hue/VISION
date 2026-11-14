import fs from 'fs';
import { sql } from '../src/db/client.js';

async function cleanWhatsAppMentions() {
  console.log('--- Cleaning OUTREACH_MESSAGES.md ---');
  let mdContent = fs.readFileSync('OUTREACH_MESSAGES.md', 'utf-8');

  const beforeMatches = mdContent.match(/0771335039/g) || [];
  console.log(`Found ${beforeMatches.length} occurrences of 0771335039 in OUTREACH_MESSAGES.md`);

  // Replace patterns like:
  // " وتواصل معايا في WhatsApp: 0771335039"
  // " وتتواصل معايا في WhatsApp: 0771335039"
  // " وللتواصل في WhatsApp: 0771335039"
  // " و WhatsApp: 0771335039"
  // " وتواصل في WhatsApp: 0771335039"
  // "، ورقمي في WhatsApp: 0771335039"
  const cleanedMd = mdContent.replace(/\s*(وتواصل معايا في WhatsApp|وتتواصل معايا في WhatsApp|وللتواصل في WhatsApp|و WhatsApp|وتواصل في WhatsApp|، ورقمي في WhatsApp|ورقمي في WhatsApp|ورقمي)\s*:\s*0771335039/g, '');

  fs.writeFileSync('OUTREACH_MESSAGES.md', cleanedMd, 'utf-8');
  const afterMatches = cleanedMd.match(/0771335039/g) || [];
  console.log(`Remaining occurrences of 0771335039 in OUTREACH_MESSAGES.md: ${afterMatches.length}`);

  console.log('\n--- Updating Database outreach.custom_proposal ---');
  const res = await sql.query(`
    UPDATE outreach
    SET custom_proposal = REGEXP_REPLACE(
      custom_proposal,
      '\\s*(وتواصل معايا في WhatsApp|وتتواصل معايا في WhatsApp|وللتواصل في WhatsApp|و WhatsApp|وتواصل في WhatsApp|، ورقمي في WhatsApp|ورقمي في WhatsApp|ورقمي)\\s*:\\s*0771335039',
      '',
      'g'
    )
    WHERE custom_proposal IS NOT NULL
    RETURNING id;
  `);

  console.log(`Updated ${res.length} rows in outreach table.`);

  // Let's also check if any phone number remains in custom_proposal
  const check = await sql.query(`
    SELECT count(*) as count FROM outreach WHERE custom_proposal LIKE '%0771335039%';
  `);
  console.log(`Remaining rows with 0771335039 in custom_proposal: ${check[0].count}`);
}

cleanWhatsAppMentions().catch(console.error);
