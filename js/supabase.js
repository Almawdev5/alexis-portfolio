// ============================================================
//  SUPABASE CONFIG
// ============================================================
const SUPABASE_URL  = 'https://dhfpposgrxbvjxwrynkp.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoZnBwb3Nncnhidmp4d3J5bmtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NDMzNjIsImV4cCI6MjA5NTMxOTM2Mn0.-9Txhww6XjLMqOtnmM3VhNVf9kMfl2KltDTzY3sSYZY';

const sb = {
  headers: {
    'apikey':        SUPABASE_ANON,
    'Authorization': `Bearer ${SUPABASE_ANON}`,
    'Content-Type':  'application/json',
    'Prefer':        'return=representation',
  },

  async get(table) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers: this.headers });
      const data = await res.json();
      console.log(`✅ Supabase [${table}]:`, data.length, 'rows');
      return Array.isArray(data) ? data : [];
    } catch(e) {
      console.error(`❌ Supabase [${table}] error:`, e);
      return [];
    }
  },

  async getOne(table) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, { headers: this.headers });
      const data = await res.json();
      console.log(`✅ Supabase [${table}] one:`, data[0]);
      return Array.isArray(data) ? data[0] || null : null;
    } catch(e) {
      console.error(`❌ Supabase [${table}] error:`, e);
      return null;
    }
  },

  async insert(table, body) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST', headers: this.headers, body: JSON.stringify(body)
      });
      return res.ok ? res.json() : null;
    } catch(e) { console.error(e); return null; }
  },

  async update(table, id, body) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
        method: 'PATCH', headers: this.headers, body: JSON.stringify(body)
      });
      return res.ok ? res.json() : null;
    } catch(e) { console.error(e); return null; }
  },

  async delete(table, id) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
        method: 'DELETE', headers: this.headers
      });
    } catch(e) { console.error(e); }
  },
};

async function loadPortfolioFromDB() {
  console.log('🔄 Loading from Supabase...');
  try {
    const [personal, social, skills, projects, services, certificates] = await Promise.all([
      sb.getOne('personal'),
      sb.get('social'),
      sb.get('skills'),
      sb.get('projects'),
      sb.get('services'),
      sb.get('certificates'),
    ]);

    const hasData = skills.length || projects.length || services.length || certificates.length;

    if (!hasData) {
      console.warn('⚠️ Supabase tables empty — using local data.js fallback');
      return portfolioData;
    }

    console.log('✅ Supabase data loaded successfully!');

    return {
      personal: {
        name:              personal?.name               || portfolioData.personal.name,
        tagline:           personal?.tagline            || portfolioData.personal.tagline,
        bio:               personal?.bio                || portfolioData.personal.bio,
        email:             personal?.email              || portfolioData.personal.email,
        phone:             personal?.phone              || portfolioData.personal.phone,
        location:          personal?.location           || portfolioData.personal.location,
        yearsOfExperience: personal?.years_of_experience || portfolioData.personal.yearsOfExperience,
        avatar:            personal?.avatar             || portfolioData.personal.avatar,
        resume:            personal?.resume             || portfolioData.personal.resume,
        aboutBio:          personal?.about_bio            || portfolioData.personal.bio,
        _id:               personal?.id,
      },
      social: social.length ? social.map(s => ({
        id: s.id, name: s.name, url: s.url, icon: s.icon
      })) : portfolioData.social,
      skills: skills.length ? skills.map(s => ({
        id: s.id, category: s.category, icon: s.icon, items: s.items || []
      })) : portfolioData.skills,
      projects: projects.length ? projects.map(p => ({
        id: p.id, name: p.name, description: p.description,
        longDescription: p.long_description,
        tech: p.tech || [], live: p.live || '#', github: p.github || '#',
        image: p.image || '', images: p.images || [p.image], featured: p.featured || false,
      })) : portfolioData.projects,
      services: services.length ? services.map(s => ({
        id: s.id, icon: s.icon, title: s.title, description: s.description
      })) : portfolioData.services,
      certificates: certificates.length ? certificates.map(c => ({
        id: c.id, title: c.title, issuer: c.issuer, year: c.year,
        image: c.image, description: c.description
      })) : portfolioData.certificates,
    };
  } catch(err) {
    console.error('❌ Supabase failed, using local data:', err);
    return portfolioData;
  }
}