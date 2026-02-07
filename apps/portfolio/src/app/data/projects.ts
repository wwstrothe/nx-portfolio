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
    status: 'active',
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
  {
    id: 'project5',
    slug: 'pwa-budget-tracker',
    title: 'PWA Budget Tracker',
    status: 'archived',
    shortDescription:
      'Converted a database-enabled budget tracker into a functional Progressive Web Application (PWA) with offline access.',
    description: `This project takes provided starter code for a database enabled budget tracker and converts it into a functional Progressive Web Application (PWA) with offline access and functionality. The browser Cache API is used to store the application's HTML, CSS, and JavaScript, controlled by a service worker. Offline transactions are stored using Indexed DB and are automatically uploaded when a connection is restored. A manifest file is also provided to allow the application to be downloaded to a browser, tablet, or phone.`,
    repoLink: 'https://github.com/wwstrothe/pwa-budget-tracker',
    tags: ['PWA', 'Service Worker', 'Cache API', 'IndexedDB', 'Manifest'],
  },
  {
    id: 'project6',
    slug: 'nosql-social-network-api',
    title: 'NoSQL Social Network API',
    status: 'active',
    shortDescription: 'A RESTful API for a social network using Express and MongoDB.',
    description:
      "A RESTful API for a social network using Express and MongoDB. Implements user registration, authentication, and CRUD operations for thoughts and reactions. Users can create a friends list and interact with friends' thoughts through reactions. The API follows REST principles and includes endpoints for managing users, thoughts, reactions, and friendships.",
    repoLink: 'https://github.com/wwstrothe/nosql-social-network-api',
    tags: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'REST API'],
    videoUrl: 'https://drive.google.com/file/d/1o3UOxAmlBV5MDB3sMhT0XtHxu0NZ1Nnx/view',
  },
  {
    id: 'project7',
    slug: 'employee-tracker-sql-cli',
    title: 'Employee Tracker (SQL CLI)',
    status: 'active',
    shortDescription:
      'A command-line application to manage employee data using Node.js, Express, and MySQL.',
    description:
      'A command-line application to manage employee data using Node.js, Express, and MySQL. Provides interactive workflows via Inquirer prompts for viewing, creating, and updating employee records. Structured output supports admin-style operations for managing employees, roles, and departments within a relational database.',
    repoLink: 'https://github.com/wwstrothe/employee-tracker',
    tags: ['Node.js', 'Express', 'MySQL', 'Inquirer', 'dotenv'],
    videoUrl: 'https://drive.google.com/file/d/1LcHUaJPSaW5e5xOK6ASeEqGqL-5pezQI/view',
  },
  {
    id: 'project8',
    slug: 'react18-portfolio',
    title: 'Personal Portfolio (React 18)',
    status: 'archived',
    shortDescription:
      'A personal portfolio showcasing some of my projects, built with React 18, hosted on GitHub Pages.',
    description:
      'A personal portfolio showcasing some of my projects, built with React 18, hosted on GitHub Pages. The site features a clean and modern design with sections for project highlights, a brief bio, and contact information. Each project includes a description, technologies used, and links to the source code and live demos where applicable.',
    repoLink: 'https://github.com/wwstrothe/react-portfolio',
    tags: ['React', 'JavaScript', 'GitHub Pages'],
  },
];
