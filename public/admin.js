/**
 * VISION Admin Dashboard & CRM
 * Founder Workspace Engine
 * 100% English UI · Tri-Lingual Devis Engine (EN / FR / AR)
 * 0 Emojis, 0 Icons Policy
 */

let state = {
  projects: [],
  clients: [],
  leads: [],
  invoices: [],
  meetings: [],
  currentMeetingId: null,
  meetingView: 'calendar',
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),
  meetingsFilterStatus: 'all',
  meetingsFilterType: 'all',
  stats: null,
  activeTab: 'overview',
  historyCategory: 'projects',
  historyStageFilter: 'all',
  historySearchQuery: '',
  devisLang: 'en',
  devisItems: [
    { title: 'Custom UI/UX Architecture & Interactive Prototype', price: 60000 },
    { title: 'Full-Stack Web Development & High Performance Engineering', price: 80000 },
    { title: 'Cloud Infrastructure, Database Setup & Secure Storage', price: 70000 },
    { title: 'BaridiMob Payment Verification & Operations Dashboard', price: 40000 },
  ],
};

const DEVIS_I18N = {
  en: {
    tagline: 'Digital Development Agency · Algeria',
    docTitle: 'QUOTATION N°',
    labelDate: 'Date:',
    labelValidity: 'Validity:',
    validityVal: '15 days',
    labelIssuer: 'ISSUER',
    founder: 'Founder: Yasser Latreche',
    labelClient: 'CLIENT',
    domainInc: 'Domain name included (covered by VISION)',
    domainExc: 'Domain name: Charged separately to client',
    hostingInc: 'High-performance Cloud Hosting & SSL included',
    hostingExc: 'Cloud Hosting & SSL: Charged separately to client',
    thDesc: 'Description',
    thAmount: 'Amount (DZD)',
    labelTotal: 'TOTAL PROJECT VALUE:',
    scheduleTitle: 'PAYMENT SCHEDULE (50% / 20% / 30%):',
    m1Title: '1. Deposit (M1 - 50%)',
    m1Sub: 'Upon contract signature to start work',
    m2Title: '2. Design Approval (M2 - 20%)',
    m2Sub: 'After UI/UX review meeting & client sign-off',
    m3Title: '3. Final Delivery (M3 - 30%)',
    m3Sub: 'After backend completion, testing & deployment',
    payHeading: 'BARIDIMOB PAYMENT DETAILS:',
    beneficiary: 'Beneficiary:',
    instruction: 'Payment made strictly via BaridiMob. Please send receipt screenshot via email to contact@visiondz.com for immediate validation.',
    dir: 'ltr',
  },
  fr: {
    tagline: 'Agence de Développement Numérique · Algérie',
    docTitle: 'DEVIS OFFICIEL N°',
    labelDate: 'Date :',
    labelValidity: 'Validité :',
    validityVal: '15 jours',
    labelIssuer: 'ÉMETTEUR',
    founder: 'Fondateur : Yasser Latreche',
    labelClient: 'DESTINATAIRE (CLIENT)',
    domainInc: 'Nom de domaine inclus (pris en charge par VISION)',
    domainExc: 'Nom de domaine : Aux frais du client',
    hostingInc: 'Hébergement Cloud haute performance & SSL inclus',
    hostingExc: 'Hébergement Cloud & SSL : Aux frais du client',
    thDesc: 'Description de la prestation',
    thAmount: 'Montant (DZD)',
    labelTotal: 'TOTAL DU PROJET :',
    scheduleTitle: 'ÉCHÉANCIER DE PAIEMENT CONVENTIONNEL (50% / 20% / 30%) :',
    m1Title: '1. Acompte (M1 - 50%)',
    m1Sub: 'À la commande pour lancer les travaux',
    m2Title: '2. Validation Design (M2 - 20%)',
    m2Sub: 'Après réunion de validation du design UI/UX',
    m3Title: '3. Livraison Finale (M3 - 30%)',
    m3Sub: 'Après développement complet, tests & mise en ligne',
    payHeading: 'RÈGLEMENT BARIDIMOB :',
    beneficiary: 'Bénéficiaire :',
    instruction: 'Règlement effectué par BaridiMob uniquement. Prière d\'envoyer la capture d\'écran du reçu par email à contact@visiondz.com pour validation immédiate.',
    dir: 'ltr',
  },
  ar: {
    tagline: 'وكالة البرمجة والتطوير الرقمي · الجزائر',
    docTitle: 'عرض سعر رسمي رقم',
    labelDate: 'التاريخ:',
    labelValidity: 'الصلاحية:',
    validityVal: '15 يوماً',
    labelIssuer: 'المرسل',
    founder: 'المؤسس: ياسر لطروش',
    labelClient: 'الزبون (المستلم)',
    domainInc: 'اسم النطاق متضمن (على حساب الوكالة)',
    domainExc: 'اسم النطاق: على حساب الزبون',
    hostingInc: 'الاستضافة السحابية وشهادة الأمان SSL متضمنة',
    hostingExc: 'الاستضافة السحابية: على حساب الزبون',
    thDesc: 'تفاصيل الخدمة / الوظيفة البرمجية',
    thAmount: 'المبلغ (دج)',
    labelTotal: 'المبلغ الإجمالي للمشروع:',
    scheduleTitle: 'جدول الدفعات المعتمد (50% / 20% / 30%):',
    m1Title: '1. العربون (M1 - 50%)',
    m1Sub: 'عند توقيع الاتفاقية لبدء المشروع وحجز الموارد',
    m2Title: '2. اعتماد التصميم (M2 - 20%)',
    m2Sub: 'بعد اجتماع مراجعة التصميم وموافقة الزبون',
    m3Title: '3. التسليم النهائي (M3 - 30%)',
    m3Sub: 'بعد برمجة الباك-إند، فحص الأمان وإطلاق النظام',
    payHeading: 'معلومات الدفع عبر بريدي موب (BARIDIMOB):',
    beneficiary: 'المستفيد:',
    instruction: 'الدفع يتم حصراً عبر تطبيق بريدي موب. يرجى إرسال لقطة شاشة للوصل عبر البريد الإلكتروني contact@visiondz.com للتحقق الفوري.',
    dir: 'rtl',
  },
};

// ==========================================
// AUTHENTICATION INTERCEPTOR & PIN GATE LOGIC
// ==========================================
let currentAuthToken = '';

const originalFetch = window.fetch;
window.fetch = async function(url, options = {}) {
  const token = currentAuthToken || sessionStorage.getItem('vision_admin_token') || '';
  if (token && typeof url === 'string' && url.startsWith('/api/')) {
    options.headers = options.headers || {};
    if (options.headers instanceof Headers) {
      if (!options.headers.has('Authorization')) {
        options.headers.set('Authorization', 'Bearer ' + token);
      }
    } else if (Array.isArray(options.headers)) {
      options.headers.push(['Authorization', 'Bearer ' + token]);
    } else {
      if (!options.headers['Authorization']) {
        options.headers['Authorization'] = 'Bearer ' + token;
      }
    }
  }

  return await originalFetch(url, options);
};

let authLockoutTimer = null;
let hasDashboardStarted = false;

function checkAdminAuth() {
  // Clear any persistent localStorage auto-login so PIN is ALWAYS requested on new sessions
  localStorage.removeItem('vision_admin_token');

  // Check if authenticated in current browser session
  const sessionToken = sessionStorage.getItem('vision_admin_token');
  if (sessionToken === 'vision_founder_authorized_765483') {
    currentAuthToken = sessionToken;
    hideAuthGate();
    startAdminDashboard();
    return true;
  }

  // Not authenticated in this session: ALWAYS show PIN gate!
  showAuthGate();

  // Check if currently locked out
  const lockoutUntil = parseInt(localStorage.getItem('vision_lockout_until') || '0', 10);
  const now = Date.now();
  if (lockoutUntil && now < lockoutUntil) {
    startLockoutCountdown(Math.ceil((lockoutUntil - now) / 1000));
    return false;
  }

  return false;
}

function showAuthGate() {
  const gate = document.getElementById('admin-auth-gate');
  if (gate) {
    gate.style.display = 'flex';
    const pinInput = document.getElementById('admin-pin-input');
    if (pinInput && !pinInput.disabled) {
      setTimeout(() => pinInput.focus(), 100);
    }
  }
}

function hideAuthGate() {
  const gate = document.getElementById('admin-auth-gate');
  if (gate) {
    gate.style.display = 'none';
  }
}

async function handlePinSubmit(event) {
  if (event) event.preventDefault();

  const pinInput = document.getElementById('admin-pin-input');
  const submitBtn = document.getElementById('admin-pin-submit-btn');
  const alertBanner = document.getElementById('auth-alert-banner');
  const statusInfo = document.getElementById('auth-status-info');

  if (!pinInput || !submitBtn) return;
  const pin = (pinInput.value || '').trim();

  // Check if currently locked out
  const lockoutUntil = parseInt(localStorage.getItem('vision_lockout_until') || '0', 10);
  const now = Date.now();
  if (lockoutUntil && now < lockoutUntil) {
    startLockoutCountdown(Math.ceil((lockoutUntil - now) / 1000));
    return;
  }

  if (!pin) {
    showAlertBanner('PIN Required', 'Please enter your 6-digit security PIN to unlock.', '#FEF3C7', '#B45309', '#92400E');
    pinInput.focus();
    return;
  }

  // CORRECT PIN (765483) -> INSTANT UNLOCK
  if (pin === '765483') {
    currentAuthToken = 'vision_founder_authorized_765483';
    sessionStorage.setItem('vision_admin_token', currentAuthToken);
    localStorage.removeItem('vision_failed_attempts');
    localStorage.removeItem('vision_lockout_until');

    hideAuthGate();
    pinInput.value = '';
    if (alertBanner) alertBanner.style.display = 'none';
    if (authLockoutTimer) {
      clearInterval(authLockoutTimer);
      authLockoutTimer = null;
    }
    showToast('Dashboard unlocked.');
    startAdminDashboard();
    return;
  }

  // INCORRECT PIN -> Track 5 attempts, then 15-min lockout
  let failed = parseInt(localStorage.getItem('vision_failed_attempts') || '0', 10) + 1;
  localStorage.setItem('vision_failed_attempts', String(failed));

  if (failed >= 5) {
    const lockSeconds = 15 * 60; // 15 minutes
    localStorage.setItem('vision_lockout_until', String(Date.now() + lockSeconds * 1000));
    startLockoutCountdown(lockSeconds);
    return;
  }

  const remaining = 5 - failed;
  showAlertBanner(
    'Invalid PIN Code',
    `${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining before 15-minute security lockout.`,
    '#FEE2E2',
    '#DC2626',
    '#B91C1C'
  );
  if (statusInfo) {
    statusInfo.textContent = `${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining before 15-minute security lockout.`;
  }
  pinInput.value = '';
  pinInput.focus();
}

function showAlertBanner(title, detail, bg, border, textColor) {
  const alertBanner = document.getElementById('auth-alert-banner');
  const alertTitle = document.getElementById('auth-alert-title');
  const alertDetail = document.getElementById('auth-alert-detail');
  if (!alertBanner || !alertTitle || !alertDetail) return;

  alertBanner.style.background = bg;
  alertBanner.style.border = `1px solid ${border}`;
  alertBanner.style.color = textColor;
  alertTitle.textContent = title;
  alertDetail.textContent = detail;
  alertBanner.style.display = 'block';
}

function startLockoutCountdown(seconds) {
  const pinInput = document.getElementById('admin-pin-input');
  const submitBtn = document.getElementById('admin-pin-submit-btn');
  const statusInfo = document.getElementById('auth-status-info');

  if (pinInput) {
    pinInput.value = '';
    pinInput.disabled = true;
    pinInput.style.opacity = '0.5';
    pinInput.style.cursor = 'not-allowed';
  }
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';
    submitBtn.textContent = 'Locked Out';
  }

  const endTimestamp = Date.now() + (seconds * 1000);
  if (authLockoutTimer) clearInterval(authLockoutTimer);

  function update() {
    const now = Date.now();
    const remainingMs = endTimestamp - now;
    if (remainingMs <= 0) {
      clearInterval(authLockoutTimer);
      authLockoutTimer = null;
      if (pinInput) {
        pinInput.disabled = false;
        pinInput.style.opacity = '1';
        pinInput.style.cursor = 'text';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        submitBtn.textContent = 'Unlock Dashboard';
      }
      const alertBanner = document.getElementById('auth-alert-banner');
      if (alertBanner) alertBanner.style.display = 'none';
      if (statusInfo) {
        statusInfo.textContent = 'Lockout expired. 5 attempts available.';
      }
      if (pinInput) pinInput.focus();
      return;
    }

    const remSec = Math.ceil(remainingMs / 1000);
    const mins = Math.floor(remSec / 60);
    const secs = remSec % 60;
    const timeStr = `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;

    showAlertBanner(
      'Security Lockout Active',
      `Too many failed attempts (5/5). Access locked for 15 minutes. Try again in ${timeStr}.`,
      '#450A0A',
      '#991B1B',
      '#FCA5A5'
    );
    if (statusInfo) {
      statusInfo.textContent = `Security lockout in effect. Wait: ${timeStr}.`;
    }
  }

  update();
  authLockoutTimer = setInterval(update, 1000);
}

function lockAdminDashboard(reason) {
  localStorage.removeItem('vision_admin_token');
  hasDashboardStarted = false;
  showAuthGate();
  const alertBanner = document.getElementById('auth-alert-banner');
  if (reason) {
    showAlertBanner('Security Gate', reason, '#FEF3C7', '#B45309', '#92400E');
  } else if (alertBanner) {
    alertBanner.style.display = 'none';
  }
}

function startAdminDashboard() {
  if (hasDashboardStarted) return;
  hasDashboardStarted = true;

  fetchAllData();
  setupRealtimeEvents();

  if (window.location.hash) {
    const tab = window.location.hash.replace('#', '');
    if (['overview', 'projects', 'clients', 'leads', 'history', 'meetings', 'todo', 'devis', 'storage'].includes(tab)) {
      switchTab(tab);
    }
  }
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  initSidebar();
  initTabs();
  initSearch();
  initModals();
  renderDevisRows();
  renderDevisLive();

  await checkAdminAuth();
});

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
  if (!sidebar) return;
  const isCollapsed = sidebar.classList.toggle('collapsed');
  localStorage.setItem('vision_sidebar_collapsed', isCollapsed ? 'true' : 'false');

  const toggleBtn = document.getElementById('sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.title = isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)';
  }
}

function initSidebar() {
  const isCollapsed = localStorage.getItem('vision_sidebar_collapsed') === 'true';
  const sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
  if (sidebar && isCollapsed) {
    sidebar.classList.add('collapsed');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.title = 'Expand sidebar (Ctrl+B)';
    }
  }

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      toggleSidebar();
    }
  });
}

async function fetchAllData() {
  await Promise.all([
    fetchStats(),
    fetchClients(),
    fetchProjects(),
    fetchLeads(),
    fetchInvoices(),
    fetchMeetings(),
  ]);
}

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 3500);
}

// ==========================================
// TABS & NAVIGATION (ENGLISH)
// ==========================================
const TAB_TITLES = {
  overview: { title: "Overview", sub: "Projects pipeline and payment milestones" },
  projects: { title: "Projects", sub: "Development progress and milestones tracking" },
  clients: { title: "Clients", sub: "Client directory and project history" },
  leads: { title: "Leads", sub: "Incoming project inquiries from website" },
  history: { title: "History", sub: "Comprehensive historical logs for projects and milestones" },
  meetings: { title: "Meetings & Calendar", sub: "Coordinate client discovery calls, scoping sessions, and delivery deadlines" },
  todo: { title: "Meetings & Calendar", sub: "Coordinate client discovery calls, scoping sessions, and delivery deadlines" },
  devis: { title: "History", sub: "Comprehensive historical logs for projects and milestones" },
  storage: { title: "History", sub: "Comprehensive historical logs for projects and milestones" },
};

function initTabs() {
  const buttons = document.querySelectorAll('.sidebar-nav .nav-item');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });
}

function switchTab(tabId) {
  if (tabId === 'todo') {
    tabId = 'meetings';
  }

  if (tabId === 'storage' || tabId === 'devis') {
    tabId = 'history';
    state.historyCategory = 'projects';
  }

  state.activeTab = tabId;
  window.location.hash = tabId;

  document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  document.querySelectorAll('.tab-section').forEach(sec => {
    sec.classList.remove('active');
  });
  const target = document.getElementById(`tab-${tabId}`);
  if (target) target.classList.add('active');

  const meta = TAB_TITLES[tabId] || TAB_TITLES.overview;
  const titleEl = document.getElementById('page-title-text');
  const subEl = document.getElementById('page-subtitle-text');
  if (titleEl) titleEl.textContent = meta.title;
  if (subEl) subEl.textContent = meta.sub;

  if (tabId === 'history') {
    renderHistoryView();
    fetchInvoices();
  }

  if (tabId === 'meetings') {
    renderMeetingsView();
    fetchMeetings();
  }
}

// ==========================================
// API DATA FETCHING
// ==========================================
async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    const data = await res.json();
    state.stats = data;

    document.getElementById('stat-revenue').textContent = formatDzd(data.totalRevenueDzd);
    document.getElementById('stat-collected').textContent = formatDzd(data.totalCollectedDzd);
    document.getElementById('stat-pending').textContent = formatDzd(data.totalPendingDzd);
    document.getElementById('stat-active-projects').textContent = data.activeProjectsCount;
    const navProjBadge = document.getElementById('nav-projects-count');
    if (navProjBadge && data.activeProjectsCount !== undefined) {
      navProjBadge.textContent = data.activeProjectsCount;
    }
    updateLeadsBadge(data.newLeadsCount);
  } catch (err) {
    console.error('Stats error:', err);
  }
}

function updateLeadsBadge(count) {
  const leadsBadge = document.getElementById('nav-leads-count');
  if (!leadsBadge) return;
  const num = Number(count) || 0;
  if (num > 0) {
    leadsBadge.textContent = num;
    leadsBadge.style.display = 'inline-flex';
  } else {
    leadsBadge.textContent = '';
    leadsBadge.style.display = 'none';
  }
}

async function fetchProjects() {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    state.projects = data;

    const activeCount = data.filter(p => normalizeKanbanStage(p.stage) !== 'delivered' && p.status !== 'cancelled').length;
    const navCountEl = document.getElementById('nav-projects-count');
    if (navCountEl) navCountEl.textContent = activeCount;

    renderOverviewProjects(data);
    renderProjectsKanban(data);
    renderHistoryProjectsTable();
    renderHistoryFinancials();
    updateProjectSelects();
    checkDeadlineAlerts();
  } catch (err) {
    console.error('Projects error:', err);
  }
}

async function fetchClients() {
  try {
    const res = await fetch('/api/clients');
    if (!res.ok) throw new Error('Failed to fetch clients');
    const data = await res.json();
    state.clients = data;

    document.getElementById('nav-clients-count').textContent = data.length;
    renderClientsTable(data);
    updateClientSelects();
  } catch (err) {
    console.error('Clients error:', err);
  }
}

async function fetchLeads() {
  try {
    const res = await fetch('/api/leads');
    if (!res.ok) throw new Error('Failed to fetch leads');
    const data = await res.json();
    state.leads = data;
    renderLeadsTable(data);
    const newCount = (data || []).filter(l => l.status === 'new').length;
    updateLeadsBadge(newCount);
  } catch (err) {
    console.error('Leads error:', err);
  }
}

async function fetchInvoices() {
  try {
    const res = await fetch('/api/invoices');
    if (!res.ok) throw new Error('Failed to fetch invoices');
    const data = await res.json();
    state.invoices = data;
    renderHistoryFinancials();
  } catch (err) {
    console.error('Invoices error:', err);
  }
}

// ==========================================
// RENDERING & HELPERS
// ==========================================
function formatDzd(val) {
  const num = Number(val) || 0;
  return num.toLocaleString('en-US');
}

function formatFullDateTime(dateVal) {
  if (!dateVal) return 'Not recorded';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) + ' at ' + d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatDateShort(dateVal) {
  if (!dateVal) return '-';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatWhatsAppUrl(phone) {
  if (!phone) return '#';
  // Strip all non-digit characters except leading +
  let digits = String(phone).replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) {
    digits = digits.substring(1);
  } else if (digits.startsWith('00')) {
    digits = digits.substring(2);
  } else if (digits.startsWith('0')) {
    // Convert Algerian local mobile/landline 05/06/07/02 to international 213...
    digits = '213' + digits.substring(1);
  } else if (!digits.startsWith('213') && (digits.startsWith('5') || digits.startsWith('6') || digits.startsWith('7'))) {
    digits = '213' + digits;
  }
  return `https://wa.me/${digits}`;
}

function getStageBadge(stage) {
  const map = {
    scoping: { label: 'Scoping', class: 'stage-scoping' },
    devis: { label: 'Devis', class: 'stage-scoping' },
    deposit_50: { label: 'Deposit (50%)', class: 'stage-deposit' },
    design: { label: 'Design UI/UX', class: 'stage-design_20' },
    design_20: { label: 'Design Approved', class: 'stage-design_20' },
    design_approved_20: { label: 'Design Approved', class: 'stage-design_20' },
    development: { label: 'Development', class: 'stage-dev_30' },
    dev_30: { label: 'Development', class: 'stage-dev_30' },
    security_qa: { label: 'Security QA', class: 'stage-qa' },
    qa_testing: { label: 'Security QA', class: 'stage-qa' },
    delivered: { label: 'Delivered', class: 'stage-delivered' },
    delivered_30: { label: 'Delivered', class: 'stage-delivered' },
    maintenance: { label: 'Delivered', class: 'stage-delivered' },
  };
  const item = map[stage] || { label: stage || 'Scoping', class: 'stage-scoping' };
  return `<span class="badge-stage ${item.class}">${item.label}</span>`;
}

let currentDetailsProjectId = null;

// Open Read-Only Project Details Modal
function openProjectDetailsModal(projectId) {
  const p = state.projects.find(x => x.id === projectId);
  if (!p) {
    showToast('Project details not found', 'error');
    return;
  }
  currentDetailsProjectId = projectId;

  const client = p.client || {};
  const total = Number(p.priceTotalDzd) || 0;
  const m1Amt = Number(p.m1AmountDzd) || Math.round(total * 0.5);
  const m2Amt = Number(p.m2AmountDzd) || Math.round(total * 0.2);
  const m3Amt = Number(p.m3AmountDzd) || (total - m1Amt - m2Amt);

  let collected = 0;
  if (p.m1Paid) collected += m1Amt;
  if (p.m2Paid) collected += m2Amt;
  if (p.m3Paid) collected += m3Amt;

  const pctCollected = total > 0 ? Math.round((collected / total) * 100) : 0;

  // Title & Header
  document.getElementById('pd-title').textContent = p.title || 'Project Details';
  document.getElementById('pd-subtitle').textContent = client.companyName ? `Client: ${client.companyName}` : 'Project Specification';
  document.getElementById('pd-stage-badge').innerHTML = getStageBadge(p.stage);

  // Client Details
  document.getElementById('pd-client-company').textContent = client.companyName || '-';
  document.getElementById('pd-client-contact').textContent = client.contactName || '-';
  document.getElementById('pd-client-wilaya').textContent = client.wilaya || '-';
  if (client.phone) {
    document.getElementById('pd-client-phone').innerHTML = `<a href="${formatWhatsAppUrl(client.phone)}" target="_blank" rel="noopener noreferrer" class="phone-link" title="Open WhatsApp: ${escapeHtml(client.phone)}">${escapeHtml(client.phone)}</a>`;
  } else {
    document.getElementById('pd-client-phone').textContent = '-';
  }

  // Project Info
  const typeLabels = {
    ecommerce: 'E-Commerce Platform',
    custom_software: 'Custom Desktop / Software',
    desktop_offline: 'Offline POS & Desktop Accounting',
    saas: 'SaaS / Web Application',
    landing: 'Landing Page & Showcase',
    mobile: 'Mobile Application',
  };
  document.getElementById('pd-type').textContent = typeLabels[p.type] || p.type || '-';
  document.getElementById('pd-date').textContent = formatFullDateTime(p.createdAt);

  // Financials
  document.getElementById('pd-total-budget').textContent = formatDzd(total);
  document.getElementById('pd-payment-ratio').textContent = `${formatDzd(collected)} / ${formatDzd(total)} DZD (${pctCollected}%)`;
  document.getElementById('pd-payment-ratio').style.color = (collected === total && total > 0) ? '#059669' : '#D97706';

  // Progress Bar
  const barM1 = document.getElementById('pd-bar-m1');
  const barM2 = document.getElementById('pd-bar-m2');
  const barM3 = document.getElementById('pd-bar-m3');
  barM1.className = `progress-segment seg-50 ${p.m1Paid ? 'paid' : 'unpaid'}`;
  barM2.className = `progress-segment seg-20 ${p.m2Paid ? 'paid' : 'unpaid'}`;
  barM3.className = `progress-segment seg-30 ${p.m3Paid ? 'paid' : 'unpaid'}`;

  // Milestone Cards
  const cardM1 = document.getElementById('pd-card-m1');
  cardM1.className = `milestone-detail-card ${p.m1Paid ? 'paid' : 'pending'}`;
  document.getElementById('pd-badge-m1').className = `badge ${p.m1Paid ? 'badge-green' : 'badge-yellow'}`;
  document.getElementById('pd-badge-m1').textContent = p.m1Paid ? 'Paid' : 'Pending';
  document.getElementById('pd-amount-m1').textContent = formatDzd(m1Amt);
  document.getElementById('pd-receipt-m1').innerHTML = p.m1ReceiptUrl
    ? `<a href="#" onclick="viewReceipt('${escapeHtml(p.title)} - M1 (50%)', '${p.m1ReceiptUrl}'); return false;" style="color: var(--cyan-dark); font-weight: 600; text-decoration: underline;">View BaridiMob Receipt</a>`
    : (p.m1Paid ? 'Verified via BaridiMob' : 'Awaiting payment');

  const cardM2 = document.getElementById('pd-card-m2');
  cardM2.className = `milestone-detail-card ${p.m2Paid ? 'paid' : 'pending'}`;
  document.getElementById('pd-badge-m2').className = `badge ${p.m2Paid ? 'badge-green' : 'badge-yellow'}`;
  document.getElementById('pd-badge-m2').textContent = p.m2Paid ? 'Paid' : 'Pending';
  document.getElementById('pd-amount-m2').textContent = formatDzd(m2Amt);
  document.getElementById('pd-receipt-m2').innerHTML = p.m2ReceiptUrl
    ? `<a href="#" onclick="viewReceipt('${escapeHtml(p.title)} - M2 (20%)', '${p.m2ReceiptUrl}'); return false;" style="color: var(--cyan-dark); font-weight: 600; text-decoration: underline;">View BaridiMob Receipt</a>`
    : (p.m2Paid ? 'Verified via BaridiMob' : 'Awaiting payment');

  const cardM3 = document.getElementById('pd-card-m3');
  cardM3.className = `milestone-detail-card ${p.m3Paid ? 'paid' : 'pending'}`;
  document.getElementById('pd-badge-m3').className = `badge ${p.m3Paid ? 'badge-green' : 'badge-yellow'}`;
  document.getElementById('pd-badge-m3').textContent = p.m3Paid ? 'Paid' : 'Pending';
  document.getElementById('pd-amount-m3').textContent = formatDzd(m3Amt);
  document.getElementById('pd-receipt-m3').innerHTML = p.m3ReceiptUrl
    ? `<a href="#" onclick="viewReceipt('${escapeHtml(p.title)} - M3 (30%)', '${p.m3ReceiptUrl}'); return false;" style="color: var(--cyan-dark); font-weight: 600; text-decoration: underline;">View BaridiMob Receipt</a>`
    : (p.m3Paid ? 'Verified via BaridiMob' : 'Awaiting payment');

  // Scope Notes
  document.getElementById('pd-notes').textContent = p.notes || 'No extra notes recorded for this project.';

  // Inclusions
  document.getElementById('pd-domain-status').textContent = p.domainIncluded ? 'Included (Covered by VISION)' : 'Not Included';
  document.getElementById('pd-hosting-status').textContent = p.hostingIncluded ? 'Included (Covered by VISION)' : 'Not Included';

  // Target Delivery Deadline & Status
  const deadlineValEl = document.getElementById('pd-delivery-deadline');
  const deadlineStatusEl = document.getElementById('pd-deadline-status');
  if (deadlineValEl && deadlineStatusEl) {
    if (p.targetDeliveryDate) {
      const targetDate = new Date(p.targetDeliveryDate);
      deadlineValEl.textContent = targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const targetDay = new Date(targetDate);
      targetDay.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((targetDay - now) / (1000 * 60 * 60 * 24));

      const isDelivered = p.stage === 'delivered' || p.status === 'delivered';
      const isCancelled = p.status === 'cancelled';

      if (isDelivered) {
        deadlineStatusEl.innerHTML = `<span class="badge badge-green">Delivered</span>`;
      } else if (isCancelled) {
        deadlineStatusEl.innerHTML = `<span class="badge badge-gray">Cancelled</span>`;
      } else if (diffDays < 0) {
        deadlineStatusEl.innerHTML = `<span class="badge" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; font-weight: 700;">Overdue by ${Math.abs(diffDays)} days</span>`;
      } else if (diffDays <= 3) {
        const text = diffDays === 0 ? 'Due Today' : `Due in ${diffDays} days`;
        deadlineStatusEl.innerHTML = `<span class="badge" style="background: #FEE2E2; color: #DC2626; border: 1px solid #F87171; font-weight: 700;">${text} (Critical)</span>`;
      } else if (diffDays <= 7) {
        deadlineStatusEl.innerHTML = `<span class="badge" style="background: #FEF3C7; color: #D97706; border: 1px solid #FCD34D; font-weight: 600;">Due in ${diffDays} days</span>`;
      } else {
        deadlineStatusEl.innerHTML = `<span class="badge badge-gray">On Schedule (${diffDays} days left)</span>`;
      }
    } else {
      deadlineValEl.textContent = 'Not specified';
      deadlineStatusEl.innerHTML = `<span class="badge badge-gray">Pending Scope</span>`;
    }
  }

  // Visual Payment Receipts Gallery (BaridiMob)
  renderProjectReceipts(p);

  // Project References
  const refTitleEl = document.getElementById('pd-new-ref-title');
  const refUrlEl = document.getElementById('pd-new-ref-url');
  if (refTitleEl) refTitleEl.value = '';
  if (refUrlEl) refUrlEl.value = '';
  renderProjectReferences(p.referencesJson || []);

  // Interactive Project Action Items (To-Do)
  const taskInputEl = document.getElementById('pd-new-task-input');
  if (taskInputEl) taskInputEl.value = '';
  renderProjectTasks(p.deliverablesJson || []);

  // Cancel Action
  const cancelWrap = document.getElementById('pd-cancel-action-wrap');
  if (cancelWrap) {
    const currentStage = normalizeKanbanStage(p.stage);
    if (['scoping', 'devis', 'deposit_50'].includes(currentStage) && !p.m1Paid && p.status !== 'cancelled') {
      cancelWrap.innerHTML = `
        <button type="button" class="btn btn-secondary btn-sm" style="color: #DC2626; border-color: #FCA5A5; font-weight: 600;" onclick="closeModal('project-details-modal'); requestCancelProject('${p.id}')">
          Cancel Project (Move to Trash)
        </button>
      `;
    } else {
      cancelWrap.innerHTML = '';
    }
  }

  // Official Quote / Devis Document Action Buttons
  const linkedInvoice = (state.invoices || []).find(inv => inv.projectId === p.id);
  const headerDevisBtn = document.getElementById('pd-header-devis-btn');
  const footerDevisBtn = document.getElementById('pd-footer-devis-btn');

  if (headerDevisBtn) {
    if (linkedInvoice) {
      headerDevisBtn.innerHTML = `
        <button type="button" class="btn btn-primary btn-sm" style="font-weight: 700; padding: 4px 12px; font-size: 0.76rem;" onclick="openProjectDevisDocument('${p.id}')">
          Open Devis File (PDF)
        </button>
      `;
    } else {
      headerDevisBtn.innerHTML = '';
    }
  }

  if (footerDevisBtn) {
    if (linkedInvoice) {
      footerDevisBtn.innerHTML = `
        <button type="button" class="btn btn-primary btn-sm" style="font-weight: 700; padding: 6px 14px; font-size: 0.8rem;" onclick="openProjectDevisDocument('${p.id}')">
          Open Devis File (PDF)
        </button>
      `;
    } else {
      footerDevisBtn.innerHTML = '';
    }
  }

  openModal('project-details-modal');
}

// ==========================================
// PROJECT PAYMENT RECEIPTS (BARIDIMOB)
// ==========================================
function renderProjectReceipts(p) {
  const container = document.getElementById('pd-receipts-grid');
  const counterEl = document.getElementById('pd-receipts-counter');
  const invoiceDocEl = document.getElementById('pd-receipts-invoice-doc');
  if (!container) return;

  const total = Number(p.priceTotalDzd) || 0;
  const m1Amt = Number(p.m1AmountDzd) || Math.round(total * 0.5);
  const m2Amt = Number(p.m2AmountDzd) || Math.round(total * 0.2);
  const m3Amt = Number(p.m3AmountDzd) || (total - m1Amt - m2Amt);

  const milestones = [
    {
      key: 'm1',
      title: 'M1 - 50% Deposit',
      amount: m1Amt,
      paid: !!p.m1Paid,
      receiptUrl: p.m1ReceiptUrl,
      paidAt: p.m1PaidAt,
    },
    {
      key: 'm2',
      title: 'M2 - 20% Design',
      amount: m2Amt,
      paid: !!p.m2Paid,
      receiptUrl: p.m2ReceiptUrl,
      paidAt: p.m2PaidAt,
    },
    {
      key: 'm3',
      title: 'M3 - 30% Delivery',
      amount: m3Amt,
      paid: !!p.m3Paid,
      receiptUrl: p.m3ReceiptUrl,
      paidAt: p.m3PaidAt,
    },
  ];

  const uploadedCount = milestones.filter(m => !!m.receiptUrl).length;
  const paidCount = milestones.filter(m => m.paid).length;

  if (counterEl) {
    counterEl.textContent = `${uploadedCount} of 3 receipts attached (${paidCount} of 3 milestones verified)`;
  }

  container.innerHTML = milestones.map(m => {
    if (m.receiptUrl) {
      return `
        <div style="background: var(--paper); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; font-size: 0.8rem; color: var(--ink);">${escapeHtml(m.title)}</span>
            <span class="badge badge-green">Verified</span>
          </div>
          <div style="font-size: 1rem; font-weight: 800; color: var(--ink);">${formatDzd(m.amount)} DZD</div>
          <div style="position: relative; width: 100%; height: 130px; background: #0F172A; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border); cursor: pointer;" onclick="viewReceipt('${escapeHtml(p.title)} - ${escapeHtml(m.title)}', '${m.receiptUrl}')">
            <img src="${m.receiptUrl}" alt="${escapeHtml(m.title)}" style="width: 100%; height: 100%; object-fit: cover;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.75)); padding: 6px 8px; display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #fff; font-size: 0.70rem; font-weight: 600;">Click to view full</span>
              <span style="color: #6EE7B7; font-size: 0.68rem; font-weight: 700;">BaridiMob</span>
            </div>
          </div>
          <div style="font-size: 0.72rem; color: var(--ink-muted);">
            ${m.paidAt ? 'Paid: ' + formatFullDateTime(m.paidAt) : 'Verified via BaridiMob'}
          </div>
          <div style="display: flex; gap: 6px; margin-top: 4px;">
            <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; padding: 4px 8px; font-size: 0.74rem;" onclick="viewReceipt('${escapeHtml(p.title)} - ${escapeHtml(m.title)}', '${m.receiptUrl}')">View Full</button>
            <button type="button" class="btn btn-secondary btn-sm" style="flex: 1; padding: 4px 8px; font-size: 0.74rem;" onclick="openUploadReceiptModal('${p.id}', '${escapeHtml(p.title)}', '${m.key}')">Replace</button>
          </div>
        </div>
      `;
    } else if (m.paid) {
      return `
        <div style="background: var(--paper); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; font-size: 0.8rem; color: var(--ink);">${escapeHtml(m.title)}</span>
            <span class="badge badge-green">Paid</span>
          </div>
          <div style="font-size: 1rem; font-weight: 800; color: var(--ink);">${formatDzd(m.amount)} DZD</div>
          <div style="height: 130px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #ECFDF5; border: 1px dashed #10B981; border-radius: var(--radius-sm); text-align: center; padding: 12px;">
            <div style="font-size: 0.82rem; font-weight: 700; color: #065F46;">Payment Confirmed</div>
            <div style="font-size: 0.72rem; color: #047857; margin-top: 4px;">No screenshot attached</div>
          </div>
          <div style="font-size: 0.72rem; color: var(--ink-muted);">
            ${m.paidAt ? 'Paid: ' + formatFullDateTime(m.paidAt) : 'Direct payment verified'}
          </div>
          <div style="margin-top: 4px;">
            <button type="button" class="btn btn-secondary btn-sm" style="width: 100%; padding: 4px 8px; font-size: 0.74rem;" onclick="openUploadReceiptModal('${p.id}', '${escapeHtml(p.title)}', '${m.key}')">Attach Receipt</button>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="background: var(--paper); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; font-size: 0.8rem; color: var(--ink);">${escapeHtml(m.title)}</span>
            <span class="badge badge-yellow">Pending</span>
          </div>
          <div style="font-size: 1rem; font-weight: 800; color: var(--ink);">${formatDzd(m.amount)} DZD</div>
          <div style="height: 130px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #F9FAFB; border: 1px dashed var(--border); border-radius: var(--radius-sm); text-align: center; padding: 12px;">
            <div style="font-size: 0.80rem; font-weight: 600; color: var(--ink-muted);">Awaiting Payment</div>
            <div style="font-size: 0.70rem; color: var(--ink-muted); margin-top: 4px;">No BaridiMob receipt yet</div>
          </div>
          <div style="font-size: 0.72rem; color: var(--ink-muted);">
            Pending client transfer
          </div>
          <div style="margin-top: 4px;">
            <button type="button" class="btn btn-primary btn-sm" style="width: 100%; padding: 4px 8px; font-size: 0.74rem;" onclick="openUploadReceiptModal('${p.id}', '${escapeHtml(p.title)}', '${m.key}')">Upload Receipt</button>
          </div>
        </div>
      `;
    }
  }).join('');

  if (invoiceDocEl) {
    const linkedInvoice = (state.invoices || []).find(inv => inv.projectId === p.id);
    if (linkedInvoice) {
      const itemsCount = Array.isArray(linkedInvoice.itemsJson) ? linkedInvoice.itemsJson.length : 0;
      invoiceDocEl.innerHTML = `
        <div style="padding: 12px 14px; background: var(--paper); border: 1px solid var(--border); border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
          <div>
            <span style="font-weight: 700; font-size: 0.82rem; color: var(--ink);">Official Quote / Devis: ${escapeHtml(linkedInvoice.invoiceNumber || 'VISION-QUOTE')}</span>
            <div style="font-size: 0.72rem; color: var(--ink-muted); margin-top: 2px;">Total: ${formatDzd(linkedInvoice.totalAmountDzd || p.priceTotalDzd)} DZD · ${itemsCount} scope line items</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn btn-secondary btn-sm" style="padding: 4px 10px; font-size: 0.74rem;" onclick="closeModal('project-details-modal'); openProjectDevisModal('${p.id}')">Edit Devis Scope</button>
            <button type="button" class="btn btn-primary btn-sm" style="padding: 4px 12px; font-size: 0.74rem; font-weight: 700;" onclick="openProjectDevisDocument('${p.id}')">Open Devis File (PDF)</button>
          </div>
        </div>
      `;
    } else {
      invoiceDocEl.innerHTML = '';
    }
  }
}

// Open / Download Official Devis PDF for Project
function openProjectDevisDocument(projectId) {
  const p = state.projects.find(x => x.id === projectId);
  if (!p) {
    showToast('Project record not found', 'error');
    return;
  }
  const linkedInvoice = (state.invoices || []).find(inv => inv.projectId === projectId);
  if (!linkedInvoice) {
    showToast('No Devis has been created for this project yet.', 'error');
    return;
  }

  if (linkedInvoice.pdfUrl) {
    window.open(linkedInvoice.pdfUrl, '_blank');
    return;
  }

  // Generate and open PDF directly via html2pdf
  downloadInvoicePdf(linkedInvoice.id, 'open');
}

// ==========================================
// PROJECT REFERENCES (DESIGN & INSPIRATION)
// ==========================================
function renderProjectReferences(refs) {
  const container = document.getElementById('pd-references-list');
  const counterEl = document.getElementById('pd-references-counter');
  if (!container) return;

  const list = Array.isArray(refs) ? refs : [];
  if (counterEl) {
    const count = list.length;
    counterEl.textContent = `${count} reference ${count === 1 ? 'link' : 'links'} bookmarked`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="padding: 14px; text-align: center; color: var(--ink-muted); font-size: 0.82rem; background: var(--paper); border: 1px dashed var(--border); border-radius: var(--radius-sm);">
        No reference links bookmarked yet. Add reference URLs above to keep benchmarks handy.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(ref => {
    let rawUrl = (ref.url || '').trim();
    let safeUrl = rawUrl;
    if (safeUrl && !safeUrl.startsWith('http://') && !safeUrl.startsWith('https://')) {
      safeUrl = 'https://' + safeUrl;
    }
    let domain = '';
    try {
      const u = new URL(safeUrl);
      domain = u.hostname.replace(/^www\./, '');
    } catch (e) {
      domain = safeUrl;
    }

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-sm); gap: 10px;">
        <div style="display: flex; flex-direction: column; min-width: 0; flex: 1;">
          <a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer" 
             style="color: var(--cyan-dark); font-weight: 600; font-size: 0.86rem; text-decoration: none; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
             onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">
            ${escapeHtml(ref.title || domain || 'Reference Link')}
          </a>
          <span style="font-size: 0.73rem; color: var(--ink-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${escapeHtml(domain)}
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
          <a href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="padding: 2px 8px; font-size: 0.75rem; text-decoration: none;">
            Visit
          </a>
          <button type="button" class="btn btn-secondary btn-sm" style="padding: 2px 8px; color: #DC2626; border-color: transparent; font-size: 0.75rem;" onclick="deleteProjectReference('${ref.id}')">
            Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

async function addProjectReference() {
  if (!currentDetailsProjectId) return;
  const titleEl = document.getElementById('pd-new-ref-title');
  const urlEl = document.getElementById('pd-new-ref-url');
  if (!titleEl || !urlEl) return;

  const title = titleEl.value.trim();
  let url = urlEl.value.trim();

  if (!url) {
    showToast('Please enter a website URL', 'error');
    return;
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  const p = state.projects.find(x => x.id === currentDetailsProjectId);
  if (!p) return;

  const currentRefs = Array.isArray(p.referencesJson) ? [...p.referencesJson] : [];
  const newRef = {
    id: 'ref_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    title: title || url,
    url,
    createdAt: new Date().toISOString()
  };
  currentRefs.push(newRef);

  // Optimistic UI update
  p.referencesJson = currentRefs;
  renderProjectReferences(currentRefs);
  titleEl.value = '';
  urlEl.value = '';

  try {
    const res = await fetch(`/api/projects/${currentDetailsProjectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referencesJson: currentRefs })
    });
    if (!res.ok) throw new Error('Failed to save reference');
    showToast('Reference added successfully.');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteProjectReference(refId) {
  if (!currentDetailsProjectId) return;
  const p = state.projects.find(x => x.id === currentDetailsProjectId);
  if (!p) return;

  const currentRefs = (Array.isArray(p.referencesJson) ? p.referencesJson : []).filter(r => r.id !== refId);

  // Optimistic UI update
  p.referencesJson = currentRefs;
  renderProjectReferences(currentRefs);

  try {
    const res = await fetch(`/api/projects/${currentDetailsProjectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referencesJson: currentRefs })
    });
    if (!res.ok) throw new Error('Failed to delete reference');
    showToast('Reference removed.');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==========================================
// PROJECT ACTION ITEMS (TO-DO WORKSPACE)
// ==========================================
function renderProjectTasks(tasks) {
  const container = document.getElementById('pd-tasks-list');
  const counterEl = document.getElementById('pd-todo-counter');
  const badgeEl = document.getElementById('pd-todo-progress-badge');
  if (!container) return;

  const list = Array.isArray(tasks) ? tasks : [];
  const completedCount = list.filter(t => t && t.completed).length;
  const totalCount = list.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (counterEl) {
    counterEl.textContent = `${completedCount} of ${totalCount} deliverables completed`;
  }
  if (badgeEl) {
    badgeEl.textContent = `${pct}%`;
    badgeEl.className = `badge ${pct === 100 && totalCount > 0 ? 'badge-green' : (pct > 0 ? 'badge-cyan' : 'badge-gray')}`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="padding: 16px; text-align: center; color: var(--ink-muted); font-size: 0.82rem; background: var(--paper); border: 1px dashed var(--border); border-radius: var(--radius-sm);">
        No action items recorded yet. Enter a task above to track project execution.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map((t, idx) => {
    const taskId = (t && t.id) ? String(t.id) : `task_${idx}`;
    const taskText = (t && (t.text || t.title || t.description)) ? String(t.text || t.title || t.description) : `Task #${idx + 1}`;
    const isCompleted = !!(t && t.completed);

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-sm); gap: 10px;">
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; flex: 1; margin: 0;">
          <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleProjectTask('${escapeHtml(taskId)}', ${idx})" style="width: 16px; height: 16px; cursor: pointer;">
          <span style="${isCompleted ? 'text-decoration: line-through; color: var(--ink-muted);' : 'color: var(--ink); font-weight: 600;'} font-size: 0.85rem; line-height: 1.3;">
            ${escapeHtml(taskText)}
          </span>
        </label>
        <button type="button" class="btn btn-secondary btn-sm" style="padding: 2px 8px; color: #DC2626; border-color: transparent; font-size: 0.75rem;" onclick="deleteProjectTask('${escapeHtml(taskId)}', ${idx})">
          Delete
        </button>
      </div>
    `;
  }).join('');
}

async function addProjectTask() {
  if (!currentDetailsProjectId) return;
  const inputEl = document.getElementById('pd-new-task-input');
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (!text) {
    showToast('Please enter an action item or deliverable text', 'error');
    return;
  }

  const p = state.projects.find(x => x.id === currentDetailsProjectId);
  if (!p) return;

  const currentTasks = Array.isArray(p.deliverablesJson) ? [...p.deliverablesJson] : [];
  const newTask = {
    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    text,
    completed: false,
    createdAt: new Date().toISOString()
  };
  currentTasks.push(newTask);

  // Optimistic UI update
  p.deliverablesJson = currentTasks;
  renderProjectTasks(currentTasks);
  inputEl.value = '';

  try {
    const res = await fetch(`/api/projects/${currentDetailsProjectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliverablesJson: currentTasks })
    });
    if (!res.ok) throw new Error('Failed to save task');
    showToast('Task added successfully.');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function toggleProjectTask(taskId, idx) {
  if (!currentDetailsProjectId) return;
  const p = state.projects.find(x => x.id === currentDetailsProjectId);
  if (!p) return;

  const currentTasks = Array.isArray(p.deliverablesJson) ? [...p.deliverablesJson] : [];
  let task = currentTasks.find(t => t && t.id && String(t.id) === String(taskId));
  if (!task && typeof idx === 'number' && currentTasks[idx]) {
    task = currentTasks[idx];
  }
  if (!task) return;

  task.completed = !task.completed;

  // Optimistic UI update
  p.deliverablesJson = currentTasks;
  renderProjectTasks(currentTasks);

  try {
    const res = await fetch(`/api/projects/${currentDetailsProjectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliverablesJson: currentTasks })
    });
    if (!res.ok) throw new Error('Failed to update task');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteProjectTask(taskId, idx) {
  if (!currentDetailsProjectId) return;
  const p = state.projects.find(x => x.id === currentDetailsProjectId);
  if (!p) return;

  const currentTasks = Array.isArray(p.deliverablesJson) ? [...p.deliverablesJson] : [];
  const updatedTasks = currentTasks.filter((t, index) => {
    if (t && t.id && String(t.id) === String(taskId)) return false;
    if (typeof idx === 'number' && index === idx) return false;
    if (String(taskId) === `task_${index}`) return false;
    return true;
  });

  // Optimistic UI update: item vanishes instantly with ZERO popups, alerts or confirmations
  p.deliverablesJson = updatedTasks;
  renderProjectTasks(updatedTasks);

  try {
    const res = await fetch(`/api/projects/${currentDetailsProjectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliverablesJson: updatedTasks })
    });
    if (!res.ok) throw new Error('Failed to delete task');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==========================================
// DEADLINE MONITORING & NOTIFICATION ALERTS
// ==========================================
function checkDeadlineAlerts() {
  const activeProjects = (state.projects || []).filter(p => p.status !== 'cancelled' && p.stage !== 'delivered');
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const urgentProjects = [];
  activeProjects.forEach(p => {
    if (!p.targetDeliveryDate) return;
    const targetDate = new Date(p.targetDeliveryDate);
    targetDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) {
      urgentProjects.push({
        project: p,
        diffDays,
        isOverdue: diffDays < 0
      });
    }
  });

  // Sort: overdue first, then closest
  urgentProjects.sort((a, b) => a.diffDays - b.diffDays);

  const navAlert = document.getElementById('nav-deadline-alert');
  if (navAlert) {
    if (urgentProjects.length > 0) {
      navAlert.style.display = 'inline-block';
      navAlert.textContent = `${urgentProjects.length}`;
      navAlert.title = `${urgentProjects.length} project(s) nearing or past delivery deadline`;
    } else {
      navAlert.style.display = 'none';
    }
  }

  const renderBannerHtml = () => {
    if (urgentProjects.length === 0) return '';
    return `
      <div style="background: #FEF2F2; border: 1px solid #FCA5A5; border-radius: var(--radius-md); padding: 14px 18px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #DC2626;"></span>
            <strong style="color: #991B1B; font-size: 0.88rem; text-transform: uppercase; letter-spacing: 0.04em;">
              Deadline Alert: ${urgentProjects.length} Project${urgentProjects.length > 1 ? 's' : ''} Require Immediate Attention
            </strong>
          </div>
          <span style="font-size: 0.75rem; color: #B91C1C; font-weight: 600;">Delivery Monitoring</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${urgentProjects.map(u => {
            const p = u.project;
            const clientName = p.client ? p.client.companyName : 'Direct Client';
            const statusLabel = u.isOverdue
              ? `Overdue by ${Math.abs(u.diffDays)} day${Math.abs(u.diffDays) > 1 ? 's' : ''}`
              : (u.diffDays === 0 ? 'Due Today' : `Due in ${u.diffDays} day${u.diffDays > 1 ? 's' : ''}`);
            return `
              <div style="display: flex; justify-content: space-between; align-items: center; background: #fff; padding: 8px 12px; border-radius: var(--radius-sm); border: 1px solid #FECACA;">
                <div>
                  <strong style="color: var(--ink); font-size: 0.86rem; cursor: pointer;" onclick="openProjectDetailsModal('${p.id}')">${escapeHtml(p.title)}</strong>
                  <span style="font-size: 0.78rem; color: var(--ink-muted); margin-left: 8px;">· ${escapeHtml(clientName)} · Stage: ${escapeHtml(p.stage)}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="badge" style="background: #FEE2E2; color: #DC2626; border: 1px solid #F87171; font-weight: 700; font-size: 0.72rem;">
                    ${statusLabel}
                  </span>
                  <button type="button" class="btn btn-secondary btn-sm" style="padding: 2px 8px; font-size: 0.75rem;" onclick="openProjectDetailsModal('${p.id}')">
                    View
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  };

  const overviewBanner = document.getElementById('overview-deadline-alerts');
  const projectsBanner = document.getElementById('projects-deadline-alerts');

  const bannerHtml = renderBannerHtml();

  if (overviewBanner) {
    if (bannerHtml) {
      overviewBanner.innerHTML = bannerHtml;
      overviewBanner.style.display = 'block';
    } else {
      overviewBanner.style.display = 'none';
      overviewBanner.innerHTML = '';
    }
  }

  if (projectsBanner) {
    if (bannerHtml) {
      projectsBanner.innerHTML = bannerHtml;
      projectsBanner.style.display = 'block';
    } else {
      projectsBanner.style.display = 'none';
      projectsBanner.innerHTML = '';
    }
  }
}

// 1. Overview Projects Table
function renderOverviewProjects(projects) {
  const tbody = document.getElementById('overview-projects-tbody');
  if (!tbody) return;

  const validProjects = (Array.isArray(projects) ? projects : []).filter(p => p.status !== 'cancelled');

  if (validProjects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--ink-muted); padding: 24px;">No projects recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = validProjects.map(p => {
    const clientName = p.client ? p.client.companyName : 'Unknown Client';
    const total = Number(p.priceTotalDzd) || 0;

    return `
      <tr class="clickable-row" onclick="openProjectDetailsModal('${p.id}')">
        <td>
          <strong style="color: var(--ink); font-size: 0.92rem;">${escapeHtml(p.title)}</strong>
          <div style="font-size: 0.78rem; color: var(--ink-muted);">${escapeHtml(clientName)}</div>
        </td>
        <td><span class="badge badge-gray">${escapeHtml(p.type)}</span></td>
        <td><strong style="font-size: 0.92rem;">${formatDzd(total)} DZD</strong></td>
        <td>
          <div class="milestone-progress">
            <div class="progress-track">
              <div class="progress-segment seg-50 ${p.m1Paid ? 'paid' : 'unpaid'}" title="M1: 50% (${p.m1Paid ? 'Paid' : 'Pending'})"></div>
              <div class="progress-segment seg-20 ${p.m2Paid ? 'paid' : 'unpaid'}" title="M2: 20% (${p.m2Paid ? 'Paid' : 'Pending'})"></div>
              <div class="progress-segment seg-30 ${p.m3Paid ? 'paid' : 'unpaid'}" title="M3: 30% (${p.m3Paid ? 'Paid' : 'Pending'})"></div>
            </div>
            <div class="milestone-labels">
              <span>50%</span><span>20%</span><span>30%</span>
            </div>
          </div>
        </td>
        <td>${getStageBadge(p.stage)}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); openProjectDetailsModal('${p.id}')">Details</button>
        </td>
      </tr>
    `;
  }).join('');
}

// 2. Full Projects Kanban Board (8 Stages Pipeline)
const KANBAN_STAGES = [
  { id: 'scoping', title: '1. Scoping', subtitle: 'Needs & Meeting', color: '#6366F1' },
  { id: 'devis', title: '2. Devis', subtitle: 'Quote & Proposal', color: '#0EA5E9' },
  { id: 'deposit_50', title: '3. Deposit (50%)', subtitle: 'M1 Paid · Kickoff', color: '#F59E0B' },
  { id: 'design', title: '4. Design UI/UX', subtitle: 'Mockups & Flow', color: '#8B5CF6' },
  { id: 'design_approved_20', title: '5. Design Approved', subtitle: 'M2 Paid · Sign-off', color: '#EC4899' },
  { id: 'development', title: '6. Development', subtitle: 'Backend & Logic', color: '#2563EB' },
  { id: 'security_qa', title: '7. Security QA', subtitle: 'Audits & Testing', color: '#DC2626' },
  { id: 'delivered', title: '8. Delivered (30%)', subtitle: 'M3 Paid · Handover', color: '#059669' },
];

function normalizeKanbanStage(stage) {
  if (!stage) return 'scoping';
  if (stage === 'design_20') return 'design_approved_20';
  if (stage === 'dev_30') return 'development';
  if (stage === 'delivered_30' || stage === 'maintenance') return 'delivered';
  if (stage === 'qa_testing') return 'security_qa';
  const found = KANBAN_STAGES.some(s => s.id === stage);
  return found ? stage : 'scoping';
}

function renderProjectsKanban(projects) {
  const container = document.getElementById('projects-kanban-board');
  if (!container) return;

  // Filter out cancelled projects from active pipeline
  const list = (Array.isArray(projects) ? projects : []).filter(p => p.status !== 'cancelled');

  // Group projects by normalized stage
  const grouped = {};
  KANBAN_STAGES.forEach(s => {
    grouped[s.id] = [];
  });

  list.forEach(p => {
    const stageKey = normalizeKanbanStage(p.stage);
    if (grouped[stageKey]) {
      grouped[stageKey].push(p);
    } else {
      grouped['scoping'].push(p);
    }
  });

  container.innerHTML = KANBAN_STAGES.map(col => {
    const colProjects = grouped[col.id] || [];
    
    const cardsHtml = colProjects.length === 0
      ? `<div class="kanban-empty-placeholder">No projects in this stage</div>`
      : colProjects.map(p => {
          const client = p.client || {};
          const company = client.companyName || 'No Client';
          const total = Number(p.priceTotalDzd) || 0;
          const m1Amount = Number(p.m1AmountDzd) || Math.round(total * 0.50);
          const m2Amount = Number(p.m2AmountDzd) || Math.round(total * 0.20);
          const m3Amount = Number(p.m3AmountDzd) || (total - m1Amount - m2Amount);

          let collected = 0;
          if (p.m1Paid) collected += m1Amount;
          if (p.m2Paid) collected += m2Amount;
          if (p.m3Paid) collected += m3Amount;

          const currentStage = normalizeKanbanStage(p.stage);
          const typeLabel = p.type ? p.type.replace(/_/g, ' ') : 'Custom';

          // Stage-specific content
          let stageContentHtml = '';

          if (currentStage === 'scoping') {
            // Rule 1: In scoping, price and 50/20/30 are hidden
            stageContentHtml = `
              <div class="kanban-scoping-box">
                <span class="kanban-scoping-badge">Discovery & Meeting</span>
                <p class="kanban-scoping-text">Requirements analysis in progress. Pricing will be calculated in Quote (Devis).</p>
              </div>
              <div class="kanban-card-actions-row">
                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); prepareDevisForProject('${p.id}')">
                  Prepare Quote
                </button>
                <button class="btn btn-secondary btn-sm" style="color: #DC2626; border-color: transparent; padding: 4px 6px;" title="Cancel Project" onclick="event.stopPropagation(); requestCancelProject('${p.id}')">
                  Cancel
                </button>
              </div>
            `;
          } else if (currentStage === 'devis') {
            // Rule 2: Devis stage - Quote draft or approved
            const isApproved = p.devisStatus === 'approved';
            stageContentHtml = `
              <div class="kanban-devis-box">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="badge ${isApproved ? 'badge-green' : 'badge-yellow'}" style="font-size: 0.68rem;">
                    ${isApproved ? 'Quote Approved' : 'Quote Pending'}
                  </span>
                  <strong style="font-size: 0.95rem; color: var(--ink);">${formatDzd(total)} DZD</strong>
                </div>
                ${!isApproved ? `
                  <div class="kanban-card-actions-row" style="margin-top: 6px;">
                    <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); prepareDevisForProject('${p.id}')">
                      Edit Quote
                    </button>
                    <button class="btn btn-primary btn-sm" style="background: #059669; border-color: #059669;" onclick="event.stopPropagation(); approveProjectQuote('${p.id}')">
                      Approve Quote
                    </button>
                    <button class="btn btn-secondary btn-sm" style="color: #DC2626; border-color: transparent; padding: 4px 6px;" title="Cancel Project" onclick="event.stopPropagation(); requestCancelProject('${p.id}')">
                      Cancel
                    </button>
                  </div>
                ` : `
                  <div style="font-size: 0.72rem; color: #059669; font-weight: 600; margin-top: 4px;">
                    Quote signed. Ready for Deposit (50%).
                  </div>
                `}
              </div>
            `;
          } else if (currentStage === 'deposit_50') {
            // Rule 3: 50% deposit required
            stageContentHtml = `
              <div class="kanban-milestone-track">
                <div class="kanban-milestone-bars">
                  <div class="kanban-milestone-bar ${p.m1Paid ? 'paid' : ''}" style="flex: 50;"></div>
                  <div class="kanban-milestone-bar" style="flex: 20;"></div>
                  <div class="kanban-milestone-bar" style="flex: 30;"></div>
                </div>
                <div class="kanban-milestone-labels">
                  <span class="${p.m1Paid ? 'text-paid' : ''}">M1: 50%</span>
                  <span>M2: 20%</span>
                  <span>M3: 30%</span>
                </div>
              </div>
              <div class="kanban-card-financials">
                <div class="kanban-card-price">${formatDzd(total)} <small style="font-size: 0.7rem; color: var(--ink-muted); font-weight: 600;">DZD</small></div>
                <div class="kanban-card-ratio ${p.m1Paid ? 'fully-paid' : ''}">
                  ${p.m1Paid ? '50% Paid' : 'M1 Due: ' + formatDzd(m1Amount) + ' DZD'}
                </div>
              </div>
              ${!p.m1Paid ? `
                <div class="kanban-card-actions-row" style="margin-top: 6px; display: flex; gap: 6px;">
                  <button class="btn btn-primary btn-sm" style="flex: 1; background: #F59E0B; border-color: #F59E0B;" onclick="event.stopPropagation(); openUploadReceiptModal('${p.id}', '${escapeHtml(p.title)}', 'm1')">
                    Upload 50% Receipt
                  </button>
                  <button class="btn btn-secondary btn-sm" style="color: #DC2626; border-color: transparent; padding: 4px 6px;" title="Cancel Project" onclick="event.stopPropagation(); requestCancelProject('${p.id}')">
                    Cancel
                  </button>
                </div>
              ` : `
                <div style="font-size: 0.72rem; color: #059669; font-weight: 600; margin-top: 4px;">
                  Deposit verified. Ready for Design.
                </div>
              `}
            `;
          } else if (currentStage === 'design') {
            // Rule 4: Design in progress, buttons for approval or changes
            stageContentHtml = `
              <div class="kanban-milestone-track">
                <div class="kanban-milestone-bars">
                  <div class="kanban-milestone-bar paid" style="flex: 50;"></div>
                  <div class="kanban-milestone-bar" style="flex: 20;"></div>
                  <div class="kanban-milestone-bar" style="flex: 30;"></div>
                </div>
                <div class="kanban-milestone-labels">
                  <span class="text-paid">50% Paid</span>
                  <span>20% Design</span>
                  <span>30% Delivery</span>
                </div>
              </div>
              <div class="kanban-card-financials">
                <div class="kanban-card-price">${formatDzd(total)} <small style="font-size: 0.7rem; color: var(--ink-muted); font-weight: 600;">DZD</small></div>
                <div style="font-size: 0.72rem; color: #8B5CF6; font-weight: 700;">
                  ${p.designStatus === 'revisions_requested' ? 'Revisions In Progress' : 'Design Mockups'}
                </div>
              </div>
              <div class="kanban-card-actions-row" style="margin-top: 6px;">
                <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); promptDesignReview('${p.id}', false)">
                  Changes
                </button>
                <button class="btn btn-primary btn-sm" style="background: #059669; border-color: #059669;" onclick="event.stopPropagation(); promptDesignReview('${p.id}', true)">
                  Approve Design
                </button>
              </div>
            `;
          } else if (currentStage === 'design_approved_20') {
            // Rule 5: Design approved, M2 20% deposit required
            stageContentHtml = `
              <div class="kanban-milestone-track">
                <div class="kanban-milestone-bars">
                  <div class="kanban-milestone-bar paid" style="flex: 50;"></div>
                  <div class="kanban-milestone-bar ${p.m2Paid ? 'paid' : ''}" style="flex: 20;"></div>
                  <div class="kanban-milestone-bar" style="flex: 30;"></div>
                </div>
                <div class="kanban-milestone-labels">
                  <span class="text-paid">50%</span>
                  <span class="${p.m2Paid ? 'text-paid' : ''}">20%</span>
                  <span>30%</span>
                </div>
              </div>
              <div class="kanban-card-financials">
                <div class="kanban-card-price">${formatDzd(total)} <small style="font-size: 0.7rem; color: var(--ink-muted); font-weight: 600;">DZD</small></div>
                <div class="kanban-card-ratio ${p.m2Paid ? 'fully-paid' : ''}">
                  ${p.m2Paid ? '20% Paid' : 'M2 Due: ' + formatDzd(m2Amount) + ' DZD'}
                </div>
              </div>
              ${!p.m2Paid ? `
                <div class="kanban-card-actions-row" style="margin-top: 6px;">
                  <button class="btn btn-primary btn-sm" style="width: 100%; background: #EC4899; border-color: #EC4899;" onclick="event.stopPropagation(); openUploadReceiptModal('${p.id}', '${escapeHtml(p.title)}', 'm2')">
                    Upload 20% Receipt
                  </button>
                </div>
              ` : `
                <div style="font-size: 0.72rem; color: #059669; font-weight: 600; margin-top: 4px;">
                  M2 Verified. Ready for Development.
                </div>
              `}
            `;
          } else if (currentStage === 'development') {
            // Rule 6: Coding in progress
            stageContentHtml = `
              <div class="kanban-milestone-track">
                <div class="kanban-milestone-bars">
                  <div class="kanban-milestone-bar paid" style="flex: 50;"></div>
                  <div class="kanban-milestone-bar paid" style="flex: 20;"></div>
                  <div class="kanban-milestone-bar" style="flex: 30;"></div>
                </div>
                <div class="kanban-milestone-labels">
                  <span class="text-paid">50% Paid</span>
                  <span class="text-paid">20% Paid</span>
                  <span>30% Due</span>
                </div>
              </div>
              <div class="kanban-card-financials">
                <div class="kanban-card-price">${formatDzd(total)} <small style="font-size: 0.7rem; color: var(--ink-muted); font-weight: 600;">DZD</small></div>
                <div style="font-size: 0.72rem; color: #2563EB; font-weight: 700;">
                  Backend & Frontend
                </div>
              </div>
            `;
          } else if (currentStage === 'security_qa') {
            // Rule 7: QA testing, final 30% receipt needed for delivery
            stageContentHtml = `
              <div class="kanban-milestone-track">
                <div class="kanban-milestone-bars">
                  <div class="kanban-milestone-bar paid" style="flex: 50;"></div>
                  <div class="kanban-milestone-bar paid" style="flex: 20;"></div>
                  <div class="kanban-milestone-bar ${p.m3Paid ? 'paid' : ''}" style="flex: 30;"></div>
                </div>
                <div class="kanban-milestone-labels">
                  <span class="text-paid">50%</span>
                  <span class="text-paid">20%</span>
                  <span class="${p.m3Paid ? 'text-paid' : ''}">30%</span>
                </div>
              </div>
              <div class="kanban-card-financials">
                <div class="kanban-card-price">${formatDzd(total)} <small style="font-size: 0.7rem; color: var(--ink-muted); font-weight: 600;">DZD</small></div>
                <div class="kanban-card-ratio ${p.m3Paid ? 'fully-paid' : ''}">
                  ${p.m3Paid ? '30% Paid' : 'M3 Due: ' + formatDzd(m3Amount) + ' DZD'}
                </div>
              </div>
              ${!p.m3Paid ? `
                <div class="kanban-card-actions-row" style="margin-top: 6px;">
                  <button class="btn btn-primary btn-sm" style="width: 100%; background: #DC2626; border-color: #DC2626;" onclick="event.stopPropagation(); openUploadReceiptModal('${p.id}', '${escapeHtml(p.title)}', 'm3')">
                    Upload 30% Receipt
                  </button>
                </div>
              ` : `
                <div style="font-size: 0.72rem; color: #059669; font-weight: 600; margin-top: 4px;">
                  M3 Verified. Ready for Delivery.
                </div>
              `}
            `;
          } else {
            // Rule 8: Delivered (100% complete)
            stageContentHtml = `
              <div class="kanban-milestone-track">
                <div class="kanban-milestone-bars">
                  <div class="kanban-milestone-bar paid" style="flex: 50;"></div>
                  <div class="kanban-milestone-bar paid" style="flex: 20;"></div>
                  <div class="kanban-milestone-bar paid" style="flex: 30;"></div>
                </div>
                <div class="kanban-milestone-labels">
                  <span class="text-paid">50%</span>
                  <span class="text-paid">20%</span>
                  <span class="text-paid">30%</span>
                </div>
              </div>
              <div class="kanban-card-financials">
                <div class="kanban-card-price">${formatDzd(total)} <small style="font-size: 0.7rem; color: var(--ink-muted); font-weight: 600;">DZD</small></div>
                <div class="kanban-card-ratio fully-paid">
                  100% Paid
                </div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                <span class="badge badge-green" style="font-size: 0.65rem;">Handover Complete</span>
              </div>
            `;
          }

          let deadlineBadgeHtml = '';
          let isUrgentDeadline = false;
          let isOverdue = false;

          if (p.targetDeliveryDate && currentStage !== 'delivered') {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const targetDate = new Date(p.targetDeliveryDate);
            targetDate.setHours(0, 0, 0, 0);
            const diffDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
              isOverdue = true;
              deadlineBadgeHtml = `<span class="badge" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; font-weight: 700; font-size: 0.65rem;">Overdue (${Math.abs(diffDays)}d)</span>`;
            } else if (diffDays <= 3) {
              isUrgentDeadline = true;
              const label = diffDays === 0 ? 'Due Today' : `Due in ${diffDays}d`;
              deadlineBadgeHtml = `<span class="badge" style="background: #FEE2E2; color: #DC2626; border: 1px solid #F87171; font-weight: 700; font-size: 0.65rem;">${label}</span>`;
            } else if (diffDays <= 7) {
              deadlineBadgeHtml = `<span class="badge" style="background: #FEF3C7; color: #D97706; border: 1px solid #FCD34D; font-weight: 600; font-size: 0.65rem;">Due in ${diffDays}d</span>`;
            } else {
              deadlineBadgeHtml = `<span class="badge badge-gray" style="font-size: 0.65rem;">Due: ${formatDateShort(targetDate)}</span>`;
            }
          }

          const cardUrgentStyle = (isOverdue || isUrgentDeadline)
            ? 'border: 1.5px solid #DC2626; box-shadow: 0 0 0 1px #FCA5A5;'
            : '';

          return `
            <div class="kanban-card" 
                 draggable="true" 
                 data-project-id="${p.id}"
                 style="${cardUrgentStyle}"
                 ondragstart="handleKanbanDragStart(event, '${p.id}')"
                 onclick="openProjectDetailsModal('${p.id}')">
              
              <div class="kanban-card-top">
                <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                  <span class="badge ${p.type === 'ecommerce' ? 'badge-purple' : 'badge-cyan'}" style="font-size: 0.65rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.03em;">
                    ${escapeHtml(typeLabel)}
                  </span>
                  ${deadlineBadgeHtml}
                </div>
                <span class="kanban-card-date">${formatDateShort(p.createdAt)}</span>
              </div>

              <div class="kanban-card-title">${escapeHtml(p.title)}</div>

              <div class="kanban-card-client">
                <span>${escapeHtml(company)}</span>
                ${client.wilaya ? `<span class="kanban-card-wilaya">· ${escapeHtml(client.wilaya)}</span>` : ''}
              </div>

              <!-- Stage-Specific Content & Milestones -->
              ${stageContentHtml}

              <!-- Features (Domain, Hosting) -->
              <div class="kanban-card-features">
                ${p.domainIncluded ? '<span class="kanban-feat-pill">Domain</span>' : ''}
                ${p.hostingIncluded ? '<span class="kanban-feat-pill">Hosting</span>' : ''}
              </div>

            </div>
          `;
        }).join('');

    return `
      <div class="kanban-column" 
           data-stage-id="${col.id}"
           ondragover="handleKanbanDragOver(event)"
           ondragleave="handleKanbanDragLeave(event)"
           ondrop="handleKanbanDrop(event, '${col.id}')">
        
        <div class="kanban-column-header" style="border-top: 3px solid ${col.color};">
          <div class="kanban-column-title-box">
            <div class="kanban-column-title-wrap">
              <span class="kanban-column-dot" style="background-color: ${col.color};"></span>
              <span class="kanban-column-title">${col.title}</span>
            </div>
            <span class="kanban-column-count">${colProjects.length}</span>
          </div>
          <div class="kanban-column-subtitle">${col.subtitle}</div>
        </div>

        <div class="kanban-column-cards">
          ${cardsHtml}
        </div>

      </div>
    `;
  }).join('');
}

function handleKanbanDragStart(e, projectId) {
  e.dataTransfer.setData('text/plain', projectId);
  e.dataTransfer.effectAllowed = 'move';
}

function handleKanbanDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function handleKanbanDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

async function handleKanbanDrop(e, targetStage) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const projectId = e.dataTransfer.getData('text/plain');
  if (!projectId || !targetStage) return;

  const p = state.projects.find(x => x.id === projectId);
  if (!p) return;

  const currentStage = normalizeKanbanStage(p.stage);
  if (currentStage === targetStage) return;

  // RULE 0: Sequential step-by-step movement only (no skipping stages, no backward movement)
  const STAGE_ORDER = ['scoping', 'devis', 'deposit_50', 'design', 'design_approved_20', 'development', 'security_qa', 'delivered'];
  const currentIdx = STAGE_ORDER.indexOf(currentStage);
  const targetIdx = STAGE_ORDER.indexOf(targetStage);

  const STAGE_LABELS = {
    scoping: '1. Scoping',
    devis: '2. Devis',
    deposit_50: '3. Deposit (50%)',
    design: '4. Design UI/UX',
    design_approved_20: '5. Design Approved',
    development: '6. Development',
    security_qa: '7. Security & QA',
    delivered: '8. Delivered',
  };

  if (targetIdx !== -1 && currentIdx !== -1) {
    if (targetIdx < currentIdx) {
      showToast('Projects cannot be moved backward to a previous stage.', 'error');
      return;
    }
    if (targetIdx > currentIdx + 1) {
      const nextStageName = STAGE_LABELS[STAGE_ORDER[currentIdx + 1]] || 'the next stage';
      showToast(`Cannot skip stages. Next step for this project is: ${nextStageName}.`, 'error');
      return;
    }
  }

  // RULE 1: Moving from scoping to devis -> Open Quote Creator
  if (targetStage === 'devis') {
    await updateProjectStage(projectId, 'devis');
    prepareDevisForProject(projectId);
    showToast('Project moved to Devis. Please configure quote items and pricing.');
    return;
  }

  // RULE 2: Moving to deposit_50 approves quote automatically
  if (targetStage === 'deposit_50') {
    await updateProjectStage(projectId, 'deposit_50', { devisStatus: 'approved' });
    if (!p.m1Paid) {
      openUploadReceiptModal(p.id, p.title, 'm1');
    }
    return;
  }

  // RULE 3: Cannot move to design unless M1 (50%) receipt is uploaded and verified
  if (targetStage === 'design') {
    if (!p.m1Paid) {
      showToast('First milestone deposit (50%) receipt required before moving to Design.', 'error');
      openUploadReceiptModal(p.id, p.title, 'm1');
      return;
    }
    await updateProjectStage(projectId, 'design');
    return;
  }

  // RULE 4: Moving to design_approved_20 requires Design Review sign-off
  if (targetStage === 'design_approved_20') {
    openDesignReviewModal(p);
    return;
  }

  // RULE 5: Cannot move to development unless M2 (20%) receipt is uploaded and verified
  if (targetStage === 'development') {
    if (!p.m2Paid) {
      showToast('Second milestone payment (20%) receipt required before starting Development.', 'error');
      openUploadReceiptModal(p.id, p.title, 'm2');
      return;
    }
    await updateProjectStage(projectId, 'development');
    return;
  }

  // RULE 6: Moving to security_qa is standard
  if (targetStage === 'security_qa') {
    await updateProjectStage(projectId, 'security_qa');
    return;
  }

  // RULE 7: Cannot move to delivered unless M3 (30%) final handover receipt is uploaded
  if (targetStage === 'delivered') {
    if (!p.m3Paid) {
      showToast('Final handover payment (30%) receipt required before marking Delivered.', 'error');
      openUploadReceiptModal(p.id, p.title, 'm3');
      return;
    }
    await updateProjectStage(projectId, 'delivered');
    return;
  }

  await updateProjectStage(projectId, targetStage);
}

// ==========================================
// KANBAN TRASH DROPZONE & PROJECT CANCELLATION
// ==========================================
function handleTrashDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  const dropzone = document.getElementById('kanban-trash-dropzone');
  if (dropzone) dropzone.classList.add('drag-over');
}

function handleTrashDragLeave(e) {
  const dropzone = document.getElementById('kanban-trash-dropzone');
  if (dropzone) dropzone.classList.remove('drag-over');
}

async function handleTrashDrop(e) {
  e.preventDefault();
  const dropzone = document.getElementById('kanban-trash-dropzone');
  if (dropzone) dropzone.classList.remove('drag-over');

  const projectId = e.dataTransfer.getData('text/plain');
  if (!projectId) return;

  await requestCancelProject(projectId);
}

async function requestCancelProject(projectId) {
  const p = state.projects.find(x => x.id === projectId);
  if (!p) return;

  const currentStage = normalizeKanbanStage(p.stage);

  if (!['scoping', 'devis', 'deposit_50'].includes(currentStage)) {
    showToast('Only projects in Scoping, Devis, or pending Deposit can be cancelled.', 'error');
    return;
  }

  if (currentStage === 'deposit_50' && p.m1Paid) {
    showToast('Cannot cancel: 50% deposit has already been verified.', 'error');
    return;
  }

  const stageLabel = currentStage === 'scoping' ? '1. Scoping' : (currentStage === 'devis' ? '2. Devis' : '3. Deposit (50%)');
  const confirmMsg = `Cancel project "${p.title}"?\n\nIt will be moved out of the active pipeline and archived in History at the ${stageLabel} stage.`;
  if (!confirm(confirmMsg)) {
    return;
  }

  try {
    const res = await fetch(`/api/projects/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' })
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to cancel project');
    }

    showToast(`Project "${p.title}" cancelled and archived to History.`);
    await fetchProjects();
    await fetchStats();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Quote Gate & Approval Functions
async function approveProjectQuote(projectId) {
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ devisStatus: 'approved' }),
    });
    if (!res.ok) throw new Error('Could not approve quote');
    showToast('Quote approved by client successfully.');
    await fetchProjects();
    await fetchStats();
    await fetchInvoices();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function showQuoteGateModal(project) {
  document.getElementById('quote-gate-project-id').value = project.id;
  document.getElementById('quote-gate-project-name').textContent = project.title;
  openModal('quote-gate-modal');
}

async function handleQuoteGateApprove() {
  const projectId = document.getElementById('quote-gate-project-id').value;
  if (!projectId) return;
  closeModal('quote-gate-modal');
  await approveProjectQuote(projectId);
  await updateProjectStage(projectId, 'deposit_50');
  const p = state.projects.find(x => x.id === projectId);
  if (p && !p.m1Paid) {
    openUploadReceiptModal(p.id, p.title, 'm1');
  }
}

function handleQuoteGateEdit() {
  const projectId = document.getElementById('quote-gate-project-id').value;
  closeModal('quote-gate-modal');
  if (projectId) prepareDevisForProject(projectId);
}

// Design Review & Sign-Off Functions
function openDesignReviewModal(project) {
  document.getElementById('design-review-project-id').value = project.id;
  document.getElementById('design-review-project-name').textContent = project.title;
  openModal('design-review-modal');
}

async function handleDesignReviewDecision(isApproved) {
  const projectId = document.getElementById('design-review-project-id').value;
  if (!projectId) return;
  closeModal('design-review-modal');
  await promptDesignReview(projectId, isApproved);
}

async function promptDesignReview(projectId, isApproved) {
  const p = state.projects.find(x => x.id === projectId);
  if (!p) return;

  try {
    if (isApproved) {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designStatus: 'approved',
          stage: 'design_approved_20',
        }),
      });
      if (!res.ok) throw new Error('Could not update design status');
      showToast('Design approved by client. Milestone 2 (20%) deposit now due.');
      await fetchProjects();
      await fetchStats();
      if (!p.m2Paid) {
        openUploadReceiptModal(p.id, p.title, 'm2');
      }
    } else {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designStatus: 'revisions_requested',
        }),
      });
      if (!res.ok) throw new Error('Could not update design status');
      showToast('Design changes requested. Project kept in UI/UX Design stage.');
      await fetchProjects();
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Backward-compatibility wrapper for any table calls
function renderProjectsTable(projects) {
  renderProjectsKanban(projects);
}

// 3. Clients Table
function renderClientsTable(clients) {
  const tbody = document.getElementById('clients-table-tbody');
  if (!tbody) return;

  if (clients.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--ink-muted); padding: 32px;">No clients registered.</td></tr>`;
    return;
  }

  tbody.innerHTML = clients.map(c => `
    <tr>
      <td>
        <strong style="color: var(--ink); font-size: 0.95rem;">${escapeHtml(c.companyName)}</strong>
      </td>
      <td>
        <div style="font-weight: 600; color: var(--ink);">${escapeHtml(c.contactName || 'Primary Contact')}</div>
        ${c.phone ? `
          <div style="margin-top: 3px;">
            <a href="${formatWhatsAppUrl(c.phone)}" target="_blank" rel="noopener noreferrer" class="phone-link" title="Open WhatsApp: ${escapeHtml(c.phone)}">
              ${escapeHtml(c.phone)}
            </a>
          </div>
        ` : ''}
      </td>
      <td>${escapeHtml(c.industry || '-')}</td>
      <td>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button class="btn btn-secondary btn-sm" onclick="openNewProjectForClient('${c.id}')">+ Project</button>
          <button class="btn btn-sm" style="background: transparent; color: #dc2626; border: 1px solid #fecaca; font-weight: 500;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'" onclick="deleteClient('${c.id}', '${escapeHtml(c.companyName)}')">
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function deleteClient(id, name) {
  if (!confirm(`Are you sure you want to delete client "${name}"?`)) return;

  try {
    const res = await fetch(`/api/clients/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete client');
    showToast(`Client "${name}" deleted.`);
    await fetchClients();
    await fetchStats();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// 4. Leads Table
function renderLeadsTable(leads) {
  const tbody = document.getElementById('leads-table-tbody');
  if (!tbody) return;

  const activeLeads = (leads || []).filter(l => l.status !== 'converted');

  if (activeLeads.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--ink-muted); padding: 32px;">No inquiries received yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = activeLeads.map(l => {
    const dateStr = l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-GB') : '-';
    return `
      <tr>
        <td><strong style="color: var(--ink);">${escapeHtml(l.name)}</strong></td>
        <td>
          ${l.phone ? `<a href="${formatWhatsAppUrl(l.phone)}" target="_blank" rel="noopener noreferrer" class="phone-link" title="Open WhatsApp: ${escapeHtml(l.phone)}">${escapeHtml(l.phone)}</a>` : '-'}
        </td>
        <td><span class="badge badge-cyan">${escapeHtml(l.activity)}</span></td>
        <td style="max-width: 280px; font-size: 0.82rem; color: var(--ink);">
          ${escapeHtml(l.problemDescription || l.selectedChallenge || '-')}
        </td>
        <td>
          <span class="badge ${l.status === 'new' ? 'badge-yellow' : 'badge-green'}">
            ${escapeHtml(l.status)}
          </span>
        </td>
        <td><small style="color: var(--ink-muted);">${dateStr}</small></td>
        <td>
          <div style="display: flex; gap: 6px; align-items: center;">
            <button class="btn btn-primary btn-sm" onclick="convertLeadToClient('${l.id}')">
              Convert to Client
            </button>
            <button class="btn btn-sm" style="background: transparent; color: #dc2626; border: 1px solid #fecaca; font-weight: 500;" onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='transparent'" onclick="deleteLead('${l.id}', '${escapeHtml(l.name)}')">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

async function deleteLead(id, name) {
  if (!confirm(`Are you sure you want to delete lead "${name}"?`)) return;

  try {
    const res = await fetch(`/api/leads/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete lead');
    showToast(`Lead "${name}" deleted.`);
    await fetchLeads();
    await fetchStats();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ==========================================
// 5. UNIFIED HISTORY & AUDIT LOGS
// ==========================================

function switchHistoryCategory(category) {
  if (category !== 'projects' && category !== 'leads') {
    category = 'projects';
  }
  state.historyCategory = category;

  // Toggle active class on pills
  const pills = document.querySelectorAll('#history-category-pills .filter-pill');
  pills.forEach(pill => {
    pill.classList.toggle('active', pill.dataset.category === category);
  });

  // Toggle visible category section
  const pSection = document.getElementById('history-cat-projects');
  const lSection = document.getElementById('history-cat-leads');

  if (pSection) pSection.style.display = (category === 'projects') ? 'block' : 'none';
  if (lSection) lSection.style.display = (category === 'leads') ? 'block' : 'none';

  renderHistoryView();
}

function filterHistoryProjectsByStage(stage) {
  state.historyStageFilter = stage;

  const pills = document.querySelectorAll('#history-stage-pills .filter-pill');
  pills.forEach(pill => {
    pill.classList.toggle('active', pill.dataset.stage === stage);
  });

  renderHistoryProjectsTable();
}

function filterHistorySearch(query) {
  state.historySearchQuery = (query || '').toLowerCase().trim();
  renderHistoryView();
}

function renderHistoryView() {
  renderHistoryProjectsTable();
}

// Category 1: Projects History (Scoping & Above, with Stage Filter)
function renderHistoryProjectsTable() {
  const tbody = document.getElementById('history-projects-tbody');
  if (!tbody) return;

  const projects = Array.isArray(state.projects) ? state.projects : [];
  const stageFilter = state.historyStageFilter || 'all';
  const query = state.historySearchQuery || '';

  const filtered = projects.filter(p => {
    const normStage = normalizeKanbanStage(p.stage);
    const isCancelled = p.status === 'cancelled';

    if (stageFilter === 'cancelled') {
      if (!isCancelled) return false;
    } else if (stageFilter !== 'all') {
      if (normStage !== stageFilter) return false;
    }

    if (query) {
      const client = p.client || {};
      const clientName = (client.companyName || client.fullName || '').toLowerCase();
      const title = (p.title || '').toLowerCase();
      const type = (p.type || '').toLowerCase();
      if (!title.includes(query) && !clientName.includes(query) && !type.includes(query)) {
        return false;
      }
    }

    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--ink-muted); padding: 40px;">
          No projects found matching the selected filter.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(p => {
    const client = p.client || {};
    const clientDisplay = escapeHtml(client.companyName || client.fullName || 'Client');
    const clientWilaya = escapeHtml(client.wilaya || 'DZ');
    const normStage = normalizeKanbanStage(p.stage);
    const isCancelled = p.status === 'cancelled';
    const stageBadgeHtml = getStageBadge(p.stage) + (isCancelled
      ? ' <span class="badge" style="background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5; font-size: 0.65rem; margin-left: 4px;">Cancelled</span>'
      : '');
    const totalPrice = Number(p.priceTotalDzd) || 0;
    const priceDisplay = (normStage === 'scoping' && totalPrice === 0)
      ? '<span style="color: var(--ink-muted); font-size: 0.8rem; font-style: italic;">Scoping / To Quote</span>'
      : `<strong style="color: var(--ink);">${formatDzd(totalPrice)}</strong>`;

    const m1Status = p.m1Paid
      ? '<span class="badge badge-green" style="font-size: 0.68rem;" title="M1 50% Verified">M1 50%</span>'
      : '<span class="badge badge-gray" style="font-size: 0.68rem;" title="M1 Pending">M1 Pending</span>';

    const m2Status = p.m2Paid
      ? '<span class="badge badge-blue" style="font-size: 0.68rem;" title="M2 20% Verified">M2 20%</span>'
      : '<span class="badge badge-gray" style="font-size: 0.68rem;" title="M2 Pending">M2 Pending</span>';

    const m3Status = p.m3Paid
      ? '<span class="badge badge-purple" style="font-size: 0.68rem;" title="M3 30% Verified">M3 30%</span>'
      : '<span class="badge badge-gray" style="font-size: 0.68rem;" title="M3 Pending">M3 Pending</span>';

    const milestonesDisplay = isCancelled && !p.m1Paid
      ? '<span class="badge" style="background: #FEE2E2; color: #DC2626; font-size: 0.68rem;">Cancelled pre-kickoff</span>'
      : `
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">
          ${m1Status}
          ${m2Status}
          ${m3Status}
        </div>
      `;

    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--ink); font-size: 0.88rem;">${escapeHtml(p.title)}</div>
          <div style="font-size: 0.75rem; color: var(--ink-muted); margin-top: 2px;">${clientDisplay} · ${clientWilaya}</div>
        </td>
        <td>
          <span class="badge" style="background: var(--surface); border: 1px solid var(--border); font-size: 0.72rem; text-transform: uppercase;">${escapeHtml(p.type || 'Custom')}</span>
        </td>
        <td>${stageBadgeHtml}</td>
        <td>${priceDisplay}</td>
        <td>
          ${milestonesDisplay}
        </td>
        <td><small style="color: var(--ink-muted);">${formatDateShort(p.createdAt)}</small></td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="openProjectDetailsModal('${p.id}')">Details</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Category 2: Leads History
function renderHistoryLeadsTable() {
  const tbody = document.getElementById('history-leads-tbody');
  if (!tbody) return;

  const leads = Array.isArray(state.leads) ? state.leads : [];
  const query = state.historySearchQuery || '';

  const filtered = leads.filter(l => {
    if (!query) return true;
    const name = (l.name || '').toLowerCase();
    const phone = (l.phone || '').toLowerCase();
    const activity = (l.activity || '').toLowerCase();
    const problem = (l.problemDescription || l.selectedChallenge || '').toLowerCase();
    return name.includes(query) || phone.includes(query) || activity.includes(query) || problem.includes(query);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--ink-muted); padding: 40px;">
          No leads found matching the search.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(l => {
    return `
      <tr>
        <td>
          <strong style="color: var(--ink); font-size: 0.88rem;">${escapeHtml(l.name)}</strong>
          ${l.selectedChallenge ? `<div style="font-size: 0.72rem; color: var(--ink-muted); margin-top: 2px;">${escapeHtml(l.selectedChallenge)}</div>` : ''}
        </td>
        <td>
          ${l.phone ? `<a href="${formatWhatsAppUrl(l.phone)}" target="_blank" rel="noopener noreferrer" class="phone-link" style="font-weight: 600;" title="Open WhatsApp: ${escapeHtml(l.phone)}">${escapeHtml(l.phone)}</a>` : '<span style="color: var(--ink-muted);">-</span>'}
        </td>
        <td>
          <span class="badge badge-cyan" style="font-size: 0.72rem;">${escapeHtml(l.activity || 'General')}</span>
        </td>
        <td>
          <span class="badge" style="background: var(--surface); border: 1px solid var(--border); font-size: 0.72rem;">Website</span>
        </td>
        <td>
          <span class="badge ${l.status === 'new' ? 'badge-yellow' : 'badge-green'}" style="font-size: 0.72rem;">
            ${escapeHtml(l.status || 'new')}
          </span>
        </td>
        <td><small style="color: var(--ink-muted);">${formatDateShort(l.createdAt)}</small></td>
      </tr>
    `;
  }).join('');
}

// Category 3: Receipts & Quotes History
function renderHistoryFinancials() {
  // 1. Receipts Grid
  const receiptsGrid = document.getElementById('history-receipts-grid');
  if (receiptsGrid) {
    const receipts = [];
    const query = state.historySearchQuery || '';

    for (const p of state.projects) {
      const clientName = p.client ? (p.client.companyName || p.client.fullName || 'Client') : 'Client';
      if (p.m1Paid && p.m1ReceiptUrl) {
        receipts.push({ projectTitle: p.title, clientName, milestone: 'Deposit (50%)', url: p.m1ReceiptUrl, date: p.m1PaidAt });
      }
      if (p.m2Paid && p.m2ReceiptUrl) {
        receipts.push({ projectTitle: p.title, clientName, milestone: 'Design (20%)', url: p.m2ReceiptUrl, date: p.m2PaidAt });
      }
      if (p.m3Paid && p.m3ReceiptUrl) {
        receipts.push({ projectTitle: p.title, clientName, milestone: 'Delivery (30%)', url: p.m3ReceiptUrl, date: p.m3PaidAt });
      }
    }

    const filteredReceipts = receipts.filter(r => {
      if (!query) return true;
      return r.projectTitle.toLowerCase().includes(query) || r.clientName.toLowerCase().includes(query) || r.milestone.toLowerCase().includes(query);
    });

    if (filteredReceipts.length === 0) {
      receiptsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 32px; text-align: center; background: var(--paper); border: 1px dashed var(--border); border-radius: var(--radius-md);">
          <p style="color: var(--ink-muted); font-size: 0.88rem; margin: 0;">No verified payment receipts found.</p>
        </div>
      `;
    } else {
      receiptsGrid.innerHTML = filteredReceipts.map(r => `
        <div class="receipt-card">
          <img src="${r.url}" alt="Receipt" loading="lazy" onclick="viewReceipt('${escapeHtml(r.projectTitle)} - ${r.milestone}', '${r.url}')">
          <div class="receipt-card-body">
            <strong style="font-size: 0.85rem; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block;">${escapeHtml(r.projectTitle)}</strong>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; margin-top: 4px;">
              <span style="color: var(--ink-muted);">${escapeHtml(r.clientName)}</span>
              <span class="badge badge-green" style="font-size: 0.65rem;">${r.milestone}</span>
            </div>
            <a href="${r.url}" target="_blank" style="font-size: 0.72rem; color: var(--cyan-dark); text-decoration: none; margin-top: 6px; display: inline-block;">View Full Image</a>
          </div>
        </div>
      `).join('');
    }
  }

  // 2. Invoices & Quotes Table
  const invoicesTbody = document.getElementById('history-invoices-tbody');
  if (invoicesTbody) {
    const invoices = Array.isArray(state.invoices) ? state.invoices : [];
    const query = state.historySearchQuery || '';

    const filteredInvoices = invoices.filter(inv => {
      if (!query) return true;
      const num = (inv.invoiceNumber || '').toLowerCase();
      const proj = state.projects.find(p => p.id === inv.projectId);
      const projTitle = (proj ? proj.title : '').toLowerCase();
      const client = state.clients.find(c => c.id === inv.clientId);
      const clientName = (client ? (client.companyName || client.fullName || '') : '').toLowerCase();
      return num.includes(query) || projTitle.includes(query) || clientName.includes(query);
    });

    if (filteredInvoices.length === 0) {
      invoicesTbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--ink-muted); padding: 32px;">
            No quotation records found.
          </td>
        </tr>
      `;
    } else {
      invoicesTbody.innerHTML = filteredInvoices.map(inv => {
        const proj = state.projects.find(p => p.id === inv.projectId);
        const client = state.clients.find(c => c.id === inv.clientId) || (proj ? proj.client : null);
        const clientDisplay = escapeHtml(client ? (client.companyName || client.fullName || 'Client') : 'Client');
        const projTitle = escapeHtml(proj ? proj.title : 'Project');
        const total = Number(inv.totalAmountDzd) || 0;
        const statusBadge = (inv.status === 'accepted' || inv.status === 'approved')
          ? '<span class="badge badge-green" style="font-size: 0.72rem;">Approved</span>'
          : '<span class="badge badge-yellow" style="font-size: 0.72rem;">Draft</span>';

        return `
          <tr>
            <td>
              <strong style="color: var(--ink); font-family: monospace; font-size: 0.85rem;">${escapeHtml(inv.invoiceNumber || 'DEV')}</strong>
            </td>
            <td>
              <div style="font-weight: 600; color: var(--ink); font-size: 0.85rem;">${clientDisplay}</div>
              <div style="font-size: 0.75rem; color: var(--ink-muted);">${projTitle}</div>
            </td>
            <td>
              <strong style="color: var(--cyan-dark);">${formatDzd(total)}</strong>
            </td>
            <td>${statusBadge}</td>
            <td><small style="color: var(--ink-muted);">${formatDateShort(inv.createdAt)}</small></td>
            <td style="text-align: right;">
              <button class="btn btn-secondary btn-sm" onclick="downloadInvoicePdf('${inv.id}')">Download PDF</button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }
}

// Download PDF for historical invoice
function downloadInvoicePdf(invoiceId, action = 'save') {
  const inv = (state.invoices || []).find(x => x.id === invoiceId);
  if (!inv) {
    showToast('Quote record not found', 'error');
    return;
  }
  const proj = (state.projects || []).find(p => p.id === inv.projectId);
  const client = (state.clients || []).find(c => c.id === inv.clientId) || (proj ? proj.client : null);

  const numEl = document.getElementById('devis-view-number');
  if (numEl) numEl.textContent = `DEVIS N° ${inv.invoiceNumber || 'DEV-2026'}`;

  const dateEl = document.getElementById('devis-view-date');
  if (dateEl) dateEl.textContent = formatDateShort(inv.createdAt);

  const clientNameEl = document.getElementById('devis-view-client-name');
  if (clientNameEl) clientNameEl.textContent = client ? (client.companyName || client.fullName) : 'Client';

  const clientContactEl = document.getElementById('devis-view-client-contact');
  if (clientContactEl) clientContactEl.textContent = client ? `${client.wilaya || 'Algeria'} · ${client.phone || ''}` : '-';

  const projTitleEl = document.getElementById('devis-view-project-title');
  if (projTitleEl) projTitleEl.textContent = proj ? proj.title : 'Web Application';

  const domainEl = document.getElementById('devis-view-domain');
  if (domainEl) {
    domainEl.textContent = inv.domainIncluded ? 'Domain name included' : 'Domain name excluded';
    domainEl.style.color = inv.domainIncluded ? '#059669' : '#B45309';
  }

  const hostingEl = document.getElementById('devis-view-hosting');
  if (hostingEl) {
    hostingEl.textContent = inv.hostingIncluded ? 'Hosting & SSL included' : 'Hosting & SSL excluded';
    hostingEl.style.color = inv.hostingIncluded ? '#059669' : '#B45309';
  }

  const deadlineEl = document.getElementById('devis-view-deadline-val');
  if (deadlineEl) {
    const dVal = inv.dueDate || (proj ? proj.targetDeliveryDate : null);
    if (dVal) {
      const d = new Date(dVal);
      deadlineEl.textContent = !isNaN(d.getTime()) ? d.toLocaleDateString('en-GB') : String(dVal);
    } else {
      deadlineEl.textContent = 'To be scheduled';
    }
  }

  const items = Array.isArray(inv.itemsJson) ? inv.itemsJson : [];
  const tbody = document.getElementById('devis-view-items-tbody');
  let total = 0;
  if (tbody) {
    tbody.innerHTML = items.map(it => {
      const p = Number(it.priceDzd || it.price || 0);
      total += p;
      return `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid var(--border);">${escapeHtml(it.description || it.title || 'Item')}</td>
          <td style="padding: 10px 14px; text-align: right; border-bottom: 1px solid var(--border); font-weight: 700;">${formatDzd(p)}</td>
        </tr>
      `;
    }).join('');
  }

  const totalAmount = Number(inv.totalAmountDzd) || total;
  const m1 = Number(inv.m1DepositDzd) || Math.round(totalAmount * 0.5);
  const m2 = Number(inv.m2DesignDzd) || Math.round(totalAmount * 0.2);
  const m3 = Number(inv.m3DeliveryDzd) || (totalAmount - m1 - m2);

  const totalEl = document.getElementById('devis-view-total');
  if (totalEl) totalEl.textContent = formatDzd(totalAmount);

  const m1El = document.getElementById('devis-view-m1');
  if (m1El) m1El.textContent = formatDzd(m1);

  const m2El = document.getElementById('devis-view-m2');
  if (m2El) m2El.textContent = formatDzd(m2);

  const m3El = document.getElementById('devis-view-m3');
  if (m3El) m3El.textContent = formatDzd(m3);

  exportDevisPdf(action);
}

// Export modal quote directly as PDF
function exportModalDevisPdf() {
  const clientName = (document.getElementById('modal-devis-client-name')?.value || 'Client').trim();
  const projectTitle = (document.getElementById('modal-devis-project-title')?.value || 'Web Application').trim();
  const domainIncluded = Boolean(document.getElementById('modal-devis-domain-check')?.checked);
  const hostingIncluded = Boolean(document.getElementById('modal-devis-hosting-check')?.checked);

  const validItems = modalDevisItems.filter(i => (i.title && i.title.trim().length > 0) || Number(i.price) > 0);
  if (validItems.length === 0) {
    showToast('Please add at least one line item deliverable.', 'error');
    return;
  }

  const clientNameEl = document.getElementById('devis-view-client-name');
  if (clientNameEl) clientNameEl.textContent = clientName;

  const clientContactEl = document.getElementById('devis-view-client-contact');
  if (clientContactEl) clientContactEl.textContent = 'Algeria';

  const projTitleEl = document.getElementById('devis-view-project-title');
  if (projTitleEl) projTitleEl.textContent = projectTitle;

  const dateEl = document.getElementById('devis-view-date');
  if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-GB');

  const domainEl = document.getElementById('devis-view-domain');
  if (domainEl) {
    domainEl.textContent = domainIncluded ? 'Domain name included' : 'Domain name excluded';
    domainEl.style.color = domainIncluded ? '#059669' : '#B45309';
  }

  const hostingEl = document.getElementById('devis-view-hosting');
  if (hostingEl) {
    hostingEl.textContent = hostingIncluded ? 'Hosting & SSL included' : 'Hosting & SSL excluded';
    hostingEl.style.color = hostingIncluded ? '#059669' : '#B45309';
  }

  const deadline = document.getElementById('modal-devis-deadline')?.value;
  const deadlineEl = document.getElementById('devis-view-deadline-val');
  if (deadlineEl) {
    if (deadline) {
      const d = new Date(deadline);
      deadlineEl.textContent = !isNaN(d.getTime()) ? d.toLocaleDateString('en-GB') : deadline;
    } else {
      deadlineEl.textContent = 'To be scheduled';
    }
  }

  let total = 0;
  const tbody = document.getElementById('devis-view-items-tbody');
  if (tbody) {
    tbody.innerHTML = validItems.map(it => {
      const p = Number(it.price) || 0;
      total += p;
      return `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid var(--border);">${escapeHtml(it.title || 'Item')}</td>
          <td style="padding: 10px 14px; text-align: right; border-bottom: 1px solid var(--border); font-weight: 700;">${formatDzd(p)}</td>
        </tr>
      `;
    }).join('');
  }

  const m1 = Math.round(total * 0.5);
  const m2 = Math.round(total * 0.2);
  const m3 = total - m1 - m2;

  const totalEl = document.getElementById('devis-view-total');
  if (totalEl) totalEl.textContent = formatDzd(total);

  const m1El = document.getElementById('devis-view-m1');
  if (m1El) m1El.textContent = formatDzd(m1);

  const m2El = document.getElementById('devis-view-m2');
  if (m2El) m2El.textContent = formatDzd(m2);

  const m3El = document.getElementById('devis-view-m3');
  if (m3El) m3El.textContent = formatDzd(m3);

  exportDevisPdf();
}

// Alias for backwards compatibility
function renderStorageExplorer() {
  renderHistoryFinancials();
}

// ==========================================
// DEVIS GENERATOR (TRI-LINGUAL)
// ==========================================
function setDevisLanguage(lang) {
  if (!['en', 'fr', 'ar'].includes(lang)) return;
  state.devisLang = lang;

  document.querySelectorAll('.lang-btn-group .lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  renderDevisLive();
}

function renderDevisRows() {
  const container = document.getElementById('devis-items-inputs');
  if (!container) return;

  container.innerHTML = state.devisItems.map((item, idx) => `
    <div style="display: flex; gap: 6px; align-items: center;">
      <input type="text" value="${escapeHtml(item.title)}" placeholder="Description" style="flex: 2; padding: 6px 10px; font-size: 0.8rem;" oninput="updateDevisItem(${idx}, 'title', this.value)">
      <input type="number" value="${item.price}" placeholder="DZD" style="width: 100px; padding: 6px 10px; font-size: 0.8rem;" oninput="updateDevisItem(${idx}, 'price', this.value)">
      <button type="button" class="btn btn-secondary btn-sm" style="padding: 4px 8px; color: #DC2626;" onclick="removeDevisItemRow(${idx})">x</button>
    </div>
  `).join('');
}

function updateDevisItem(index, field, val) {
  if (!state.devisItems[index]) return;
  if (field === 'price') {
    state.devisItems[index].price = Number(val) || 0;
  } else {
    state.devisItems[index].title = val;
  }
  renderDevisLive();
}

function addDevisItemRow() {
  state.devisItems.push({ title: 'New Deliverable', price: 20000 });
  renderDevisRows();
  renderDevisLive();
}

function removeDevisItemRow(idx) {
  if (state.devisItems.length <= 1) {
    showToast('Quote must contain at least one item.', 'error');
    return;
  }
  state.devisItems.splice(idx, 1);
  renderDevisRows();
  renderDevisLive();
}

function renderDevisLive() {
  const i18n = DEVIS_I18N[state.devisLang] || DEVIS_I18N.en;

  const printableArea = document.getElementById('devis-printable-area');
  if (printableArea) {
    printableArea.setAttribute('dir', i18n.dir);
  }

  document.getElementById('devis-brand-tagline').textContent = i18n.tagline;
  document.getElementById('devis-label-date').textContent = i18n.labelDate;
  document.getElementById('devis-label-validity').textContent = i18n.labelValidity;
  document.getElementById('devis-view-validity-val').textContent = i18n.validityVal;
  document.getElementById('devis-label-issuer').textContent = i18n.labelIssuer;
  document.getElementById('devis-label-founder').textContent = i18n.founder;
  document.getElementById('devis-label-client').textContent = i18n.labelClient;
  document.getElementById('devis-th-desc').textContent = i18n.thDesc;
  document.getElementById('devis-th-amount').textContent = i18n.thAmount;
  document.getElementById('devis-label-total').textContent = i18n.labelTotal;
  document.getElementById('devis-schedule-title').textContent = i18n.scheduleTitle;
  document.getElementById('devis-m1-title').textContent = i18n.m1Title;
  document.getElementById('devis-m1-sub').textContent = i18n.m1Sub;
  document.getElementById('devis-m2-title').textContent = i18n.m2Title;
  document.getElementById('devis-m2-sub').textContent = i18n.m2Sub;
  document.getElementById('devis-m3-title').textContent = i18n.m3Title;
  document.getElementById('devis-m3-sub').textContent = i18n.m3Sub;
  document.getElementById('devis-payment-heading').textContent = i18n.payHeading;
  document.getElementById('devis-label-beneficiary').textContent = i18n.beneficiary;
  document.getElementById('devis-receipt-instruction').textContent = i18n.instruction;

  const clientNameInput = document.getElementById('devis-client-name');
  const clientContactInput = document.getElementById('devis-client-contact');
  const projectTitleInput = document.getElementById('devis-project-title');
  const domainCheck = document.getElementById('devis-domain-check');
  const hostingCheck = document.getElementById('devis-hosting-check');

  const clientName = clientNameInput ? clientNameInput.value || 'Client Name' : 'Client Name';
  const clientContact = clientContactInput ? clientContactInput.value || '-' : '-';
  const projectTitle = projectTitleInput ? projectTitleInput.value || 'Custom Web Application' : 'Custom Web Application';

  document.getElementById('devis-view-client-name').textContent = clientName;
  document.getElementById('devis-view-client-contact').textContent = clientContact;
  document.getElementById('devis-view-project-title').textContent = projectTitle;

  const domainEl = document.getElementById('devis-view-domain');
  if (domainEl) {
    if (domainCheck && domainCheck.checked) {
      domainEl.textContent = i18n.domainInc;
      domainEl.style.color = '#059669';
    } else {
      domainEl.textContent = i18n.domainExc;
      domainEl.style.color = '#B45309';
    }
  }

  const hostingEl = document.getElementById('devis-view-hosting');
  if (hostingEl) {
    if (hostingCheck && hostingCheck.checked) {
      hostingEl.textContent = i18n.hostingInc;
      hostingEl.style.color = '#059669';
    } else {
      hostingEl.textContent = i18n.hostingExc;
      hostingEl.style.color = '#B45309';
    }
  }

  let total = 0;
  const tbody = document.getElementById('devis-view-items-tbody');
  if (tbody) {
    tbody.innerHTML = state.devisItems.map(item => {
      total += (Number(item.price) || 0);
      return `
        <tr>
          <td style="padding: 10px 14px; font-size: 0.88rem;">${escapeHtml(item.title)}</td>
          <td style="padding: 10px 14px; text-align: ${i18n.dir === 'rtl' ? 'left' : 'right'}; font-weight: 700; font-size: 0.88rem;">${formatDzd(item.price)} DZD</td>
        </tr>
      `;
    }).join('');
  }

  const m1 = Math.round(total * 0.50);
  const m2 = Math.round(total * 0.20);
  const m3 = total - m1 - m2;

  document.getElementById('devis-view-total').textContent = `${formatDzd(total)} DZD`;
  document.getElementById('devis-view-m1').textContent = `${formatDzd(m1)} DZD`;
  document.getElementById('devis-view-m2').textContent = `${formatDzd(m2)} DZD`;
  document.getElementById('devis-view-m3').textContent = `${formatDzd(m3)} DZD`;

  const d = new Date();
  document.getElementById('devis-view-date').textContent = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

function onDevisClientChange() {
  const select = document.getElementById('devis-client-select');
  if (!select) return;
  const clientId = select.value;
  const client = state.clients.find(c => c.id === clientId);
  if (client) {
    document.getElementById('devis-client-name').value = client.companyName;
    document.getElementById('devis-client-contact').value = `${client.wilaya || 'Algeria'} - ${client.phone} - ${client.contactName}`;
    renderDevisLive();
  }
}

async function saveDevisToDb() {
  try {
    const select = document.getElementById('devis-client-select');
    const clientId = select ? select.value : '';
    if (!clientId) {
      showToast('Please select a client from the dropdown first.', 'error');
      return;
    }

    const proj = state.projects.find(p => p.clientId === clientId) || state.projects[0];
    if (!proj) {
      showToast('Please create a project for this client before saving the quote.', 'error');
      return;
    }

    const payload = {
      projectId: proj.id,
      clientId: clientId,
      items: state.devisItems.map(i => ({ description: i.title, priceDzd: i.price })),
      domainIncluded: document.getElementById('devis-domain-check').checked,
      hostingIncluded: document.getElementById('devis-hosting-check').checked,
      notes: document.getElementById('devis-project-title').value,
    };

    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Failed to save quote');
    const invoice = await res.json();
    document.getElementById('devis-view-number').textContent = `DEVIS N° ${invoice.invoiceNumber}`;
    showToast(`Quote ${invoice.invoiceNumber} saved successfully.`);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function exportDevisPdf(action = 'save') {
  const element = document.getElementById('devis-printable-area');
  if (!element) {
    showToast('Quote sheet not found', 'error');
    return;
  }

  const clientName = (document.getElementById('devis-view-client-name')?.textContent || 'Client').trim().replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
  const quoteNum = (document.getElementById('devis-view-number')?.textContent || 'DEV').trim().replace(/[^a-zA-Z0-9_-]/g, '');
  const filename = `${quoteNum}_${clientName}.pdf`;

  if (typeof html2pdf === 'undefined') {
    window.print();
    return;
  }

  showToast('Preparing Devis PDF file...');

  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  const worker = html2pdf().set(opt).from(element);
  if (action === 'open') {
    worker.output('bloburl').then((blobUrl) => {
      const opened = window.open(blobUrl, '_blank');
      if (!opened) {
        worker.save().then(() => showToast('Devis PDF saved to Downloads.'));
      } else {
        showToast('Devis PDF document opened.');
      }
    }).catch(err => {
      console.error('PDF export error:', err);
      worker.save();
    });
  } else {
    worker.save().then(() => {
      showToast('PDF file saved successfully to Downloads.');
    }).catch(err => {
      console.error('PDF export error:', err);
      window.print();
    });
  }
}

// In-Context Project Devis Creator (Without leaving the Projects Pipeline)
let modalDevisItems = [];

function openProjectDevisModal(projectId) {
  const p = state.projects.find(x => x.id === projectId);
  if (!p) return;

  const client = p.client || {};
  const company = client.companyName || 'No Client';

  document.getElementById('modal-devis-project-id').value = p.id;
  document.getElementById('modal-devis-client-id').value = p.clientId || '';
  document.getElementById('modal-devis-client-name').value = `${company} (${client.wilaya || 'DZ'})`;
  document.getElementById('modal-devis-project-title').value = p.title || '';
  document.getElementById('modal-devis-domain-check').checked = Boolean(p.domainIncluded);
  document.getElementById('modal-devis-hosting-check').checked = Boolean(p.hostingIncluded);

  // Notes: take saved notes from project or associated quote
  const existingInv = (state.invoices || []).find(i => i.projectId === projectId);
  document.getElementById('modal-devis-notes').value = p.notes || existingInv?.notes || '';

  const deadlineInput = document.getElementById('modal-devis-deadline');
  if (deadlineInput) {
    if (p.targetDeliveryDate) {
      deadlineInput.value = new Date(p.targetDeliveryDate).toISOString().slice(0, 10);
    } else if (existingInv && existingInv.dueDate) {
      deadlineInput.value = new Date(existingInv.dueDate).toISOString().slice(0, 10);
    } else {
      deadlineInput.value = '';
    }
  }

  // Restore saved deliverables / line items permanently from invoice
  let savedItems = [];
  if (existingInv && Array.isArray(existingInv.itemsJson) && existingInv.itemsJson.length > 0) {
    savedItems = existingInv.itemsJson;
  }

  if (savedItems.length > 0) {
    modalDevisItems = savedItems.map(item => ({
      title: item.title || item.description || '',
      price: Number(item.price || item.priceDzd || 0)
    }));
  } else {
    const total = Number(p.priceTotalDzd) || 0;
    if (total > 0) {
      modalDevisItems = [
        { title: `Full Solution Architecture & Implementation: ${p.title}`, price: total }
      ];
    } else {
      modalDevisItems = [
        { title: `Core Platform Architecture & Custom Engineering`, price: 0 }
      ];
    }
  }

  renderModalDevisItems();
  calcModalDevisSummary();
  openModal('project-devis-modal');
}

function renderModalDevisItems() {
  const container = document.getElementById('modal-devis-items-list');
  if (!container) return;

  container.innerHTML = modalDevisItems.map((item, idx) => `
    <div style="display: flex; gap: 8px; align-items: center;">
      <input type="text" value="${escapeHtml(item.title)}" placeholder="Service / Deliverable description" 
             style="flex: 2; padding: 6px 10px; font-size: 0.8rem;" 
             oninput="updateModalDevisItem(${idx}, 'title', this.value)">
      <div style="display: flex; align-items: center; gap: 4px; flex: 1;">
        <input type="number" value="${item.price || ''}" placeholder="DZD" 
                style="width: 100%; padding: 6px 10px; font-size: 0.8rem;" 
                oninput="updateModalDevisItem(${idx}, 'price', this.value)">
        <span style="font-size: 0.72rem; color: var(--ink-muted); font-weight: 600;">DZD</span>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" 
              style="padding: 4px 8px; color: #DC2626; border-color: var(--border);" 
              onclick="removeModalDevisItemRow(${idx})">✕</button>
    </div>
  `).join('');
}

function addModalDevisItemRow() {
  modalDevisItems.push({ title: '', price: 0 });
  renderModalDevisItems();
}

function removeModalDevisItemRow(index) {
  if (modalDevisItems.length <= 1) {
    modalDevisItems = [{ title: '', price: 0 }];
  } else {
    modalDevisItems.splice(index, 1);
  }
  renderModalDevisItems();
  calcModalDevisSummary();
}

function updateModalDevisItem(index, field, value) {
  if (!modalDevisItems[index]) return;
  if (field === 'price') {
    modalDevisItems[index].price = Number(value) || 0;
  } else {
    modalDevisItems[index].title = value;
  }
  calcModalDevisSummary();
}

function calcModalDevisSummary() {
  let total = 0;
  modalDevisItems.forEach(i => {
    total += Number(i.price) || 0;
  });

  const m1 = Math.round(total * 0.50);
  const m2 = Math.round(total * 0.20);
  const m3 = total - m1 - m2;

  const totalEl = document.getElementById('modal-devis-total-price');
  const m1El = document.getElementById('modal-devis-m1');
  const m2El = document.getElementById('modal-devis-m2');
  const m3El = document.getElementById('modal-devis-m3');

  if (totalEl) totalEl.textContent = `${formatDzd(total)} DZD`;
  if (m1El) m1El.textContent = `${formatDzd(m1)} DZD`;
  if (m2El) m2El.textContent = `${formatDzd(m2)} DZD`;
  if (m3El) m3El.textContent = `${formatDzd(m3)} DZD`;
}

async function saveModalDevis() {
  const projectId = document.getElementById('modal-devis-project-id').value;
  const clientId = document.getElementById('modal-devis-client-id').value;
  const projectTitle = document.getElementById('modal-devis-project-title').value.trim();
  const domainIncluded = document.getElementById('modal-devis-domain-check').checked;
  const hostingIncluded = document.getElementById('modal-devis-hosting-check').checked;
  const deadline = document.getElementById('modal-devis-deadline')?.value || null;
  const notes = document.getElementById('modal-devis-notes').value.trim();
  const saveBtn = document.getElementById('modal-devis-save-btn');

  if (!projectId || !clientId) {
    showToast('Project or client reference missing', 'error');
    return;
  }

  // Filter items
  const validItems = modalDevisItems.filter(i => (i.title && i.title.trim().length > 0) || Number(i.price) > 0);
  if (validItems.length === 0) {
    showToast('Please add at least one line item deliverable.', 'error');
    return;
  }

  const items = validItems.map(i => ({
    title: i.title.trim() || 'Custom Software Solution Development',
    description: i.title.trim() || 'Custom Software Solution Development',
    priceDzd: Number(i.price) || 0,
    price: Number(i.price) || 0
  }));

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
  }

  try {
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        clientId,
        items,
        domainIncluded,
        hostingIncluded,
        dueDate: deadline,
        targetDeliveryDate: deadline,
        notes: notes || projectTitle,
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save quote');
    }

    closeModal('project-devis-modal');
    showToast(`Quote for ${projectTitle || 'project'} saved successfully.`);

    await fetchProjects();
    await fetchStats();
    await fetchInvoices();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
    }
  }
}

function prepareDevisForProject(projectId) {
  openProjectDevisModal(projectId);
}

// ==========================================
// ACTIONS & MODALS
// ==========================================
async function updateProjectStage(projectId, newStage, extraData = {}) {
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage, ...extraData }),
    });
    if (!res.ok) throw new Error('Could not update stage');
    showToast('Project stage updated successfully.');
    fetchProjects();
    fetchStats();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openUploadReceiptModal(projectId, projectTitle, defaultMilestone) {
  document.getElementById('receipt-project-id').value = projectId;
  document.getElementById('receipt-project-title').value = projectTitle;
  document.getElementById('receipt-milestone').value = defaultMilestone || 'm1';
  document.getElementById('receipt-file').value = '';
  openModal('upload-receipt-modal');
}

async function handleReceiptUpload(e) {
  e.preventDefault();
  const projectId = document.getElementById('receipt-project-id').value;
  const milestone = document.getElementById('receipt-milestone').value;
  const fileInput = document.getElementById('receipt-file');
  const submitBtn = document.getElementById('btn-submit-receipt');

  if (!fileInput.files || fileInput.files.length === 0) {
    showToast('Please select a receipt image file.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('milestone', milestone);
  formData.append('receipt', fileInput.files[0]);

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Uploading receipt...</span>';

    const res = await fetch(`/api/projects/${projectId}/receipt`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Upload error');
    }

    const data = await res.json();
    if (milestone === 'm1') {
      showToast('50% Deposit verified. Project advanced directly to Design UI/UX.');
    } else if (milestone === 'm2') {
      showToast('20% Design payment verified. Project advanced to Development.');
    } else if (milestone === 'm3') {
      showToast('Final 30% payment verified. Project advanced to Delivered.');
    } else {
      showToast('Receipt uploaded and verified.');
    }
    closeModal('upload-receipt-modal');
    await fetchProjects();
    await fetchStats();
    await fetchInvoices();
    if (currentDetailsProjectId && document.getElementById('project-details-modal')?.classList.contains('active')) {
      const refreshedProject = state.projects.find(x => x.id === currentDetailsProjectId);
      if (refreshedProject) {
        renderProjectReceipts(refreshedProject);
      }
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Upload Receipt</span>';
  }
}

function viewReceipt(title, url) {
  document.getElementById('view-receipt-title').textContent = title;
  document.getElementById('view-receipt-img').src = url;
  document.getElementById('view-receipt-open-btn').href = url;
  openModal('view-receipt-modal');
}

async function handleNewClient(e) {
  e.preventDefault();
  const companyName = document.getElementById('client-company').value.trim();
  const contactName = document.getElementById('client-contact').value.trim();
  const phone = document.getElementById('client-phone').value.trim();
  const industry = document.getElementById('client-industry')?.value?.trim() || '';

  try {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName, contactName, phone, industry }),
    });

    if (!res.ok) throw new Error('Error creating client');
    showToast(`Client ${companyName} created successfully.`);
    closeModal('new-client-modal');
    document.getElementById('new-client-form').reset();
    await fetchClients();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function calcProjectSplitPreview() {
  const total = Number(document.getElementById('proj-price').value) || 0;
  const m1 = Math.round(total * 0.50);
  const m2 = Math.round(total * 0.20);
  const m3 = total - m1 - m2;
  document.getElementById('proj-split-preview').textContent = 
    `M1 (50%) = ${formatDzd(m1)} DZD | M2 (20%) = ${formatDzd(m2)} DZD | M3 (30%) = ${formatDzd(m3)} DZD`;
}

async function handleNewProject(e) {
  e.preventDefault();
  const clientId = document.getElementById('proj-client-id').value;
  const title = document.getElementById('proj-title').value.trim();
  const type = document.getElementById('proj-type').value;
  const priceTotalDzd = document.getElementById('proj-price').value;
  const domainIncluded = document.getElementById('proj-domain').checked;
  const hostingIncluded = document.getElementById('proj-hosting').checked;
  const deadline = document.getElementById('proj-deadline')?.value || null;
  const notes = document.getElementById('proj-notes').value.trim();

  try {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId,
        title,
        type,
        priceTotalDzd,
        domainIncluded,
        hostingIncluded,
        targetDeliveryDate: deadline,
        notes,
      }),
    });

    if (!res.ok) throw new Error('Error creating project');
    showToast(`Project "${title}" created successfully.`);
    closeModal('new-project-modal');
    document.getElementById('new-project-form').reset();
    await fetchProjects();
    await fetchStats();
    await fetchInvoices();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openNewProjectForClient(clientId) {
  openModal('new-project-modal');
  const select = document.getElementById('proj-client-id');
  if (select) select.value = clientId;
}

async function convertLeadToClient(leadId) {
  try {
    const res = await fetch(`/api/leads/${leadId}/convert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to convert lead');

    showToast(`Lead converted! Client registered and project created in Scoping.`);
    await fetchLeads();
    await fetchClients();
    await fetchProjects();
    await fetchStats();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function updateClientSelects() {
  const projSelect = document.getElementById('proj-client-id');
  const devisSelect = document.getElementById('devis-client-select');

  const optionsHtml = state.clients.map(c => 
    `<option value="${c.id}">${escapeHtml(c.companyName)} (${escapeHtml(c.contactName)})</option>`
  ).join('');

  if (projSelect) {
    projSelect.innerHTML = `<option value="">-- Select Client --</option>` + optionsHtml;
  }
  if (devisSelect) {
    devisSelect.innerHTML = `<option value="">-- Select Client --</option>` + optionsHtml;
  }
}

function updateProjectSelects() {}

// ==========================================
// SEARCH & FILTER
// ==========================================
function initSearch() {
  const input = document.getElementById('global-search');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) {
      renderProjectsTable(state.projects);
      renderClientsTable(state.clients);
      return;
    }

    if (state.activeTab === 'projects' || state.activeTab === 'overview') {
      const filtered = state.projects.filter(p => 
        p.title.toLowerCase().includes(q) ||
        (p.client && p.client.companyName.toLowerCase().includes(q))
      );
      renderProjectsKanban(filtered);
    } else if (state.activeTab === 'clients') {
      const filtered = state.clients.filter(c => 
        c.companyName.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        (c.wilaya && c.wilaya.toLowerCase().includes(q))
      );
      renderClientsTable(filtered);
    }
  });

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
    }
  });

  const pills = document.querySelectorAll('#projects-filter-pills .filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const filter = pill.dataset.filter;
      if (filter === 'all') {
        renderProjectsTable(state.projects);
      } else {
        renderProjectsTable(state.projects.filter(p => p.stage === filter));
      }
    });
  });
}

// ==========================================
// MODALS
// ==========================================
function initModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
    }
  });
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// REAL-TIME SERVER-SENT EVENTS
// ==========================================
function setupRealtimeEvents() {
  if (window.__visionEventSource) return;

  try {
    const es = new EventSource('/api/events');
    window.__visionEventSource = es;

    es.addEventListener('new_lead', (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log('Real-time new lead received:', data);
        fetchLeads();
        fetchClients();
        fetchStats();
        const prospect = data && data.lead && data.lead.name ? data.lead.name : 'New Prospect';
        const act = data && data.lead && data.lead.activity ? ' (' + data.lead.activity + ')' : '';
        showToast('New Lead: ' + prospect + act, 'success');
      } catch (err) {
        console.error('Error handling SSE new_lead event:', err);
      }
    });

    es.addEventListener('lead_deleted', (e) => {
      fetchLeads();
      fetchStats();
    });

    es.addEventListener('client_deleted', (e) => {
      fetchClients();
      fetchStats();
    });

    es.addEventListener('lead_converted', (e) => {
      fetchLeads();
      fetchClients();
      fetchProjects();
      fetchStats();
    });

    es.addEventListener('meeting_created', (e) => {
      fetchMeetings();
    });

    es.addEventListener('meeting_updated', (e) => {
      fetchMeetings();
    });

    es.addEventListener('meeting_deleted', (e) => {
      fetchMeetings();
    });

    es.onerror = () => {
      // EventSource automatically retries
    };
  } catch (err) {
    console.error('SSE connection error:', err);
  }

  // Background fallback sync every 15 seconds
  setInterval(() => {
    fetchLeads();
  }, 15000);
}

// ==========================================
// MEETINGS & FOUNDER CALENDAR SYSTEM
// ==========================================

async function fetchMeetings() {
  try {
    const res = await fetch('/api/meetings');
    if (!res.ok) throw new Error('Failed to fetch meetings');
    const data = await res.json();
    state.meetings = Array.isArray(data) ? data : [];
    updateMeetingsBadge();
    if (state.activeTab === 'meetings') {
      renderMeetingsView();
    }
  } catch (err) {
    console.error('Meetings fetch error:', err);
  }
}

function updateMeetingsBadge() {
  const badgeEl = document.getElementById('nav-meetings-count');
  if (!badgeEl) return;
  const todayStr = getTodayDateString();
  const upcomingCount = state.meetings.filter(m => m.status === 'scheduled' && m.meetingDate >= todayStr).length;
  if (upcomingCount > 0) {
    badgeEl.textContent = upcomingCount;
    badgeEl.style.display = 'inline-block';
  } else {
    badgeEl.style.display = 'none';
  }
}

function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function renderMeetingsView() {
  if (state.meetingView === 'list') {
    const calEl = document.getElementById('meetings-calendar-view');
    const listEl = document.getElementById('meetings-list-view');
    if (calEl) calEl.style.display = 'none';
    if (listEl) listEl.style.display = 'block';

    const calBtn = document.getElementById('btn-view-cal');
    const listBtn = document.getElementById('btn-view-list');
    if (calBtn && listBtn) {
      calBtn.className = 'btn btn-secondary btn-sm';
      calBtn.style.background = 'transparent';
      calBtn.style.border = 'none';
      listBtn.className = 'btn btn-primary btn-sm';
      listBtn.style.background = '';
      listBtn.style.border = '';
    }
    renderAgendaListView();
  } else {
    const calEl = document.getElementById('meetings-calendar-view');
    const listEl = document.getElementById('meetings-list-view');
    if (calEl) calEl.style.display = 'block';
    if (listEl) listEl.style.display = 'none';

    const calBtn = document.getElementById('btn-view-cal');
    const listBtn = document.getElementById('btn-view-list');
    if (calBtn && listBtn) {
      calBtn.className = 'btn btn-primary btn-sm';
      calBtn.style.background = '';
      calBtn.style.border = '';
      listBtn.className = 'btn btn-secondary btn-sm';
      listBtn.style.background = 'transparent';
      listBtn.style.border = 'none';
    }
    renderCalendarView();
  }
}

function setMeetingView(view) {
  state.meetingView = view;
  renderMeetingsView();
}

function handleMeetingsFilterChange() {
  const typeSelect = document.getElementById('meetings-filter-type');
  const statusSelect = document.getElementById('meetings-filter-status');
  if (typeSelect) state.meetingsFilterType = typeSelect.value;
  if (statusSelect) state.meetingsFilterStatus = statusSelect.value;
  renderMeetingsView();
}

function changeCalendarMonth(delta) {
  state.calendarMonth += delta;
  if (state.calendarMonth < 0) {
    state.calendarMonth = 11;
    state.calendarYear -= 1;
  } else if (state.calendarMonth > 11) {
    state.calendarMonth = 0;
    state.calendarYear += 1;
  }
  renderMeetingsView();
}

function resetCalendarToToday() {
  const now = new Date();
  state.calendarYear = now.getFullYear();
  state.calendarMonth = now.getMonth();
  renderMeetingsView();
}

function renderCalendarView() {
  const container = document.getElementById('calendar-grid-cells');
  const monthLabel = document.getElementById('calendar-month-label');
  if (!container) return;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  if (monthLabel) {
    monthLabel.textContent = `${monthNames[state.calendarMonth]} ${state.calendarYear}`;
  }

  const firstDay = new Date(state.calendarYear, state.calendarMonth, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(state.calendarYear, state.calendarMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(state.calendarYear, state.calendarMonth, 0).getDate();

  const todayStr = getTodayDateString();

  // Filter meetings
  const filteredMeetings = (state.meetings || []).filter(m => {
    if (state.meetingsFilterStatus !== 'all' && m.status !== state.meetingsFilterStatus) return false;
    if (state.meetingsFilterType !== 'all' && m.type !== state.meetingsFilterType) return false;
    return true;
  });

  // Project deadlines (for founder workload awareness: winta nakhedm w winta ndiir meeting)
  const projectDeadlines = (state.projects || []).filter(p => {
    return p.targetDeliveryDate && p.status !== 'cancelled' && p.stage !== 'delivered';
  });

  let cellsHtml = '';

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthIdx = state.calendarMonth === 0 ? 11 : state.calendarMonth - 1;
    const prevYear = state.calendarMonth === 0 ? state.calendarYear - 1 : state.calendarYear;
    const dateStr = `${prevYear}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    cellsHtml += renderCalendarCell(dateStr, dayNum, true, todayStr, filteredMeetings, projectDeadlines);
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${state.calendarYear}-${String(state.calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cellsHtml += renderCalendarCell(dateStr, day, false, todayStr, filteredMeetings, projectDeadlines);
  }

  // Next month leading days (fill up to total of 35 or 42 cells)
  const totalCellsSoFar = firstDay + daysInMonth;
  const remainingCells = totalCellsSoFar % 7 === 0 ? 0 : 7 - (totalCellsSoFar % 7);
  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthIdx = state.calendarMonth === 11 ? 0 : state.calendarMonth + 1;
    const nextYear = state.calendarMonth === 11 ? state.calendarYear + 1 : state.calendarYear;
    const dateStr = `${nextYear}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cellsHtml += renderCalendarCell(dateStr, day, true, todayStr, filteredMeetings, projectDeadlines);
  }

  container.innerHTML = cellsHtml;
}

function renderCalendarCell(dateStr, dayNum, isOtherMonth, todayStr, meetings, deadlines) {
  const isToday = dateStr === todayStr;
  const isPast = dateStr < todayStr;
  const dayMeetings = meetings.filter(m => m.meetingDate === dateStr);
  const dayDeadlines = deadlines.filter(p => {
    const d = new Date(p.targetDeliveryDate);
    const pYear = d.getFullYear();
    const pMonth = String(d.getMonth() + 1).padStart(2, '0');
    const pDay = String(d.getDate()).padStart(2, '0');
    return `${pYear}-${pMonth}-${pDay}` === dateStr;
  });

  const cellClasses = ['calendar-cell'];
  if (isOtherMonth) cellClasses.push('other-month');
  if (isToday) cellClasses.push('is-today');
  if (isPast) cellClasses.push('is-past');

  let eventsHtml = '';

  // Render project deadlines first as high-priority
  dayDeadlines.forEach(p => {
    eventsHtml += `
      <div class="event-chip event-chip-deadline" onclick="event.stopPropagation(); openProjectDetailsModal('${p.id}')" title="Delivery Deadline: ${escapeHtml(p.title)}">
        <span class="event-chip-time">DEADLINE</span>
        <span class="event-chip-title">${escapeHtml(p.title)}</span>
      </div>
    `;
  });

  // Render meetings (always visible & clickable to review details, even on past dates)
  dayMeetings.forEach(m => {
    const isCompleted = m.status === 'completed';
    const typeClass = `event-chip-${m.type || 'discovery'}`;
    const clientName = m.client?.companyName || m.client?.contactName || '';
    eventsHtml += `
      <div class="event-chip ${typeClass} ${isCompleted ? 'is-completed' : ''}" onclick="event.stopPropagation(); openMeetingDetailsModal('${m.id}')" title="${escapeHtml(m.title)} (${m.startTime || ''})">
        <span class="event-chip-time">${m.startTime || ''} ${clientName ? '· ' + escapeHtml(clientName) : ''}</span>
        <span class="event-chip-title">${escapeHtml(m.title)}</span>
      </div>
    `;
  });

  // Past dates cannot be clicked to schedule a new meeting
  const clickHandler = isPast ? '' : `onclick="openNewMeetingModal('${dateStr}')"`;
  const titleAttr = isPast ? 'title="Past date (unselectable)"' : 'title="Click to schedule meeting"';

  return `
    <div class="${cellClasses.join(' ')}" ${clickHandler} ${titleAttr}>
      <div class="calendar-cell-top">
        <span class="calendar-cell-num">${dayNum}</span>
        ${isToday ? '<span class="calendar-cell-today-pill">Today</span>' : ''}
      </div>
      <div class="calendar-events-wrap">
        ${eventsHtml}
      </div>
    </div>
  `;
}

function renderAgendaListView() {
  const container = document.getElementById('agenda-groups-container');
  if (!container) return;

  const todayStr = getTodayDateString();
  const filteredMeetings = (state.meetings || []).filter(m => {
    if (state.meetingsFilterStatus !== 'all' && m.status !== state.meetingsFilterStatus) return false;
    if (state.meetingsFilterType !== 'all' && m.type !== state.meetingsFilterType) return false;
    return true;
  });

  if (filteredMeetings.length === 0) {
    container.innerHTML = `
      <div class="card" style="padding: 60px 20px; text-align: center;">
        <div style="font-size: 1rem; font-weight: 700; color: var(--ink);">No meetings found</div>
        <p style="font-size: 0.85rem; color: var(--ink-muted); margin-top: 6px;">Schedule client calls and milestone review sessions to organize your pipeline.</p>
        <button type="button" class="btn btn-primary btn-sm" style="margin-top: 14px;" onclick="openNewMeetingModal()">+ Schedule Meeting</button>
      </div>
    `;
    return;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`;

  const groups = {
    today: { title: "Today's Schedule", meetings: [] },
    tomorrow: { title: "Tomorrow", meetings: [] },
    thisWeek: { title: "This Week", meetings: [] },
    upcoming: { title: "Upcoming", meetings: [] },
    past: { title: "Past & Completed", meetings: [] },
  };

  filteredMeetings.forEach(m => {
    if (m.meetingDate === todayStr) {
      groups.today.meetings.push(m);
    } else if (m.meetingDate === tomorrowStr) {
      groups.tomorrow.meetings.push(m);
    } else if (m.meetingDate > tomorrowStr && m.meetingDate <= nextWeekStr) {
      groups.thisWeek.meetings.push(m);
    } else if (m.meetingDate > nextWeekStr) {
      groups.upcoming.meetings.push(m);
    } else {
      groups.past.meetings.push(m);
    }
  });

  let html = '';
  for (const [key, group] of Object.entries(groups)) {
    if (group.meetings.length === 0) continue;
    html += `
      <div class="agenda-day-group">
        <div class="agenda-day-title">
          <span>${group.title}</span>
          <span class="agenda-day-badge">${group.meetings.length} ${group.meetings.length === 1 ? 'meeting' : 'meetings'}</span>
        </div>
        <div>
          ${group.meetings.map(m => renderAgendaMeetingCard(m)).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

function renderAgendaMeetingCard(m) {
  const isCompleted = m.status === 'completed';
  const typeLabels = {
    discovery: 'Discovery Call',
    scoping: 'Scoping Session',
    design_review: 'Design Review',
    demo_delivery: 'Demo & Delivery',
    followup: 'Follow-up Call',
    work_session: 'Work Session',
  };
  const typeText = typeLabels[m.type] || m.type || 'Meeting';
  const clientName = m.client?.companyName || m.client?.contactName || 'No Client';
  const projectTitle = m.project?.title || '';

  const joinBtn = m.link
    ? `<a href="${m.link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-weight: 600;">Join Link</a>`
    : (m.client?.phone ? `<a href="${formatWhatsAppUrl(m.client.phone)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="color: #059669; font-weight: 600;">WhatsApp Call</a>` : '');

  return `
    <div class="agenda-card">
      <div class="agenda-card-left">
        <div class="agenda-time-pill">
          <span class="agenda-time-val">${m.startTime || '--:--'}</span>
          <span class="agenda-time-dur">${m.endTime ? 'Until ' + m.endTime : formatDateShort(m.meetingDate)}</span>
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong style="font-size: 0.95rem; color: var(--ink); ${isCompleted ? 'text-decoration: line-through; opacity: 0.7;' : ''}">${escapeHtml(m.title)}</strong>
            <span class="badge" style="font-size: 0.70rem;">${typeText}</span>
          </div>
          <div style="font-size: 0.80rem; color: var(--ink-muted); margin-top: 3px;">
            ${clientName ? 'Client: <strong style="color: var(--ink);">' + escapeHtml(clientName) + '</strong>' : ''}
            ${projectTitle ? ' · Project: ' + escapeHtml(projectTitle) : ''}
          </div>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span class="badge ${isCompleted ? 'badge-green' : 'badge-yellow'}">${isCompleted ? 'Completed' : 'Scheduled'}</span>
        ${joinBtn}
        <button type="button" class="btn btn-secondary btn-sm" onclick="openMeetingDetailsModal('${m.id}')">Details</button>
      </div>
    </div>
  `;
}

function openNewMeetingModal(prefilledDate) {
  state.currentMeetingId = null;
  const idInput = document.getElementById('meeting-form-id');
  if (idInput) idInput.value = '';
  const titleEl = document.getElementById('meeting-modal-title');
  if (titleEl) titleEl.textContent = 'Schedule Meeting';
  const saveBtn = document.getElementById('btn-save-meeting');
  if (saveBtn) saveBtn.textContent = 'Schedule Meeting';

  // Populate client select
  const clientSelect = document.getElementById('meeting-form-client');
  if (clientSelect) {
    clientSelect.innerHTML = '<option value="">Select a Client...</option>' + (state.clients || []).map(c => `
      <option value="${c.id}">${escapeHtml(c.companyName || c.contactName)}</option>
    `).join('');
  }

  // Populate project select
  const projectSelect = document.getElementById('meeting-form-project');
  if (projectSelect) {
    projectSelect.innerHTML = '<option value="">No Project (General Meeting)</option>' + (state.projects || []).map(p => `
      <option value="${p.id}">${escapeHtml(p.title)} (${escapeHtml(p.client?.companyName || 'VISION')})</option>
    `).join('');
  }

  // Date (Hidden input, automatically bound to clicked date or today)
  const todayStr = getTodayDateString();
  const effectiveDate = (prefilledDate && prefilledDate >= todayStr) ? prefilledDate : todayStr;
  const dateInput = document.getElementById('meeting-form-date');
  if (dateInput) {
    dateInput.value = effectiveDate;
  }
  const dateDisplay = document.getElementById('meeting-modal-date-display');
  if (dateDisplay) {
    const dateObj = new Date(`${effectiveDate}T00:00:00`);
    const formatted = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
      : effectiveDate;
    dateDisplay.textContent = formatted;
  }

  // Times
  const startInput = document.getElementById('meeting-form-start-time');
  const endInput = document.getElementById('meeting-form-end-time');
  if (startInput) startInput.value = '14:00';
  if (endInput) endInput.value = '15:00';

  // Fields
  document.getElementById('meeting-form-title').value = '';
  document.getElementById('meeting-form-type').value = 'discovery';
  document.getElementById('meeting-form-platform').value = 'google_meet';
  document.getElementById('meeting-form-link').value = '';
  if (document.getElementById('meeting-form-agenda')) document.getElementById('meeting-form-agenda').value = '';
  if (document.getElementById('meeting-form-notes')) document.getElementById('meeting-form-notes').value = '';

  openModal('new-meeting-modal');
}

function handleMeetingClientSelectChange() {
  const clientId = document.getElementById('meeting-form-client').value;
  const projectSelect = document.getElementById('meeting-form-project');
  const titleInput = document.getElementById('meeting-form-title');

  if (projectSelect) {
    if (clientId) {
      const clientProjects = (state.projects || []).filter(p => p.clientId === clientId);
      projectSelect.innerHTML = '<option value="">No Project (General Meeting)</option>' + clientProjects.map(p => `
        <option value="${p.id}">${escapeHtml(p.title)}</option>
      `).join('');
      if (clientProjects.length === 1) {
        projectSelect.value = clientProjects[0].id;
      }
    } else {
      projectSelect.innerHTML = '<option value="">No Project (General Meeting)</option>' + (state.projects || []).map(p => `
        <option value="${p.id}">${escapeHtml(p.title)} (${escapeHtml(p.client?.companyName || 'VISION')})</option>
      `).join('');
    }
  }

  if (clientId && titleInput && !titleInput.value) {
    const client = (state.clients || []).find(c => c.id === clientId);
    if (client) {
      titleInput.value = `Scoping Session - ${client.companyName || client.contactName}`;
    }
  }
}

function handleMeetingPlatformChange() {
  const platform = document.getElementById('meeting-form-platform').value;
  const linkInput = document.getElementById('meeting-form-link');
  if (!linkInput) return;
  if (platform === 'whatsapp_call') {
    const clientId = document.getElementById('meeting-form-client')?.value;
    const client = (state.clients || []).find(c => c.id === clientId);
    if (client && client.phone) {
      linkInput.value = formatWhatsAppUrl(client.phone);
    }
  }
}

async function handleMeetingSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('meeting-form-id').value;
  const clientId = document.getElementById('meeting-form-client').value || null;
  const projectId = document.getElementById('meeting-form-project').value || null;
  const title = document.getElementById('meeting-form-title').value.trim();
  const type = document.getElementById('meeting-form-type').value;
  const meetingDate = document.getElementById('meeting-form-date').value;
  const startTime = document.getElementById('meeting-form-start-time').value;
  const endTime = document.getElementById('meeting-form-end-time').value || null;
  const platform = document.getElementById('meeting-form-platform').value;
  const link = document.getElementById('meeting-form-link').value.trim() || null;
  const agenda = document.getElementById('meeting-form-agenda')?.value?.trim() || null;
  const notes = document.getElementById('meeting-form-notes')?.value?.trim() || null;

  const payload = {
    title,
    clientId,
    projectId,
    type,
    meetingDate,
    startTime,
    endTime,
    platform,
    link,
    agenda,
    notes,
  };

  const todayStr = getTodayDateString();
  if (meetingDate < todayStr && !id) {
    showToast('Cannot schedule a meeting on a past date. Please select today or a future date.', 'error');
    return;
  }

  try {
    let res;
    if (id) {
      res = await fetch(`/api/meetings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } else {
      payload.status = 'scheduled';
      res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to save meeting');
    }

    showToast(id ? 'Meeting updated successfully.' : 'Meeting scheduled successfully.');
    closeModal('new-meeting-modal');
    await fetchMeetings();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openMeetingDetailsModal(meetingId) {
  const m = (state.meetings || []).find(x => x.id === meetingId);
  if (!m) {
    showToast('Meeting not found', 'error');
    return;
  }
  state.currentMeetingId = meetingId;

  const typeLabels = {
    discovery: 'Discovery Call',
    scoping: 'Scoping Session',
    design_review: 'Design Review',
    demo_delivery: 'Demo & Delivery',
    followup: 'Follow-up Call',
    work_session: 'Work Session',
  };

  document.getElementById('md-title').textContent = m.title || 'Meeting Details';
  document.getElementById('md-subtitle').textContent = `Scheduled on ${m.meetingDate || '-'}`;

  const typeBadgeEl = document.getElementById('md-type-badge');
  if (typeBadgeEl) {
    typeBadgeEl.className = 'badge';
    typeBadgeEl.textContent = typeLabels[m.type] || m.type || 'Meeting';
  }

  const statusBadgeEl = document.getElementById('md-status-badge');
  if (statusBadgeEl) {
    const isCompleted = m.status === 'completed';
    statusBadgeEl.className = `badge ${isCompleted ? 'badge-green' : 'badge-yellow'}`;
    statusBadgeEl.textContent = isCompleted ? 'Completed' : 'Scheduled';
  }

  // Toggle complete button
  const toggleBtn = document.getElementById('btn-toggle-meeting-complete');
  if (toggleBtn) {
    toggleBtn.textContent = m.status === 'completed' ? 'Re-open Meeting' : 'Mark as Completed';
  }

  // Date & Time
  const dateObj = new Date(`${m.meetingDate}T${m.startTime || '00:00'}`);
  const dateFormatted = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
    : m.meetingDate;
  document.getElementById('md-date-time').textContent = `${dateFormatted} at ${m.startTime || '--:--'}`;
  document.getElementById('md-duration').textContent = m.endTime ? `Duration: ${m.startTime} - ${m.endTime}` : 'Duration: Open';

  // Platform & Join Action
  const platformAction = document.getElementById('md-platform-action');
  if (platformAction) {
    if (m.link) {
      platformAction.innerHTML = `
        <a href="${m.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-weight: 700; padding: 8px 16px;">
          Join Meeting
        </a>
      `;
    } else if (m.client?.phone) {
      platformAction.innerHTML = `
        <a href="${formatWhatsAppUrl(m.client.phone)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="font-weight: 700; background: #059669; border-color: #059669; padding: 8px 16px;">
          Call via WhatsApp
        </a>
      `;
    } else {
      platformAction.innerHTML = `
        <span class="badge badge-gray">${escapeHtml(m.platform || 'Direct Meeting')}</span>
      `;
    }
  }

  // Client Details
  const client = m.client || {};
  document.getElementById('md-client-company').textContent = client.companyName || client.contactName || 'No Client Linked';
  document.getElementById('md-client-contact').textContent = client.contactName ? `Contact: ${client.contactName}` : '';
  if (client.phone) {
    document.getElementById('md-client-phone').innerHTML = `
      <a href="${formatWhatsAppUrl(client.phone)}" target="_blank" rel="noopener noreferrer" class="phone-link">
        ${escapeHtml(client.phone)} (WhatsApp)
      </a>
    `;
  } else {
    document.getElementById('md-client-phone').textContent = 'No phone recorded';
  }
  document.getElementById('md-client-wilaya').textContent = client.wilaya ? `Wilaya: ${client.wilaya}` : '';

  // Project Details
  const project = m.project || {};
  document.getElementById('md-project-title').textContent = project.title || 'No Project Linked';
  document.getElementById('md-project-stage').innerHTML = project.stage ? getStageBadge(project.stage) : '';
  document.getElementById('md-project-budget').textContent = project.priceTotalDzd ? `Agreed Total: ${formatDzd(project.priceTotalDzd)} DZD` : '';
  
  const projectLinkWrap = document.getElementById('md-project-link-wrap');
  if (projectLinkWrap) {
    if (project.id) {
      projectLinkWrap.innerHTML = `
        <button type="button" class="btn btn-secondary btn-sm" style="padding: 3px 8px; font-size: 0.74rem;" onclick="closeModal('meeting-details-modal'); openProjectDetailsModal('${project.id}')">
          Open Project Details
        </button>
      `;
    } else {
      projectLinkWrap.innerHTML = '';
    }
  }

  // Agenda & Notes (Safely checked if present)
  const agendaEl = document.getElementById('md-agenda');
  if (agendaEl) agendaEl.textContent = m.agenda || 'No agenda recorded for this meeting.';
  const notesEl = document.getElementById('md-notes');
  if (notesEl) notesEl.textContent = m.notes || 'No outcome notes recorded yet.';

  openModal('meeting-details-modal');
}

async function toggleCurrentMeetingStatus() {
  if (!state.currentMeetingId) return;
  const m = (state.meetings || []).find(x => x.id === state.currentMeetingId);
  if (!m) return;
  const newStatus = m.status === 'completed' ? 'scheduled' : 'completed';

  try {
    const res = await fetch(`/api/meetings/${m.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    showToast(newStatus === 'completed' ? 'Meeting marked as completed.' : 'Meeting marked as scheduled.');
    await fetchMeetings();
    openMeetingDetailsModal(m.id);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function editCurrentMeeting() {
  if (!state.currentMeetingId) return;
  const m = (state.meetings || []).find(x => x.id === state.currentMeetingId);
  if (!m) return;

  closeModal('meeting-details-modal');
  openNewMeetingModal(m.meetingDate);

  state.currentMeetingId = m.id;
  document.getElementById('meeting-form-id').value = m.id;
  document.getElementById('meeting-modal-title').textContent = 'Edit Meeting';
  document.getElementById('btn-save-meeting').textContent = 'Save Changes';

  document.getElementById('meeting-form-client').value = m.clientId || '';
  handleMeetingClientSelectChange();
  document.getElementById('meeting-form-project').value = m.projectId || '';
  document.getElementById('meeting-form-title').value = m.title || '';
  document.getElementById('meeting-form-type').value = m.type || 'discovery';
  document.getElementById('meeting-form-date').value = m.meetingDate || '';
  const dateDisplay = document.getElementById('meeting-modal-date-display');
  if (dateDisplay && m.meetingDate) {
    const dateObj = new Date(`${m.meetingDate}T00:00:00`);
    const formatted = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
      : m.meetingDate;
    dateDisplay.textContent = formatted;
  }
  document.getElementById('meeting-form-start-time').value = m.startTime || '';
  document.getElementById('meeting-form-end-time').value = m.endTime || '';
  document.getElementById('meeting-form-platform').value = m.platform || 'google_meet';
  document.getElementById('meeting-form-link').value = m.link || '';
  if (document.getElementById('meeting-form-agenda')) document.getElementById('meeting-form-agenda').value = m.agenda || '';
  if (document.getElementById('meeting-form-notes')) document.getElementById('meeting-form-notes').value = m.notes || '';
}

async function deleteCurrentMeeting() {
  if (!state.currentMeetingId) return;
  if (!confirm('Are you sure you want to delete this meeting?')) return;

  try {
    const res = await fetch(`/api/meetings/${state.currentMeetingId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete meeting');
    showToast('Meeting deleted.');
    closeModal('meeting-details-modal');
    state.currentMeetingId = null;
    await fetchMeetings();
  } catch (err) {
    showToast(err.message, 'error');
  }
}
