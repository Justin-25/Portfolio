// Everything the page says lives here, so changing text or links never means editing components.

export const profile = {
  name: "Justin John Albert Mandia",
  shortName: "Justin Mandia",
  initials: "JM",
  role: "Full-Stack Developer",
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
