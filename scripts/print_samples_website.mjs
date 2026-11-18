import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function printSamples() {
  const names = ['Ipad Store 16', 'Case Phone', 'La Villa Femme', 'Dreams Shop'];
  for (const n of names) {
    const rows = await sql`SELECT business_name, custom_proposal FROM outreach WHERE business_name ILIKE ${'%' + n + '%'}`;
    if (rows.length) {
      console.log('====================================================');
      console.log(`STORE: ${rows[0].business_name}`);
      console.log('====================================================');
      console.log(rows[0].custom_proposal);
      console.log('\n');
    }
  }
}

printSamples().catch(console.error);
