# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

This repo uses **pnpm** exclusively. Never use npm or yarn.

## Common Commands

```bash
# Serve apps locally
pnpm exec nx serve portfolio              # Angular app (default port 4200)
pnpm exec nx serve portfolio-react        # React app
pnpm exec nx serve games                  # Games Angular app

# Build
pnpm exec nx build portfolio
pnpm exec nx build portfolio --configuration=production

# Lint / test a specific project
pnpm exec nx lint portfolio
pnpm exec nx test portfolio
pnpm exec nx test shared-config           # use the Nx project name

# Run a single Jest test file
pnpm exec nx test portfolio --testFile=path/to/spec.ts

# E2E (Playwright)
pnpm exec nx e2e portfolio-e2e
pnpm exec nx e2e portfolio-react-e2e
pnpm exec nx e2e games-e2e

# Run targets across all projects
pnpm exec nx run-many -t lint
pnpm exec nx run-many -t test
pnpm exec nx run-many -t build

# Firebase emulators (Firestore on :8080, Auth on :9099)
pnpm exec firebase emulators:start --import=./emulator-data --export-on-exit=./emulator-data
```

## Architecture Overview

**Nx monorepo** with two frontend apps, one Node.js backend, two E2E suites, and ten shared libraries.

### Apps

| App                   | Framework         | Description                                          |
| --------------------- | ----------------- | ---------------------------------------------------- |
| `portfolio`           | Angular 20        | Primary portfolio app                                |
| `portfolio-react`     | React 19          | Alternate React implementation of the same portfolio |
| `games`               | Angular 20        | Games app (no SSR)                                   |
| `firebase-sync`       | Node.js / Express | Backend REST API deployed to Google Cloud Run        |
| `portfolio-e2e`       | Playwright        | E2E tests for Angular app                            |
| `portfolio-react-e2e` | Playwright        | E2E tests for React app                              |
| `games-e2e`           | Playwright        | E2E tests for Games app                              |

### Library Layers (imported as `@portfolio/shared/*`)

| Path                                   | Import                                              | Description                             |
| -------------------------------------- | --------------------------------------------------- | --------------------------------------- |
| `libs/shared/config`                   | `@portfolio/shared/config`                          | Workspace config, Firebase project IDs  |
| `libs/shared/firebase-core`            | `@portfolio/shared/firebase-core`                   | Framework-agnostic Firebase client init |
| `libs/shared/firestore`                | `@portfolio/shared/firestore`                       | Generic Firestore CRUD/batch ops        |
| `libs/shared/design-tokens`            | `@portfolio/shared/design-tokens`                   | Style constants                         |
| `libs/angular/firestore-angular`       | `@portfolio/shared/angular/firestore-angular`       | RxJS-wrapped Firestore                  |
| `libs/angular/firebase-config-angular` | `@portfolio/shared/angular/firebase-config-angular` | Angular DI config service               |
| `libs/angular/layouts`                 | `@portfolio/shared/angular/layouts`                 | Header/footer/sidenav                   |
| `libs/react/firebase-config-react`     | `@portfolio/shared/react/firebase-config-react`     | React Firebase config                   |
| `libs/react/firestore-react`           | `@portfolio/shared/react/firestore-react`           | Async Firestore helpers                 |
| `libs/react/layouts-react`             | `@portfolio/shared/react/layouts-react`             | React layout components                 |

**Dependency direction:** `shared foundation → framework-specific layers → apps`. Apps never depend on each other.

### Firebase Environments

Two environments are defined in `libs/shared/config`:

- `live` — production Firestore/Auth
- `emulator` — local dev (Firestore :8080, Auth :9099)

Both frontend apps use the shared Firebase client from `@portfolio/shared/firebase-core`; they also call the `firebase-sync` backend API for operations requiring the Admin SDK.

## CI/CD

Three GitHub Actions workflows:

- **`ci.yml`** — lint → unit test → build → E2E (E2E runs on push only). Uses Nx Cloud on `main`/`beta`.
- **`deploy.yml`** — Cloudflare Pages. `main` → production, `beta` → pre-production, feature branches → preview.
- **`deploy-firebase-sync.yml`** — Docker → Artifact Registry → Cloud Run. Env vars sourced from `apps/firebase-sync/.env.yaml`. GCP auth via Workload Identity (OIDC).

## Code Style

Prettier is enforced: 100-char line width, 2-space indent, single quotes. ESLint module boundary rules prevent cross-layer imports that violate the dependency graph.
