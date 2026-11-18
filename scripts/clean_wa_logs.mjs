import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function cleanLogs() {
  const rows = await sql`SELECT id, content FROM whatsapp_logs WHERE content ILIKE '%كتالوج%' OR content ILIKE '%catalogue%'`;
  for (const r of rows) {
    let newContent = r.content
      .replaceAll('الكتالوج يعرض', 'المتجر الإلكتروني الخاص بيكم (Site web) يعرض')
      .replaceAll('الكتالوج الرقمي يعرض', 'المتجر الإلكتروني الخاص بيكم (Site web) يعرض')
      .replaceAll('الكتالوج', 'المتجر الإلكتروني')
      .replaceAll('كتالوج', 'متجر إلكتروني');
    await sql`UPDATE whatsapp_logs SET content = ${newContent} WHERE id = ${r.id}`;
    console.log(`Updated whatsapp_log: ${r.id}`);
  }
}

cleanLogs().catch(console.error);
