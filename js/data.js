// ============================================================
//  PORTFOLIO DATA — Edit this file to update your portfolio
// ============================================================

const portfolioData = {

  personal: {
    name: "Almaw Tadele",
    tagline: "Full-Stack Developer & AI Enthusiast",
    location: "Gullele, Addis Ababa, Ethiopia",
    email: "almawtadele0@gmail.com",
    phone: "+251961615102",
    bio: "I'm Almaw, a visionary full-stack engineer building futuristic digital experiences. My passion is creating sleek, scalable, and cutting-edge solutions for the modern web. I merge creativity with code to deliver highly interactive interfaces and seamless user journeys — and I'm currently diving deep into the world of Artificial Intelligence, exploring how AI can elevate the future of software.",
    avatar: "assets/img/profile.png",
    resume: "assets/CV.pdf",
    yearsOfExperience: 2,
  },

  social: [
    { name: "GitHub",   url: "https://github.com/Almawdev5",                   icon: "fab fa-github" },
    { name: "LinkedIn", url: "https://linkedin.com/in/almaw-tadele-8794a9366", icon: "fab fa-linkedin-in" },
    { name: "Telegram", url: "https://t.me/Almaw16",                           icon: "fab fa-telegram-plane" },
  ],

  skills: [
    { category: "Languages",      icon: "fas fa-code",          items: ["Python","JavaScript","TypeScript","Java","C++","PHP"] },
    { category: "Frontend",       icon: "fas fa-desktop",       items: ["HTML","CSS","React","Next.js","Bootstrap"] },
    { category: "Backend",        icon: "fas fa-server",        items: ["Node.js","Express.js","Django","FastAPI"] },
    { category: "Databases",      icon: "fas fa-database",      items: ["MySQL","Supabase"] },
    { category: "AI & ML",        icon: "fas fa-brain",         items: ["TensorFlow","PyTorch","Scikit-learn","Pandas","NumPy","Matplotlib","Seaborn","EDA"] },
    { category: "DevOps & Tools", icon: "fas fa-tools",         items: ["Git","GitHub","Linux","Vercel","Netlify","VS Code"] },
    { category: "Mobile",         icon: "fas fa-mobile-alt",    items: ["React Native"] },
    { category: "Networking",     icon: "fas fa-network-wired", items: ["Cisco Networking","Packet Tracer"] },
  ],

  // ── To add a new project: copy one block, paste at top of array ──
  projects: [
    {
      name: "ReFind",
      description: "A community-powered digital noticeboard for safely recovering lost items. ReFind builds trust and accountability by turning small actions into meaningful impact.",
      longDescription: "ReFind is a community-driven platform built to help people recover lost items safely and efficiently. The platform uses a real-time Supabase backend to store and retrieve lost item reports, allowing users to post, browse, and claim items with accountability. The design focuses on trust — every action is traceable, and the community is encouraged to help each other.",
      tech: ["HTML","CSS","JavaScript","Supabase"],
      live: "https://refinddigitalnb.netlify.app/",
      github: "https://github.com/Almawdev5/Digital-Noticeboard-Website",
      image: "assets/img/project-refind.png",
      images: ["assets/img/project-refind.png"],
      featured: true,
    },
    {
      name: "AI Chat Assistant",
      description: "A conversational AI assistant powered by a custom ML pipeline. Supports context-aware dialogue and real-time response streaming.",
      longDescription: "An intelligent conversational assistant built with a custom ML pipeline. Features include context-aware multi-turn dialogue, real-time streaming responses, and a clean modern UI. Built with FastAPI on the backend and React on the frontend.",
      tech: ["Python","FastAPI","React","TensorFlow"],
      live: "#",
      github: "#",
      image: "assets/img/project-demo1.png",
      images: ["assets/img/project-demo1.png"],
      featured: false,
    },
    {
      name: "Data Dashboard",
      description: "An interactive analytics dashboard for visualizing complex datasets with dynamic charts, filters, and exportable reports.",
      longDescription: "A powerful analytics dashboard that transforms raw data into beautiful interactive visualizations. Features dynamic charts, advanced filters, date range pickers, and PDF/CSV export functionality. Built with Next.js and powered by Supabase.",
      tech: ["Next.js","Supabase","Pandas","Matplotlib"],
      live: "#",
      github: "#",
      image: "assets/img/project-demo2.png",
      images: ["assets/img/project-demo2.png"],
      featured: false,
    },
  ],

  services: [
    { icon: "fas fa-layer-group", title: "Full-Stack Web Development",       description: "Building end-to-end web apps with React, Next.js, Node.js, Django & FastAPI — from pixel-perfect frontends to rock-solid backends." },
    { icon: "fas fa-brain",       title: "AI & Machine Learning Integration",description: "Implementing ML models, data pipelines & AI-powered features using TensorFlow, PyTorch & Scikit-learn." },
    { icon: "fas fa-chart-line",  title: "Data Analysis & Visualization",    description: "Turning raw data into actionable insights using Pandas, NumPy, Matplotlib & Seaborn." },
    { icon: "fas fa-database",    title: "Database Design & Management",     description: "Designing and managing relational & modern databases with MySQL & Supabase." },
    { icon: "fas fa-mobile-alt",  title: "Mobile App Development",           description: "Building smooth, cross-platform mobile apps with React Native for iOS and Android." },
    { icon: "fas fa-plug",        title: "API Development & Integration",    description: "Designing robust REST APIs with Express.js & FastAPI, built for speed and reliability." },
  ],

  // ── To add a certificate: { title, issuer, year, image, description } ──
  certificates: [
    { title: "Claude 101", issuer: "Anthropic", year: "2025", image: "assets/img/Claude101.png", description: "Foundational certification covering Claude AI, prompt engineering, and responsible AI usage." },
    { title: "RAG Certificate", issuer: "Issuing Organization", year: "2025", image: "assets/img/RAG_certificate.png", description: "Certification in Retrieval-Augmented Generation — building AI systems that combine LLMs with external knowledge bases." },
  ],
};