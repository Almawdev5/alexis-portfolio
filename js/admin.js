/* ============================================================
   ADMIN DASHBOARD | admin.js — Supabase Backend
   ============================================================ */

const ADMIN_PIN = '@alexportifolio#';
const BUCKET    = 'portfolio-images';
const $  = id => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls)  e.className = cls;
  if (html) e.innerHTML = html;
  return e;
};

// ── TOAST ────────────────────────────────────────────────────
function toast(msg, type = 'success') {
  const t = $('adminToast');
  t.innerHTML = `<i class="fas fa-${type==='success'?'check-circle':'times-circle'}"></i> ${msg}`;
  t.className = `admin-toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3200);
}

function openModal(id)  { $(id).classList.add('open') }
function closeModal(id) { $(id).classList.remove('open') }
window.closeModal = closeModal;

// Remove image preview and from URLs array
window.removeImgPreview = function(btn) {
  const item = btn.parentElement;
  const url  = item.dataset.url;
  projUploadedUrls = projUploadedUrls.filter(u => u !== url);
  item.remove();
};

window.removeCertImgPreview = function() {
  certUploadedUrl = '';
  $('certImgPreview').innerHTML = '';
};

function openSection(name) {
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
  $(`sec-${name}`)?.classList.add('active');
  document.querySelector(`[data-section="${name}"]`)?.classList.add('active');
  renderSection(name);
}
window.openSection = openSection;

// ── AUTH ─────────────────────────────────────────────────────
function showDashboard() {
  $('loginScreen').style.display = 'none';
  $('adminWrap').style.display   = 'block';
  renderSection('dashboard');
}
$('loginBtn').addEventListener('click', () => {
  if ($('pinInput').value === ADMIN_PIN) {
    sessionStorage.setItem('alexAdminAuth','true');
    $('loginError').style.display = 'none';
    showDashboard();
  } else {
    $('loginError').style.display = 'block';
    $('pinInput').value = '';
    $('pinInput').focus();
  }
});
$('pinInput').addEventListener('keydown', e => { if(e.key==='Enter') $('loginBtn').click(); });
$('logoutBtn').addEventListener('click', () => { sessionStorage.removeItem('alexAdminAuth'); location.reload(); });
document.querySelectorAll('.admin-nav-item').forEach(item => {
  item.addEventListener('click', () => openSection(item.dataset.section));
});
if (sessionStorage.getItem('alexAdminAuth')==='true') showDashboard();

// ── LOADING STATE ─────────────────────────────────────────────
function setLoading(id, msg='Loading...') {
  const e = $(id);
  if (e) e.innerHTML = `<div style="color:var(--text2);font-size:.85rem;padding:20px;text-align:center"><i class="fas fa-spinner fa-spin" style="color:var(--accent);margin-right:8px"></i>${msg}</div>`;
}

// ── IMAGE HELPERS ─────────────────────────────────────────────
function imgSrc(image) {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  return `../assets/img/${image.split('/').pop().replace(/ /g,'%20')}`;
}

// ── IMAGE UPLOAD ──────────────────────────────────────────────
async function uploadImage(file, folder='projects') {
  const ext      = file.name.split('.').pop().toLowerCase();
  const mimeMap  = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', webp:'image/webp', gif:'image/gif' };
  const mimeType = file.type || mimeMap[ext] || 'image/jpeg';
  const name     = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${name}`, {
    method: 'POST',
    headers: {
      'apikey':        SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Content-Type':  mimeType,
      'x-upsert':      'true',
    },
    body: file,
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('Upload error:', err);
    throw new Error(`Upload failed: ${res.status}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${name}`;
}

function setupUpload(areaId, inputId, previewId, progressId, barId, textId, multi, onDone) {
  const area = $(areaId), input = $(inputId);
  if (!area || !input) return;

  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover',  e => { e.preventDefault(); area.classList.add('drag'); });
  area.addEventListener('dragleave', () => area.classList.remove('drag'));
  area.addEventListener('drop', e => { e.preventDefault(); area.classList.remove('drag'); handleFiles(e.dataTransfer.files); });
  input.addEventListener('change', () => handleFiles(input.files));

  async function handleFiles(files) {
    if (!files.length) return;
    const progress = $(progressId), bar = $(barId), text = $(textId), previews = $(previewId);
    progress.style.display = 'block';
    bar.style.width = '5%';
    const urls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      text.textContent = `Uploading ${i+1} of ${files.length}...`;
      bar.style.width  = `${10 + (i/files.length)*80}%`;

      // Show local preview
      const previewItem = document.createElement('div');
      previewItem.className = 'img-preview-item';
      previewItem.innerHTML = `<img src="${URL.createObjectURL(file)}">`;
      previews.appendChild(previewItem);

      try {
        const folder = areaId.includes('cert') ? 'certificates' : 'projects';
        const url    = await uploadImage(file, folder);
        urls.push(url);
        previewItem.innerHTML = `
          <img src="${url}">
          <div class="img-preview-remove" onclick="this.parentElement.remove()">✕</div>`;
      } catch(err) {
        previewItem.remove();
        console.error(err);
        toast(`Upload failed: ${err.message}`, 'error');
      }
    }

    bar.style.width = '100%';
    text.textContent = urls.length ? `✅ ${urls.length} image(s) uploaded!` : '❌ Upload failed';
    setTimeout(() => { progress.style.display = 'none'; }, 2500);
    input.value = '';
    if (urls.length) onDone(urls);
  }
}

// Track uploaded URLs per modal
let projUploadedUrls = [];
let certUploadedUrl  = '';

function initUploads() {
  setupUpload('projUploadArea','proj-images-input','projImgPreviews',
    'projUploadProgress','projProgressBar','projProgressText', true,
    urls => projUploadedUrls.push(...urls));
  setupUpload('certUploadArea','cert-image-input','certImgPreview',
    'certUploadProgress','certProgressBar','certProgressText', false,
    urls => { certUploadedUrl = urls[0]||''; });
}
document.addEventListener('DOMContentLoaded', initUploads);

// ── DASHBOARD ─────────────────────────────────────────────────
async function renderDashboard() {
  const [skills, projects, services, certificates, messages] = await Promise.all([
    sb.get('skills'), sb.get('projects'), sb.get('services'),
    sb.get('certificates'), sb.get('messages').catch(()=>[]),
  ]);
  const unread = messages.filter(m=>!m.read).length;
  const badge  = $('msgBadge');
  if (badge && unread > 0) { badge.textContent = unread; badge.style.display = 'inline'; }

  const stats = $('dashStats');
  stats.innerHTML = '';
  [
    { num: projects.length,                                      lbl: 'Projects' },
    { num: skills.length,                                        lbl: 'Skill Groups' },
    { num: services.length,                                      lbl: 'Services' },
    { num: certificates.length,                                  lbl: 'Certificates' },
    { num: skills.reduce((a,s)=>a+(s.items||[]).length,0),       lbl: 'Total Skills' },
    { num: unread,                                               lbl: 'Unread Messages' },
  ].forEach(s => {
    stats.innerHTML += `<div class="admin-stat-card"><div class="admin-stat-num">${s.num}</div><div class="admin-stat-lbl">${s.lbl}</div></div>`;
  });
}

// ── PERSONAL ─────────────────────────────────────────────────
async function renderPersonal() {
  const p = await sb.getOne('personal');
  if (!p) { toast('No personal data found in Supabase', 'error'); return; }
  $('p-id').value       = p.id       || '';
  $('p-name').value     = p.name     || '';
  $('p-tagline').value  = p.tagline  || '';
  $('p-bio').value       = p.bio       || '';
  $('p-about-bio') && ($('p-about-bio').value = p.about_bio || '');
  $('p-email').value    = p.email    || '';
  $('p-phone').value    = p.phone    || '';
  $('p-location').value = p.location || '';
  $('p-years').value    = p.years_of_experience || '';
  const socials = await sb.get('social');
  $('p-github').value   = socials.find(s=>s.name==='GitHub')?.url   || '';
  $('p-linkedin').value = socials.find(s=>s.name==='LinkedIn')?.url || '';
  $('p-telegram').value = socials.find(s=>s.name==='Telegram')?.url || '';
}

$('savePersonalBtn').addEventListener('click', async () => {
  const id = $('p-id').value;
  if (!id) { toast('No personal record found!', 'error'); return; }
  await sb.update('personal', id, {
    name: $('p-name').value, tagline: $('p-tagline').value,
    bio: $('p-bio').value,
    about_bio: $('p-about-bio')?.value || '', email: $('p-email').value,
    phone: $('p-phone').value, location: $('p-location').value,
    years_of_experience: parseInt($('p-years').value)||0,
  });
  const socials = await sb.get('social');
  const upsertSocial = async (name, icon, url) => {
    const ex = socials.find(s=>s.name===name);
    if (ex) await sb.update('social', ex.id, { url });
    else    await sb.insert('social', { name, icon, url, sort_order: 99 });
  };
  await upsertSocial('GitHub',   'fab fa-github',         $('p-github').value);
  await upsertSocial('LinkedIn', 'fab fa-linkedin-in',    $('p-linkedin').value);
  await upsertSocial('Telegram', 'fab fa-telegram-plane', $('p-telegram').value);
  toast('Personal info saved! ✅');
});

// ── PROJECTS ─────────────────────────────────────────────────
let editProjectId = null;

async function renderProjects() {
  setLoading('projectsList','Loading projects...');
  const projects = await sb.get('projects');
  const list = $('projectsList');
  list.innerHTML = '';
  if (!projects.length) {
    list.innerHTML = '<div style="color:var(--text2);font-size:.85rem;padding:16px">No projects yet.</div>';
    return;
  }
  projects.forEach(p => {
    const src = imgSrc(p.image);
    const item = el('div','admin-item');
    item.innerHTML = `
      <div style="width:64px;height:48px;border-radius:8px;overflow:hidden;background:var(--bg2);border:1px solid var(--border);flex-shrink:0;">
        ${src ? `<img src="${src}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='<div style=display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3)><i class=fas\\ fa-rocket></i></div>'">` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3)"><i class="fas fa-rocket"></i></div>'}
      </div>
      <div class="admin-item-info">
        <div class="admin-item-name">${p.name} ${p.featured?'⭐':''}</div>
        <div class="admin-item-meta">${(p.tech||[]).join(', ')}</div>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-edit" onclick="editProject('${p.id}')"><i class="fas fa-pen"></i></button>
        <button class="admin-btn-del"  onclick="deleteProject('${p.id}')"><i class="fas fa-trash"></i></button>
      </div>`;
    list.appendChild(item);
  });
}

window.editProject = async function(id) {
  const projects = await sb.get('projects');
  const p = projects.find(x=>x.id===id);
  if (!p) return;
  editProjectId = id;
  projUploadedUrls = [];
  $('projImgPreviews').innerHTML = '';
  $('projectModalTitle').textContent = 'Edit Project';
  $('proj-name').value     = p.name || '';
  $('proj-desc').value     = p.description || '';
  $('proj-longdesc').value = p.long_description || '';
  $('proj-live').value     = p.live || '';
  $('proj-github').value   = p.github || '';
  $('proj-tech').value     = (p.tech||[]).join(', ');
  $('proj-featured').value = p.featured ? 'true' : 'false';

  // Show existing images
  const previews = $('projImgPreviews');
  const existingImgs = p.images || (p.image ? [p.image] : []);
  existingImgs.forEach((img, i) => {
    if (!img) return;
    const src  = imgSrc(img);
    const item = document.createElement('div');
    item.className = 'img-preview-item';
    item.dataset.url = img;
    item.innerHTML = `<img src="${src}" onerror="this.style.opacity='.3'"><div class="img-preview-remove" onclick="removeImgPreview(this)">✕</div>`;
    previews.appendChild(item);
    projUploadedUrls.push(img);
  });

  openModal('projectModal');
};

window.deleteProject = async function(id) {
  if (!confirm('Delete this project?')) return;
  await sb.delete('projects', id);
  renderProjects();
  toast('Project deleted!');
};

$('addProjectBtn').addEventListener('click', () => {
  editProjectId    = null;
  projUploadedUrls = [];
  $('projImgPreviews').innerHTML = '';
  $('projectModalTitle').textContent = 'Add Project';
  ['proj-name','proj-desc','proj-longdesc','proj-live','proj-github','proj-tech'].forEach(i => $(i).value='');
  $('proj-featured').value = 'false';
  openModal('projectModal');
});

$('saveProjectBtn').addEventListener('click', async () => {
  const name = $('proj-name').value.trim();
  if (!name) { toast('Project name is required!','error'); return; }
  const allImgs   = projUploadedUrls.filter(Boolean);
  const mainImage = allImgs[0] || '';
  const body = {
    name,
    description:      $('proj-desc').value.trim(),
    long_description: $('proj-longdesc').value.trim(),
    live:             $('proj-live').value.trim()   || '#',
    github:           $('proj-github').value.trim() || '#',
    tech:             $('proj-tech').value.split(',').map(t=>t.trim()).filter(Boolean),
    image:            mainImage,
    images:           allImgs.length ? allImgs : [mainImage],
    featured:         $('proj-featured').value === 'true',
    sort_order:       0,
  };
  if (editProjectId) await sb.update('projects', editProjectId, body);
  else               await sb.insert('projects', body);
  closeModal('projectModal');
  renderProjects();
  toast(editProjectId ? 'Project updated! ✅' : 'Project added! ✅');
});

// ── SKILLS ────────────────────────────────────────────────────
let editSkillId = null;

async function renderSkills() {
  setLoading('skillsList','Loading skills...');
  const skills = await sb.get('skills');
  const list   = $('skillsList');
  list.innerHTML = '';
  if (!skills.length) {
    list.innerHTML = '<div style="color:var(--text2);font-size:.85rem;padding:16px">No skills yet.</div>';
    return;
  }
  skills.forEach(cat => {
    const item = el('div','admin-item');
    item.innerHTML = `
      <div class="admin-item-icon"><i class="${cat.icon}"></i></div>
      <div class="admin-item-info">
        <div class="admin-item-name">${cat.category}</div>
        <div class="admin-item-meta">${(cat.items||[]).join(', ')}</div>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-edit" onclick="editSkill('${cat.id}')"><i class="fas fa-pen"></i></button>
        <button class="admin-btn-del"  onclick="deleteSkill('${cat.id}')"><i class="fas fa-trash"></i></button>
      </div>`;
    list.appendChild(item);
  });
}

window.editSkill = async function(id) {
  const skills = await sb.get('skills');
  const cat    = skills.find(x=>x.id===id);
  if (!cat) return;
  editSkillId = id;
  $('skillModalTitle').textContent = 'Edit Skill Category';
  $('skill-cat').value   = cat.category;
  $('skill-icon').value  = cat.icon;
  $('skill-items').value = (cat.items||[]).join(', ');
  openModal('skillModal');
};

window.deleteSkill = async function(id) {
  if (!confirm('Delete this skill category?')) return;
  await sb.delete('skills', id);
  renderSkills();
  toast('Skill deleted!');
};

$('addSkillCatBtn').addEventListener('click', () => {
  editSkillId = null;
  $('skillModalTitle').textContent = 'Add Skill Category';
  ['skill-cat','skill-icon','skill-items'].forEach(i => $(i).value='');
  openModal('skillModal');
});

$('saveSkillBtn').addEventListener('click', async () => {
  const body = {
    category:   $('skill-cat').value.trim(),
    icon:       $('skill-icon').value.trim() || 'fas fa-code',
    items:      $('skill-items').value.split(',').map(s=>s.trim()).filter(Boolean),
    sort_order: 0,
  };
  if (!body.category) { toast('Category name required!','error'); return; }
  if (editSkillId) await sb.update('skills', editSkillId, body);
  else             await sb.insert('skills', body);
  closeModal('skillModal');
  renderSkills();
  toast(editSkillId ? 'Skill updated! ✅' : 'Skill added! ✅');
});

// ── SERVICES ──────────────────────────────────────────────────
let editServiceId = null;

async function renderServices() {
  setLoading('servicesList','Loading services...');
  const services = await sb.get('services');
  const list     = $('servicesList');
  list.innerHTML = '';
  if (!services.length) {
    list.innerHTML = '<div style="color:var(--text2);font-size:.85rem;padding:16px">No services yet.</div>';
    return;
  }
  services.forEach(s => {
    const item = el('div','admin-item');
    item.innerHTML = `
      <div class="admin-item-icon"><i class="${s.icon}"></i></div>
      <div class="admin-item-info">
        <div class="admin-item-name">${s.title}</div>
        <div class="admin-item-meta">${(s.description||'').substring(0,80)}...</div>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-edit" onclick="editService('${s.id}')"><i class="fas fa-pen"></i></button>
        <button class="admin-btn-del"  onclick="deleteService('${s.id}')"><i class="fas fa-trash"></i></button>
      </div>`;
    list.appendChild(item);
  });
}

window.editService = async function(id) {
  const services = await sb.get('services');
  const s        = services.find(x=>x.id===id);
  if (!s) return;
  editServiceId = id;
  $('serviceModalTitle').textContent = 'Edit Service';
  $('svc-title').value = s.title;
  $('svc-icon').value  = s.icon;
  $('svc-desc').value  = s.description;
  openModal('serviceModal');
};

window.deleteService = async function(id) {
  if (!confirm('Delete this service?')) return;
  await sb.delete('services', id);
  renderServices();
  toast('Service deleted!');
};

$('addServiceBtn').addEventListener('click', () => {
  editServiceId = null;
  $('serviceModalTitle').textContent = 'Add Service';
  ['svc-title','svc-icon','svc-desc'].forEach(i => $(i).value='');
  openModal('serviceModal');
});

$('saveServiceBtn').addEventListener('click', async () => {
  const body = {
    title:       $('svc-title').value.trim(),
    icon:        $('svc-icon').value.trim() || 'fas fa-cogs',
    description: $('svc-desc').value.trim(),
    sort_order:  0,
  };
  if (!body.title) { toast('Title required!','error'); return; }
  if (editServiceId) await sb.update('services', editServiceId, body);
  else               await sb.insert('services', body);
  closeModal('serviceModal');
  renderServices();
  toast(editServiceId ? 'Service updated! ✅' : 'Service added! ✅');
});

// ── CERTIFICATES ──────────────────────────────────────────────
let editCertId = null;

async function renderCerts() {
  setLoading('certsList','Loading certificates...');
  const certs = await sb.get('certificates');
  const list  = $('certsList');
  list.innerHTML = '';
  if (!certs.length) {
    list.innerHTML = '<div style="color:var(--text2);font-size:.85rem;padding:16px">No certificates yet.</div>';
    return;
  }
  certs.forEach(c => {
    const src  = imgSrc(c.image);
    const item = el('div','admin-item');
    item.innerHTML = `
      <div style="width:64px;height:48px;border-radius:8px;overflow:hidden;background:var(--bg2);border:1px solid var(--border);flex-shrink:0;">
        ${src ? `<img src="${src}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.innerHTML='<div style=display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3)><i class=fas\\ fa-certificate></i></div>'">` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text3)"><i class="fas fa-certificate"></i></div>'}
      </div>
      <div class="admin-item-info">
        <div class="admin-item-name">${c.title}</div>
        <div class="admin-item-meta">${c.issuer} · ${c.year}</div>
      </div>
      <div class="admin-item-actions">
        <button class="admin-btn-edit" onclick="editCert('${c.id}')"><i class="fas fa-pen"></i></button>
        <button class="admin-btn-del"  onclick="deleteCert('${c.id}')"><i class="fas fa-trash"></i></button>
      </div>`;
    list.appendChild(item);
  });
}

window.editCert = async function(id) {
  const certs = await sb.get('certificates');
  const c     = certs.find(x=>x.id===id);
  if (!c) return;
  editCertId      = id;
  certUploadedUrl = c.image || '';
  $('certImgPreview').innerHTML = '';
  $('certModalTitle').textContent = 'Edit Certificate';
  $('cert-title').value  = c.title;
  $('cert-issuer').value = c.issuer;
  $('cert-year').value   = c.year;
  $('cert-desc').value   = c.description;

  // Show existing image
  if (c.image) {
    const src  = imgSrc(c.image);
    const item = document.createElement('div');
    item.className = 'img-preview-item';
    item.innerHTML = `<img src="${src}"><div class="img-preview-remove" onclick="this.parentElement.remove();certUploadedUrl='';">✕</div>`;
    $('certImgPreview').appendChild(item);
  }
  openModal('certModal');
};

window.deleteCert = async function(id) {
  if (!confirm('Delete this certificate?')) return;
  await sb.delete('certificates', id);
  renderCerts();
  toast('Certificate deleted!');
};

$('addCertBtn').addEventListener('click', () => {
  editCertId      = null;
  certUploadedUrl = '';
  $('certImgPreview').innerHTML = '';
  $('certModalTitle').textContent = 'Add Certificate';
  ['cert-title','cert-issuer','cert-year','cert-desc'].forEach(i => $(i).value='');
  openModal('certModal');
});

$('saveCertBtn').addEventListener('click', async () => {
  const body = {
    title:       $('cert-title').value.trim(),
    issuer:      $('cert-issuer').value.trim(),
    year:        $('cert-year').value.trim(),
    image:       certUploadedUrl || '',
    description: $('cert-desc').value.trim(),
    sort_order:  0,
  };
  if (!body.title) { toast('Title required!','error'); return; }
  if (editCertId) await sb.update('certificates', editCertId, body);
  else            await sb.insert('certificates', body);
  closeModal('certModal');
  renderCerts();
  toast(editCertId ? 'Certificate updated! ✅' : 'Certificate added! ✅');
});

// ── MESSAGES ──────────────────────────────────────────────────
async function renderMessages() {
  setLoading('messagesList','Loading messages...');
  const list = $('messagesList');
  try {
    const res  = await fetch(`${SUPABASE_URL}/rest/v1/messages?select=*&order=created_at.desc`, { headers: sb.headers });
    const msgs = await res.json();
    const unread = msgs.filter(m=>!m.read).length;
    const badge  = $('msgBadge');
    const count  = $('unreadCount');
    if (badge) { badge.textContent = unread; badge.style.display = unread>0?'inline':'none'; }
    if (count) count.textContent = unread>0 ? `(${unread} unread)` : '';
    list.innerHTML = '';
    if (!msgs.length) {
      list.innerHTML = '<div style="color:var(--text2);font-size:.85rem;padding:20px;text-align:center"><i class="fas fa-inbox" style="font-size:2rem;opacity:.3;display:block;margin-bottom:12px"></i>No messages yet.</div>';
      return;
    }
    msgs.forEach(m => {
      const date = new Date(m.created_at).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
      const item = el('div','admin-item');
      item.style.flexDirection = 'column';
      item.style.alignItems    = 'stretch';
      if (!m.read) item.style.borderColor = 'rgba(0,245,160,.3)';
      item.innerHTML = `
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:12px">
          <div class="admin-item-icon" style="${!m.read?'background:var(--accent);color:var(--bg)':''}">
            <i class="fas fa-envelope${m.read?'-open':''}"></i>
          </div>
          <div style="flex:1">
            <div class="admin-item-name">${m.name||'Unknown'} ${!m.read?'<span style="font-size:.6rem;background:var(--accent);color:var(--bg);padding:2px 7px;border-radius:100px;margin-left:6px">NEW</span>':''}</div>
            <div class="admin-item-meta">${m.email||''} · ${date}</div>
          </div>
          <div style="display:flex;gap:8px">
            <a href="mailto:${m.email}?subject=Re: ${m.subject||''}" class="admin-btn-edit" style="width:auto;padding:0 12px;font-size:.72rem;font-family:var(--fm);display:flex;align-items:center;gap:6px;text-decoration:none">
              <i class="fas fa-reply"></i> Reply
            </a>
            <button class="admin-btn-del" onclick="deleteMessage('${m.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </div>
        <div style="background:var(--bg2);border-radius:8px;padding:14px">
          <div style="font-family:var(--fm);font-size:.65rem;color:var(--accent);margin-bottom:6px">SUBJECT: ${m.subject||'No subject'}</div>
          <div style="font-size:.85rem;color:var(--text2);line-height:1.7">${m.message||''}</div>
        </div>`;
      if (!m.read) sb.update('messages', m.id, { read: true }).catch(()=>{});
      list.appendChild(item);
    });
  } catch(err) {
    list.innerHTML = '<div style="color:#ff5050;padding:16px">Error loading messages. Make sure the messages table exists.</div>';
  }
}

window.deleteMessage = async function(id) {
  if (!confirm('Delete this message?')) return;
  await sb.delete('messages', id);
  renderMessages();
  toast('Message deleted!');
};

// ── SECTION ROUTER ────────────────────────────────────────────
function renderSection(name) {
  const map = {
    dashboard:    renderDashboard,
    personal:     renderPersonal,
    projects:     renderProjects,
    skills:       renderSkills,
    services:     renderServices,
    certificates: renderCerts,
    messages:     renderMessages,
  };
  map[name]?.();
}

// Close modal on overlay click
document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if(e.target===overlay) overlay.classList.remove('open'); });
});

// ── CV / RESUME ───────────────────────────────────────────────
async function renderCV() {
  // Load current CV from personal table
  const personal = await sb.getOne('personal');
  const cvUrl    = personal?.resume || '';

  const nameEl    = document.getElementById('cvFileName');
  const urlEl     = document.getElementById('cvFileUrl');
  const downloadEl= document.getElementById('cvDownloadBtn');

  if (cvUrl) {
    const fileName = cvUrl.split('/').pop() || 'resume.pdf';
    if (nameEl)     nameEl.textContent  = fileName;
    if (urlEl)      urlEl.textContent   = 'Stored in Supabase Storage';
    if (downloadEl) { downloadEl.href = cvUrl; downloadEl.style.display = 'flex'; }
  } else {
    if (nameEl) nameEl.textContent = 'No CV uploaded yet';
    if (urlEl)  urlEl.textContent  = 'Upload a PDF below';
  }

  // Setup upload
  const area     = document.getElementById('cvUploadArea');
  const input    = document.getElementById('cv-file-input');
  const progress = document.getElementById('cvUploadProgress');
  const bar      = document.getElementById('cvProgressBar');
  const text     = document.getElementById('cvProgressText');

  if (!area || !input) return;

  // Remove old listeners by cloning
  const newArea  = area.cloneNode(true);
  const newInput = newArea.querySelector('#cv-file-input') || input;
  area.parentNode.replaceChild(newArea, area);

  newArea.addEventListener('click', () => newInput.click());
  newArea.addEventListener('dragover', e => { e.preventDefault(); newArea.style.borderColor = 'var(--accent)'; });
  newArea.addEventListener('dragleave', () => { newArea.style.borderColor = 'rgba(255,80,80,.3)'; });
  newArea.addEventListener('drop', e => { e.preventDefault(); handleCvUpload(e.dataTransfer.files[0]); });
  newInput.addEventListener('change', () => handleCvUpload(newInput.files[0]));

  async function handleCvUpload(file) {
    if (!file) return;
    if (file.type !== 'application/pdf') { toast('Please upload a PDF file!', 'error'); return; }

    progress.style.display = 'block';
    bar.style.width = '0%';
    text.textContent = 'Uploading CV...';

    try {
      // Upload to Supabase Storage
      const name = `cv/resume-${Date.now()}.pdf`;
      const res  = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${name}`, {
        method:  'POST',
        headers: {
          'apikey':        SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Content-Type':  'application/pdf',
          'x-upsert':      'true',
        },
        body: file,
      });

      if (!res.ok) throw new Error('Upload failed');

      bar.style.width  = '80%';
      const publicUrl  = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${name}`;

      // Save URL to personal table
      const p = await sb.getOne('personal');
      if (p) await sb.update('personal', p.id, { resume: publicUrl });

      bar.style.width  = '100%';
      text.textContent = '✅ CV uploaded successfully!';

      // Update display
      if (nameEl)     nameEl.textContent = file.name;
      if (urlEl)      urlEl.textContent  = 'Stored in Supabase Storage';
      if (downloadEl) { downloadEl.href = publicUrl; downloadEl.style.display = 'flex'; }

      toast('CV uploaded successfully! ✅');
      setTimeout(() => { progress.style.display = 'none'; }, 2000);

    } catch (err) {
      text.textContent = '❌ Upload failed. Try again.';
      bar.style.background = '#ff5050';
      toast('Upload failed!', 'error');
    }
    input.value = '';
  }
}

// Add CV to section router
const _origRenderSection2 = window.renderSection;
window.renderSection = function(name) {
  if (name === 'cv') renderCV();
  else _origRenderSection2(name);
};

// ── CV UPLOAD ─────────────────────────────────────────────────
let cvUploadedUrl = '';

async function uploadCV(file) {
  const ext      = file.name.split('.').pop().toLowerCase();
  const name     = `cv/almaw-cv-${Date.now()}.${ext}`;
  const mimeType = ext === 'pdf' ? 'application/pdf' : 'application/msword';
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${name}`, {
    method: 'POST',
    headers: {
      'apikey':        SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_ANON}`,
      'Content-Type':  mimeType,
      'x-upsert':      'true',
    },
    body: file,
  });
  if (!res.ok) throw new Error('CV upload failed');
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${name}`;
}

function initCVUpload() {
  const area     = document.getElementById('cvUploadArea');
  const input    = document.getElementById('cv-file-input');
  const status   = document.getElementById('cvUploadStatus');
  const bar      = document.getElementById('cvProgressBar');
  const text     = document.getElementById('cvProgressText');
  const current  = document.getElementById('cvCurrentFile');

  if (!area || !input) return;

  area.addEventListener('click', () => input.click());
  area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag'); });
  area.addEventListener('dragleave', () => area.classList.remove('drag'));
  area.addEventListener('drop', e => {
    e.preventDefault(); area.classList.remove('drag');
    if (e.dataTransfer.files[0]) handleCV(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', () => { if (input.files[0]) handleCV(input.files[0]); });

  async function handleCV(file) {
    status.style.display = 'block';
    bar.style.width      = '30%';
    text.textContent     = `Uploading ${file.name}...`;
    try {
      bar.style.width  = '70%';
      const url        = await uploadCV(file);
      cvUploadedUrl    = url;
      bar.style.width  = '100%';
      text.textContent = '✅ CV uploaded successfully!';

      // Show current file
      if (current) {
        current.innerHTML = `
          <div style="display:flex;align-items:center;gap:12px;background:var(--bg2);border:1px solid var(--accent-b);border-radius:8px;padding:12px 16px">
            <i class="fas fa-file-pdf" style="color:var(--accent);font-size:1.2rem"></i>
            <div style="flex:1">
              <div style="font-size:.82rem;font-weight:700">${file.name}</div>
              <div style="font-family:var(--fm);font-size:.65rem;color:var(--text2)">${(file.size/1024).toFixed(0)} KB</div>
            </div>
            <a href="${url}" target="_blank" class="admin-btn-edit" style="width:auto;padding:0 12px;font-size:.72rem;display:flex;align-items:center;gap:6px">
              <i class="fas fa-eye"></i> Preview
            </a>
            <button onclick="removeCVUpload()" class="admin-btn-del"><i class="fas fa-trash"></i></button>
          </div>`;
      }

      // Auto-save CV URL to personal record
      const pid = $('p-id').value;
      if (pid) {
        await sb.update('personal', pid, { resume_url: url });
        toast('CV uploaded & saved! ✅');
      }
      setTimeout(() => { status.style.display = 'none'; }, 2000);
    } catch(err) {
      text.textContent = '❌ Upload failed. Try again.';
      bar.style.background = '#ff5050';
    }
    input.value = '';
  }
}

window.removeCVUpload = function() {
  cvUploadedUrl = '';
  document.getElementById('cvCurrentFile').innerHTML = '';
  toast('CV removed. Upload a new one.', 'error');
};

// Show existing CV when personal section loads
const _origRenderPersonal = typeof renderPersonal === 'function' ? renderPersonal : null;

async function showExistingCV(p) {
  const current = document.getElementById('cvCurrentFile');
  if (!current) return;
  const url = p.resume_url || p.resume;
  if (url && url.startsWith('http')) {
    cvUploadedUrl = url;
    const filename = url.split('/').pop();
    current.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;background:var(--bg2);border:1px solid var(--accent-b);border-radius:8px;padding:12px 16px">
        <i class="fas fa-file-pdf" style="color:var(--accent);font-size:1.2rem"></i>
        <div style="flex:1">
          <div style="font-size:.82rem;font-weight:700">${filename}</div>
          <div style="font-family:var(--fm);font-size:.65rem;color:var(--accent)">Current CV</div>
        </div>
        <a href="${url}" target="_blank" class="admin-btn-edit" style="width:auto;padding:0 12px;font-size:.72rem;display:flex;align-items:center;gap:6px">
          <i class="fas fa-eye"></i> Preview
        </a>
        <button onclick="removeCVUpload()" class="admin-btn-del"><i class="fas fa-trash"></i></button>
      </div>`;
  }
}

// Hook into renderPersonal
const __origRender = window.renderSection;
window.renderSection = async function(name) {
  await __origRender(name);
  if (name === 'personal') {
    const p = await sb.getOne('personal');
    if (p) showExistingCV(p);
    initCVUpload();
  }
};