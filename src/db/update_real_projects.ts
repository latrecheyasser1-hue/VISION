import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { db, sql } from './client.js';
import * as schema from './schema.js';
import { eq, or, ilike } from 'drizzle-orm';

async function updateRealProjects() {
  console.log('Synchronizing accurate portfolio data in Neon Postgres...');

  const enumVals = await sql`SELECT enumlabel FROM pg_enum JOIN pg_type ON pg_enum.enumtypid = pg_type.oid WHERE typname = 'project_stage';`;
  console.log('Existing project_stage enum values:', enumVals.map((e: any) => e.enumlabel));

  // 1. Remove ClinicFlow DZ invoices, projects, and client
  const clinicClients = await db.select().from(schema.clients).where(ilike(schema.clients.companyName, '%clinic%'));
  for (const c of clinicClients) {
    await db.delete(schema.invoices).where(eq(schema.invoices.clientId, c.id));
    await db.delete(schema.projects).where(eq(schema.projects.clientId, c.id));
    await db.delete(schema.clients).where(eq(schema.clients.id, c.id));
    console.log(`Deleted ClinicFlow client and related records (${c.id})`);
  }

  // 2. Clear out all seeded data to insert the exact real portfolio cleanly
  await db.delete(schema.invoices);
  await db.delete(schema.projects);
  await db.delete(schema.clients);
  console.log('Cleaned old records.');

  // 3. Define the exact real clients and projects
  const realClients = [
    {
      companyName: 'Pyjama DZ',
      contactName: 'Mohamed - Pyjama DZ',
      phone: '0550 11 22 33',
      wilaya: 'Alger',
      industry: 'Fashion & Wholesale Manufacturing',
      projects: [
        {
          title: 'Pyjama DZ — E-Commerce Platform & Online Store',
          type: 'ecommerce',
          stage: 'delivered' as any,
          priceTotalDzd: '450000',
          m1AmountDzd: '225000',
          m1Paid: true,
          m2AmountDzd: '90000',
          m2Paid: true,
          m3AmountDzd: '135000',
          m3Paid: true,
          notes: 'Full online shopping platform with product catalog, cart, and delivery integration.',
          startDate: new Date('2026-06-10T09:00:00Z'),
        },
        {
          title: 'Pyjama DZ — Employee Attendance System (Pointage)',
          type: 'custom_software',
          stage: 'delivered' as any,
          priceTotalDzd: '50000',
          m1AmountDzd: '25000',
          m1Paid: true,
          m2AmountDzd: '10000',
          m2Paid: true,
          m3AmountDzd: '15000',
          m3Paid: true,
          notes: 'Automated staff time & attendance logging, shift tracking, and monthly hours calculation.',
          startDate: new Date('2026-08-15T10:30:00Z'),
        },
        {
          title: 'Pyjama DZ — Barcode Reception & Counting System',
          type: 'custom_software',
          stage: 'delivered' as any,
          priceTotalDzd: '40000',
          m1AmountDzd: '20000',
          m1Paid: true,
          m2AmountDzd: '8000',
          m2Paid: true,
          m3AmountDzd: '12000',
          m3Paid: true,
          notes: 'Barcode scanner intake tool for workers to scan incoming items without manual counting.',
          startDate: new Date('2026-09-02T14:00:00Z'),
        },
      ],
    },
    {
      companyName: 'Al Aqsa (الأقصى للأعشاب والتوابل)',
      contactName: 'Responsable Al Aqsa',
      phone: '0550 22 33 44',
      wilaya: 'Blida',
      industry: 'Retail & Spices',
      projects: [
        {
          title: 'Al Aqsa — Offline POS & Desktop Accounting',
          type: 'desktop_offline',
          stage: 'delivered' as any,
          priceTotalDzd: '55000',
          m1AmountDzd: '27500',
          m1Paid: true,
          m2AmountDzd: '11000',
          m2Paid: true,
          m3AmountDzd: '16500',
          m3Paid: true,
          notes: 'Offline sales register, cash drawer control, inventory alerts, and ticket receipt printing.',
          startDate: new Date('2026-07-20T11:00:00Z'),
        },
      ],
    },
    {
      companyName: 'Asel Butik',
      contactName: 'Responsable Asel Butik',
      phone: '0550 33 44 55',
      wilaya: 'Constantine',
      industry: 'Fashion & Retail',
      projects: [
        {
          title: 'Asel Butik — E-Commerce & Desktop POS',
          type: 'ecommerce',
          stage: 'delivered' as any,
          priceTotalDzd: '45000',
          m1AmountDzd: '22500',
          m1Paid: true,
          m2AmountDzd: '9000',
          m2Paid: true,
          m3AmountDzd: '13500',
          m3Paid: true,
          notes: 'Storefront with catalog management and synced in-store point of sale.',
          startDate: new Date('2026-08-01T09:30:00Z'),
        },
      ],
    },
    {
      companyName: 'Massmakat La City (مسمكة لا سيتي)',
      contactName: 'Responsable La City',
      phone: '0550 44 55 66',
      wilaya: 'Alger',
      industry: 'Fishmonger & Seafood Retail',
      projects: [
        {
          title: 'Massmakat La City — POS & Daily Sales System',
          type: 'custom_software',
          stage: 'delivered' as any,
          priceTotalDzd: '65000',
          m1AmountDzd: '32500',
          m1Paid: true,
          m2AmountDzd: '13000',
          m2Paid: true,
          m3AmountDzd: '19500',
          m3Paid: true,
          notes: 'Weighing scale integration, daily fresh catch pricing, fast receipt checkout, and sales ledger.',
          startDate: new Date('2026-09-18T08:00:00Z'),
        },
      ],
    },
    {
      companyName: 'HK STORE',
      contactName: 'Responsable HK STORE',
      phone: '0550 55 66 77',
      wilaya: 'Setif',
      industry: 'Watches & Accessories',
      projects: [
        {
          title: 'HK STORE — E-Commerce & POS',
          type: 'ecommerce',
          stage: 'scoping' as const, // Pending payment!
          priceTotalDzd: '60000',
          m1AmountDzd: '30000',
          m1Paid: false, // NOT PAID
          m2AmountDzd: '12000',
          m2Paid: false, // NOT PAID
          m3AmountDzd: '18000',
          m3Paid: false, // NOT PAID
          notes: 'E-commerce platform and inventory system. Payment pending verification.',
          startDate: new Date('2026-10-25T16:00:00Z'),
        },
      ],
    },
  ];

  for (const c of realClients) {
    const [insertedClient] = await db.insert(schema.clients).values({
      companyName: c.companyName,
      contactName: c.contactName,
      phone: c.phone,
      wilaya: c.wilaya,
      industry: c.industry,
    }).returning();

    for (const p of c.projects) {
      await db.insert(schema.projects).values({
        clientId: insertedClient.id,
        title: p.title,
        type: p.type,
        stage: p.stage,
        priceTotalDzd: p.priceTotalDzd,
        domainIncluded: true,
        hostingIncluded: true,
        m1AmountDzd: p.m1AmountDzd,
        m1Paid: p.m1Paid,
        m2AmountDzd: p.m2AmountDzd,
        m2Paid: p.m2Paid,
        m3AmountDzd: p.m3AmountDzd,
        m3Paid: p.m3Paid,
        notes: p.notes,
        createdAt: p.startDate,
      });
    }
  }

  console.log('Successfully updated all real projects and clients!');
}

updateRealProjects()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
