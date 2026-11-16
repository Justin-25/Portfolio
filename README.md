# Justin Mandia: Portfolio

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
- [ ] **3. Contact form**: sends to my email (Web3Forms), inline errors, a confirmation modal
- [ ] **4. GitHub activity**: my contribution graph for the last 12 months in the footer
- [ ] **5. Launch**: motion, accessibility pass, deploy on Vercel

The live link will be added here after step 5.

## Tech stack

| | |
|---|---|
| UI | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4, using the colour and text tokens from the Figma design |
| Fonts | Geist and Geist Mono, served by the site itself (Fontsource) |
| Icons | react-icons (Lucide, plus Font Awesome for brand logos) |
| Tests | Playwright end-to-end tests at desktop and phone sizes, ESLint |
| Hosting | Vercel (planned) |

## Running locally

You need Node.js 22.12 or newer.

```
npm install
npm run dev        # site on http://localhost:5174
```

| Command | What it does |
|---|---|
| `npm run dev` | development server on http://localhost:5174 |
| `npm run build` | production build in `dist/` |
| `npm run preview` | serves the production build on http://localhost:4174 |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright tests at 1440px and 390px (starts the dev server if needed) |

The first time you run the tests, download Playwright's browser with
`npx playwright install chromium`.

The dev server uses port 5174 on purpose (not Vite's usual 5173), so it can run next to my
[Tooth Fairy Dentistry](https://github.com/Justin-25/DentalClinic-FullStack-project) project
without the tests ever reaching the wrong app.

## Changing the content

All text and links on the page live in one file, [`src/content.js`](src/content.js), so
updating the bio, a link or a project never means editing components.

Two links aren't ready yet. Setting `linkedin` or `cv` in `profile` makes the LinkedIn links
or the "Download CV" button appear by themselves.

## Project structure

```
src/
├── content.js       # all text and links on the page
├── index.css        # design tokens (colours, text styles) and shared CSS utilities
├── App.jsx          # page layout: background, nav, sections, footer
├── assets/          # photo and project screenshot (WebP, resized for 2x screens)
├── components/      # Nav, MobileMenu, Background (grid + cursor spotlight), Badge,
│                    # TagList, IconBox, SocialLinks, SectionHeading, Footer, ui.js (button styles)
└── sections/        # Hero, Projects, About (with education & courses), Contact
e2e/                 # Playwright tests
public/              # favicon
```

## Design and accessibility

- **Tokens match Figma.** Colour names in code are the Figma variable names (`bg`, `surface`,
  `border`, `primary` / `secondary` / `muted` text), and text classes are the Figma text
  styles (`text-display-xl`, `text-heading-m`, `text-body-s`, `eyebrow`…).
- **Keyboard friendly.** A "Skip to content" link appears on the first Tab. The phone menu is
  a native `<dialog>`: it keeps focus inside, closes with Esc, and returns focus to the menu
  button.
- **Calm motion.** In-page links glide to their section, and everything moves instantly
  instead when the visitor's system asks for reduced motion.
- **Cursor spotlight.** A soft light follows the mouse and brightens the background grid. It
  moves with CSS transforms only, so scrolling stays smooth. On touch screens, and when reduced
  motion is on, the page shows a still glow instead.
- **Light images.** Photos are WebP, sized for sharp screens, and load only when needed, so a
  phone never downloads the large desktop photo.

## Contact

- Email: [justinmandia25@gmail.com](mailto:justinmandia25@gmail.com)
- GitHub: [@Justin-25](https://github.com/Justin-25)
