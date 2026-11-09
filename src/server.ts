import express from 'express';
import cors from 'cors';
import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';
import { eq, desc, asc } from 'drizzle-orm';
import { db } from './db/client.js';
import * as schema from './db/schema.js';
import { uploadToR2 } from './services/storage.js';

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

// ==========================================
// SECURITY HARDENING & HEADERS
// ==========================================
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Strict CORS Allowlist
const allowedOrigins = new Set([
  'https://admin.digitalvisiondz.com',
  'https://www.digitalvisiondz.com',
  'https://digitalvisiondz.com',
  'http://localhost:4190',
  'http://127.0.0.1:4190',
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  if (req.url.startsWith('/api/index.js') && req.originalUrl) {
    req.url = req.originalUrl;
  }
  next();
});

app.use(express.json({ limit: '1mb' }));

// Restrict uploads to safe document and image formats
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WEBP, and PDF receipts are permitted.'));
    }
  },
});

// ==========================================
// REAL-TIME SERVER-SENT EVENTS (SSE)
// ==========================================
const sseClients = new Set<express.Response>();

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
// ADMIN PORTAL AUTHENTICATION & RATE LIMITING
// ==========================================
const ADMIN_AUTH_SECRET = (process.env.ADMIN_AUTH_SECRET || 'VISION_FOUNDER_SECURE_AUTH_KEY_2026').trim();
const ADMIN_PIN = (process.env.ADMIN_PIN || '765483').trim();
const MAX_PIN_ATTEMPTS = 5;
const PIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

interface PinRateLimit {
  attempts: number;
  lockedUntil: number | null;
}

const pinAttemptsMap = new Map<string, PinRateLimit>();

interface SessionPayload {
  iat: number;
  exp: number;
  nonce: string;
}

function createSignedSessionToken(): string {
  const payload: SessionPayload = {
    iat: Date.now(),
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24-hour expiration
    nonce: crypto.randomBytes(16).toString('hex'),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', ADMIN_AUTH_SECRET).update(payloadB64).digest('base64url');
  return `${payloadB64}.${signature}`;
}

function isValidAdminToken(token: string | null | undefined): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payloadB64, signature] = parts;
  try {
    const expectedSig = crypto.createHmac('sha256', ADMIN_AUTH_SECRET).update(payloadB64).digest('base64url');
    const sigBuf = Buffer.from(signature);
    const expSigBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expSigBuf.length || !crypto.timingSafeEqual(sigBuf, expSigBuf)) {
      return false;
    }
    const payload: SessionPayload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

function verifyPinTimingSafe(submitted: string): boolean {
  const a = Buffer.from(submitted.trim());
  const b = Buffer.from(ADMIN_PIN);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function getClientIp(req: express.Request): string {
  return req.ip || req.socket.remoteAddress || 'unknown';
}

const requireAdminAuth: express.RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token || !isValidAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
  }
  next();
};

// Authenticated Real-Time Events endpoint
app.get('/api/events', (req, res) => {
  const token = (req.query.token as string) || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7).trim() : null);
  if (!isValidAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication required for event stream.' });
  }

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

// Verify PIN code with strict 5-attempt rate limiter, constant-time compare, and 15-min lockout
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

  // 3. Verify submitted PIN in constant time
  const { pin } = req.body || {};
  const submittedPin = typeof pin === 'string' ? pin.trim() : String(pin || '').trim();

  if (verifyPinTimingSafe(submittedPin)) {
    pinAttemptsMap.delete(ip);
    const token = createSignedSessionToken();

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
  if (isValidAdminToken(token)) {
    return res.json({ valid: true });
  }
  return res.status(401).json({ valid: false, message: 'Invalid or expired session token.' });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
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
    res.status(500).json({ error: 'Failed to retrieve stats.' });
  }
});

// 2. Clients CRUD
app.get('/api/clients', requireAdminAuth, async (req, res) => {
  try {
    const list = await db.select().from(schema.clients).orderBy(desc(schema.clients.createdAt));
    res.json(list);
  } catch (err: any) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Failed to retrieve clients.' });
  }
});

app.post('/api/clients', requireAdminAuth, async (req, res) => {
  try {
    const { companyName, contactName, phone, email, wilaya, industry, notes } = req.body || {};
    if (!companyName || !contactName || !phone) {
      return res.status(400).json({ error: 'companyName, contactName, and phone are required' });
    }
    const [inserted] = await db.insert(schema.clients).values({
      companyName: String(companyName).trim(),
      contactName: String(contactName).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : null,
      wilaya: wilaya ? String(wilaya).trim() : null,
      industry: industry ? String(industry).trim() : null,
      notes: notes ? String(notes).trim() : null,
    }).returning();
    res.status(201).json(inserted);
  } catch (err: any) {
    console.error('Error creating client:', err);
    res.status(500).json({ error: 'Failed to create client.' });
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
    res.status(500).json({ error: 'Failed to delete client.' });
  }
});

// 3. Leads Ingestion & Management
const leadSubmissionsMap = new Map<string, { count: number; resetAt: number }>();
function checkLeadRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = leadSubmissionsMap.get(ip);
  if (!entry || now > entry.resetAt) {
    leadSubmissionsMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 10) {
    return false;
  }
  entry.count += 1;
  return true;
}

app.get('/api/leads', requireAdminAuth, async (req, res) => {
  try {
    const list = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt));
    res.json(list);
  } catch (err: any) {
    console.error('Error fetching leads:', err);
    res.status(500).json({ error: 'Failed to retrieve leads.' });
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const ip = getClientIp(req);
    if (!checkLeadRateLimit(ip)) {
      return res.status(429).json({ error: 'Too many submissions. Please wait a few minutes before trying again.' });
    }

    const { name, phone, activity, problemDescription, need, selectedChallenge, budgetEstimate } = req.body || {};
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

    // Broadcast in real-time to authenticated admin dashboards via SSE
    broadcastEvent('new_lead', {
      lead: inserted,
      clientId: linkedClientId,
    });

    res.status(201).json({
      success: true,
      message: 'Brief submitted successfully.',
    });
  } catch (err: any) {
    console.error('Lead submission error:', err);
    res.status(500).json({ error: 'Failed to submit brief. Please contact via WhatsApp.' });
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
    res.status(500).json({ error: 'Failed to convert lead.' });
  }
});

app.patch('/api/leads/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body || {};
    const [updated] = await db.update(schema.leads)
      .set({ status })
      .where(eq(schema.leads.id, id))
      .returning();
    res.json(updated);
  } catch (err: any) {
    console.error('Update lead error:', err);
    res.status(500).json({ error: 'Failed to update lead.' });
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
    res.status(500).json({ error: 'Failed to delete lead.' });
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
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
});

app.post('/api/projects', requireAdminAuth, async (req, res) => {
  try {
    const { clientId, title, type, priceTotalDzd, domainIncluded, hostingIncluded, notes, targetDeliveryDate } = req.body || {};
    if (!clientId || !title || !type) {
      return res.status(400).json({ error: 'clientId, title, and type are required' });
    }

    const total = Number(priceTotalDzd) || 0;
    const m1Amount = Math.round(total * 0.50);
    const m2Amount = Math.round(total * 0.20);
    const m3Amount = total - m1Amount - m2Amount;

    const [inserted] = await db.insert(schema.projects).values({
      clientId: String(clientId).trim(),
      title: String(title).trim(),
      type: String(type).trim(),
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
      notes: notes ? String(notes).trim() : null,
    }).returning();

    res.status(201).json(inserted);
  } catch (err: any) {
    console.error('Create project error:', err);
    res.status(500).json({ error: 'Failed to create project.' });
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

      const [currentProject] = await db.select({ stage: schema.projects.stage }).from(schema.projects).where(eq(schema.projects.id, id));
      if (currentProject) {
        const STAGE_ORDER = ['scoping', 'devis', 'deposit_50', 'design', 'design_approved_20', 'development', 'security_qa', 'delivered', 'maintenance'];
        const currentIdx = STAGE_ORDER.indexOf(currentProject.stage || 'scoping');
        const newIdx = STAGE_ORDER.indexOf(normalizedNewStage);
        if (newIdx !== -1 && currentIdx !== -1) {
          if (newIdx < currentIdx) {
            return res.status(400).json({ error: 'Projects cannot be moved backward to a previous stage' });
          }
          if (newIdx > currentIdx + 1) {
            return res.status(400).json({ error: 'Cannot skip stages. Projects must advance step-by-step through the pipeline.' });
          }
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
    console.error('Update project error:', err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// 5. Upload BaridiMob Receipt to Cloudflare R2
app.post('/api/projects/:id/receipt', requireAdminAuth, upload.single('receipt'), async (req, res) => {
  try {
    const id = String(req.params.id);
    const { milestone } = req.body || {};

    if (!['m1', 'm2', 'm3'].includes(milestone)) {
      return res.status(400).json({ error: 'Milestone must be m1, m2, or m3' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No receipt file uploaded' });
    }

    const MIME_TO_EXT: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
      'application/pdf': '.pdf',
    };
    const ext = MIME_TO_EXT[req.file.mimetype] || '.jpg';
    const safeId = id.replace(/[^a-zA-Z0-9_-]/g, '');
    const randomSuffix = crypto.randomBytes(4).toString('hex');
    const key = `receipts/${safeId}-${milestone}-${Date.now()}-${randomSuffix}${ext}`;

    const uploadResult = await uploadToR2(key, req.file.buffer, req.file.mimetype);

    let updated: any;
    if (milestone === 'm1') {
      [updated] = await db.update(schema.projects)
        .set({
          m1Paid: true,
          m1ReceiptUrl: uploadResult.publicUrl,
          m1PaidAt: new Date(),
          stage: 'design',
        })
        .where(eq(schema.projects.id, id))
        .returning();
    } else if (milestone === 'm2') {
      [updated] = await db.update(schema.projects)
        .set({
          m2Paid: true,
          m2ReceiptUrl: uploadResult.publicUrl,
          m2PaidAt: new Date(),
          stage: 'development',
        })
        .where(eq(schema.projects.id, id))
        .returning();
    } else if (milestone === 'm3') {
      [updated] = await db.update(schema.projects)
        .set({
          m3Paid: true,
          m3ReceiptUrl: uploadResult.publicUrl,
          m3PaidAt: new Date(),
          stage: 'delivered',
        })
        .where(eq(schema.projects.id, id))
        .returning();
    }

    res.json({
      success: true,
      receiptUrl: uploadResult.publicUrl,
      project: updated,
    });
  } catch (err: any) {
    console.error('Receipt upload error:', err);
    res.status(500).json({ error: 'Failed to upload receipt.' });
  }
});

// 6. Invoices & Quotes (Devis)
app.get('/api/invoices', requireAdminAuth, async (req, res) => {
  try {
    const list = await db.select().from(schema.invoices).orderBy(desc(schema.invoices.createdAt));
    res.json(list);
  } catch (err: any) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: 'Failed to retrieve invoices.' });
  }
});

app.post('/api/invoices', requireAdminAuth, async (req, res) => {
  try {
    const { projectId, clientId, items, domainIncluded, hostingIncluded, notes, dueDate, targetDeliveryDate } = req.body || {};

    if (!projectId || !clientId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'projectId, clientId, and items array are required' });
    }

    let total = 0;
    const formattedItems = items.map((item: any) => {
      const price = Number(item.priceDzd || item.price || 0) || 0;
      total += price;
      return {
        title: String(item.description || item.title || '').trim(),
        description: String(item.description || item.title || '').trim(),
        priceDzd: price,
        price: price,
      };
    });

    const m1 = Math.round(total * 0.50);
    const m2 = Math.round(total * 0.20);
    const m3 = total - m1 - m2;

    const finalDeadline = (dueDate || targetDeliveryDate) ? new Date(dueDate || targetDeliveryDate) : null;

    const [existingInvoice] = await db
      .select()
      .from(schema.invoices)
      .where(eq(schema.invoices.projectId, projectId));

    let resultInvoice;
    if (existingInvoice) {
      const [updated] = await db
        .update(schema.invoices)
        .set({
          totalAmountDzd: String(total),
          m1DepositDzd: String(m1),
          m2DesignDzd: String(m2),
          m3DeliveryDzd: String(m3),
          domainIncluded: Boolean(domainIncluded),
          hostingIncluded: Boolean(hostingIncluded),
          itemsJson: formattedItems,
          dueDate: finalDeadline,
          notes: notes || undefined,
        })
        .where(eq(schema.invoices.id, existingInvoice.id))
        .returning();
      resultInvoice = updated;
    } else {
      const invoiceNumber = `DEV-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`;
      const [inserted] = await db
        .insert(schema.invoices)
        .values({
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
          itemsJson: formattedItems,
          status: 'draft',
          dueDate: finalDeadline,
          notes,
        })
        .returning();
      resultInvoice = inserted;
    }

    const projectUpdates: any = {
      priceTotalDzd: String(total),
      m1AmountDzd: String(m1),
      m2AmountDzd: String(m2),
      m3AmountDzd: String(m3),
      domainIncluded: Boolean(domainIncluded),
      hostingIncluded: Boolean(hostingIncluded),
    };
    if (notes !== undefined) {
      projectUpdates.notes = notes;
    }
    if (finalDeadline) {
      projectUpdates.targetDeliveryDate = finalDeadline;
    }

    await db.update(schema.projects).set(projectUpdates).where(eq(schema.projects.id, projectId));

    res.status(200).json(resultInvoice);
  } catch (err: any) {
    console.error('Invoice error:', err);
    res.status(500).json({ error: 'Failed to process quote/invoice.' });
  }
});

// 7. Meetings & Schedule Calendar
app.get('/api/meetings', requireAdminAuth, async (req, res) => {
  try {
    const list = await db
      .select({
        meeting: schema.meetings,
        client: schema.clients,
        project: schema.projects,
        lead: schema.leads,
      })
      .from(schema.meetings)
      .leftJoin(schema.clients, eq(schema.meetings.clientId, schema.clients.id))
      .leftJoin(schema.projects, eq(schema.meetings.projectId, schema.projects.id))
      .leftJoin(schema.leads, eq(schema.meetings.leadId, schema.leads.id))
      .orderBy(asc(schema.meetings.meetingDate), asc(schema.meetings.startTime));

    const formatted = list.map(r => ({
      ...r.meeting,
      client: r.client,
      project: r.project,
      lead: r.lead,
    }));

    res.json(formatted);
  } catch (err: any) {
    console.error('Fetch meetings error:', err);
    res.status(500).json({ error: 'Failed to retrieve meetings.' });
  }
});

app.post('/api/meetings', requireAdminAuth, async (req, res) => {
  try {
    const {
      title,
      clientId,
      projectId,
      leadId,
      type,
      meetingDate,
      startTime,
      endTime,
      platform,
      link,
      location,
      agenda,
      notes,
      status,
    } = req.body || {};

    if (!title || !meetingDate || !startTime) {
      return res.status(400).json({ error: 'Title, meetingDate, and startTime are required.' });
    }

    const todayDateStr = new Date().toISOString().split('T')[0];
    if (String(meetingDate).trim() < todayDateStr) {
      return res.status(400).json({ error: 'Cannot schedule a meeting on a past date.' });
    }

    const [inserted] = await db
      .insert(schema.meetings)
      .values({
        title: String(title).trim(),
        clientId: clientId || null,
        projectId: projectId || null,
        leadId: leadId || null,
        type: type || 'discovery',
        meetingDate: String(meetingDate).trim(),
        startTime: String(startTime).trim(),
        endTime: endTime ? String(endTime).trim() : null,
        platform: platform || 'google_meet',
        link: link ? String(link).trim() : null,
        location: location ? String(location).trim() : null,
        agenda: agenda ? String(agenda).trim() : null,
        notes: notes ? String(notes).trim() : null,
        status: status || 'scheduled',
      })
      .returning();

    if (leadId) {
      await db.update(schema.leads).set({ status: 'meeting_scheduled' }).where(eq(schema.leads.id, leadId));
    }

    broadcastEvent('meeting_created', inserted);
    res.status(201).json(inserted);
  } catch (err: any) {
    console.error('Create meeting error:', err);
    res.status(500).json({ error: 'Failed to create meeting.' });
  }
});

app.patch('/api/meetings/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const updateData: any = { updatedAt: new Date() };
    const allowed = [
      'title',
      'clientId',
      'projectId',
      'leadId',
      'type',
      'meetingDate',
      'startTime',
      'endTime',
      'platform',
      'link',
      'location',
      'agenda',
      'notes',
      'status',
    ];

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    }

    const [updated] = await db
      .update(schema.meetings)
      .set(updateData)
      .where(eq(schema.meetings.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    broadcastEvent('meeting_updated', updated);
    res.json(updated);
  } catch (err: any) {
    console.error('Update meeting error:', err);
    res.status(500).json({ error: 'Failed to update meeting.' });
  }
});

app.delete('/api/meetings/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = String(req.params.id);
    const [deleted] = await db
      .delete(schema.meetings)
      .where(eq(schema.meetings.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    broadcastEvent('meeting_deleted', { id });
    res.json({ success: true, id });
  } catch (err: any) {
    console.error('Delete meeting error:', err);
    res.status(500).json({ error: 'Failed to delete meeting.' });
  }
});

// ==========================================
// STATIC FRONTEND SERVING
// ==========================================

// Dedicated entry for admin subdomain root rewrite
app.get('/api/admin-entry', (req, res) => {
  const candidates = [
    path.resolve(websitePublicDir, 'admin.html'),
    path.resolve(websitePublicDir, 'admin', 'index.html'),
    path.resolve(__dirname, '..', 'public', 'admin.html'),
    path.resolve(__dirname, '..', 'public', 'admin', 'index.html'),
    path.resolve(process.cwd(), 'public', 'admin.html'),
    path.resolve(process.cwd(), 'public', 'admin', 'index.html'),
    path.resolve(process.cwd(), 'website', 'public', 'admin.html'),
    path.resolve(process.cwd(), 'website', 'public', 'admin', 'index.html'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.sendFile(p);
    }
  }
  res.status(404).send('Admin dashboard HTML not found');
});

const adminHtmlPath = path.resolve(websitePublicDir, 'admin', 'index.html');
const indexHtmlPath = path.resolve(websitePublicDir, 'index.html');
const adminRootHtmlPath = path.resolve(websitePublicDir, 'admin.html');

// 1. Host-based routing for admin subdomain
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host.startsWith('admin.')) {
    if (req.path === '/' || req.path === '/index.html') {
      const p = existsSync(adminRootHtmlPath) ? adminRootHtmlPath : adminHtmlPath;
      if (existsSync(p)) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.sendFile(p);
      }
    }
    if (req.path === '/admin' || req.path === '/admin/') {
      return res.redirect(302, '/');
    }
  } else {
    // On public website, /admin or /admin/* redirects to homepage /
    if (req.path === '/admin' || req.path.startsWith('/admin/')) {
      return res.redirect(302, '/');
    }
  }
  next();
});

// Serve public website files
if (existsSync(websitePublicDir)) {
  app.use(express.static(websitePublicDir));
}

// Fallback for root and client pages (excluding /api routes)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const host = req.headers.host || '';
  if (host.startsWith('admin.')) {
    const adminRootHtml = path.resolve(websitePublicDir, 'admin.html');
    if (existsSync(adminRootHtml)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.sendFile(adminRootHtml);
    }
    if (existsSync(adminHtmlPath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.sendFile(adminHtmlPath);
    }
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
    console.log(`VISION Server live on: http://127.0.0.1:${port}`);
    console.log(`Public Website:        http://127.0.0.1:${port}/`);
    console.log(`Admin Portal:          https://admin.digitalvisiondz.com/`);
    console.log(`Security:              Strict CORS, Rate Limiting, Signed Tokens`);
    console.log(`======================================================\n`);
  });
}

export default app;
