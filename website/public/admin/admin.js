/**
 * VISION Admin Dashboard & CRM
 * Minimalist Pure Typographic Controller
 * 0 Emojis, 0 Icons Policy
 */

let state = {
  projects: [],
  clients: [],
  leads: [],
  stats: null,
  activeTab: 'overview',
  devisItems: [
    { title: 'Conception UI/UX sur-mesure & Prototype interactif', price: 60000 },
    { title: 'Développement Frontend Haute Performance', price: 80000 },
    { title: 'Backend API, Base de Données Neon Postgres & Cloudflare R2', price: 70000 },
    { title: 'Intégration Paiement BaridiMob & Dashboard Admin', price: 40000 },
  ],
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
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

async function fetchAllData() {
  await Promise.all([
    fetchStats(),
    fetchClients(),
    fetchProjects(),
    fetchLeads(),
  ]);
}

// ==========================================
// TOAST NOTIFICATIONS (NO EMOJIS)
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
// TABS & NAVIGATION
// ==========================================
const TAB_TITLES = {
  overview: { title: "Vue d'ensemble", sub: "Suivi des projets, paiements BaridiMob 50/20/30 et clients VISION" },
  projects: { title: "Projets & Jalons (50/20/30)", sub: "Gérez l'avancement, les étapes et les reçus BaridiMob stockés sur Cloudflare R2" },
  clients: { title: "Répertoire Clients", sub: "Gestion des contacts, wilayas et historique des projets" },
  leads: { title: "Demandes Entrantes (Leads)", sub: "Prospects ayant rempli le questionnaire du site web" },
  devis: { title: "Générateur de Devis Officiels", sub: "Calcul automatique de l'échéancier 50/20/30 et mentions BaridiMob" },
  storage: { title: "خزينة وصولات BaridiMob (Cloudflare R2)", sub: "Reçus sécurisés et directement vérifiables stockés dans le bucket 'vision'" },
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
    renderOverviewProjects(data.slice(0, 5));
    renderProjectsTable(data);
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
// RENDERING
// ==========================================
function formatDzd(val) {
  const num = Number(val) || 0;
  return num.toLocaleString('fr-FR');
}

function formatWhatsAppLink(phone) {
  if (!phone) return '#';
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '213' + cleaned.slice(1);
  } else if (!cleaned.startsWith('213')) {
    cleaned = '213' + cleaned;
  }
  return `https://wa.me/${cleaned}`;
}

function getStageBadge(stage) {
  const map = {
    scoping: { label: 'Cadrage Initial', class: 'stage-scoping' },
    design_20: { label: 'Design (20%)', class: 'stage-design_20' },
    dev_30: { label: 'Dév & Base (30%)', class: 'stage-dev_30' },
    delivered_30: { label: 'Livré & Clôturé', class: 'stage-delivered_30' },
  };
  const item = map[stage] || { label: stage, class: 'stage-scoping' };
  return `<span class="badge-stage ${item.class}">${item.label}</span>`;
}

// 1. Overview Projects Table
function renderOverviewProjects(projects) {
  const tbody = document.getElementById('overview-projects-tbody');
  if (!tbody) return;

  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--ink-muted); padding: 24px;">Aucun projet enregistré pour le moment.</td></tr>`;
    return;
  }

  tbody.innerHTML = projects.map(p => {
    const clientName = p.client ? p.client.companyName : 'Client Inconnu';
    const total = Number(p.priceTotalDzd) || 0;

    return `
      <tr>
        <td>
          <strong style="color: var(--ink); font-size: 0.92rem;">${escapeHtml(p.title)}</strong>
          <div style="font-size: 0.78rem; color: var(--ink-muted);">${escapeHtml(clientName)}</div>
        </td>
        <td><span class="badge badge-gray">${escapeHtml(p.type)}</span></td>
        <td><strong style="font-size: 0.92rem;">${formatDzd(total)} DZD</strong></td>
        <td>
          <div class="milestone-progress">
            <div class="progress-track">
              <div class="progress-segment seg-50 ${p.m1Paid ? 'paid' : 'unpaid'}" title="M1: 50% (${p.m1Paid ? 'Payé' : 'En attente'})"></div>
              <div class="progress-segment seg-20 ${p.m2Paid ? 'paid' : 'unpaid'}" title="M2: 20% (${p.m2Paid ? 'Payé' : 'En attente'})"></div>
              <div class="progress-segment seg-30 ${p.m3Paid ? 'paid' : 'unpaid'}" title="M3: 30% (${p.m3Paid ? 'Payé' : 'En attente'})"></div>
            </div>
            <div class="milestone-labels">
              <span>50%</span><span>20%</span><span>30%</span>
            </div>
          </div>
        </td>
        <td>${getStageBadge(p.stage)}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="switchTab('projects')">Détails</button>
        </td>
      </tr>
    `;
  }).join('');
}

// 2. Full Projects Table with 50/20/30 Milestones & BaridiMob Upload
function renderProjectsTable(projects) {
  const tbody = document.getElementById('projects-table-tbody');
  if (!tbody) return;

  if (projects.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--ink-muted); padding: 32px;">Aucun projet pour le moment.</td></tr>`;
    return;
  }

  tbody.innerHTML = projects.map(p => {
    const client = p.client || {};
    const company = client.companyName || 'Sans client';
    const contact = client.contactName || '-';
    const phone = client.phone || '';
    const total = Number(p.priceTotalDzd) || 0;

    const renderMCell = (milestoneKey, label, pct, paid, amount, receiptUrl) => {
      const amtStr = formatDzd(amount);
      if (paid) {
        return `
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="badge badge-green">Payé</span>
              <strong style="font-size: 0.85rem;">${amtStr} DZD</strong>
            </div>
            ${receiptUrl ? `
              <button class="btn btn-secondary btn-sm" style="padding: 2px 8px; font-size: 0.72rem;" onclick="viewReceipt('${escapeHtml(p.title)} - ${label}', '${receiptUrl}')">
                Voir Reçu (R2)
              </button>
            ` : '<small style="color: var(--ink-muted); font-size: 0.7rem;">Pas de reçu</small>'}
          </div>
        `;
      } else {
        return `
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="badge badge-yellow">En attente</span>
              <span style="font-size: 0.85rem; color: var(--ink-muted);">${amtStr} DZD</span>
            </div>
            <button class="btn btn-secondary btn-sm" style="padding: 2px 8px; font-size: 0.72rem; border-color: var(--cyan); color: var(--cyan-dark);" onclick="openUploadReceiptModal('${p.id}', '${escapeHtml(p.title)}', '${milestoneKey}')">
              Ajouter Reçu BaridiMob
            </button>
          </div>
        `;
      }
    };

    return `
      <tr>
        <td>
          <strong style="color: var(--ink); font-size: 0.95rem;">${escapeHtml(p.title)}</strong>
          <div style="font-size: 0.8rem; color: var(--ink-muted); font-weight: 600;">${escapeHtml(company)}</div>
          <div style="display: flex; gap: 6px; margin-top: 4px;">
            ${p.domainIncluded ? '<span class="badge badge-cyan" style="font-size: 0.65rem;">Domaine Inclus</span>' : ''}
            ${p.hostingIncluded ? '<span class="badge badge-purple" style="font-size: 0.65rem;">Hébergement Inclus</span>' : ''}
          </div>
        </td>
        <td>
          <div>${escapeHtml(contact)}</div>
          ${phone ? `<a href="${formatWhatsAppLink(phone)}" target="_blank" class="wa-link" style="margin-top: 3px;">${escapeHtml(phone)}</a>` : ''}
        </td>
        <td>
          <strong style="font-size: 1.05rem; color: var(--ink);">${formatDzd(total)}</strong>
          <small style="color: var(--ink-muted); font-weight: 600;"> DZD</small>
        </td>
        <td>${renderMCell('m1', 'M1 (50%)', 50, p.m1Paid, p.m1AmountDzd, p.m1ReceiptUrl)}</td>
        <td>${renderMCell('m2', 'M2 (20%)', 20, p.m2Paid, p.m2AmountDzd, p.m2ReceiptUrl)}</td>
        <td>${renderMCell('m3', 'M3 (30%)', 30, p.m3Paid, p.m3AmountDzd, p.m3ReceiptUrl)}</td>
        <td>
          <select onchange="updateProjectStage('${p.id}', this.value)" style="padding: 4px 8px; border-radius: var(--radius-sm); border: 1px solid var(--border); font-size: 0.78rem; font-weight: 600;">
            <option value="scoping" ${p.stage === 'scoping' ? 'selected' : ''}>Cadrage Initial</option>
            <option value="design_20" ${p.stage === 'design_20' ? 'selected' : ''}>Design (20%)</option>
            <option value="dev_30" ${p.stage === 'dev_30' ? 'selected' : ''}>Dév & DB (30%)</option>
            <option value="delivered_30" ${p.stage === 'delivered_30' ? 'selected' : ''}>Livré & Clôturé</option>
          </select>
        </td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="prepareDevisForProject('${p.id}')">
            Devis
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 3. Clients Table
function renderClientsTable(clients) {
  const tbody = document.getElementById('clients-table-tbody');
  if (!tbody) return;

  if (clients.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--ink-muted); padding: 32px;">Aucun client enregistré.</td></tr>`;
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
        ${c.phone ? `<a href="${formatWhatsAppLink(c.phone)}" target="_blank" class="wa-link">${escapeHtml(c.phone)}</a>` : '-'}
      </td>
      <td><small style="color: var(--ink-muted);">${escapeHtml(c.email || '-')}</small></td>
      <td>${escapeHtml(c.industry || '-')}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openNewProjectForClient('${c.id}')">+ Projet</button>
      </td>
    </tr>
  `).join('');
}

// 4. Leads Table
function renderLeadsTable(leads) {
  const tbody = document.getElementById('leads-table-tbody');
  if (!tbody) return;

  if (leads.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--ink-muted); padding: 32px;">Aucune demande de devis reçue pour le moment.</td></tr>`;
    return;
  }

  tbody.innerHTML = leads.map(l => {
    const dateStr = l.createdAt ? new Date(l.createdAt).toLocaleDateString('fr-FR') : '-';
    return `
      <tr>
        <td><strong style="color: var(--ink);">${escapeHtml(l.name)}</strong></td>
        <td>
          ${l.phone ? `<a href="${formatWhatsAppLink(l.phone)}" target="_blank" class="wa-link">${escapeHtml(l.phone)}</a>` : '-'}
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
            Convertir en Client
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. Cloudflare R2 Receipts Storage Explorer
function renderStorageExplorer() {
  const grid = document.getElementById('r2-receipts-grid');
  if (!grid) return;

  const receipts = [];
  for (const p of state.projects) {
    const clientName = p.client ? p.client.companyName : 'Client';
    if (p.m1Paid && p.m1ReceiptUrl) {
      receipts.push({ projectTitle: p.title, clientName, milestone: 'M1 - 50% (Acompte)', url: p.m1ReceiptUrl, date: p.m1PaidAt });
    }
    if (p.m2Paid && p.m2ReceiptUrl) {
      receipts.push({ projectTitle: p.title, clientName, milestone: 'M2 - 20% (Design)', url: p.m2ReceiptUrl, date: p.m2PaidAt });
    }
    if (p.m3Paid && p.m3ReceiptUrl) {
      receipts.push({ projectTitle: p.title, clientName, milestone: 'M3 - 30% (Livraison)', url: p.m3ReceiptUrl, date: p.m3PaidAt });
    }
  }

  if (receipts.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; background: var(--paper); border: 1px dashed var(--border); border-radius: var(--radius-lg);">
        <p style="color: var(--ink-muted); font-size: 0.95rem;">Aucun reçu BaridiMob n'a encore été uploadé sur le bucket Cloudflare R2.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = receipts.map(r => `
    <div class="r2-card">
      <img src="${r.url}" alt="Reçu BaridiMob" loading="lazy" onclick="viewReceipt('${escapeHtml(r.projectTitle)} - ${r.milestone}', '${r.url}')">
      <div class="r2-card-body">
        <strong style="font-size: 0.88rem; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(r.projectTitle)}</strong>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
          <span style="color: var(--ink-muted);">${escapeHtml(r.clientName)}</span>
          <span class="badge badge-green" style="font-size: 0.65rem;">${r.milestone}</span>
        </div>
        <a href="${r.url}" target="_blank" style="font-size: 0.72rem; color: var(--cyan-dark); text-decoration: none; margin-top: 4px;">Lien Cloudflare R2</a>
      </div>
    </div>
  `).join('');
}

// ==========================================
// DEVIS GENERATOR
// ==========================================
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
  state.devisItems.push({ title: 'Nouvelle prestation', price: 20000 });
  renderDevisRows();
  renderDevisLive();
}

function removeDevisItemRow(idx) {
  if (state.devisItems.length <= 1) {
    showToast('Le Devis doit contenir au moins une ligne.', 'error');
    return;
  }
  state.devisItems.splice(idx, 1);
  renderDevisRows();
  renderDevisLive();
}

function renderDevisLive() {
  const clientNameInput = document.getElementById('devis-client-name');
  const clientContactInput = document.getElementById('devis-client-contact');
  const projectTitleInput = document.getElementById('devis-project-title');
  const domainCheck = document.getElementById('devis-domain-check');
  const hostingCheck = document.getElementById('devis-hosting-check');

  const clientName = clientNameInput ? clientNameInput.value || 'Client' : 'Client';
  const clientContact = clientContactInput ? clientContactInput.value || '-' : '-';
  const projectTitle = projectTitleInput ? projectTitleInput.value || 'Projet Numérique' : 'Projet Numérique';

  document.getElementById('devis-view-client-name').textContent = clientName;
  document.getElementById('devis-view-client-contact').textContent = clientContact;
  document.getElementById('devis-view-project-title').textContent = projectTitle;

  const domainEl = document.getElementById('devis-view-domain');
  if (domainEl) {
    if (domainCheck && domainCheck.checked) {
      domainEl.textContent = 'Nom de domaine inclus (pris en charge par VISION)';
      domainEl.style.color = '#059669';
    } else {
      domainEl.textContent = 'Nom de domaine : Aux frais du client';
      domainEl.style.color = '#B45309';
    }
  }

  const hostingEl = document.getElementById('devis-view-hosting');
  if (hostingEl) {
    if (hostingCheck && hostingCheck.checked) {
      hostingEl.textContent = 'Hébergement Cloud inclus';
      hostingEl.style.color = '#059669';
    } else {
      hostingEl.textContent = 'Hébergement Cloud : Aux frais du client';
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
          <td style="padding: 10px 14px; text-align: right; font-weight: 700; font-size: 0.88rem;">${formatDzd(item.price)} DZD</td>
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
    document.getElementById('devis-client-contact').value = `${client.wilaya || 'Algérie'} - ${client.phone} - ${client.contactName}`;
    renderDevisLive();
  }
}

async function saveDevisToDb() {
  try {
    const select = document.getElementById('devis-client-select');
    const clientId = select ? select.value : '';
    if (!clientId) {
      showToast('Veuillez sélectionner un client dans la liste pour enregistrer.', 'error');
      return;
    }

    const proj = state.projects.find(p => p.clientId === clientId) || state.projects[0];
    if (!proj) {
      showToast('Créez d\'abord un projet pour ce client avant d\'enregistrer le devis.', 'error');
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

    if (!res.ok) throw new Error('Erreur lors de l\'enregistrement');
    const invoice = await res.json();
    document.getElementById('devis-view-number').textContent = `DEVIS N° ${invoice.invoiceNumber}`;
    showToast(`Devis ${invoice.invoiceNumber} enregistré avec succès dans Neon DB.`);
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
    { title: `Développement complet du projet: ${proj.title}`, price: total },
  ];
  renderDevisRows();
  renderDevisLive();
}

// ==========================================
// ACTIONS
// ==========================================
async function updateProjectStage(projectId, newStage) {
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage }),
    });
    if (!res.ok) throw new Error('Impossible de mettre à jour l\'étape');
    showToast('Étape du projet mise à jour avec succès');
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
    showToast('Veuillez sélectionner un fichier image.', 'error');
    return;
  }

  const formData = new FormData();
  formData.append('milestone', milestone);
  formData.append('receipt', fileInput.files[0]);

  try {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Téléversement vers Cloudflare R2...</span>';

    const res = await fetch(`/api/projects/${projectId}/receipt`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Erreur lors du téléversement');
    }

    const data = await res.json();
    showToast('Reçu vérifié et stocké sur Cloudflare R2 avec succès.');
    closeModal('upload-receipt-modal');
    await fetchProjects();
    await fetchStats();
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Uploader sur Cloudflare R2</span>';
  }
}

function viewReceipt(title, url) {
  document.getElementById('view-receipt-title').textContent = title;
  document.getElementById('view-receipt-img').src = url;
  document.getElementById('view-receipt-info').textContent = 'Hébergé sur Cloudflare R2 (bucket: vision)';
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

    if (!res.ok) throw new Error('Erreur lors de l\'ajout du client');
    showToast(`Client ${companyName} enregistré avec succès.`);
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

    if (!res.ok) throw new Error('Erreur lors de la création du projet');
    showToast(`Projet "${title}" créé avec succès.`);
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
    projSelect.innerHTML = `<option value="">-- Sélectionner un client --</option>` + optionsHtml;
  }
  if (devisSelect) {
    devisSelect.innerHTML = `<option value="">-- Choisir un client --</option>` + optionsHtml;
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
      renderProjectsTable(filtered);
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
