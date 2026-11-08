import * as dotenv from 'dotenv';
import { db } from './client.js';
import { clients, projects } from './schema.js';

dotenv.config({ path: '.env.local' });

async function seed() {
  console.log('Seeding initial VISION clients and projects into Neon Postgres...');

  // Existing Algerian Clients from portfolio
  const seedData = [
    {
      companyName: 'Pyjama DZ',
      contactName: 'Responsable Pyjama DZ',
      phone: '0550000001',
      wilaya: 'Alger',
      industry: 'Clothing / E-Commerce & Wholesale',
      project: {
        title: 'Pyjama DZ — E-Commerce & POS',
        type: 'ecommerce',
        stage: 'delivered' as const,
        priceTotalDzd: '180000',
        depositPaidDzd: '180000',
        balanceDueDzd: '0',
        productionUrl: 'https://pyjama-dz.vercel.app/',
        isPublicPortfolio: true,
      },
    },
    {
      companyName: 'ClinicFlow DZ',
      contactName: 'Responsable Clinique',
      phone: '0550000002',
      wilaya: 'Oran',
      industry: 'Healthcare / Medical Clinic',
      project: {
        title: 'ClinicFlow DZ — Web Management Platform',
        type: 'web_app',
        stage: 'delivered' as const,
        priceTotalDzd: '250000',
        depositPaidDzd: '250000',
        balanceDueDzd: '0',
        productionUrl: 'https://clinicflowdz.com/',
        isPublicPortfolio: true,
      },
    },
    {
      companyName: 'الأقصى للأعشاب والتوابل',
      contactName: 'مسؤول المحل',
      phone: '0550000003',
      wilaya: 'Blida',
      industry: 'Retail / Herbs & Spices',
      project: {
        title: 'Al Aqsa — Offline POS & Desktop Accounting',
        type: 'desktop_offline',
        stage: 'delivered' as const,
        priceTotalDzd: '140000',
        depositPaidDzd: '140000',
        balanceDueDzd: '0',
        isPublicPortfolio: true,
      },
    },
    {
      companyName: 'Asel Butik',
      contactName: 'Responsable Asel Butik',
      phone: '0550000004',
      wilaya: 'Constantine',
      industry: 'Fashion & Retail',
      project: {
        title: 'Asel Butik — E-Commerce & Desktop POS',
        type: 'ecommerce',
        stage: 'delivered' as const,
        priceTotalDzd: '190000',
        depositPaidDzd: '190000',
        balanceDueDzd: '0',
        productionUrl: 'https://asel-butik.netlify.app/',
        isPublicPortfolio: true,
      },
    },
    {
      companyName: 'HK STORE',
      contactName: 'Responsable HK STORE',
      phone: '0550000005',
      wilaya: 'Setif',
      industry: 'Watches & Accessories',
      project: {
        title: 'HK STORE — E-Commerce & POS',
        type: 'ecommerce',
        stage: 'delivered' as const,
        priceTotalDzd: '160000',
        depositPaidDzd: '160000',
        balanceDueDzd: '0',
        productionUrl: 'https://hk--store.vercel.app/',
        isPublicPortfolio: true,
      },
    },
  ];

  for (const item of seedData) {
    const [insertedClient] = await db
      .insert(clients)
      .values({
        companyName: item.companyName,
        contactName: item.contactName,
        phone: item.phone,
        wilaya: item.wilaya,
        industry: item.industry,
      })
      .returning();

    await db.insert(projects).values({
      clientId: insertedClient.id,
      title: item.project.title,
      type: item.project.type,
      stage: item.project.stage,
      priceTotalDzd: item.project.priceTotalDzd,
      depositPaidDzd: item.project.depositPaidDzd,
      balanceDueDzd: item.project.balanceDueDzd,
      productionUrl: item.project.productionUrl,
      isPublicPortfolio: item.project.isPublicPortfolio,
    });
  }

  console.log('✓ Successfully seeded 5 clients and 5 projects into Neon Postgres!');
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  });
