# Almaw Tadele Portfolio

A modern, static portfolio website for Almaw Tadele — Full-Stack Developer & AI Enthusiast. Built with HTML, CSS, and JavaScript, this project showcases skills, projects, services, certificates, and contact details in a polished, responsive design.

## 🚀 Key Features

- Single-page homepage with smooth scrolling navigation
- Dark/light theme toggle with localStorage persistence
- Responsive mobile menu and layout
- Typed hero headline animation
- Animated reveal effects for page sections
- Data-driven rendering for skills, projects, services, and certificates using `js/data.js`
- Contact form UI with simulated submission behavior
- Built-in section stats and project cards
- External fonts, FontAwesome icons, and Devicon technology logos

## 📁 Project Structure

- `index.html` — Home page with hero, about, skills, projects, services, certificates, and contact sections
- `pages/` — Additional page templates for about, certificates, contact, projects, services, and skills
- `css/` — Stylesheets
  - `style.css` — Main styling and theme support
  - `animations.css` — Animation and reveal effects
  - `responsive.css` — Responsive layout rules
- `js/`
  - `data.js` — Portfolio data source for personal info, skills, projects, services, and certificates
  - `main.js` — Client-side logic for navigation, theme toggling, rendering content, animations, and contact form interactions
- `assets/`
  - `icons/` — SVG icons like favicon
  - `img/` — Profile picture, project images, certificates
  - `CV.pdf` — Downloadable resume
- `vercel.json` — Deployment configuration for clean URLs and security headers

## 🧩 How It Works

- The homepage layout is authored in `index.html`, with content sections rendered dynamically from `js/data.js`.
- `js/main.js` uses DOM scripting to build skill cards, project cards, service cards, and certificate cards.
- The theme toggle stores the selected theme in `localStorage`, so the site remembers dark/light mode across visits.
- The contact form is a frontend mock that simulates sending a message.

## 💻 Running Locally

This is a static website, so no build tools are required.

1. Open the project folder in your editor.
2. Open `index.html` in your browser.

For local testing with a simple HTTP server, you can use a command like:

```bash
# Python 3
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## 🌐 Deployment

The project includes `vercel.json`, making it ready for deployment on Vercel. The site is also compatible with any static hosting provider.

## ✨ Customization

To update content, edit `js/data.js`:

- `personal` — author details and resume path
- `skills` — displayed skill categories and items
- `projects` — project cards and links
- `services` — service offerings
- `certificates` — certificate cards and metadata

To add new page-specific rendering support, update `js/main.js` where page routing is handled by `body.dataset.page`.

## 📝 Notes

- The contact form currently uses a simulated submission response and does not send real email messages.
- Images use fallback handling when asset loading fails.

## 📞 Contact

- Email: `almawtadele0@gmail.com`
- Phone: `+251961615102`
- GitHub: `https://github.com/Almawdev5`
- LinkedIn: `https://linkedin.com/in/almaw-tadele-8794a9366`
- Telegram: `https://t.me/Almaw66`

---

Built as a static portfolio with clean design, easy customization, and fast deployment support.