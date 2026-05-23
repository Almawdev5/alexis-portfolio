/* ============================================================
   ADMIN DASHBOARD | admin.js
   ============================================================ */

const ADMIN_PIN  = '@alexportifolio#';
const STORE_KEY  = 'alexPortfolioData';
const AUTH_KEY   = 'alexAdminAuth';

// ── HELPERS ──────────────────────────────────────────────────
const $  = id => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls)  e.className   = cls;
  if (html) e.innerHTML   = html;
  return e;
};

function toast(msg, type = 'success') {
  const t = $('adminToast');
  t.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'times-circle'}"></i> ${msg}`;
  t.className = `admin-toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3000);
}

function openModal(id)  { $(id).classList.add('open')    }
function closeModal(id) { $(id).classList.remove('open') }

function openSection(name) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
  $(`sec-${name}`)?.classList.add('active');
  document.querySelector(`[data-section="${name}"]`)?.classList.add('active');
  renderSection(name);
}

window.openSection = openSection;

// ── DATA LAYER ───────────────────────────────────────────────
function loadData() {
  const saved = localStorage.getItem(STORE_KEY);
  if (saved) return JSON.parse(saved);
  // Deep clone from data.js
  return JSON.parse(JSON.stringify(portfolioData));
}

function saveData(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

function resetAllData() {
  if (!confirm('Are you sure? This will reset ALL your custom edits.')) return;
  localStorage.removeItem(STORE_KEY);
  toast('Data reset to defaults!');
  renderSection('dashboard');
}
window.resetAllData = resetAllData;

// ── AUTH ─────────────────────────────────────────────────────
function checkAuth() {
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

function showDashboard() {
  $('loginScreen').style.display = 'none';
  $('adminWrap').style.display   = 'block';
  renderSection('dashboard');
}

$('loginBtn').addEventListener('click', () => {
  const val = $('pinInput').value;
  if (val === ADMIN_PIN) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    $('loginError').style.display = 'none';
    showDashboard();
  } else {
    $('loginError').style.display = 'block';
    $('pinInput').value = '';
    $('pinInput').focus();
  }
});

$('pinInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') $('loginBtn').click();
});

$('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem(AUTH_KEY);
  location.reload();
});

// Sidebar nav
document.querySelectorAll('.admin-nav-item').forEach(item => {
  item.addEventListener('click', () => openSection(item.dataset.section));
});

// Auto-login if session active
if (checkAuth()) showDashboard();

// ── DASHBOARD ────────────────────────────────────────────────
function renderDashboard() {
  const data  = loadData();
  const stats = $('dashStats');
  stats.innerHTML = '';
  [
    { num: data.projects.length,     lbl: 'Projects',     icon: 'fas fa-rocket'      },
    { num: data.skills.length,       lbl: 'Skill Groups', icon: 'fas fa-code'        },
    { num: data.services.length,     lbl: 'Services',     icon: 'fas fa-cogs'        },
    { num: data.certificates.length, lbl: 'Certificates', icon: 'fas fa-certificate' },
    { num: data.skills.reduce((a,s)=>a+s.items.length,0), lbl: 'Total Skills', icon: 'fas fa-star' },
  ].forEach(s => {
    stats.innerHTML += `
      <div class="admin-stat-card">
        <div class="admin-stat-num">${s.num}</div>
        <div class="admin-stat-lbl">${s.lbl}</div>
      </div>`;
  });
}

// ── PERSONAL ─────────────────────────────────────────────────
function renderPersonal() {
  const data = loadData();
  const p    = data.personal;
  $('p-name').value     = p.name     || '';
  $('p-tagline').value  = p.tagline  || '';
  $('p-bio').value      = p.bio      || '';
  $('p-email').value    = p.email    || '';
  $('p-phone').value    = p.phone    || '';
  $('p-location').value = p.location || '';
  $('p-years').value    = p.yearsOfExperience || '';
  const github   = data.social.find(s => s.name === 'GitHub');
  const linkedin = data.social.find(s => s.name === 'LinkedIn');
  const telegram = data.social.find(s => s.name === 'Telegram');
  $('p-github').value   = github?.url   || '';
  $('p-linkedin').value = linkedin?.url || '';
  $('p-telegram').value = telegram?.url || '';
}

$('savePersonalBtn').addEventListener('click', () => {
  const data = loadData();
  data.personal.name             = $('p-name').value;
  data.personal.tagline          = $('p-tagline').value;
  data.personal.bio              = $('p-bio').value;
  data.personal.email            = $('p-email').value;
  data.personal.phone            = $('p-phone').value;
  data.personal.location         = $('p-location').value;
  data.personal.yearsOfExperience = parseInt($('p-years').value) || 0;

  const setSocial = (name, icon, url) => {
    const idx = data.social.findIndex(s => s.name === name);
    if (idx > -1) data.social[idx].url = url;
    else data.social.push({ name, icon, url });
  };
  setSocial('GitHub',   'fab fa-github',         $('p-github').value);
  setSocial('LinkedIn', 'fab fa-linkedin-in',     $('p-linkedin').value);
  setSocial('Telegram', 'fab fa-telegram-plane',  $('p-telegram').value);

  saveData(data);
  toast('Personal info saved!');
});

// ── PROJECTS ─────────────────────────────────────────────────
let editProjectIdx = -1;

function renderProjects() {
  const data = loadData();
  const list = $('projectsList');
  list.innerHTML = '';
  if (!data.projects.length) {
    list.innerHTML = '<div style="color:var(--text2);font-size:.85rem;padding:16px">No projects yet. Add one!</div>';
    return;
  }
  data.projects.forEach((p, i) => {
    const item = el('div', 'admin-item');
    item.innerHTML = `
      <div class="admin-item-icon"><i class="fas fa-rocket"></i></div>
      <div class="admin-item-info">
        <div class="admin-item-name">${p.name} ${p.featured ? '⭐' : ''}</div>
        <div class="admin-item-meta">${p.tech.join(', ')} · ${p.live !== '#' ? '<a href="'+p.live+'" target="_blank" style="color:var(--accent)">Live</a>' : 'No live link'}</div>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-edit" onclick="editProject(${i})"><i class="fas fa-pen"></i></button>
        <button class="admin-btn-del"  onclick="deleteProject(${i})"><i class="fas fa-trash"></i></button>
      </div>`;
    list.appendChild(item);
  });
}

window.editProject = function(i) {
  const data = loadData();
  const p    = data.projects[i];
  editProjectIdx = i;
  $('projectModalTitle').textContent = 'Edit Project';
  $('proj-name').value     = p.name;
  $('proj-desc').value     = p.description;
  $('proj-live').value     = p.live;
  $('proj-github').value   = p.github;
  $('proj-tech').value     = p.tech.join(', ');
  $('proj-image').value    = p.image;
  $('proj-featured').value = p.featured ? 'true' : 'false';
  openModal('projectModal');
};

window.deleteProject = function(i) {
  if (!confirm('Delete this project?')) return;
  const data = loadData();
  data.projects.splice(i, 1);
  saveData(data);
  renderProjects();
  toast('Project deleted!');
};

$('addProjectBtn').addEventListener('click', () => {
  editProjectIdx = -1;
  $('projectModalTitle').textContent = 'Add Project';
  ['proj-name','proj-desc','proj-live','proj-github','proj-tech','proj-image'].forEach(id => $(id).value = '');
  $('proj-featured').value = 'false';
  openModal('projectModal');
});

$('saveProjectBtn').addEventListener('click', () => {
  const data    = loadData();
  const project = {
    name:        $('proj-name').value.trim(),
    description: $('proj-desc').value.trim(),
    live:        $('proj-live').value.trim()   || '#',
    github:      $('proj-github').value.trim() || '#',
    tech:        $('proj-tech').value.split(',').map(t => t.trim()).filter(Boolean),
    image:       $('proj-image').value.trim()  || 'assets/img/project-demo.png',
    featured:    $('proj-featured').value === 'true',
  };
  if (!project.name) { toast('Project name is required!', 'error'); return; }
  if (editProjectIdx > -1) data.projects[editProjectIdx] = project;
  else data.projects.unshift(project);
  saveData(data);
  closeModal('projectModal');
  renderProjects();
  toast(editProjectIdx > -1 ? 'Project updated!' : 'Project added!');
});

// ── SKILLS ───────────────────────────────────────────────────
let editSkillIdx = -1;

function renderSkills() {
  const data = loadData();
  const list = $('skillsList');
  list.innerHTML = '';
  data.skills.forEach((cat, i) => {
    const item = el('div', 'admin-item');
    item.innerHTML = `
      <div class="admin-item-icon"><i class="${cat.icon}"></i></div>
      <div class="admin-item-info">
        <div class="admin-item-name">${cat.category}</div>
        <div class="admin-item-meta">${cat.items.join(', ')}</div>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-edit" onclick="editSkill(${i})"><i class="fas fa-pen"></i></button>
        <button class="admin-btn-del"  onclick="deleteSkill(${i})"><i class="fas fa-trash"></i></button>
      </div>`;
    list.appendChild(item);
  });
}

window.editSkill = function(i) {
  const data = loadData();
  const cat  = data.skills[i];
  editSkillIdx = i;
  $('skillModalTitle').textContent = 'Edit Skill Category';
  $('skill-cat').value   = cat.category;
  $('skill-icon').value  = cat.icon;
  $('skill-items').value = cat.items.join(', ');
  openModal('skillModal');
};

window.deleteSkill = function(i) {
  if (!confirm('Delete this skill category?')) return;
  const data = loadData();
  data.skills.splice(i, 1);
  saveData(data);
  renderSkills();
  toast('Skill category deleted!');
};

$('addSkillCatBtn').addEventListener('click', () => {
  editSkillIdx = -1;
  $('skillModalTitle').textContent = 'Add Skill Category';
  ['skill-cat','skill-icon','skill-items'].forEach(id => $(id).value = '');
  openModal('skillModal');
});

$('saveSkillBtn').addEventListener('click', () => {
  const data = loadData();
  const cat  = {
    category: $('skill-cat').value.trim(),
    icon:     $('skill-icon').value.trim() || 'fas fa-code',
    items:    $('skill-items').value.split(',').map(s => s.trim()).filter(Boolean),
  };
  if (!cat.category) { toast('Category name is required!', 'error'); return; }
  if (editSkillIdx > -1) data.skills[editSkillIdx] = cat;
  else data.skills.push(cat);
  saveData(data);
  closeModal('skillModal');
  renderSkills();
  toast(editSkillIdx > -1 ? 'Skill updated!' : 'Skill category added!');
});

// ── SERVICES ─────────────────────────────────────────────────
let editServiceIdx = -1;

function renderServices() {
  const data = loadData();
  const list = $('servicesList');
  list.innerHTML = '';
  data.services.forEach((s, i) => {
    const item = el('div', 'admin-item');
    item.innerHTML = `
      <div class="admin-item-icon"><i class="${s.icon}"></i></div>
      <div class="admin-item-info">
        <div class="admin-item-name">${s.title}</div>
        <div class="admin-item-meta">${s.description.substring(0,80)}...</div>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-edit" onclick="editService(${i})"><i class="fas fa-pen"></i></button>
        <button class="admin-btn-del"  onclick="deleteService(${i})"><i class="fas fa-trash"></i></button>
      </div>`;
    list.appendChild(item);
  });
}

window.editService = function(i) {
  const data = loadData();
  const s    = data.services[i];
  editServiceIdx = i;
  $('serviceModalTitle').textContent = 'Edit Service';
  $('svc-title').value = s.title;
  $('svc-icon').value  = s.icon;
  $('svc-desc').value  = s.description;
  openModal('serviceModal');
};

window.deleteService = function(i) {
  if (!confirm('Delete this service?')) return;
  const data = loadData();
  data.services.splice(i, 1);
  saveData(data);
  renderServices();
  toast('Service deleted!');
};

$('addServiceBtn').addEventListener('click', () => {
  editServiceIdx = -1;
  $('serviceModalTitle').textContent = 'Add Service';
  ['svc-title','svc-icon','svc-desc'].forEach(id => $(id).value = '');
  openModal('serviceModal');
});

$('saveServiceBtn').addEventListener('click', () => {
  const data    = loadData();
  const service = {
    title:       $('svc-title').value.trim(),
    icon:        $('svc-icon').value.trim() || 'fas fa-cogs',
    description: $('svc-desc').value.trim(),
  };
  if (!service.title) { toast('Service title is required!', 'error'); return; }
  if (editServiceIdx > -1) data.services[editServiceIdx] = service;
  else data.services.push(service);
  saveData(data);
  closeModal('serviceModal');
  renderServices();
  toast(editServiceIdx > -1 ? 'Service updated!' : 'Service added!');
});

// ── CERTIFICATES ─────────────────────────────────────────────
let editCertIdx = -1;

function renderCerts() {
  const data = loadData();
  const list = $('certsList');
  list.innerHTML = '';
  if (!data.certificates.length) {
    list.innerHTML = '<div style="color:var(--text2);font-size:.85rem;padding:16px">No certificates yet. Add one!</div>';
    return;
  }
  data.certificates.forEach((c, i) => {
    const imgFile = c.image.split('/').pop().replace(/ /g, '%20');
    const imgSrc  = `../assets/img/${imgFile}`;
    const item = el('div', 'admin-item');
    item.innerHTML = `
      <div style="width:64px;height:48px;border-radius:8px;overflow:hidden;background:var(--bg2);border:1px solid var(--border);flex-shrink:0;">
        <img src="${imgSrc}" alt="${c.title}"
          style="width:100%;height:100%;object-fit:cover;display:block;"
          onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\'display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3)\'><i class=\'fas fa-certificate\'></i></div>'">
      </div>
      <div class="admin-item-info">
        <div class="admin-item-name">${c.title}</div>
        <div class="admin-item-meta">${c.issuer} · ${c.year}</div>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-edit" onclick="editCert(${i})"><i class="fas fa-pen"></i></button>
        <button class="admin-btn-del"  onclick="deleteCert(${i})"><i class="fas fa-trash"></i></button>
      </div>`;
    list.appendChild(item);
  });
}

window.editCert = function(i) {
  const data = loadData();
  const c    = data.certificates[i];
  editCertIdx = i;
  $('certModalTitle').textContent = 'Edit Certificate';
  $('cert-title').value  = c.title;
  $('cert-issuer').value = c.issuer;
  $('cert-year').value   = c.year;
  $('cert-image').value  = c.image;
  $('cert-desc').value   = c.description;
  openModal('certModal');
};

window.deleteCert = function(i) {
  if (!confirm('Delete this certificate?')) return;
  const data = loadData();
  data.certificates.splice(i, 1);
  saveData(data);
  renderCerts();
  toast('Certificate deleted!');
};

$('addCertBtn').addEventListener('click', () => {
  editCertIdx = -1;
  $('certModalTitle').textContent = 'Add Certificate';
  ['cert-title','cert-issuer','cert-year','cert-image','cert-desc'].forEach(id => $(id).value = '');
  openModal('certModal');
});

$('saveCertBtn').addEventListener('click', () => {
  const data = loadData();
  const cert = {
    title:       $('cert-title').value.trim(),
    issuer:      $('cert-issuer').value.trim(),
    year:        $('cert-year').value.trim(),
    image:       $('cert-image').value.trim() || 'assets/img/cert.png',
    description: $('cert-desc').value.trim(),
  };
  if (!cert.title) { toast('Certificate title is required!', 'error'); return; }
  if (editCertIdx > -1) data.certificates[editCertIdx] = cert;
  else data.certificates.push(cert);
  saveData(data);
  closeModal('certModal');
  renderCerts();
  toast(editCertIdx > -1 ? 'Certificate updated!' : 'Certificate added!');
});

// ── SECTION ROUTER ───────────────────────────────────────────
function renderSection(name) {
  switch(name) {
    case 'dashboard':    renderDashboard(); break;
    case 'personal':     renderPersonal();  break;
    case 'projects':     renderProjects();  break;
    case 'skills':       renderSkills();    break;
    case 'services':     renderServices();  break;
    case 'certificates': renderCerts();     break;
  }
}

// Close modal on overlay click
document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});