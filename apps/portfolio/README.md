# PORTFOLIO

This is my Angular Portfolio site. It serves as the central hub for my monorepo demos and case studies.
Each project links out to live demos (Angular / React / Vanilla) hosted on subdomains, along with source code.

---

## Pages

- `/`
  - Landing page with sections for fast scan
  - Includes the Contact section (scroll target)
- `/projects`
  - Grid/list of all projects with search + filters
- `/projects/:slug`
  - Project detail page with:
    - Live demos (Angular / React / Vanilla)
    - Source code links
    - Case study content (on the same page)
- `/resume`
  - Resume embedded + downloadable

---

## Layout

### Global layout

- Sticky top nav
  - Name → `/`
  - Projects → `/projects`
  - Resume → `/resume`
- Main content (routed)
- Footer
  - Email
  - LinkedIn
  - GitHub

---

## Home (`/`)

- Hero
  - Headline: “Enterprise Angular Engineer”
  - Subheading: 1–2 lines (monorepos, large datasets, scalable UI architecture)
  - CTAs:
    - View Projects → `/projects`
    - Contact → scroll to Contact section
- Featured Projects (3–6)
  - Project card:
    - Title
    - 1-liner
    - Tags
    - View → `/projects/:slug`
- Capabilities (high-signal only)
  - Typed data layer: Firestore / adapters / validation
  - Monorepo architecture: Nx libs + boundaries
  - CI/CD: preview deploys + environment promotion
- Experience Highlights
  - 4–8 impact bullets (metrics where possible)
- How it’s built
  - Nx graph screenshot/diagram + short “why this structure”
- Contact (section on home page)
  - Email button
  - LinkedIn button

---

## Projects list (`/projects`)

- Search input
- Filter chips (examples)
  - Angular
  - React
  - Vanilla
  - Node
  - Admin
  - Data-heavy
  - CI/CD
- Sort
  - Featured first (default)
- Project cards
  - Title
  - 1-liner
  - Tags
  - View → `/projects/:slug`

---

## Project detail (`/projects/:slug`)

- Header
  - Title + tagline + tech badges
  - “What it demonstrates” (2–3 bullets)
- Primary actions
  - Live demo (Angular)
  - Live demo (React)
  - Live demo (Vanilla)
  - Source code (GitHub)
  - Case study → scroll to Case Study section
- Body
  - Problem statement (2–4 sentences)
  - Architecture overview (bullets or diagram)
  - Data model (short + readable)
  - Performance considerations (what was done + why)
  - Screenshots / GIFs
  - Case study (section on this page)
    - Constraints
    - Tradeoffs
    - Decisions
  - What I’d do next (next steps / roadmap)
