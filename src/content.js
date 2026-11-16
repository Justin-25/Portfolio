// Everything the page says lives here, so changing text or links never means editing components.

export const profile = {
  name: "Justin John Albert Mandia",
  shortName: "Justin Mandia",
  initials: "JM",
  role: "Full-Stack Developer",
  status: "Available for work",
  intro:
    "I build complete web applications: the database and API, a responsive React interface, and the tests that prove it all works.",
  location: "Malvar, Philippines",
  availability: "Open to remote work",
  email: "justinmandia25@gmail.com",
  github: "https://github.com/Justin-25",
  githubHandle: "Justin-25",
  // Not ready yet. Set these and the LinkedIn links / "Download CV" button appear automatically.
  linkedin: null,
  cv: null,
};

export const navLinks = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export const sections = {
  projects: {
    eyebrow: "01 — Projects",
    title: "Things I’ve built",
    description: "Full-stack apps, designed in Figma first and tested end to end.",
  },
  about: {
    eyebrow: "02 — About",
    title: "About me",
  },
  contact: {
    eyebrow: "03 — Contact",
    title: "Want to collaborate?",
    titleMuted: "Contact me.",
    description:
      "Have a role, a project or a question? Send me a message and it goes straight to my inbox.",
  },
};

export const contactForm = {
  title: "Send a message",
  subtitle: "I’ll reply to the email address you enter.",
  privacy: "Your details are only used to reply to you.",
  placeholders: {
    name: "Your name",
    email: "you@company.com",
    message: "Tell me about the role or project…",
  },
  errors: {
    name: "Please enter your name.",
    emailMissing: "Please enter your email address.",
    email: "Enter a valid email address.",
    messageMissing: "Please write a message.",
    message: "Please write at least 10 characters.",
  },
  sent: {
    title: "Message sent",
    body: "Thanks for reaching out! Your message is in my inbox and I’ll reply to the email address you entered.",
  },
  failed: {
    title: "Message not sent",
    body: "Something went wrong, so your message wasn’t sent. Please try again, or email me at",
  },
};

// The first project is shown as the large featured card.
export const projects = [
  {
    name: "Tooth Fairy Dentistry",
    label: "Featured project",
    description:
      "A dental clinic booking app with separate portals for patients, doctors and admins.",
    highlights: [
      "REST API with JWT authentication and role-based access",
      "Booking that only offers real open times and blocks double bookings",
      "Designed in Figma first, responsive from phone to desktop",
      "70 Playwright end-to-end tests, deployed on Vercel and Render",
    ],
    tech: ["React", "Node.js", "Express", "MongoDB", "TanStack Query", "Tailwind CSS", "Playwright"],
    image: "tooth-fairy-home",
    imageAlt: "Tooth Fairy Dentistry home page: “Gentle dental care for the whole family”",
    liveUrl: "https://dental-clinic-three-kappa.vercel.app",
    codeUrl: "https://github.com/Justin-25/DentalClinic-FullStack-project",
  },
];

export const inProgress = {
  name: "E-commerce web app",
  description:
    "A full-stack online store with product management, a cart and authentication. So far: JWT login with refresh-token rotation, MongoDB Atlas and Redis.",
  codeUrl: "https://github.com/Justin-25/E-commerce-FullStack-project",
};

// Each paragraph's `highlight` phrase is shown in white.
export const bio = [
  {
    text: "I’m a full-stack developer and a 2025 Computer Science graduate from Malvar, Philippines. I build complete web applications: the database and API, a responsive React interface, and the tests that prove it all works.",
    highlight: "full-stack developer",
  },
  {
    text: "My latest project, Tooth Fairy Dentistry, is a clinic booking app with separate portals for patients, doctors and admins, backed by a Node.js, Express and MongoDB API and 70 end-to-end tests.",
    highlight: "Tooth Fairy Dentistry",
  },
  {
    text: "I care about readable code, secure defaults and interfaces that are easy to use. I use AI tools like Claude to build faster, and I review and test everything before it ships. I’m open to full-stack and frontend roles, on-site or remote.",
    highlight: "open to full-stack and frontend roles",
  },
];

export const motto = "Keep learning. Keep growing. Master the basics. Build beyond them.";

export const skills = [
  {
    group: "Frontend",
    items: ["React", "React Router", "TanStack Query", "React Hook Form", "Tailwind CSS", "Vite", "JavaScript", "HTML", "CSS"],
  },
  { group: "Backend", items: ["Node.js", "Express", "REST APIs", "JWT auth"] },
  { group: "Databases", items: ["MongoDB", "Mongoose", "PostgreSQL", "MySQL"] },
  {
    group: "Testing & tools",
    items: ["Playwright", "Postman", "Git", "GitHub", "Vercel", "Render", "ESLint", "Figma"],
  },
  { group: "AI tools", items: ["Claude Pro", "Claude Code"] },
];

// Footer: my GitHub contributions for the last 12 months (loaded live, see lib/contributions.js)
export const githubActivity = {
  eyebrow: "GitHub activity",
  loading: "Loading contributions…",
  unavailable: "GitHub activity couldn’t load right now.",
  source: "Live from GitHub · updates daily",
};

// Newest first. "View certificate" opens `certificate` (an image in src/assets/certificates)
// in a pop-up, with a button to `certificateUrl`, Udemy's own page for the certificate.
export const education = [
  {
    kind: "course",
    date: "Aug 2026",
    dateTime: "2026-08",
    title: "Node.js, Express, MongoDB & More: The Complete Bootcamp",
    meta: "Udemy · Jonas Schmedtmann · 42 hours",
    certificate: "nodejs-bootcamp",
    certificateUrl: "https://www.udemy.com/certificate/UC-43349306-f7b0-4b64-afaa-e37d82cb9f51/",
  },
  {
    kind: "course",
    date: "Jul 2026",
    dateTime: "2026-07",
    title: "The Complete Full-Stack Web Development Bootcamp",
    meta: "Udemy · Dr. Angela Yu · 62 hours",
    certificate: "fullstack-bootcamp",
    certificateUrl: "https://www.udemy.com/certificate/UC-abd3149f-d71f-4b37-8133-9954b1c39509/",
  },
  {
    kind: "degree",
    date: "2025",
    dateTime: "2025",
    title: "Bachelor of Science in Computer Science",
    meta: "Tanauan Institute",
  },
];
