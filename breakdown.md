# Nx Portfolio Breakdown

## Workspace Inventory

- Apps: 5
- Libraries: 10

---

## Apps

### 1) `firebase-sync`

**Path:** `apps/firebase-sync`

**What it is**
- A Node.js + Express utility API for Firebase Admin / Firestore operations across targets.

**What it does**
- Starts a server (default port 3333).
- Exposes:
  - `GET /health`
  - `GET /targets` (returns available targets including emulator and configured project keys)
  - `GET /collections?target=...` (lists top-level Firestore collections for the target)
- Initializes Firebase Admin app/Firestore per target and caches clients.
- Supports emulator host/port settings for Firestore.

**Libraries it uses**
- Internal:
  - `@portfolio/shared/config`
- External:
  - `express`
  - `firebase-admin`

**Evidence**
- `apps/firebase-sync/src/main.ts`
- `apps/firebase-sync/src/firebase-admin.ts`
- `apps/firebase-sync/project.json`

---

### 2) `portfolio`

**Path:** `apps/portfolio`

**What it is**
- The primary Angular portfolio application and central app in the monorepo.

**What it does**
- Angular routed app with pages:
  - `/`
  - `/projects`
  - `/project/:slug`
  - `/resume`
- Uses shared layout components (header/sidenav/footer) for the global shell.
- Uses a Firestore-backed app data layer through shared Angular Firestore service.
- Angular build is configured to include shared design token path for styles.

**Libraries it uses**
- Internal:
  - `@portfolio/shared/angular/layouts`
  - `@portfolio/shared/angular/firestore-angular`
  - `libs/shared/design-tokens` (style preprocessor include path in build config)
- External:
  - Angular framework packages (`@angular/*`)
  - `rxjs`
  - `zone.js`

**Evidence**
- `apps/portfolio/README.md`
- `apps/portfolio/src/app/app.routes.ts`
- `apps/portfolio/src/app/app.ts`
- `apps/portfolio/src/app/data/database.ts`
- `apps/portfolio/project.json`

---

### 3) `portfolio-react`

**Path:** `apps/portfolio-react`

**What it is**
- React implementation of the portfolio site.

**What it does**
- React Router-based app with routes:
  - `/`
  - `/projects`
  - `/project/:slug`
  - `/resume`
- Uses shared React layout components (header/sidenav/footer).
- Contains a Firebase usage page component for CRUD-style interactions, though it is not wired to the main route map in `app.tsx`.

**Libraries it uses**
- Internal:
  - `@portfolio/shared/react/layouts-react`
  - `@portfolio/shared/react/firestore-react` (used by `firebase-use.tsx`)
- External:
  - `react`
  - `react-dom`
  - `react-router-dom`

**Evidence**
- `apps/portfolio-react/src/app/app.tsx`
- `apps/portfolio-react/src/app/pages/firebase-use.tsx`
- `apps/portfolio-react/project.json`

---

### 4) `portfolio-e2e`

**Path:** `apps/portfolio-e2e`

**What it is**
- Playwright E2E test app for the Angular `portfolio` app.

**What it does**
- Runs browser-based E2E tests using Playwright + Nx preset.
- Starts a static server for production build of `portfolio` (configured with dedicated port in Playwright config).
- Declares implicit dependency on `portfolio`.

**Libraries it uses**
- Internal:
  - none directly
- External:
  - `@playwright/test`
  - `@nx/playwright`

**Evidence**
- `apps/portfolio-e2e/project.json`
- `apps/portfolio-e2e/playwright.config.ts`

---

### 5) `portfolio-react-e2e`

**Path:** `apps/portfolio-react-e2e`

**What it is**
- Playwright E2E project associated with the React `portfolio-react` app.

**What it does**
- Includes Playwright config to target the React preview server at `http://localhost:4201`.
- Declares implicit dependency on `portfolio-react`.
- `project.json` currently has an empty `targets` object, so wiring differs from `portfolio-e2e`.

**Libraries it uses**
- Internal:
  - none directly
- External:
  - `@playwright/test`
  - `@nx/playwright` preset usage in config

**Evidence**
- `apps/portfolio-react-e2e/project.json`
- `apps/portfolio-react-e2e/playwright.config.ts`

---

## Libraries

### Angular Libraries

#### 1) `firebase-config-angular`

**Path:** `libs/angular/firebase-config-angular`

**What it is**
- Angular DI service layer for environment-aware Firebase/Firestore adapter configuration.

**What it does**
- Resolves project key and environment (`live` vs `emulator`).
- Caches Firestore adapters by project/environment.
- Exposes environment option helpers consumed by Angular Firestore service.

**Depends on**
- Internal:
  - `@portfolio/shared/config`
  - `@portfolio/shared/firebase-core`
  - `@portfolio/shared/firestore`
- External:
  - `@angular/core`
  - `firebase`

**Used by**
- `libs/angular/firestore-angular`
- Transitively by app `portfolio` via `firestore-angular`

**Evidence**
- `libs/angular/firebase-config-angular/src/index.ts`
- `libs/angular/firebase-config-angular/src/lib/firebase-config.service.ts`

---

#### 2) `firestore-angular`

**Path:** `libs/angular/firestore-angular`

**What it is**
- Angular Firestore service wrapper over the shared Firestore adapter/CRUD layer.

**What it does**
- Exposes typed CRUD methods.
- Provides observable wrappers (`$` methods) and realtime listeners.
- Includes signal conversion helper for collection listeners.
- Delegates adapter/env resolution to `firebase-config-angular`.

**Depends on**
- Internal:
  - `@portfolio/shared/config`
  - `@portfolio/shared/firestore`
  - `@portfolio/shared/angular/firebase-config-angular`
- External:
  - `@angular/core`
  - `@angular/core/rxjs-interop`
  - `rxjs`
  - Firebase Firestore types

**Used by**
- `apps/portfolio/src/app/data/database.ts`
- `apps/portfolio/src/app/pages/firebase-use.ts`

**Evidence**
- `libs/angular/firestore-angular/src/index.ts`
- `libs/angular/firestore-angular/src/lib/firestore.service.ts`

---

#### 3) `layouts`

**Path:** `libs/angular/layouts`

**What it is**
- Reusable Angular layout component library.

**What it does**
- Exports:
  - `footer`
  - `header`
  - `side-nav`
  - `theme-toggle`
- Provides the shared structural UI for Angular app shell composition.

**Depends on**
- Internal:
  - none
- External:
  - Angular component stack (`@angular/core`, `@angular/common`, `@angular/router` where used)

**Used by**
- `apps/portfolio/src/app/app.ts`

**Evidence**
- `libs/angular/layouts/src/index.ts`

---

### React Libraries

#### 4) `firebase-config-react`

**Path:** `libs/react/firebase-config-react`

**What it is**
- React-side Firebase configuration utility module.

**What it does**
- Resolves environment (`live`/`emulator`) and project key.
- Caches Firestore adapters.
- Exposes `getAdapter` and `getEnvironmentOptions` helpers.

**Depends on**
- Internal:
  - `@portfolio/shared/config`
  - `@portfolio/shared/firebase-core`
  - `@portfolio/shared/firestore`
- External:
  - `firebase`

**Used by**
- `libs/react/firestore-react`

**Evidence**
- `libs/react/firebase-config-react/src/index.ts`
- `libs/react/firebase-config-react/src/lib/firebase-config-react.ts`

---

#### 5) `firestore-react`

**Path:** `libs/react/firestore-react`

**What it is**
- React-focused async Firestore utility library.

**What it does**
- Exposes async CRUD operations and batch commit helper usage.
- Includes sorting helper and environment-pair collection fetch helper.
- Uses adapter/env helpers from `firebase-config-react`.

**Depends on**
- Internal:
  - `@portfolio/shared/config`
  - `@portfolio/shared/firestore`
  - `@portfolio/shared/react/firebase-config-react`
- External:
  - none directly (relies on shared adapter stack)

**Used by**
- `apps/portfolio-react/src/app/pages/firebase-use.tsx`

**Evidence**
- `libs/react/firestore-react/src/index.ts`
- `libs/react/firestore-react/src/lib/firestore-react.ts`

---

#### 6) `layouts-react`

**Path:** `libs/react/layouts-react`

**What it is**
- Reusable React layout component library.

**What it does**
- Exports:
  - `Footer`
  - `Header`
  - `SideNav`
  - `ThemeToggle`
- Shared shell/navigation components for React app composition.

**Depends on**
- Internal:
  - none
- External:
  - `react`
  - `react-router-dom`

**Used by**
- `apps/portfolio-react/src/app/app.tsx`

**Evidence**
- `libs/react/layouts-react/src/index.ts`

---

### Shared Libraries

#### 7) `config`

**Path:** `libs/shared/config`

**What it is**
- Central shared workspace configuration and type definitions.

**What it does**
- Exports `workspaceConfig` with Firebase project map + emulator settings.
- Exports config model types (`WorkspaceConfig`, project key types, etc.).

**Depends on**
- Internal:
  - none
- External:
  - none

**Used by**
- `apps/firebase-sync`
- `libs/shared/firebase-core`
- `libs/angular/firebase-config-angular`
- `libs/react/firebase-config-react`
- `libs/angular/firestore-angular` (types)
- `libs/react/firestore-react` (types)

**Evidence**
- `libs/shared/config/src/index.ts`
- `libs/shared/config/src/lib/workspace-config.ts`

---

#### 8) `design-tokens`

**Path:** `libs/shared/design-tokens`

**What it is**
- Shared design token package.

**What it does**
- Exports design token constants via `design-tokens` module.
- Used as a style include source in Angular app build pipeline.

**Depends on**
- Internal:
  - none
- External:
  - none

**Used by**
- Build/style pipeline in `apps/portfolio` (include path)
- Any project importing `@portfolio/shared/design-tokens`

**Evidence**
- `libs/shared/design-tokens/src/index.ts`
- `apps/portfolio/project.json`

---

#### 9) `firebase-core`

**Path:** `libs/shared/firebase-core`

**What it is**
- Framework-agnostic Firebase client initialization/caching layer.

**What it does**
- Initializes Firebase app/auth/firestore clients per project + mode.
- Caches clients by composite key.
- Connects to emulators when enabled and emulator mode is requested.
- Exposes `getFirestoreClient` and `getAuthClient`.

**Depends on**
- Internal:
  - `@portfolio/shared/config`
- External:
  - `firebase/app`
  - `firebase/auth`
  - `firebase/firestore`

**Used by**
- `libs/angular/firebase-config-angular`
- `libs/react/firebase-config-react`

**Evidence**
- `libs/shared/firebase-core/src/index.ts`
- `libs/shared/firebase-core/src/lib/firebase-clients.ts`

---

#### 10) `firestore`

**Path:** `libs/shared/firestore`

**What it is**
- Shared Firestore abstraction + generic CRUD/batch utility layer.

**What it does**
- Defines adapter contracts and core path-based CRUD helpers.
- Exports batch operation types/helpers, including chunked commit utility.
- Exports web Firestore adapter implementation.

**Depends on**
- Internal:
  - none
- External:
  - `rxjs` in realtime/adapter utilities

**Used by**
- `libs/angular/firebase-config-angular`
- `libs/angular/firestore-angular`
- `libs/react/firebase-config-react`
- `libs/react/firestore-react`

**Evidence**
- `libs/shared/firestore/src/index.ts`
- `libs/shared/firestore/src/lib/crud.ts`
- `libs/shared/firestore/src/lib/batch.ts`

---

## Workspace Dependency Topology

1. Shared foundation
- `libs/shared/config`
- `libs/shared/design-tokens`
- `libs/shared/firebase-core`
- `libs/shared/firestore`

2. Angular layer
- `libs/angular/firebase-config-angular` -> shared config/firebase-core/firestore
- `libs/angular/firestore-angular` -> shared firestore + angular firebase-config
- `libs/angular/layouts` -> UI shell components

3. React layer
- `libs/react/firebase-config-react` -> shared config/firebase-core/firestore
- `libs/react/firestore-react` -> shared firestore + react firebase-config
- `libs/react/layouts-react` -> UI shell components

4. App usage
- `apps/portfolio` -> angular/layouts + angular/firestore-angular
- `apps/portfolio-react` -> react/layouts-react (+ react/firestore-react in Firebase usage page)
- `apps/firebase-sync` -> shared/config (+ firebase-admin directly)
- `apps/portfolio-e2e` -> tests `portfolio`
- `apps/portfolio-react-e2e` -> tests `portfolio-react`

---

## External Dependency Families (Root `package.json`)

- Angular: `@angular/*`, `@angular/ssr`
- React: `react`, `react-dom`, `react-router-dom`
- Firebase: `firebase`, `firebase-admin`
- Backend: `express`
- Reactive/utilities: `rxjs`, `zone.js`
- Tooling/testing: Nx plugins, Jest, Playwright, Vite, TypeScript, ESLint

Reference files:
- `package.json`
- `tsconfig.base.json`
- `README.md`
