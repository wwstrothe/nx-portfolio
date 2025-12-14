# Portfolio (Full Overview)

## TL;DR

- **Nx-powered monorepo** showcasing multiple applications (Angular, React, Node)
- **Primary app:** Angular portfolio built with enterprise-scale architecture
- **Modern tooling:** Nx, TypeScript, pnpm, Jest
- **CI/CD:** GitHub Actions with automated preview, beta, and production deployments
- **Hosting:** Cloudflare Pages
- **Authentication:** Firebase Auth with cross-app SSO using secure token handoff
- **Focus:** scalability, maintainability, real-world production patterns

This repository is designed to reflect how large, modern web platforms are built,
tested, and deployed in enterprise environments.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Security & Authentication](#security--authentication)
- [Environments & Branching Strategy](#environments--branching-strategy)
- [Getting Started (New Machine Setup)](#getting-started-new-machine-setup)
- [Running the Project Locally](#running-the-project-locally)
- [CI/CD & Deployment](#cicd--deployment)
- [Adding a New App](#adding-a-new-app)
- [Testing](#testing)

---

## Overview

This repository is a personal portfolio monorepo built with Nx, showcasing multiple
applications and experiments across different frameworks, including Angular, Node,
and React. While the workspace supports several technologies, the primary entry point
and flagship application is an Angular-based portfolio site.

The goal of this project is to explore large-scale application design, enterprise-level
architecture, and real-world production patterns. It serves both as a learning
environment for experimenting with new frameworks and tooling, and as a platform for
building and deploying real, production-ready applications.

This repository is intended for personal growth as well as external visibility. It is
designed to be shared with recruiters, future employers, potential collaborators, and
anyone interested in reviewing how modern frontend and full-stack applications can be
structured, built, and deployed at scale.

A strong emphasis is placed on scalability, maintainability, and automation. The
project is built with an enterprise mindset, prioritizing clean architecture, shared
libraries, and a robust CI/CD pipeline to mirror real-world engineering environments.

---

## Project Structure

This repository is organized as a standard Nx monorepo, using the conventional
`apps/` and `libs/` layout to promote scalability, reuse, and clear separation
of concerns.

### apps/

The `apps/` directory contains all runnable applications in the workspace. This
includes:

- The primary **Angular portfolio application**, which serves as the main entry
  point to the project
- Additional frontend applications used for demos, experiments, and learning
- Backend services and APIs where applicable

Each application is developed and built independently, while still benefiting
from shared tooling, configuration, and libraries provided by the monorepo.

### libs/

The `libs/` directory contains shared libraries that are consumed by one or more
applications. These libraries are used to centralize common functionality and
enforce consistent patterns across the workspace.

Examples of shared libraries include:

- Reusable UI components and styles
- Shared utilities and helper functions
- Domain-specific logic and feature libraries
- Cross-application configuration and tooling

By structuring the project this way, the monorepo supports long-term growth,
encourages code reuse, and mirrors enterprise-scale application architecture.

---

## Technologies

This project leverages a modern, enterprise-oriented technology stack focused on
scalability, maintainability, and real-world production workflows. While Angular is
the primary framework, the monorepo is intentionally flexible to support experimentation
with additional technologies over time.

### Frontend

- **Angular** – Primary framework used for the main portfolio application and
  most frontend development
- **React** – Used for experimentation and comparison with Angular in a shared
  monorepo environment
- **Vanilla HTML / CSS / JavaScript** – Simple, framework-free frontend projects
  consisting of plain HTML, CSS, and JavaScript files, used to explore fundamentals,
  browser behavior, and lightweight implementations without build tooling
- **SCSS** – Styling solution used across applications and shared libraries

### Backend

- **Node.js** – Backend runtime for APIs and services within the monorepo
- **Firebase Authentication** – Primary authentication provider for user identity,
  session management, and cross-application sign-in
- **Firestore** – Primary data store for application data, configuration, and
  user-related information
- **Exploratory Backends** – In addition to Firebase, the project intentionally allows
  experimentation with alternative backend architectures (e.g., REST APIs, workers,
  or other Node-based services) to compare tradeoffs, scalability, and operational
  complexity

Firebase serves as the default and proven backend for production use cases, while
additional backend implementations are explored to deepen understanding of different
architectural approaches and enterprise patterns.

### Tooling

- **Nx** – Monorepo tooling for managing multiple applications, shared libraries,
  and build pipelines
- **pnpm** – Package manager for fast, efficient dependency management
- **TypeScript** – Strongly typed language used across frontend and backend codebases
- **Jest** – Testing framework for unit and integration tests

### CI/CD & Hosting

- **GitHub Actions** – Continuous integration and deployment pipelines
- **Cloudflare Pages** – Hosting platform for frontend applications and previews

---

## Security & Authentication

This repository contains multiple applications that are deployed independently
(e.g., separate Cloudflare Pages projects and distinct browser origins). Because of
this, application state and authentication sessions cannot be shared directly at
runtime between apps.

To provide a seamless and secure "sign in once, use multiple apps" experience, this
project implements a Single Sign-On (SSO) style authentication flow using Firebase
Authentication and a secure token handoff mechanism.

### Cross-App Authentication (SSO Across Separate Deployments)

The authentication model is designed to allow a user who signs in to one application
(such as the Angular portfolio) to access another application (such as Banker Toolbox)
without needing to manually re-authenticate, even though the applications are deployed
separately.

#### High-Level Flow (Token Handoff + Custom Token)

1. A user signs in to the Portfolio application using Firebase Authentication
2. The Portfolio application retrieves the user's Firebase ID token
3. The ID token is sent to a backend endpoint (Cloudflare Worker or Node API)
4. The backend verifies the ID token using the Firebase Admin SDK
5. The backend mints a short-lived, one-time Firebase **custom token**
6. The user is redirected to the target application with a one-time authorization code
7. The target application exchanges the code for the custom token
8. The user is signed in via `signInWithCustomToken()` in the target application

#### Security Considerations

- Authorization codes are **short-lived** and **one-time use**
- Tokens are never stored long-term or exposed unnecessarily
- All token exchanges occur over HTTPS
- The backend is the only layer authorized to mint Firebase custom tokens
- Exchange endpoints should enforce expiration, one-time redemption, and rate limiting

#### Shared Authentication Architecture

Although runtime auth sessions are isolated per application, all Angular applications
share a consistent authentication and state-management architecture via Nx libraries:

- `libs/auth/*` — Firebase initialization and shared authentication utilities
- `libs/state/auth/*` — Shared NgRx authentication feature (actions, reducers, effects,
  selectors, and facades)
- Each application hydrates its local auth state on startup by subscribing to Firebase
  authentication state changes and loading any required user profile or role data

---

## Environments & Branching Strategy

This repository uses a simple, production-oriented branching model paired with
automated CI and Cloudflare Pages deployments. The goal is to keep feedback loops
fast (previews on every branch) while maintaining clear separation between beta and
production releases.

### Branches

- `main` — Production branch
- `beta` — Pre-production / staging branch
- `*` (any other branch) — Preview branches (feature work, experiments, CI config, etc.)

### Environments

The project follows four practical environments:

- **Local** — Developer machine via `nx serve` and local tooling
- **Preview** — Automatically deployed for any non-`main` / non-`beta` branch
- **Beta** — Automatically deployed from the `beta` branch
- **Production** — Automatically deployed from the `main` branch

### CI Behavior

The CI workflow runs on:

- **Pull Requests** (from any branch)
- **Pushes** to `main` and `beta`

CI includes fast checks on every run:

- Lint (`nx lint portfolio`)
- Unit tests (`nx test portfolio`)
- Production build (`nx build portfolio --configuration=production`)

Additional heavier checks run only on pushes (not on PR events):

- Playwright install (Chromium only)
- E2E tests (`nx e2e portfolio-e2e`)

### Deployment Behavior (Cloudflare Pages)

Deployments run on every push and publish the `portfolio` app to Cloudflare Pages
using Wrangler:

- **Production** (`main`)
  - Deploys to the Cloudflare Pages project without a branch flag
- **Beta** (`beta`)
  - Deploys using `--branch="beta"`
- **Preview** (any other branch)
  - Deploys using `--branch="<branch-name>"`

This provides stable production and beta environments, plus a fully isolated preview
deployment for every working branch.

### Adding More Apps to Deploy

Deployments are configured using a matrix strategy. To deploy additional applications,
add a new entry to the `matrix.include` list in the Cloudflare Pages workflow with:

- `nxApp` — the Nx application name
- `cfProject` — the Cloudflare Pages project name
- `distDir` — the build output directory to deploy

---

## Getting Started (New Machine Setup)

This repository is optimized for consistent local and CI builds by standardizing the
development toolchain.

- **Node.js:** 20.x
- **pnpm:** 9.x (CI uses 9.8.0)
- **Nx:** workspace-local (run via `pnpm exec nx ...`)

### Prerequisites

Verify the following tools are installed:

    git --version
    node --version
    pnpm --version
    corepack --version
    pnpm exec nx --version

Note: This repository uses **pnpm**. Avoid using `npm install` or `yarn install`
to prevent dependency and lockfile drift.

---

### Toolchain Switching (Node + pnpm)

This project is used across multiple machines and operating systems. The instructions
below cover the supported Node version managers.

Supported managers:

- nvm-windows (Windows)
- nvm (macOS / Linux)
- Volta (cross-platform)

#### Windows: nvm-windows

Switch Node to the required version:

    nvm install 20
    nvm use 20
    node --version

Pin pnpm using Corepack:

    corepack enable
    corepack prepare pnpm@9.8.0 --activate
    pnpm --version

#### macOS / Linux: nvm

Switch Node to the required version:

    nvm install 20
    nvm use 20
    node --version

Pin pnpm using Corepack:

    corepack enable
    corepack prepare pnpm@9.8.0 --activate
    pnpm --version

#### Volta (Windows / macOS / Linux)

Pin Node and pnpm at the project level:

    volta pin node@20
    volta pin pnpm@9.8.0
    node --version
    pnpm --version

---

### Install Dependencies

From the repository root:

    pnpm install --frozen-lockfile

---

### Run Locally

Start the primary portfolio application:

    pnpm exec nx serve portfolio

---

### Common Commands

Lint:

    pnpm exec nx lint portfolio

Unit tests:

    pnpm exec nx test portfolio

Production build:

    pnpm exec nx build portfolio --configuration=production

---

## Running the Project Locally

This repository uses Nx to run and manage applications locally. All commands should be
run from the root of the repository using `pnpm exec` to ensure the workspace-local
version of Nx is used.

---

### Running the Portfolio Application

The primary entry point for this repository is the Angular portfolio application.

Start the development server:

    pnpm exec nx serve portfolio

By default, the application will be available at:

    http://localhost:4200

Nx will automatically watch for file changes and reload the application during
development.

---

### Running Other Applications

Additional applications (frontend demos, experiments, backend services, etc.) can be
started using the same pattern:

    pnpm exec nx serve <app-name>

To view all available applications in the workspace:

    pnpm exec nx show projects

---

### Running Multiple Apps at Once

Nx allows multiple applications to be run concurrently in separate terminals. This is
useful when working with frontend and backend services together.

Example:

    pnpm exec nx serve portfolio
    pnpm exec nx serve some-backend-api

---

### Building Locally

To create a production build of an application:

    pnpm exec nx build portfolio --configuration=production

Build output will be generated in the `dist/` directory.

---

### Viewing the Workspace Graph

Nx provides a visual dependency graph that shows how applications and libraries relate
to each other:

    pnpm exec nx graph

This is useful for understanding shared dependencies and maintaining clean boundaries
as the monorepo grows.

---

## CI/CD & Deployment

This repository uses **GitHub Actions** for continuous integration and **Cloudflare Pages**
for automated deployments. The CI/CD pipeline is designed to provide fast feedback during
development while maintaining strong guarantees for beta and production releases.

---

### Continuous Integration (CI)

The CI workflow runs automatically on:

- All **pull requests**
- Pushes to the `main` and `beta` branches

CI is responsible for validating code quality and correctness before changes are merged
or deployed.

#### CI Checks

The following checks are run for the portfolio application:

Fast checks (always run):

- Linting (`nx lint`)
- Unit tests (`nx test`)
- Production build (`nx build --configuration=production`)

Heavier checks (run on push events):

- Playwright installation (Chromium only)
- End-to-end tests (`nx e2e`)

CI uses:

- Node.js 20
- pnpm 9.x
- Workspace-local Nx

Concurrency is enabled to cancel in-progress runs when newer commits are pushed to the
same branch.

---

### Deployment (Cloudflare Pages)

Deployments are fully automated using **Cloudflare Pages** and the Wrangler CLI. Every
push results in a deployment to the appropriate environment based on the branch name.

Deployments are configured using an Nx-aware matrix strategy, making it easy to scale
to additional applications in the future.

#### Deployment Environments

- **Production**

  - Triggered by pushes to `main`
  - Deployed without a branch flag
  - Represents the live, public-facing environment

- **Beta**

  - Triggered by pushes to `beta`
  - Deployed using a `beta` branch on Cloudflare Pages
  - Used for pre-production validation

- **Preview**
  - Triggered by pushes to any other branch
  - Deployed using the branch name
  - Used for feature development, experiments, and validation

Each preview deployment is fully isolated, allowing multiple branches to be tested in
parallel without interfering with one another.

---

### Nx-Aware Deployment Configuration

Deployments are defined using a matrix configuration that maps:

- Nx application name
- Cloudflare Pages project
- Build output directory

This allows additional applications to be deployed by adding new entries to the
deployment matrix without duplicating workflow logic.

---

### Secrets & Credentials

Sensitive credentials are stored securely using GitHub Actions secrets and are never
committed to the repository.

Required secrets include:

- Cloudflare API token
- Cloudflare account ID

These secrets are injected only at deploy time and are scoped to the deployment workflow.

---

### Design Goals

The CI/CD pipeline is designed to:

- Enforce quality gates before deployment
- Provide fast feedback through preview environments
- Maintain parity between local, CI, and production builds
- Scale cleanly as additional applications are added to the monorepo

---

## Adding a New App

This repository is structured to make adding new applications straightforward and
scalable using Nx. Applications live under the `apps/` directory, while shared code
and utilities live under `libs/`.

---

### Recommended: Use Nx Console

The **Nx Console** extension (available for VS Code and JetBrains IDEs) is the
recommended way to generate new applications and libraries.

Nx Console provides:

- A guided UI for generators
- Automatic validation of options
- Visibility into required and optional flags
- Fewer mistakes compared to manual CLI usage

When using Nx Console, **pay close attention to the `directory` field**.
You must explicitly include either `apps/` or `libs/` so the project is created in
the correct location.

Example directory values:

- `apps/my-new-app`
- `libs/shared-ui`

---

### Using the CLI (Alternative)

If you prefer using the command line, be explicit with both the project name and
directory to avoid incorrect placement.

Example: Generate a new Angular application

    pnpm exec nx generate @nx/angular:application \
      --name=my-new-app \
      --directory=apps/my-new-app

Example: Generate a new Node application

    pnpm exec nx generate @nx/node:application \
      --name=my-api \
      --directory=apps/my-api

Example: Generate a new React application

    pnpm exec nx generate @nx/react:application \
      --name=my-react-app \
      --directory=apps/my-react-app

Using both `--name` and `--directory` ensures consistent project naming and keeps the
workspace aligned with the standard Nx layout.

---

### When to Create an App vs a Library

As the workspace grows, it is important to choose correctly between creating a new
application or a shared library.

Create a **new app** when:

- The project has its own entry point or URL
- It is independently runnable or deployable
- It represents a distinct product, demo, or backend service
- It may be deployed separately via Cloudflare Pages or another platform

Create a **library** when:

- The code is intended to be reused across multiple applications
- It contains shared UI components, styles, or design systems
- It encapsulates domain logic, utilities, or state management
- It should not be deployed or run on its own

This distinction helps keep the monorepo organized, reduces duplication, and enforces
clear architectural boundaries as the codebase scales.

### Shared Code and Libraries

Reusable code should be placed in the `libs/` directory and consumed by applications
as needed.

When generating libraries, follow the same pattern and explicitly set the directory:

    pnpm exec nx generate @nx/angular:library \
      --name=shared-ui \
      --directory=libs/shared-ui

This approach promotes reuse, enforces clean boundaries, and supports long-term
scalability as the monorepo grows.

---

### Enabling Deployment for a New App

To deploy a new application, add an entry to the deployment matrix in the Cloudflare
Pages workflow:

    - nxApp: <app-name>
      cfProject: <cloudflare-pages-project>
      distDir: dist/apps/<app-name>/browser

Once added, the application will automatically participate in preview, beta, and
production deployments.

---

## Testing

Testing is integrated into the development workflow to ensure reliability and maintain
confidence as the codebase scales.

---

### Unit Testing

Unit tests are written using **Jest** and run through Nx.

Run unit tests for a specific application:

    pnpm exec nx test portfolio

Run unit tests for all affected projects:

    pnpm exec nx affected:test

---

### End-to-End Testing

End-to-end (E2E) tests are run using **Playwright** and are designed to validate real
user flows in a browser environment.

Run E2E tests locally:

    pnpm exec nx e2e portfolio-e2e

E2E tests are automatically executed as part of the CI pipeline on push events to
ensure production and beta builds remain stable.

---

### Testing Philosophy

The testing strategy focuses on:

- Fast unit tests for logic and components
- E2E tests for critical user flows
- CI enforcement to prevent regressions
- Keeping test suites maintainable as the monorepo grows
