/* ============================================================
   ALMAW TADELE — Portfolio | main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const STORE_KEY = 'alexPortfolioData';
  const saved = localStorage.getItem(STORE_KEY);
  const d = saved ? JSON.parse(saved) : portfolioData;
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const page = document.body.dataset.page;

  // ── DEVICON MAP ─────────────────────────────────────────────
  const deviconMap = {
    'Python':        'devicon-python-plain colored',
    'JavaScript':    'devicon-javascript-plain colored',
    'TypeScript':    'devicon-typescript-plain colored',
    'Java':          'devicon-java-plain colored',
    'C++':           'devicon-cplusplus-plain colored',
    'PHP':           'devicon-php-plain colored',
    'HTML':          'devicon-html5-plain colored',
    'CSS':           'devicon-css3-plain colored',
    'React':         'devicon-react-original colored',
    'Next.js':       'devicon-nextjs-plain',
    'Bootstrap':     'devicon-bootstrap-plain colored',
    'Node.js':       'devicon-nodejs-plain colored',
    'Express.js':    'devicon-express-original',
    'Django':        'devicon-django-plain colored',
    'FastAPI':       'devicon-fastapi-plain colored',
    'MySQL':         'devicon-mysql-plain colored',
    'Supabase':      'devicon-supabase-plain colored',
    'TensorFlow':    'devicon-tensorflow-original colored',
    'PyTorch':       'devicon-pytorch-original colored',
    'Pandas':        'devicon-pandas-original colored',
    'NumPy':         'devicon-numpy-original colored',
    'Git':           'devicon-git-plain colored',
    'GitHub':        'devicon-github-original',
    'Linux':         'devicon-linux-plain',
    'Vercel':        'devicon-vercel-original',
    'Netlify':       'devicon-netlify-plain colored',
    'VS Code':       'devicon-vscode-plain colored',
    'React Native':  'devicon-react-original colored',
  };

  function skillTagHTML(item) {
    const icon = deviconMap[item];
    const iconHTML = icon
      ? `<i class="${icon}" style="font-size:1rem;vertical-align:middle;margin-right:5px;"></i>`
      : '';
    return `<span class="skill-tag">${iconHTML}${item}</span>`;
  }

  // ── THEME TOGGLE ────────────────────────────────────────────
  const themeToggle = $('#themeToggle');
  const savedTheme  = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  // ── NAVBAR ──────────────────────────────────────────────────
  const navbar    = $('#navbar');
  const toggle    = $('#navToggle');
  const mobileMenu = $('#navMobile');
  const backTop   = $('#backTop');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    if (backTop) backTop.classList.toggle('visible', window.scrollY > 400);
  });

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
  });

  $$('.nav-link, .nav-mobile .nav-link').forEach(l =>
    l.addEventListener('click', () => {
      toggle?.classList.remove('open');
      mobileMenu?.classList.remove('open');
    })
  );

  backTop?.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  // ── SCROLL REVEAL ───────────────────────────────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  function observeAll() {
    $$('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
  }
  observeAll();

  // ── TYPING EFFECT ───────────────────────────────────────────
  const typingEl = $('#typingText');
  if (typingEl) {
    const texts = ['Full-Stack Developer', 'AI Enthusiast', 'Problem Solver', 'Open Source Contributor'];
    let ti = 0, ci = 0, deleting = false;
    const type = () => {
      const current = texts[ti];
      typingEl.textContent = deleting ? current.slice(0, ci--) : current.slice(0, ci++);
      let delay = deleting ? 60 : 100;
      if (!deleting && ci > current.length)  { delay = 1800; deleting = true; }
      if (deleting  && ci < 0)              { deleting = false; ti = (ti + 1) % texts.length; delay = 400; }
      setTimeout(type, delay);
    };
    type();
  }

  // ── SCROLLSPY (homepage only) ───────────────────────────────
  if (page === 'home') {
    const sections = $$('section[id]');
    const navLinks = $$('.nav-link');
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          const active = navLinks.find(l => l.getAttribute('href') === `#${e.target.id}`);
          active?.classList.add('active');
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(s => spy.observe(s));
  }

  // ── ACTIVE LINK (inner pages) ───────────────────────────────
  if (page !== 'home') {
    const currentFile = location.pathname.split('/').pop();
    $$('.nav-link').forEach(l => {
      if (l.getAttribute('href') === currentFile) l.classList.add('active');
    });
  }

  // ── STATS (homepage) ────────────────────────────────────────
  if (page === 'home') {
    const sp = $('#statProjects');
    const ss = $('#statSkills');
    const sy = $('#statYears');
    if (sp) sp.textContent = d.projects.filter(p => p.live !== '#').length + '+';
    if (ss) ss.textContent = d.skills.reduce((a, s) => a + s.items.length, 0) + '+';
    if (sy) sy.textContent = d.personal.yearsOfExperience + '+';
  }

  // ── RENDER SKILLS ───────────────────────────────────────────
  function renderSkills(gridId) {
    const grid = $(gridId);
    if (!grid) return;
    d.skills.forEach((cat, i) => {
      const card = document.createElement('div');
      card.className = 'skill-card glow-card reveal';
      card.style.transitionDelay = `${i * 0.07}s`;
      card.innerHTML = `
        <div class="skill-card-header">
          <div class="skill-icon"><i class="${cat.icon}"></i></div>
          <div class="skill-cat">${cat.category}</div>
        </div>
        <div class="skill-tags">${cat.items.map(skillTagHTML).join('')}</div>`;
      grid.appendChild(card);
      observer.observe(card);
    });
  }

  // ── RENDER PROJECTS ─────────────────────────────────────────
  function renderProjects(gridId, imgPrefix) {
    const grid = $(gridId);
    if (!grid) return;
    d.projects.forEach((p, i) => {
      const isDemo = p.live === '#' && p.github === '#';
      const card = document.createElement('div');
      card.className = `project-card glow-card reveal${p.featured ? ' featured' : ''}`;
      card.style.transitionDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div class="project-img">
          <img src="${imgPrefix}${p.image}" alt="${p.name}"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="project-img-placeholder" style="display:none"><i class="fas fa-code"></i></div>
          ${p.featured ? '<span class="project-feat-badge">⭐ Featured</span>' : ''}
        </div>
        <div class="project-body">
          <div class="project-name">${p.name}</div>
          <div class="project-desc">${p.description}</div>
          <div class="project-tech">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
          <div class="project-links">
            <a href="${p.live}" target="_blank" class="project-link live${isDemo ? ' disabled' : ''}">
              <i class="fas fa-external-link-alt"></i>${isDemo ? 'Coming Soon' : 'Live Demo'}
            </a>
            <a href="${p.github}" target="_blank" class="project-link github${isDemo ? ' disabled' : ''}">
              <i class="fab fa-github"></i>GitHub
            </a>
          </div>
        </div>`;
      grid.appendChild(card);
      observer.observe(card);
    });
  }

  // ── RENDER SERVICES ─────────────────────────────────────────
  function renderServices(gridId) {
    const grid = $(gridId);
    if (!grid) return;
    d.services.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'service-card glow-card reveal';
      card.style.transitionDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div class="service-icon"><i class="${s.icon}"></i></div>
        <div class="service-title">${s.title}</div>
        <div class="service-desc">${s.description}</div>`;
      grid.appendChild(card);
      observer.observe(card);
    });
  }

  // ── RENDER CERTIFICATES ─────────────────────────────────────
  function renderCerts(gridId, imgPrefix) {
    const grid = $(gridId);
    if (!grid) return;
    d.certificates.forEach((c, i) => {
      const imgFile = c.image.split('/').pop().replace(/ /g, '%20');
      const src = `${imgPrefix}assets/img/${imgFile}`;
      const card = document.createElement('div');
      card.className = 'cert-card glow-card reveal';
      card.style.transitionDelay = `${i * 0.1}s`;
      card.innerHTML = `
        <div class="cert-img" style="height:200px;overflow:hidden;background:var(--bg2);display:flex;align-items:center;justify-content:center;">
          <img src="${src}" alt="${c.title}"
            style="width:100%;height:100%;object-fit:cover;display:block;"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div style="display:none;align-items:center;justify-content:center;width:100%;height:100%;">
            <i class="fas fa-certificate" style="font-size:3rem;opacity:.25;"></i>
          </div>
        </div>
        <div class="cert-body">
          <div class="cert-title">${c.title}</div>
          <div class="cert-meta">
            <span class="cert-issuer">${c.issuer}</span>
            <span class="cert-year">${c.year}</span>
          </div>
          <div class="cert-desc">${c.description}</div>
        </div>`;
      grid.appendChild(card);
      observer.observe(card);
    });
  }

  // ── CONTACT FORM ────────────────────────────────────────────
  function setupForm() {
    const form   = $('#contactForm');
    const status = $('#formStatus');
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending…';
      btn.disabled = true;
      await new Promise(r => setTimeout(r, 1400));
      status.textContent = '✓ Message sent! I will get back to you soon.';
      status.className = 'form-status success';
      status.style.display = 'block';
      form.reset();
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
    });
  }

  // ── PAGE ROUTING ────────────────────────────────────────────
  if (page === 'home') {
    const p = d.personal;

    // ── Hero ──
    const heroName = document.getElementById('heroName');
    const heroBio  = document.getElementById('heroBio');
    if (heroName) heroName.textContent = p.name;
    if (heroBio)  heroBio.textContent  = p.bio;

    // ── Hero Card ──
    const hcName     = document.getElementById('hcName');
    const hcRole     = document.getElementById('hcRole');
    const hcLocation = document.getElementById('hcLocation');
    const hcEmail    = document.getElementById('hcEmail');
    const hcPhone    = document.getElementById('hcPhone');
    if (hcName)     hcName.textContent     = p.name;
    if (hcRole)     hcRole.textContent     = p.tagline;
    if (hcLocation) hcLocation.textContent = p.location;
    if (hcEmail)    hcEmail.textContent    = p.email;
    if (hcPhone)    hcPhone.textContent    = p.phone;

    // ── Social links in card ──
    const hcSocial = document.getElementById('hcSocial');
    if (hcSocial) {
      hcSocial.innerHTML = d.social.map(s =>
        `<a href="${s.url}" target="_blank" class="soc-btn" title="${s.name}"><i class="${s.icon}"></i></a>`
      ).join('');
    }

    // ── About section ──
    const aboutYears = document.getElementById('aboutYears');
    const aboutBio   = document.getElementById('aboutBio');
    if (aboutYears) aboutYears.textContent = p.yearsOfExperience + '+';
    if (aboutBio)   aboutBio.textContent   = p.bio;

    // ── Contact section ──
    const contactItems = document.getElementById('contactItems');
    if (contactItems) {
      contactItems.innerHTML = `
        <div class="contact-item">
          <div class="contact-item-icon"><i class="fas fa-envelope"></i></div>
          <div><div class="contact-item-label">Email</div><div class="contact-item-val">${p.email}</div></div>
        </div>
        <div class="contact-item">
          <div class="contact-item-icon"><i class="fas fa-phone"></i></div>
          <div><div class="contact-item-label">Phone</div><div class="contact-item-val">${p.phone}</div></div>
        </div>
        <div class="contact-item">
          <div class="contact-item-icon"><i class="fas fa-map-marker-alt"></i></div>
          <div><div class="contact-item-label">Location</div><div class="contact-item-val">${p.location}</div></div>
        </div>`;
    }

    // ── Contact socials ──
    const contactSocials = document.getElementById('contactSocials');
    if (contactSocials) {
      contactSocials.innerHTML = d.social.map(s =>
        `<a href="${s.url}" target="_blank" class="contact-soc" title="${s.name}"><i class="${s.icon}"></i></a>`
      ).join('');
    }

    // ── Stats ──
    const sp = document.getElementById('statProjects');
    const ss = document.getElementById('statSkills');
    const sy = document.getElementById('statYears');
    if (sp) sp.textContent = d.projects.filter(p => p.live !== '#').length + '+';
    if (ss) ss.textContent = d.skills.reduce((a, s) => a + s.items.length, 0) + '+';
    if (sy) sy.textContent = p.yearsOfExperience + '+';

    // Render all sections
    renderSkills('#skillsGrid');
    renderProjects('#projectsGrid', '');
    renderServices('#servicesGrid');
    renderCerts('#certsGrid', '');
    setupForm();
    observeAll();
  }

  if (page === 'skills')       renderSkills('#skillsGrid');
  if (page === 'projects')     renderProjects('#projectsGrid', '../');
  if (page === 'services')     renderServices('#servicesGrid');
  if (page === 'certificates') renderCerts('#certsGrid', '../');
  if (page === 'contact')      setupForm();

  if (page === 'about') {
    const bio = $('#aboutBio');
    const yr  = $('#aboutYears');
    if (bio) bio.textContent = d.personal.bio;
    if (yr)  yr.textContent  = d.personal.yearsOfExperience + '+';
  }

});