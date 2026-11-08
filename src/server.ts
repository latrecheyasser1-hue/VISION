import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';
import { eq, desc, sql as dSql } from 'drizzle-orm';
import { db } from './db/client.js';
import * as schema from './db/schema.js';
import { uploadToR2, getR2PublicUrl } from './services/storage.js';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const websitePublicDir = path.resolve(rootDir, 'website', 'public');

const app = express();
const port = process.env.PORT || 4190;

app.use(cors());
app.use(express.json());

// Memory storage for multer uploads (direct stream to Cloudflare R2)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
});

// ==========================================
// API ROUTES
// ==========================================

// 1. Stats & KPIs Overview
app.get('/api/stats', async (req, res) => {
  try {
    const allProjects = await db.select().from(schema.projects);
    const allClients = await db.select().from(schema.clients);
    const allLeads = await db.select().from(schema.leads);

    let totalRevenueDzd = 0;
    let totalCollectedDzd = 0;
    let totalPendingDzd = 0;

    for (const p of allProjects) {
      if ((p as any).status === 'cancelled') continue;

      const total = Number(p.priceTotalDzd) || 0;
      totalRevenueDzd += total;

      let collected = 0;
      if (p.m1Paid) collected += Number(p.m1AmountDzd) || 0;
      if (p.m2Paid) collected += Number(p.m2AmountDzd) || 0;
      if (p.m3Paid) collected += Number(p.m3AmountDzd) || 0;

      totalCollectedDzd += collected;
      totalPendingDzd += (total - collected);
    }

    const activeProjects = allProjects.filter(p => (p as any).status !== 'cancelled' && p.stage !== 'delivered');

    res.json({
      totalRevenueDzd,
      totalCollectedDzd,
      totalPendingDzd,
      totalClients: allClients.length,
      totalProjects: allProjects.length,
      activeProjectsCount: activeProjects.length,
      newLeadsCount: allLeads.filter(l => l.status === 'new').length,
    });
  } catch (err: any) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Clients CRUD
app.get('/api/clients', async (req, res) => {
  try {
    const list = await db.select().from(schema.clients).orderBy(desc(schema.clients.createdAt));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', async (req, res) => {
  try {
    const { companyName, contactName, phone, email, wilaya, industry, notes } = req.body;
    if (!companyName || !contactName || !phone) {
      return res.status(400).json({ error: 'companyName, contactName, and phone are required' });
    }
    const [inserted] = await db.insert(schema.clients).values({
      companyName,
      contactName,
      phone,
      email,
      wilaya,
      industry,
      notes,
    }).returning();
    res.status(201).json(inserted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Leads Ingestion & Management
app.get('/api/leads', async (req, res) => {
  try {
    const list = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, activity, problemDescription, selectedChallenge, budgetEstimate } = req.body;
    if (!name || !activity) {
      return res.status(400).json({ error: 'name and activity are required' });
    }
    const [inserted] = await db.insert(schema.leads).values({
      name,
      phone,
      activity,
      problemDescription,
      selectedChallenge,
      budgetEstimate: budgetEstimate ? String(budgetEstimate) : null,
    }).returning();
    res.status(201).json(inserted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/leads/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const [updated] = await db.update(schema.leads)
      .set({ status })
      .where(eq(schema.leads.id, id))
      .returning();
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Projects CRUD & Milestones
app.get('/api/projects', async (req, res) => {
  try {
    const rows = await db
      .select({
        project: schema.projects,
        client: schema.clients,
      })
      .from(schema.projects)
      .leftJoin(schema.clients, eq(schema.projects.clientId, schema.clients.id))
      .orderBy(desc(schema.projects.createdAt));

    const result = rows.map(r => ({
      ...r.project,
      client: r.client,
    }));

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { clientId, title, type, priceTotalDzd, domainIncluded, hostingIncluded, notes } = req.body;
    if (!clientId || !title || !type) {
      return res.status(400).json({ error: 'clientId, title, and type are required' });
    }

    const total = Number(priceTotalDzd) || 0;
    const m1Amount = Math.round(total * 0.50);
    const m2Amount = Math.round(total * 0.20);
    const m3Amount = total - m1Amount - m2Amount; // Remaining 30%

    const [inserted] = await db.insert(schema.projects).values({
      clientId,
      title,
      type,
      stage: 'scoping',
      priceTotalDzd: String(total),
      domainIncluded: Boolean(domainIncluded),
      hostingIncluded: Boolean(hostingIncluded),
      m1AmountDzd: String(m1Amount),
      m1Paid: false,
      m2AmountDzd: String(m2Amount),
      m2Paid: false,
      m3AmountDzd: String(m3Amount),
      m3Paid: false,
      notes,
    }).returning();

    res.status(201).json(inserted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData: any = {};
    const allowed = ['title', 'stage', 'type', 'priceTotalDzd', 'domainIncluded', 'hostingIncluded', 'repoUrl', 'stagingUrl', 'productionUrl', 'isPublicPortfolio', 'notes', 'devisStatus', 'designStatus', 'status', 'm1Paid', 'm2Paid', 'm3Paid'];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    // Cancellation Rule: Can only cancel projects in scoping, devis, or deposit_50 before m1 is paid
    if (updateData.status === 'cancelled') {
      const [currProject] = await db.select().from(schema.projects).where(eq(schema.projects.id, id));
      if (!currProject) {
        return res.status(404).json({ error: 'Project not found' });
      }
      const stage = currProject.stage || 'scoping';
      if (!['scoping', 'devis', 'deposit_50'].includes(stage) || currProject.m1Paid) {
        return res.status(400).json({ error: 'Only projects in Scoping, Devis, or pending Deposit (unpaid) can be cancelled' });
      }
    }

    if (updateData.stage) {
      const stageMap: Record<string, any> = {
        scoping: 'scoping',
        devis: 'devis',
        deposit_50: 'deposit_50',
        design: 'design',
        design_20: 'design_approved_20',
        design_approved_20: 'design_approved_20',
        dev_30: 'development',
        development: 'development',
        security_qa: 'security_qa',
        qa_testing: 'security_qa',
        delivered: 'delivered',
        delivered_30: 'delivered',
        maintenance: 'maintenance',
      };
      const normalizedNewStage = stageMap[updateData.stage] || updateData.stage;
      updateData.stage = normalizedNewStage;

      // Rule: Projects cannot be moved backward to a previous stage
      const [currentProject] = await db.select({ stage: schema.projects.stage }).from(schema.projects).where(eq(schema.projects.id, id));
      if (currentProject) {
        const STAGE_ORDER = ['scoping', 'devis', 'deposit_50', 'design', 'design_approved_20', 'development', 'security_qa', 'delivered', 'maintenance'];
        const currentIdx = STAGE_ORDER.indexOf(currentProject.stage || 'scoping');
        const newIdx = STAGE_ORDER.indexOf(normalizedNewStage);
        if (newIdx !== -1 && currentIdx !== -1 && newIdx < currentIdx) {
          return res.status(400).json({ error: 'Projects cannot be moved backward to a previous stage' });
        }
      }
    }

    if (updateData.priceTotalDzd) {
      const total = Number(updateData.priceTotalDzd) || 0;
      updateData.m1AmountDzd = String(Math.round(total * 0.50));
      updateData.m2AmountDzd = String(Math.round(total * 0.20));
      updateData.m3AmountDzd = String(total - Math.round(total * 0.50) - Math.round(total * 0.20));
    }

    const [updated] = await db.update(schema.projects)
      .set(updateData)
      .where(eq(schema.projects.id, id))
      .returning();

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Upload BaridiMob Receipt to Cloudflare R2
app.post('/api/projects/:id/receipt', upload.single('receipt'), async (req, res) => {
  try {
    const { id } = req.params;
    const { milestone } = req.body; // 'm1', 'm2', or 'm3'

    if (!['m1', 'm2', 'm3'].includes(milestone)) {
      return res.status(400).json({ error: 'Milestone must be m1, m2, or m3' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No receipt file uploaded' });
    }

    const ext = path.extname(req.file.originalname) || '.jpg';
    const key = `receipts/${id}-${milestone}-${Date.now()}${ext}`;

    // Upload to Cloudflare R2 bucket "vision"
    const uploadResult = await uploadToR2(key, req.file.buffer, req.file.mimetype);

    // Update Project milestone in Neon Postgres & automatically advance stage
    let updated: any;
    if (milestone === 'm1') {
      [updated] = await db.update(schema.projects)
        .set({
          m1Paid: true,
          m1ReceiptUrl: uploadResult.publicUrl,
          m1PaidAt: new Date(),
          stage: 'design',
        })
        .where(dSql`${schema.projects.id} = ${id}`)
        .returning();
    } else if (milestone === 'm2') {
      [updated] = await db.update(schema.projects)
        .set({
          m2Paid: true,
          m2ReceiptUrl: uploadResult.publicUrl,
          m2PaidAt: new Date(),
          stage: 'development',
        })
        .where(dSql`${schema.projects.id} = ${id}`)
        .returning();
    } else if (milestone === 'm3') {
      [updated] = await db.update(schema.projects)
        .set({
          m3Paid: true,
          m3ReceiptUrl: uploadResult.publicUrl,
          m3PaidAt: new Date(),
          stage: 'delivered',
        })
        .where(dSql`${schema.projects.id} = ${id}`)
        .returning();
    }

    res.json({
      success: true,
      receiptUrl: uploadResult.publicUrl,
      project: updated,
    });
  } catch (err: any) {
    console.error('Receipt upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Invoices & Quotes (Devis)
app.get('/api/invoices', async (req, res) => {
  try {
    const list = await db.select().from(schema.invoices).orderBy(desc(schema.invoices.createdAt));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/invoices', async (req, res) => {
  try {
    const { projectId, clientId, items, domainIncluded, hostingIncluded, notes } = req.body;

    if (!projectId || !clientId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'projectId, clientId, and items array are required' });
    }

    let total = 0;
    for (const item of items) {
      total += Number(item.priceDzd) || 0;
    }

    const m1 = Math.round(total * 0.50);
    const m2 = Math.round(total * 0.20);
    const m3 = total - m1 - m2;

    const invoiceNumber = `DEV-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`;

    const isApproved = req.body.approved === true || req.body.status === 'accepted';

    const [inserted] = await db.insert(schema.invoices).values({
      invoiceNumber,
      projectId,
      clientId,
      type: 'devis',
      totalAmountDzd: String(total),
      m1DepositDzd: String(m1),
      m2DesignDzd: String(m2),
      m3DeliveryDzd: String(m3),
      domainIncluded: Boolean(domainIncluded),
      hostingIncluded: Boolean(hostingIncluded),
      itemsJson: items,
      status: isApproved ? 'accepted' : 'draft',
      notes,
    }).returning();

    // Sync calculated pricing and status back to the project
    await db.update(schema.projects).set({
      priceTotalDzd: String(total),
      m1AmountDzd: String(m1),
      m2AmountDzd: String(m2),
      m3AmountDzd: String(m3),
      devisStatus: isApproved ? 'approved' : 'draft',
      domainIncluded: Boolean(domainIncluded),
      hostingIncluded: Boolean(hostingIncluded),
    }).where(eq(schema.projects.id, projectId));

    res.status(201).json(inserted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// STATIC FRONTEND SERVING
// ==========================================

// Serve public website files
app.use(express.static(websitePublicDir));

// Fallback for /admin route to serve the admin dashboard
app.get('/admin', (req, res) => {
  res.sendFile(path.resolve(websitePublicDir, 'admin', 'index.html'));
});

app.use('/admin', (req, res) => {
  res.sendFile(path.resolve(websitePublicDir, 'admin', 'index.html'));
});

// Fallback for root and client pages
app.use((req, res) => {
  res.sendFile(path.resolve(websitePublicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 VISION Server live on: http://127.0.0.1:${port}`);
  console.log(`🌐 Public Website:         http://127.0.0.1:${port}/`);
  console.log(`⚡ Admin Dashboard:        http://127.0.0.1:${port}/admin`);
  console.log(`📡 Cloudflare R2 Bucket:   vision`);
  console.log(`🐘 Database:               Neon Serverless Postgres`);
  console.log(`======================================================\n`);
});
