import { pgTable, text, varchar, timestamp, boolean, numeric, jsonb, uuid, pgEnum } from 'drizzle-orm/pg-core';

export const projectStageEnum = pgEnum('project_stage', [
  'scoping', 'design', 'development', 'qa_testing', 'delivered', 'maintenance'
]);

export const leadStatusEnum = pgEnum('lead_status', [
  'new', 'contacted', 'qualifying', 'proposal_sent', 'converted', 'lost'
]);

export const invoiceTypeEnum = pgEnum('invoice_type', [
  'devis', 'facture', 'recu'
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'draft', 'sent', 'partial', 'paid', 'cancelled'
]);

// 1. Admin Users (Yasser)
export const adminUsers = pgTable('admin_users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  pinCode: varchar('pin_code', { length: 10 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Clients (Algerian Businesses)
export const clients = pgTable('clients', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyName: varchar('company_name', { length: 150 }).notNull(),
  contactName: varchar('contact_name', { length: 150 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  wilaya: varchar('wilaya', { length: 50 }),
  industry: varchar('industry', { length: 100 }),
  status: varchar('status', { length: 30 }).default('active'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Leads (Inquiries from website brief / WhatsApp)
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

// 4. Projects & Deliverables
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  title: varchar('title', { length: 150 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  stage: projectStageEnum('stage').default('scoping'),
  priceTotalDzd: numeric('price_total_dzd', { precision: 12, scale: 2 }).default('0').notNull(),
  depositPaidDzd: numeric('deposit_paid_dzd', { precision: 12, scale: 2 }).default('0').notNull(),
  balanceDueDzd: numeric('balance_due_dzd', { precision: 12, scale: 2 }).default('0').notNull(),
  repoUrl: text('repo_url'),
  stagingUrl: text('staging_url'),
  productionUrl: text('production_url'),
  startDate: timestamp('start_date'),
  targetDeliveryDate: timestamp('target_delivery_date'),
  actualDeliveryDate: timestamp('actual_delivery_date'),
  deliverablesJson: jsonb('deliverables_json'),
  isPublicPortfolio: boolean('is_public_portfolio').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Invoices & Payments (Facturation DZD)
export const invoices = pgTable('invoices', {
  id: uuid('id').defaultRandom().primaryKey(),
  invoiceNumber: varchar('invoice_number', { length: 50 }).unique().notNull(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  clientId: uuid('client_id').references(() => clients.id).notNull(),
  type: invoiceTypeEnum('type').default('devis'),
  amountDzd: numeric('amount_dzd', { precision: 12, scale: 2 }).notNull(),
  status: invoiceStatusEnum('status').default('draft'),
  paymentMethod: varchar('payment_method', { length: 50 }), // baridimob, ccp, cash, virement
  issueDate: timestamp('issue_date').defaultNow().notNull(),
  dueDate: timestamp('due_date'),
  itemsJson: jsonb('items_json').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
