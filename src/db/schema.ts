import { pgTable, text, varchar, timestamp, boolean, numeric, jsonb, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const projectStageEnum = pgEnum('project_stage', [
  'scoping',
  'devis',
  'deposit_50',
  'design',
  'design_approved_20',
  'development',
  'security_qa',
  'delivered',
  'qa_testing',
  'maintenance'
]);

export const leadStatusEnum = pgEnum('lead_status', [
  'new', 'contacted', 'meeting_scheduled', 'proposal_sent', 'converted', 'lost'
]);

export const invoiceTypeEnum = pgEnum('invoice_type', [
  'devis', 'facture', 'recu'
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft', 'sent', 'accepted', 'rejected'
]);

// 1. Clients (Algerian Businesses)
export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: varchar('company_name', { length: 150 }).notNull(),
  contactName: varchar('contact_name', { length: 150 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  email: varchar('email', { length: 150 }),
  wilaya: varchar('wilaya', { length: 50 }),
  industry: varchar('industry', { length: 100 }),
  status: varchar('status', { length: 30 }).default('active'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Leads (Inquiries from website brief / WhatsApp)
export const leads = pgTable('leads', {
  id: uuid('id').defaultRandom().primaryKey(),
  source: varchar('source', { length: 50 }).default('website_brief'),
  name: varchar('name', { length: 150 }).notNull(),
  phone: varchar('phone', { length: 30 }),
  activity: varchar('activity', { length: 200 }).notNull(),
  problemDescription: text('problem_description'),
  selectedChallenge: varchar('selected_challenge', { length: 50 }),
  status: leadStatusEnum('status').default('new'),
  budgetEstimate: numeric('budget_estimate', { precision: 12, scale: 2 }),
  clientId: uuid('client_id').references(() => clients.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 3. Projects (With 50% / 20% / 30% Milestones & BaridiMob Receipts)
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  title: varchar('title', { length: 150 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // ecommerce, web_app, desktop_offline, pos_system
  stage: projectStageEnum('stage').default('scoping'),
  priceTotalDzd: numeric('price_total_dzd', { precision: 12, scale: 2 }).default('0').notNull(),
  
  // Options
  domainIncluded: boolean('domain_included').default(false),
  hostingIncluded: boolean('hosting_included').default(false),

  // Milestone 1: 50% Launch
  m1AmountDzd: numeric('m1_amount_dzd', { precision: 12, scale: 2 }).default('0').notNull(),
  m1Paid: boolean('m1_paid').default(false),
  m1ReceiptUrl: text('m1_receipt_url'),
  m1PaidAt: timestamp('m1_paid_at'),

  // Milestone 2: 20% Design Approval
  m2AmountDzd: numeric('m2_amount_dzd', { precision: 12, scale: 2 }).default('0').notNull(),
  m2Paid: boolean('m2_paid').default(false),
  m2ReceiptUrl: text('m2_receipt_url'),
  m2PaidAt: timestamp('m2_paid_at'),

  // Milestone 3: 30% Final Delivery & Security Check
  m3AmountDzd: numeric('m3_amount_dzd', { precision: 12, scale: 2 }).default('0').notNull(),
  m3Paid: boolean('m3_paid').default(false),
  m3ReceiptUrl: text('m3_receipt_url'),
  m3PaidAt: timestamp('m3_paid_at'),

  // Stage Approval States & Pipeline Lifecycle
  devisStatus: varchar('devis_status', { length: 50 }).default('pending'),
  designStatus: varchar('design_status', { length: 50 }).default('pending'),
  status: varchar('status', { length: 50 }).default('active'),

  // Schedule & Deliverables
  startDate: timestamp('start_date'),
  targetDeliveryDate: timestamp('target_delivery_date'),
  actualDeliveryDate: timestamp('actual_delivery_date'),
  deliverablesJson: jsonb('deliverables_json').default([]),
  referencesJson: jsonb('references_json').default([]),

  // Technical links
  repoUrl: text('repo_url'),
  stagingUrl: text('staging_url'),
  productionUrl: text('production_url'),
  isPublicPortfolio: boolean('is_public_portfolio').default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Invoices & Quotes (Devis)
export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceNumber: varchar('invoice_number', { length: 50 }).unique().notNull(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  type: invoiceTypeEnum('type').default('devis'),
  totalAmountDzd: numeric('total_amount_dzd', { precision: 12, scale: 2 }).notNull(),
  
  // 50 / 20 / 30 breakdown
  m1DepositDzd: numeric('m1_deposit_dzd', { precision: 12, scale: 2 }).notNull(),
  m2DesignDzd: numeric('m2_design_dzd', { precision: 12, scale: 2 }).notNull(),
  m3DeliveryDzd: numeric('m3_delivery_dzd', { precision: 12, scale: 2 }).notNull(),

  domainIncluded: boolean('domain_included').default(false),
  hostingIncluded: boolean('hosting_included').default(false),
  
  itemsJson: jsonb('items_json').notNull(), // [{ feature, description, priceDzd }]
  status: invoiceStatusEnum('status').default('draft'),
  pdfUrl: text('pdf_url'), // Link in Cloudflare R2
  issueDate: timestamp('issue_date').defaultNow().notNull(),
  dueDate: timestamp('due_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Meetings (Client Discovery, Scoping, Design Review, Delivery Demos)
export const meetings = pgTable('meetings', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  clientId: uuid('client_id').references(() => clients.id),
  projectId: uuid('project_id').references(() => projects.id),
  leadId: uuid('lead_id').references(() => leads.id),
  type: varchar('type', { length: 50 }).default('discovery').notNull(), // 'discovery', 'scoping', 'design_review', 'demo_delivery', 'followup', 'work_session'
  meetingDate: varchar('meeting_date', { length: 20 }).notNull(), // 'YYYY-MM-DD'
  startTime: varchar('start_time', { length: 10 }).notNull(), // 'HH:MM'
  endTime: varchar('end_time', { length: 10 }), // 'HH:MM'
  platform: varchar('platform', { length: 50 }).default('google_meet'), // 'google_meet', 'whatsapp_call', 'phone_call', 'in_person', 'other'
  link: text('link'),
  location: varchar('location', { length: 200 }),
  agenda: text('agenda'),
  notes: text('notes'),
  status: varchar('status', { length: 30 }).default('scheduled').notNull(), // 'scheduled', 'completed', 'cancelled', 'rescheduled'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6. Expenses (Immutable business and operational expenditure log)
export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 250 }).notNull(),
  category: varchar('category', { length: 100 }).default('general').notNull(),
  amountDzd: numeric('amount_dzd', { precision: 12, scale: 2 }).notNull(),
  date: timestamp('date').defaultNow().notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Finance Settings (Base balances and thresholds)
export const financeSettings = pgTable('finance_settings', {
  key: varchar('key', { length: 100 }).primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 8. Outreach (Cold outreach and prospect communication ledger)
export const outreach = pgTable('outreach', {
  id: uuid('id').defaultRandom().primaryKey(),
  businessName: varchar('business_name', { length: 250 }).notNull(),
  businessType: varchar('business_type', { length: 150 }).notNull(),
  wilaya: varchar('wilaya', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  instagramUrl: varchar('instagram_url', { length: 500 }),
  status: varchar('status', { length: 50 }).default('no_reply').notNull(), // 'no_reply', 'responded', 'thinking', 'declined'
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


