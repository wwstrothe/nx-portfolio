import { Project } from './database';

export const PROJECTS: Array<Project> = [
  {
    id: 'project1',
    slug: 'personal-portfolio-angular',
    status: 'active',
    title: 'Personal Portfolio (Angular)',
    shortDescription:
      'A full-stack personal portfolio built with Angular and TypeScript in an Nx monorepo.',
    description:
      'A full-stack personal portfolio built with Angular and TypeScript in an Nx monorepo. Features dynamic project data powered by Firestore, leveraging shared libraries for authentication, database operations, and responsive UI components. Demonstrates scalable architecture with centralized design tokens and reusable service patterns.',
    repoLink: 'https://github.com/wwstrothe/nx-portfolio/tree/main/apps/portfolio',
    liveLink: 'https://william-strothe.pages.dev/',
    tags: ['Angular', 'TypeScript', 'Nx', 'Firestore', 'Shared Libraries'],
  },
  {
    id: 'project2',
    slug: 'personal-portfolio-react',
    title: 'Personal Portfolio (React)',
    status: 'wip',
    shortDescription:
      'A full-stack personal portfolio built with React and TypeScript in an Nx monorepo.',
    description:
      'A full-stack personal portfolio built with React, TypeScript, and Vite in an Nx monorepo. Integrates Firestore for dynamic project data management with authentication, utilizing shared libraries for consistent design tokens, API patterns, and database operations. Showcases cross-framework code sharing and modern frontend architecture.',
    repoLink: 'https://github.com/wwstrothe/nx-portfolio/tree/main/apps/portfolio-react',
    liveLink: 'https://william-strothe-react.pages.dev/',
    tags: ['React', 'TypeScript', 'Nx', 'Vite', 'Firestore', 'Shared Libraries'],
  },
  {
    id: 'project3',
    slug: 'nx-monorepo',
    title: 'Nx Monorepo Example',
    status: 'active',
    shortDescription: 'An example Nx monorepo showcasing Angular and React projects.',
    description:
      'An example Nx monorepo showcasing Angular and React projects. Demonstrates shared libraries for common utilities, design tokens, and state management patterns. Provides a reference architecture for structuring scalable frontend applications with Nx.',
    repoLink: 'https://github.com/wwstrothe/nx-portfolio',
    tags: ['Nx', 'Monorepo', 'Angular', 'React', 'Node', 'Shared Libraries'],
  },
  {
    id: 'project4',
    slug: 'react17-photo-portfolio',
    title: 'Photo Portfolio (React 17)',
    status: 'archived',
    shortDescription:
      'A responsive single-page photo portfolio with dynamic filtering and modal image viewer.',
    description:
      'Developed a responsive single-page photo portfolio with dynamic category filtering (Commercial, Portraits, Food, Landscape) and modal image viewer. Implemented a contact form with real-time client-side validation including regex email validation and conditional rendering between gallery and contact views. Built a component-based UI with reusable components and state management via React Hooks (useState) for navigation, modal behavior, and validation. Added unit tests with Jest + React Testing Library (including snapshot tests) and configured deployment to GitHub Pages.',
    repoLink: 'https://github.com/wwstrothe/20-photo-port',
    liveLink: 'https://wwstrothe.github.io/20-photo-port/',
    tags: ['React', 'JavaScript', 'Jest', 'React Testing Library', 'GitHub Pages'],
  },
];
