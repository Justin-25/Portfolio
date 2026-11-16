# Portfolio site: working rules

My personal portfolio site, for applying to full-stack developer jobs as a recent graduate.
It links to my projects, starting with Tooth Fairy Dentistry
(live: https://dental-clinic-three-kappa.vercel.app, code: https://github.com/Justin-25/DentalClinic-FullStack-project).
Keep it small (about 1–2 days of work): content over polish.

## Decisions (2026-11-15)
- **Stack:** React + Vite + Tailwind CSS, deployed on Vercel. No backend of my own (unless the
  contact-form choice below needs a small serverless function).
- **Structure:** one page: Hero → Projects → About & skills (with Education & courses) → Contact
  → Footer with my GitHub contribution graph.
- **Contact (changed 2026-11-15):** links (email, LinkedIn, GitHub) plus a "Want to collaborate?
  Contact me." form that sends the message to my email via **Web3Forms** (no backend). Public email:
  **justinmandia25@gmail.com**. Download CV stays hidden until the PDF exists.
- **Currently building card:** my e-commerce repo (https://github.com/Justin-25/E-commerce-FullStack-project),
  described with its real progress (JWT login with refresh-token rotation, MongoDB Atlas, Redis).
- **Look:** Vercel-like black and white (dark), Geist + Geist Mono, grayscale photo, a fixed grid
  background with a spotlight that follows the cursor (static on touch screens and reduced motion).
- **Design:** Figma file "Portfolio – Web Design": https://www.figma.com/design/VB9xMZZb55hSy7bBScv7f5
  (page "Web Design": Desktop 1440, Phone 390, States & notes; page "Components"). Design first,
  then I approve it, then code.

## Build plan (design approved 2026-11-16); I commit after each task
1. Setup & page shell: Vite + React + Tailwind, Geist fonts, Figma tokens, nav + phone menu,
   empty sections, footer bar, Playwright (desktop 1440 + phone 390).
2. Content: Hero, Projects, About & skills, Education & courses, grid background + cursor spotlight.
3. Contact: form, inline errors, "Sending…", Web3Forms, shared Modal (sent / not sent).
4. Footer GitHub graph, loaded live from the free public contributions API
   (github-contributions-api.jogruber.de); "View on GitHub" link if it can't load.
5. Motion, accessibility pass, deploy to Vercel.

These rules carry over from the Tooth Fairy Dentistry project. Follow them every session.

## How we work
- **Recommend first, then code.** Before coding a task, bring a short plain-English plan, your
  recommendations and any open decisions (scope, design gaps, deviations from Figma), ideally as
  questions with a recommended option. Start coding only after I agree. Claude writes the code.
- **Plain English first.** Briefly explain what happens and why before the code, and say what
  professional teams usually do when it matters.
- **Act as QA.** Run and test what you build, and report exactly what passed and failed with the
  real output. Never claim something works that wasn't tested.
- **I commit, never Claude.** When a task is done and verified, stop and give me a short commit
  message (one subject line, at most a few short bullets) with the terminal commands. Wait for me
  to commit before starting the next task.

## Design
- **Figma is the source of truth** for layout, components, spacing, sizes and fonts. Don't
  introduce a different design on your own. If a change seems better (usability, accessibility, a
  missing state), propose it with the trade-off; if I approve, update Figma too so design and code
  stay in sync.
- My Figma account is on the Starter plan with a View seat: at most 3 pages per file, and only
  about 20 read-type Figma MCP calls a month, so read sparingly. Tell me before using AI image
  generation (it uses credits).
- **Messages:** confirmations, and the result of a confirmed action, use a shared Modal (never
  `window.confirm` or an inline alert); form errors stay inline next to their fields.

## Motion
- Subtle and calm, "less is more". Sections fade in with a 10–20px slide-up the first time they
  scroll into view (IntersectionObserver, once). Lists stagger by 50–100ms (capped). Hover is a
  slight lift, soft shadow or colour change. Menus and modals open and close smoothly.
- 150–400ms, ease-out `cubic-bezier(0.22, 1, 0.36, 1)`; animate only opacity and transform.
- No bounce, spin, heavy parallax, auto-playing carousels, typing effects or looping backgrounds.
  No heavy animation libraries unless really needed: CSS transitions + IntersectionObserver.
- Respect `prefers-reduced-motion`; content must never wait on an animation.
- Exception I asked for (2026-11-15): the background spotlight follows the cursor. Keep it subtle,
  move it with transform only, and turn it off on touch screens and with reduced motion.

## Testing
- Verify in a real browser with Playwright end-to-end tests before saying a change works, and
  run lint.
- When checking against real services or data, prefer read-only checks; record anything you
  change and put it back.

## Tools
- When spawning subagents, use the Sonnet model.
