/* ============================================================
   ALMAW TADELE — Portfolio | main.js
   ============================================================ */

// ── DEVICON MAP ──────────────────────────────────────────────
const deviconMap = {
  'Python':'devicon-python-plain colored','JavaScript':'devicon-javascript-plain colored',
  'TypeScript':'devicon-typescript-plain colored','Java':'devicon-java-plain colored',
  'C++':'devicon-cplusplus-plain colored','PHP':'devicon-php-plain colored',
  'HTML':'devicon-html5-plain colored','CSS':'devicon-css3-plain colored',
  'React':'devicon-react-original colored','Next.js':'devicon-nextjs-plain',
  'Bootstrap':'devicon-bootstrap-plain colored','Node.js':'devicon-nodejs-plain colored',
  'Express.js':'devicon-express-original','Django':'devicon-django-plain colored',
  'FastAPI':'devicon-fastapi-plain colored','MySQL':'devicon-mysql-plain colored',
  'Supabase':'devicon-supabase-plain colored','TensorFlow':'devicon-tensorflow-original colored',
  'PyTorch':'devicon-pytorch-original colored','Pandas':'devicon-pandas-original colored',
  'NumPy':'devicon-numpy-original colored','Git':'devicon-git-plain colored',
  'GitHub':'devicon-github-original','Linux':'devicon-linux-plain',
  'Vercel':'devicon-vercel-original','Netlify':'devicon-netlify-plain colored',
  'VS Code':'devicon-vscode-plain colored','React Native':'devicon-react-original colored',
};

function skillTagHTML(item) {
  const icon = deviconMap[item];
  return `<span class="skill-tag">${icon?`<i class="${icon}" style="font-size:1rem;vertical-align:middle;margin-right:5px;"></i>`:''}${item}</span>`;
}

// ── SCROLL REVEAL ────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.1 });

function observeAll() {
  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => observer.observe(el));
}

// ── RENDER FUNCTIONS ─────────────────────────────────────────
function renderSkills(gridId, d) {
  const grid = document.querySelector(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  (d.skills || []).forEach((cat, i) => {
    const card = document.createElement('div');
    card.className = 'skill-card glow-card reveal';
    card.style.transitionDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="skill-card-header">
        <div class="skill-icon"><i class="${cat.icon}"></i></div>
        <div class="skill-cat">${cat.category}</div>
      </div>
      <div class="skill-tags">${(cat.items||[]).map(skillTagHTML).join('')}</div>`;
    grid.appendChild(card);
    observer.observe(card);
  });
}

function renderProjects(gridId, imgPrefix, d) {
  const grid = document.querySelector(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  (d.projects || []).forEach((p, i) => {
    const isDemo = p.live === '#' && p.github === '#';
    const imgSrc = p.image?.startsWith('http') ? p.image : imgPrefix + (p.image || '');
    const card   = document.createElement('div');
    card.className = `project-card glow-card reveal${p.featured?' featured':''}`;
    card.style.transitionDelay = `${i*0.1}s`;
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <div class="project-img">
        <img src="${imgSrc}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;display:block;"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="project-img-placeholder" style="display:none"><i class="fas fa-code"></i></div>
        ${p.featured?'<span class="project-feat-badge">⭐ Featured</span>':''}
      </div>
      <div class="project-body">
        <div class="project-name">${p.name}</div>
        <div class="project-desc">${p.description}</div>
        <div class="project-tech">${(p.tech||[]).map(t=>`<span>${t}</span>`).join('')}</div>
        <div class="project-links">
          <a href="${p.live}" target="_blank" class="project-link live${isDemo?' disabled':''}" onclick="event.stopPropagation()">
            <i class="fas fa-external-link-alt"></i>${isDemo?'Coming Soon':'Live Demo'}
          </a>
          <a href="${p.github}" target="_blank" class="project-link github${isDemo?' disabled':''}" onclick="event.stopPropagation()">
            <i class="fab fa-github"></i>GitHub
          </a>
        </div>
      </div>`;
    card.addEventListener('click', () => {
      const detail = imgPrefix===''?'pages/project-detail.html':'project-detail.html';
      window.location.href = `${detail}?id=${i}`;
    });
    grid.appendChild(card);
    observer.observe(card);
  });
}

function renderServices(gridId, d) {
  const grid = document.querySelector(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  (d.services || []).forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'service-card glow-card reveal';
    card.style.transitionDelay = `${i*0.1}s`;
    card.innerHTML = `
      <div class="service-icon"><i class="${s.icon}"></i></div>
      <div class="service-title">${s.title}</div>
      <div class="service-desc">${s.description}</div>`;
    grid.appendChild(card);
    observer.observe(card);
  });
}

function renderCerts(gridId, imgPrefix, d) {
  const grid = document.querySelector(gridId);
  if (!grid) return;
  grid.innerHTML = '';
  (d.certificates || []).forEach((c, i) => {
    const imgSrc = c.image?.startsWith('http')
      ? c.image
      : `${imgPrefix}assets/img/${(c.image||'').split('/').pop().replace(/ /g,'%20')}`;
    const card = document.createElement('div');
    card.className = 'cert-card glow-card reveal';
    card.style.transitionDelay = `${i*0.1}s`;
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <div class="cert-img" style="height:200px;overflow:hidden;background:var(--bg2);display:flex;align-items:center;justify-content:center;">
        <img src="${imgSrc}" alt="${c.title}" style="width:100%;height:100%;object-fit:cover;display:block;"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div style="display:none;align-items:center;justify-content:center;width:100%;height:100%;">
          <i class="fas fa-certificate" style="font-size:3rem;opacity:.25;"></i>
        </div>
      </div>
      <div class="cert-body">
        <div class="cert-title">${c.title}</div>
        <div class="cert-meta"><span class="cert-issuer">${c.issuer}</span><span class="cert-year">${c.year}</span></div>
        <div class="cert-desc">${c.description}</div>
      </div>`;
    card.addEventListener('click', () => {
      const detail = imgPrefix===''?'pages/certificate-detail.html':'certificate-detail.html';
      window.location.href = `${detail}?id=${i}`;
    });
    grid.appendChild(card);
    observer.observe(card);
  });
}

function setupForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  // Init EmailJS
  emailjs.init('6SuTtkmHpgY4nZhrK');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled  = true;
    status.style.display = 'none';

    const fname   = document.getElementById('fname')?.value || '';
    const lname   = document.getElementById('lname')?.value || '';
    const femail  = document.getElementById('femail')?.value || '';
    const fsubject= document.getElementById('fsubject')?.value || '';
    const fmessage= document.getElementById('fmessage')?.value || '';

    try {
      await emailjs.send('service_qt64yva', 'template_4r9t5yr', {
        from_name:  `${fname} ${lname}`.trim(),
        from_email: femail,
        subject:    fsubject,
        message:    fmessage,
      });

      // Also save to Supabase messages table
      await sb.insert('messages', {
        name:    `${fname} ${lname}`.trim(),
        email:   femail,
        subject: fsubject,
        message: fmessage,
      }).catch(() => {});

      status.textContent   = '✓ Message sent! I will get back to you soon.';
      status.className     = 'form-status success';
      status.style.display = 'block';
      form.reset();
    } catch (err) {
      status.textContent   = '✗ Failed to send. Please email me directly at almawtadele0@gmail.com';
      status.className     = 'form-status error';
      status.style.display = 'block';
    }

    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    btn.disabled  = false;
  });
}

function updatePersonalInfo(d) {
  const p = d.personal;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('heroName', p.name);
  set('heroBio', p.bio);
  set('hcName',   p.name);
  set('hcRole',   p.tagline);
  set('hcLocation', p.location);
  set('hcEmail',  p.email);
  set('hcPhone',  p.phone);
  set('aboutYears', p.yearsOfExperience + '+');
  // About bio — use full about bio (separate from hero bio)
  const aboutBio = document.getElementById('aboutBio');
  if (aboutBio) aboutBio.textContent = p.aboutBio || p.bio;
  set('statProjects', d.projects.filter(p=>p.live!=='#').length+'+');
  set('statSkills',   d.skills.reduce((a,s)=>a+s.items.length,0)+'+');
  set('statYears',    p.yearsOfExperience+'+');

  const hcSocial = document.getElementById('hcSocial');
  if (hcSocial) hcSocial.innerHTML = d.social.map(s=>
    `<a href="${s.url}" target="_blank" class="soc-btn" title="${s.name}"><i class="${s.icon}"></i></a>`
  ).join('');

  const contactItems = document.getElementById('contactItems');
  if (contactItems) contactItems.innerHTML = `
    <div class="contact-item"><div class="contact-item-icon"><i class="fas fa-envelope"></i></div><div><div class="contact-item-label">Email</div><div class="contact-item-val">${p.email}</div></div></div>
    <div class="contact-item"><div class="contact-item-icon"><i class="fas fa-phone"></i></div><div><div class="contact-item-label">Phone</div><div class="contact-item-val">${p.phone}</div></div></div>
    <div class="contact-item"><div class="contact-item-icon"><i class="fas fa-map-marker-alt"></i></div><div><div class="contact-item-label">Location</div><div class="contact-item-val">${p.location}</div></div></div>`;

  const contactSocials = document.getElementById('contactSocials');
  if (contactSocials) contactSocials.innerHTML = d.social.map(s=>
    `<a href="${s.url}" target="_blank" class="contact-soc" title="${s.name}"><i class="${s.icon}"></i></a>`
  ).join('');
}

// ── DOM READY ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  const page = document.body.dataset.page;

  // ── THEME TOGGLE ──────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // ── NAVBAR ────────────────────────────────────────────────
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  const backTop   = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 20);
    backTop?.classList.toggle('visible', window.scrollY > 400);
  });

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    navMobile?.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(l =>
    l.addEventListener('click', () => {
      navToggle?.classList.remove('open');
      navMobile?.classList.remove('open');
    })
  );

  backTop?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  // ── TYPING EFFECT ─────────────────────────────────────────
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const texts = ['Full-Stack Developer','AI Enthusiast','Problem Solver','Open Source Contributor'];
    let ti=0, ci=0, deleting=false;
    const type = () => {
      const cur = texts[ti];
      typingEl.textContent = deleting ? cur.slice(0,ci--) : cur.slice(0,ci++);
      let delay = deleting ? 60 : 100;
      if (!deleting && ci > cur.length)  { delay=1800; deleting=true; }
      if (deleting  && ci < 0)          { deleting=false; ti=(ti+1)%texts.length; delay=400; }
      setTimeout(type, delay);
    };
    type();
  }

  // ── SCROLLSPY ─────────────────────────────────────────────
  if (page === 'home') {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          [...navLinks].find(l => l.getAttribute('href') === `#${e.target.id}`)?.classList.add('active');
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(s => spy.observe(s));
  }

  observeAll();

  // ── LOAD DATA & RENDER ────────────────────────────────────
  loadPortfolioFromDB().then(d => {

    if (page === 'home') {
      updatePersonalInfo(d);
      renderSkills('#skillsGrid', d);
      renderProjects('#projectsGrid', '', d);
      renderServices('#servicesGrid', d);
      renderCerts('#certsGrid', '', d);
      setupForm();
      observeAll();
    }

    if (page === 'skills')       renderSkills('#skillsGrid', d);
    if (page === 'projects')     renderProjects('#projectsGrid', '../', d);
    if (page === 'services')     renderServices('#servicesGrid', d);
    if (page === 'certificates') renderCerts('#certsGrid', '../', d);
    if (page === 'contact')      setupForm();

    if (page === 'about') {
      const bio = document.getElementById('aboutBio');
      const yr  = document.getElementById('aboutYears');
      if (bio) bio.textContent = d.personal.aboutBio || d.personal.bio;
      if (yr)  yr.textContent  = d.personal.yearsOfExperience + '+';
    }

    observeAll();
  });

});