# Portfolio

This repository is a **personal portfolio monorepo** built with **Nx**, designed to
showcase how modern, enterprise-scale web applications are structured, developed,
and deployed.

---

## What This Is

- An Nx monorepo containing multiple applications and shared libraries
- The primary application is an **Angular-based portfolio**
- Additional apps include demos, experiments, and backend services
- Code is structured to mirror real-world enterprise patterns

---

## Key Technologies

- **Frontend:** Angular (primary), React, Vanilla HTML/CSS/JS
- **Backend:** Node.js, Firebase Authentication, Firestore
- **Tooling:** Nx, TypeScript, pnpm
- **Testing:** Jest, Playwright
- **CI/CD:** GitHub Actions
- **Hosting:** Cloudflare Pages

---

## Architecture Highlights

- Clear separation between **apps** and **shared libraries**
- Reusable, scalable code via Nx libraries
- Automated CI with quality gates
- Branch-based deployments:
  - `main` → production
  - `beta` → pre-production
  - feature branches → preview environments

---

## Authentication

Applications are deployed independently and use a secure **SSO-style authentication**
flow built on Firebase Authentication and short-lived token handoff to support
cross-application sign-in.

---

## Running Locally

    pnpm install
    pnpm exec nx serve portfolio

---

For full documentation, setup instructions, and architectural details, see the main
`README.full.md`.
