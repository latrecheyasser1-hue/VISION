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
  stats: null,
  activeTab: 'overview',
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
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initTabs();
  initSearch();
  initModals();
  renderDevisRows();
  renderDevisLive();

  fetchAllData();

  if (window.location.hash) {
    const tab = window.location.hash.replace('#', '');
    if (['overview', 'projects', 'clients', 'leads', 'devis', 'storage'].includes(tab)) {
      switchTab(tab);
    }
  }
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
  devis: { title: "Quotes & Devis", sub: "Multi-language quotation generator (50/20/30 split)" },
  storage: { title: "Receipts", sub: "Verified payment receipts archive" },
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

  if (tabId === 'storage') renderStorageExplorer();
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
    document.getElementById('nav-leads-count').textContent = data.newLeadsCount;
  } catch (err) {
    console.error('Stats error:', err);
  }
}

async function fetchProjects() {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error('Failed to fetch projects');
    const data = await res.json();
    state.projects = data;

    document.getElementById('nav-projects-count').textContent = data.length;
    renderOverviewProjects(data);
    renderProjectsKanban(data);
    renderStorageExplorer();
    updateProjectSelects();
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
  } catch (err) {
    console.error('Leads error:', err);
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

// Open Read-Only Project Details Modal
function openProjectDetailsModal(projectId) {
  const p = state.projects.find(x => x.id === projectId);
  if (!p) {
    showToast('Project details not found', 'error');
    return;
  }

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
    document.getElementById('pd-client-phone').innerHTML = `<a href="tel:${escapeHtml(client.phone)}" class="phone-link">${escapeHtml(client.phone)}</a>`;
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

  openModal('project-details-modal');
}

// 1. Overview Projects Table
function renderOverviewProjects(projects) {
  const tbody = document.getElementById('overview-projects-tbody');
  if (!tbody) return;

  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--ink-muted); padding: 24px;">No projects recorded yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = projects.map(p => {
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

  const list = Array.isArray(projects) ? projects : [];

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
                <div class="kanban-card-actions-row" style="margin-top: 6px;">
                  <button class="btn btn-primary btn-sm" style="width: 100%; background: #F59E0B; border-color: #F59E0B;" onclick="event.stopPropagation(); openUploadReceiptModal('${p.id}', '${escapeHtml(p.title)}', 'm1')">
                    Upload 50% Receipt
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

          return `
            <div class="kanban-card" 
                 draggable="true" 
                 data-project-id="${p.id}"
                 ondragstart="handleKanbanDragStart(event, '${p.id}')"
                 onclick="openProjectDetailsModal('${p.id}')">
              
              <div class="kanban-card-top">
                <span class="badge ${p.type === 'ecommerce' ? 'badge-purple' : 'badge-cyan'}" style="font-size: 0.65rem; text-transform: uppercase; font-weight: 700; letter-spacing: 0.03em;">
                  ${escapeHtml(typeLabel)}
                </span>
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

  // RULE 1: Moving from scoping to devis -> Open Quote Creator
  if (targetStage === 'devis') {
    await updateProjectStage(projectId, 'devis');
    prepareDevisForProject(projectId);
    showToast('Project moved to Devis. Please configure quote items and pricing.');
    return;
  }

  // RULE 2: Cannot move to deposit_50 unless quote is created and approved
  if (targetStage === 'deposit_50') {
    if (p.devisStatus !== 'approved') {
      showQuoteGateModal(p);
      return;
    }
    await updateProjectStage(projectId, 'deposit_50');
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
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--ink-muted); padding: 32px;">No clients registered.</td></tr>`;
    return;
  }

  tbody.innerHTML = clients.map(c => `
    <tr>
      <td>
        <strong style="color: var(--ink); font-size: 0.95rem;">${escapeHtml(c.companyName)}</strong>
      </td>
      <td>${escapeHtml(c.contactName)}</td>
      <td><span class="badge badge-gray">${escapeHtml(c.wilaya || '-')}</span></td>
      <td>
        ${c.phone ? `<a href="tel:${escapeHtml(c.phone)}" class="phone-link">${escapeHtml(c.phone)}</a>` : '-'}
      </td>
      <td><small style="color: var(--ink-muted);">${escapeHtml(c.email || '-')}</small></td>
      <td>${escapeHtml(c.industry || '-')}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openNewProjectForClient('${c.id}')">+ Project</button>
      </td>
    </tr>
  `).join('');
}

// 4. Leads Table
function renderLeadsTable(leads) {
  const tbody = document.getElementById('leads-table-tbody');
  if (!tbody) return;

  if (leads.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--ink-muted); padding: 32px;">No inquiries received yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = leads.map(l => {
    const dateStr = l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-GB') : '-';
    return `
      <tr>
        <td><strong style="color: var(--ink);">${escapeHtml(l.name)}</strong></td>
        <td>
          ${l.phone ? `<a href="tel:${escapeHtml(l.phone)}" class="phone-link">${escapeHtml(l.phone)}</a>` : '-'}
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
          <button class="btn btn-secondary btn-sm" onclick="convertLeadToClient('${escapeHtml(l.name)}', '${escapeHtml(l.phone || '')}', '${escapeHtml(l.activity || '')}')">
            Convert to Client
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. Receipts Storage Explorer
function renderStorageExplorer() {
  const grid = document.getElementById('receipts-grid');
  if (!grid) return;

  const receipts = [];
  for (const p of state.projects) {
    const clientName = p.client ? p.client.companyName : 'Client';
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

  if (receipts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; background: var(--paper); border: 1px dashed var(--border); border-radius: var(--radius-lg);">
        <p style="color: var(--ink-muted); font-size: 0.95rem;">No receipts uploaded yet.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = receipts.map(r => `
    <div class="receipt-card">
      <img src="${r.url}" alt="Receipt" loading="lazy" onclick="viewReceipt('${escapeHtml(r.projectTitle)} - ${r.milestone}', '${r.url}')">
      <div class="receipt-card-body">
        <strong style="font-size: 0.88rem; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(r.projectTitle)}</strong>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
          <span style="color: var(--ink-muted);">${escapeHtml(r.clientName)}</span>
          <span class="badge badge-green" style="font-size: 0.65rem;">${r.milestone}</span>
        </div>
        <a href="${r.url}" target="_blank" style="font-size: 0.72rem; color: var(--cyan-dark); text-decoration: none; margin-top: 4px;">View Full Image</a>
      </div>
    </div>
  `).join('');
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

function prepareDevisForProject(projectId) {
  const proj = state.projects.find(p => p.id === projectId);
  if (!proj) return;

  switchTab('devis');

  if (proj.clientId) {
    const select = document.getElementById('devis-client-select');
    if (select) select.value = proj.clientId;
    onDevisClientChange();
  }

  document.getElementById('devis-project-title').value = proj.title;
  document.getElementById('devis-domain-check').checked = proj.domainIncluded;
  document.getElementById('devis-hosting-check').checked = proj.hostingIncluded;

  const total = Number(proj.priceTotalDzd) || 0;
  state.devisItems = [
    { title: `Full Solution Development: ${proj.title}`, price: total },
  ];
  renderDevisRows();
  renderDevisLive();
}

// ==========================================
// ACTIONS & MODALS
// ==========================================
async function updateProjectStage(projectId, newStage) {
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage }),
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
    showToast('Receipt uploaded and verified.');
    closeModal('upload-receipt-modal');
    await fetchProjects();
    await fetchStats();
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
  const wilaya = document.getElementById('client-wilaya').value.trim();
  const email = document.getElementById('client-email').value.trim();
  const industry = document.getElementById('client-industry').value.trim();

  try {
    const res = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName, contactName, phone, wilaya, email, industry }),
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
        notes,
      }),
    });

    if (!res.ok) throw new Error('Error creating project');
    showToast(`Project "${title}" created successfully.`);
    closeModal('new-project-modal');
    document.getElementById('new-project-form').reset();
    await fetchProjects();
    await fetchStats();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function openNewProjectForClient(clientId) {
  openModal('new-project-modal');
  const select = document.getElementById('proj-client-id');
  if (select) select.value = clientId;
}

function convertLeadToClient(name, phone, activity) {
  openModal('new-client-modal');
  document.getElementById('client-company').value = name;
  document.getElementById('client-contact').value = name;
  document.getElementById('client-phone').value = phone;
  document.getElementById('client-industry').value = activity;
}

function updateClientSelects() {
  const projSelect = document.getElementById('proj-client-id');
  const devisSelect = document.getElementById('devis-client-select');

  const optionsHtml = state.clients.map(c => 
    `<option value="${c.id}">${escapeHtml(c.companyName)} (${escapeHtml(c.contactName)} - ${escapeHtml(c.wilaya || 'DZ')})</option>`
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
