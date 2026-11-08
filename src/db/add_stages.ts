import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const labels = ['devis', 'deposit_50', 'design_approved_20', 'security_qa'];
  for (const label of labels) {
    try {
      await sql.query(`ALTER TYPE project_stage ADD VALUE '${label}';`);
      console.log('Added:', label);
    } catch (e: any) {
      console.log('Note for', label, e.message);
    }
  }
  const res = await sql`SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE typname = 'project_stage';`;
  console.log('All labels:', res.map((r: any) => r.enumlabel));
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
