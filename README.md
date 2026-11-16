# Justin Mandia: Portfolio

**Live: [justin-mandia.vercel.app](https://justin-mandia.vercel.app)**

My personal portfolio site: who I am, the projects I've built, and a way to get in touch.
I'm a full-stack developer and a 2025 Computer Science graduate from Malvar, Philippines,
open to full-stack and frontend roles, on-site or remote.

It's one page: **Hero → Projects → About & skills (with education and courses) → Contact**,
with my GitHub contribution graph in the footer. The look is black and white, in the style of
Vercel, and the page was designed in Figma first at desktop (1440px) and phone (390px) sizes.

## Status

I'm building it in small steps, each one tested before it's committed.

- [x] **1. Page shell**: sticky nav, phone menu, section anchors, footer bar
- [x] **2. Content**: hero, projects, about & skills, education & courses, grid background
      with a spotlight that follows the cursor
- [x] **3. Contact form**: sends to my email (Web3Forms), inline errors, a confirmation modal,
      and a certificate viewer for my courses
- [x] **4. GitHub activity**: my contribution graph for the last 12 months in the footer
- [x] **5. Launch**: motion, accessibility pass (axe + keyboard tests), link previews,
      deployed on Vercel

## Tech stack

| | |
|---|---|
| UI | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4, using the colour and text tokens from the Figma design |
| Fonts | Geist and Geist Mono, served by the site itself (Fontsource) |
| Icons | react-icons (Lucide, plus Font Awesome for brand logos) |
| Tests | Playwright end-to-end tests at desktop and phone sizes, ESLint |
| Hosting | Vercel: every push to `main` deploys the site |
| AI tools | Claude Pro and Claude Code, with every change reviewed and tested |

## Running locally

You need Node.js 22.12 or newer.

```
npm install
cp .env.example .env.local   # then paste your Web3Forms access key into .env.local
npm run dev                  # site on http://localhost:5174
```

The contact form sends messages through [Web3Forms](https://web3forms.com). Its free access key
goes in `.env.local` as `VITE_WEB3FORMS_ACCESS_KEY` (never committed); on Vercel, set the same
variable in the project settings. Without a key, the page still works, but sending a message
shows "Message not sent".

| Command | What it does |
|---|---|
| `npm run dev` | development server on http://localhost:5174 |
| `npm run build` | production build in `dist/` |
| `npm run preview` | serves the production build on http://localhost:4174 |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright tests at 1440px and 390px (starts the dev server if needed). They run without live services: GitHub data comes from a saved sample and Web3Forms is faked, so no test sends a real email |

The first time you run the tests, download Playwright's browser with
`npx playwright install chromium`.

The dev server uses port 5174 on purpose (not Vite's usual 5173), so it can run next to my
[Tooth Fairy Dentistry](https://github.com/Justin-25/DentalClinic-FullStack-project) project
without the tests ever reaching the wrong app.

## Changing the content

All text and links on the page live in one file, [`src/content.js`](src/content.js), so
updating the bio, a link or a project never means editing components.

**The CV.** "Download CV" serves [`public/Justin-Mandia-Resume.pdf`](public/Justin-Mandia-Resume.pdf):
a public copy of my resume **without my phone number**, because anything on the site can be read
by bots. The full version (with the phone number, for direct applications) stays off the site.
When the resume changes:

1. Update the full resume, then save a copy with the phone number removed.
2. Export that copy as PDF, replace `public/Justin-Mandia-Resume.pdf` (keep the file name), and
   check it's one page.
3. Commit and push; Vercel publishes it.

## Project structure

```
src/
├── content.js       # all text and links on the page
├── index.css        # design tokens (colours, text styles) and shared CSS utilities
├── App.jsx          # page layout: background, nav, sections, footer
├── assets/          # photo, project screenshot and course certificates (WebP)
├── components/      # Nav, MobileMenu, Background (grid + cursor spotlight), Modal (shared),
│                    # ContactForm, Field, GitHubActivity, Badge, TagList, IconBox, SocialLinks,
│                    # SectionHeading, Footer, ui.js (button styles)
├── lib/             # sendMessage.js (Web3Forms), contributions.js (GitHub contribution data)
└── sections/        # Hero, Projects, About (with education & courses), Contact
e2e/                 # Playwright tests; fixtures.js keeps them off live services,
                     # data/contributions.json is the saved GitHub sample
public/              # favicon, iPhone icon, link-preview image, public CV (PDF)
```

## Design and accessibility

- **Tokens match Figma.** Colour names in code are the Figma variable names (`bg`, `surface`,
  `border`, `primary` / `secondary` / `muted` text), and text classes are the Figma text
  styles (`text-display-xl`, `text-heading-m`, `text-body-s`, `eyebrow`…).
- **Keyboard friendly.** A "Skip to content" link appears on the first Tab. The phone menu and
  the shared Modal are native `<dialog>`s: they keep focus inside, close with Esc, and return
  focus to whatever opened them.
- **Helpful form.** Errors appear under their field and are read out by screen readers; the
  cursor jumps to the first one. The result of sending (sent / not sent, with "Try again")
  opens the shared Modal. A hidden honeypot field quietly drops messages from spam bots.
- **Calm motion.** In-page links glide to their section, and everything moves instantly
  instead when the visitor's system asks for reduced motion.
- **Cursor spotlight.** A soft light follows the mouse and brightens the background grid. It
  moves with CSS transforms only, so scrolling stays smooth. On touch screens, and when reduced
  motion is on, the page shows a still glow instead.
- **Light images.** Photos are WebP, sized for sharp screens, and load only when needed, so a
  phone never downloads the large desktop photo.
- **Live GitHub graph.** The footer loads my contributions from a free public API
  ([github-contributions-api](https://github.com/grubersjoe/github-contributions-api)). Screen
  readers hear one summary instead of 366 squares; hovering a square shows its date and count.
  If the data can't load, the card links to my GitHub profile instead.

## Contact

- Email: [justinmandia25@gmail.com](mailto:justinmandia25@gmail.com)
- GitHub: [@Justin-25](https://github.com/Justin-25)
