import express from 'express';
import cors from 'cors';
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';
import { eq, desc, sql as dSql } from 'drizzle-orm';
import { db } from './db/client.js';
import * as schema from './db/schema.js';
import { uploadToR2, getR2PublicUrl } from './services/storage.js';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const candidatePublicDirs = [
  path.resolve(process.cwd(), 'public'),
  path.resolve(process.cwd(), 'website', 'public'),
  path.resolve(__dirname, '..', 'public'),
  path.resolve(__dirname, '..', 'dist', 'public'),
  path.resolve(__dirname, '..', 'website', 'public'),
  path.resolve(__dirname, 'website', 'public'),
  path.resolve(__dirname, '..', '..', 'public'),
  path.resolve(__dirname, '..', '..', 'website', 'public'),
];
const websitePublicDir = candidatePublicDirs.find(dir => existsSync(dir) && existsSync(path.resolve(dir, 'index.html'))) || path.resolve(process.cwd(), 'public');

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
// REAL-TIME SERVER-SENT EVENTS (SSE)
// ==========================================
const sseClients = new Set<express.Response>();

app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
  res.write('retry: 5000\n\n');

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

function broadcastEvent(type: string, data: any) {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

// ==========================================
// ADMIN PORTAL PIN AUTHENTICATION & RATE LIMITING
// ==========================================
const ADMIN_PIN = (process.env.ADMIN_PIN || '765483').trim();
const MAX_PIN_ATTEMPTS = 5;
const PIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

interface PinRateLimit {
  attempts: number;
  lockedUntil: number | null;
}

const pinAttemptsMap = new Map<string, PinRateLimit>();
const validAdminTokens = new Set<string>();

function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

const requireAdminAuth: express.RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token || !validAdminTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
  }
  next();
};

// Check current lock status or attempts remaining
app.get('/api/auth/status', (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const state = pinAttemptsMap.get(ip) || { attempts: 0, lockedUntil: null };

  if (state.lockedUntil && now < state.lockedUntil) {
    const remainingSeconds = Math.ceil((state.lockedUntil - now) / 1000);
    return res.json({
      locked: true,
      remainingSeconds,
      attemptsLeft: 0,
    });
  }

  // If lockout expired, reset
  if (state.lockedUntil && now >= state.lockedUntil) {
    pinAttemptsMap.delete(ip);
  }

  const currentAttempts = pinAttemptsMap.get(ip)?.attempts || 0;
  return res.json({
    locked: false,
    remainingSeconds: 0,
    attemptsLeft: Math.max(0, MAX_PIN_ATTEMPTS - currentAttempts),
  });
});

// Verify PIN code with strict 5-attempt rate limiter and 15-min lockout
app.post('/api/auth/pin', (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();
  let state = pinAttemptsMap.get(ip);
  if (!state) {
    state = { attempts: 0, lockedUntil: null };
    pinAttemptsMap.set(ip, state);
  }

  // 1. Check if currently locked
  if (state.lockedUntil && now < state.lockedUntil) {
    const remainingSeconds = Math.ceil((state.lockedUntil - now) / 1000);
    return res.status(429).json({
      success: false,
      locked: true,
      remainingSeconds,
      message: `Too many failed attempts. Access locked for ${Math.ceil(remainingSeconds / 60)} minutes.`,
    });
  }

  // 2. If lockout expired, reset attempts
  if (state.lockedUntil && now >= state.lockedUntil) {
    state.attempts = 0;
    state.lockedUntil = null;
  }

  // 3. Verify submitted PIN
  const { pin } = req.body || {};
  const submittedPin = typeof pin === 'string' ? pin.trim() : String(pin || '').trim();

  if (submittedPin === ADMIN_PIN) {
    // Correct PIN: reset rate limiter for this IP
    pinAttemptsMap.delete(ip);
    const token = crypto.randomBytes(32).toString('hex');
    validAdminTokens.add(token);

    return res.json({
      success: true,
      token,
      message: 'Authentication successful.',
    });
  }

  // 4. Incorrect PIN: increment attempts
  state.attempts += 1;
  if (state.attempts >= MAX_PIN_ATTEMPTS) {
    state.lockedUntil = now + PIN_LOCKOUT_MS;
    pinAttemptsMap.set(ip, state);
    return res.status(429).json({
      success: false,
      locked: true,
      remainingSeconds: Math.ceil(PIN_LOCKOUT_MS / 1000),
      message: 'Too many failed attempts. Access locked for 15 minutes.',
    });
  }

  pinAttemptsMap.set(ip, state);
  const attemptsLeft = MAX_PIN_ATTEMPTS - state.attempts;
  return res.status(401).json({
    success: false,
    locked: false,
    attemptsLeft,
    message: `Invalid PIN code. ${attemptsLeft} ${attemptsLeft === 1 ? 'attempt' : 'attempts'} remaining.`,
  });
});

// Verify existing session token on refresh
app.post('/api/auth/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : req.body?.token;
  if (token && validAdminTokens.has(token)) {
    return res.json({ valid: true });
  }
  return res.status(401).json({ valid: false, message: 'Invalid or expired session token.' });
});

// Logout / Lock session
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : req.body?.token;
  if (token) {
    validAdminTokens.delete(token);
  }
  return res.json({ success: true });
});

// ==========================================
// API ROUTES
// ==========================================

// 1. Stats & KPIs Overview
app.get('/api/stats', requireAdminAuth, async (req, res) => {
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
app.get('/api/clients', requireAdminAuth, async (req, res) => {
  try {
    const list = await db.select().from(schema.clients).orderBy(desc(schema.clients.createdAt));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/clients', requireAdminAuth, async (req, res) => {
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

app.delete('/api/clients/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const linkedProjects = await db.select().from(schema.projects).where(eq(schema.projects.clientId, id));
    if (linkedProjects.length > 0) {
      return res.status(400).json({ error: 'Cannot delete client with existing projects.' });
    }
    await db.update(schema.leads).set({ clientId: null }).where(eq(schema.leads.clientId, id));
    const [deleted] = await db.delete(schema.clients).where(eq(schema.clients.id, id)).returning();
    if (!deleted) {
      return res.status(404).json({ error: 'Client not found' });
    }
    broadcastEvent('client_deleted', { id });
    res.json({ success: true, deleted });
  } catch (err: any) {
    console.error('Delete client error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Leads Ingestion & Management
app.get('/api/leads', requireAdminAuth, async (req, res) => {
  try {
    const list = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, activity, problemDescription, need, selectedChallenge, budgetEstimate } = req.body;
    const finalProblem = (problemDescription || need || '').trim();
    const cleanName = (name || '').trim();
    const cleanPhone = (phone || '').trim();
    const cleanActivity = (activity || '').trim();

    if (!cleanName || !cleanPhone || !cleanActivity || !finalProblem) {
      return res.status(400).json({ error: 'Name, phone number, activity, and note/problem description are required' });
    }

    // Check if client with this phone number already exists
    const phoneDigits = cleanPhone.replace(/[^\d]/g, '');
    const allClients = await db.select().from(schema.clients);
    const existingClient = allClients.find(c => {
      if (!c.phone) return false;
      const cDigits = c.phone.replace(/[^\d]/g, '');
      return cDigits === phoneDigits || (cDigits.length >= 8 && phoneDigits.endsWith(cDigits.slice(-8))) || (phoneDigits.length >= 8 && cDigits.endsWith(phoneDigits.slice(-8)));
    });

    const linkedClientId: string | null = existingClient ? existingClient.id : null;

    const [inserted] = await db.insert(schema.leads).values({
      name: cleanName,
      phone: cleanPhone,
      activity: cleanActivity,
      problemDescription: finalProblem,
      selectedChallenge: selectedChallenge || null,
      budgetEstimate: budgetEstimate ? String(budgetEstimate) : null,
      clientId: linkedClientId,
      status: 'new',
      source: 'website_brief',
    }).returning();

    // Broadcast in real-time to all open admin dashboards via SSE
    broadcastEvent('new_lead', {
      lead: inserted,
      clientId: linkedClientId,
    });

    res.status(201).json(inserted);
  } catch (err: any) {
    console.error('Lead submission error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/leads/:id/convert', requireAdminAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, id));
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // 1. Check or register Client
    const phoneDigits = (lead.phone || '').replace(/[^\d]/g, '');
    const allClients = await db.select().from(schema.clients);
    let client = allClients.find(c => {
      if (!c.phone) return false;
      const cDigits = c.phone.replace(/[^\d]/g, '');
      return cDigits === phoneDigits || (cDigits.length >= 8 && phoneDigits.endsWith(cDigits.slice(-8))) || (phoneDigits.length >= 8 && cDigits.endsWith(phoneDigits.slice(-8)));
    });

    if (!client) {
      const [newClient] = await db.insert(schema.clients).values({
        companyName: lead.name,
        contactName: lead.name,
        phone: lead.phone || '',
        industry: lead.activity || '',
        wilaya: 'Algeria',
        status: 'active',
        notes: lead.problemDescription || '',
      }).returning();
      client = newClient;
    }

    // 2. Determine project type from activity
    const actLower = (lead.activity || '').toLowerCase();
    let projectType = 'web_app';
    if (/boutique|magasin|vetement|commerce|shop|store|vente/i.test(actLower)) {
      projectType = 'ecommerce';
    }

    // 3. Create Project in SCOPING stage with lead info
    const projectTitle = `${lead.name} — ${lead.activity}`;
    const [project] = await db.insert(schema.projects).values({
      clientId: client.id,
      title: projectTitle,
      type: projectType,
      stage: 'scoping',
      priceTotalDzd: '0',
      domainIncluded: false,
      hostingIncluded: false,
      m1AmountDzd: '0',
      m1Paid: false,
      m2AmountDzd: '0',
      m2Paid: false,
      m3AmountDzd: '0',
      m3Paid: false,
      notes: lead.problemDescription || '',
      deliverablesJson: [],
      referencesJson: [],
    }).returning();

    // 4. Update Lead to converted
    const [updatedLead] = await db.update(schema.leads).set({
      status: 'converted',
      clientId: client.id,
    }).where(eq(schema.leads.id, id)).returning();

    // 5. Broadcast real-time SSE event
    broadcastEvent('lead_converted', {
      leadId: id,
      client,
      project,
    });

    res.json({
      success: true,
      client,
      project,
      lead: updatedLead,
    });
  } catch (err: any) {
    console.error('Lead conversion error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/leads/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
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

app.delete('/api/leads/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const [deleted] = await db.delete(schema.leads)
      .where(eq(schema.leads.id, id))
      .returning();
    if (!deleted) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    broadcastEvent('lead_deleted', { id });
    res.json({ success: true, deleted });
  } catch (err: any) {
    console.error('Delete lead error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 4. Projects CRUD & Milestones
app.get('/api/projects', requireAdminAuth, async (req, res) => {
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

app.post('/api/projects', requireAdminAuth, async (req, res) => {
  try {
    const { clientId, title, type, priceTotalDzd, domainIncluded, hostingIncluded, notes, targetDeliveryDate } = req.body;
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
      targetDeliveryDate: targetDeliveryDate ? new Date(targetDeliveryDate) : null,
      deliverablesJson: [],
      referencesJson: [],
      notes,
    }).returning();

    res.status(201).json(inserted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/projects/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const updateData: any = {};
    const allowed = ['title', 'stage', 'type', 'priceTotalDzd', 'domainIncluded', 'hostingIncluded', 'repoUrl', 'stagingUrl', 'productionUrl', 'isPublicPortfolio', 'notes', 'devisStatus', 'designStatus', 'status', 'm1Paid', 'm2Paid', 'm3Paid', 'targetDeliveryDate', 'deliverablesJson', 'referencesJson'];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === 'targetDeliveryDate') {
          updateData.targetDeliveryDate = req.body.targetDeliveryDate ? new Date(req.body.targetDeliveryDate) : null;
        } else if (key === 'deliverablesJson') {
          updateData.deliverablesJson = Array.isArray(req.body.deliverablesJson) ? req.body.deliverablesJson : [];
        } else if (key === 'referencesJson') {
          updateData.referencesJson = Array.isArray(req.body.referencesJson) ? req.body.referencesJson : [];
        } else {
          updateData[key] = req.body[key];
        }
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
app.post('/api/projects/:id/receipt', requireAdminAuth, upload.single('receipt'), async (req, res) => {
  try {
    const id = String(req.params.id);
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
app.get('/api/invoices', requireAdminAuth, async (req, res) => {
  try {
    const list = await db.select().from(schema.invoices).orderBy(desc(schema.invoices.createdAt));
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/invoices', requireAdminAuth, async (req, res) => {
  try {
    const { projectId, clientId, items, domainIncluded, hostingIncluded, notes, dueDate, targetDeliveryDate } = req.body;

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
    const finalDeadline = (dueDate || targetDeliveryDate) ? new Date(dueDate || targetDeliveryDate) : null;

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
      dueDate: finalDeadline,
      notes,
    }).returning();

    // Sync calculated pricing, status, and deadline back to the project
    const projectUpdates: any = {
      priceTotalDzd: String(total),
      m1AmountDzd: String(m1),
      m2AmountDzd: String(m2),
      m3AmountDzd: String(m3),
      devisStatus: isApproved ? 'approved' : 'draft',
      domainIncluded: Boolean(domainIncluded),
      hostingIncluded: Boolean(hostingIncluded),
    };
    if (finalDeadline) {
      projectUpdates.targetDeliveryDate = finalDeadline;
    }

    await db.update(schema.projects).set(projectUpdates).where(eq(schema.projects.id, projectId));

    res.status(201).json(inserted);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// STATIC FRONTEND SERVING
// ==========================================

// Serve public website files
if (existsSync(websitePublicDir)) {
  app.use(express.static(websitePublicDir));
}

const adminHtmlPath = path.resolve(websitePublicDir, 'admin', 'index.html');
const indexHtmlPath = path.resolve(websitePublicDir, 'index.html');

// Fallback for /admin route to serve the admin dashboard
app.get('/admin', (req, res) => {
  if (existsSync(adminHtmlPath)) {
    res.sendFile(adminHtmlPath);
  } else {
    res.redirect('/admin/index.html');
  }
});

app.use('/admin', (req, res) => {
  if (existsSync(adminHtmlPath)) {
    res.sendFile(adminHtmlPath);
  } else {
    res.redirect('/admin/index.html');
  }
});

// Fallback for root and client pages (excluding /api routes)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  if (existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else {
    res.status(404).send('Not Found');
  }
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 VISION Server live on: http://127.0.0.1:${port}`);
    console.log(`🌐 Public Website:         http://127.0.0.1:${port}/`);
    console.log(`⚡ Admin Dashboard:        http://127.0.0.1:${port}/admin`);
    console.log(`📡 Cloudflare R2 Bucket:   vision`);
    console.log(`🐘 Database:               Neon Serverless Postgres`);
    console.log(`======================================================\n`);
  });
}

export default app;
