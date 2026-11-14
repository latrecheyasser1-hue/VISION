import fs from 'fs';
import { sql } from '../src/db/client.js';

async function syncMessages() {
  const content = fs.readFileSync('OUTREACH_MESSAGES.md', 'utf-8');
  const sections = content.split('### ').slice(1);

  console.log(`Parsed ${sections.length} sections from OUTREACH_MESSAGES.md`);

  const allRows: any[] = await sql.query(`
    SELECT id, business_name, instagram_url FROM outreach
  `);

  console.log(`Database has ${allRows.length} outreach prospects.`);

  let matched = 0;

  for (const sec of sections) {
    const lines = sec.split(/\r?\n/);
    const header = lines[0].trim(); // e.g. "1. bd_luxury19"
    const handle = header.replace(/^\d+\.\s*/, '').trim().toLowerCase();

    const msgMatch = sec.match(/```text\r?\n([\s\S]*?)\r?\n```/);
    if (!msgMatch) continue;
    const message = msgMatch[1].trim();

    // Find row where instagram_url contains handle or business_name matches
    const match = allRows.find(r => {
      const ig = (r.instagram_url || '').toLowerCase();
      const bname = (r.business_name || '').toLowerCase();
      return ig.includes(handle) || bname.includes(handle.replace(/_/g, ' '));
    });

    if (match) {
      await sql.query(`
        UPDATE outreach
        SET custom_proposal = $1
        WHERE id = $2
      `, [message, match.id]);
      matched++;
      console.log(`Matched [${handle}] -> [${match.business_name}]`);
    } else {
      console.log(`Unmatched handle: ${handle}`);
    }
  }

  console.log(`Successfully synced ${matched} custom proposals to database!`);
}

syncMessages()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error syncing:', err);
    process.exit(1);
  });
