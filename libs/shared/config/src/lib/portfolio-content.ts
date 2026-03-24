export interface SiteContent extends Record<string, unknown> {
  title: string;
  header: string;
  subHeader: string;
  aboutMe: string;
  profilePicture: string;
  links: Array<{ name: string; link: string }>;
  contactEmail: string;
  socialLinks: {
    linkedin: string;
    github: string;
  };
}

export interface Project extends Record<string, unknown> {
  id: string;
  slug: string;
  status: 'active' | 'archived' | 'wip';
  title: string;
  shortDescription: string;
  description: string;
  repoLink: string;
  liveLink?: string;
  tags: string[];
  thumbnailUrl?: string;
  galleryUrls?: string[];
  videoUrl?: string;
}

export interface Resume extends Record<string, unknown> {
  name: string;
  subHeader: string;
  location: string;
  cellPhone: string;
  email: string;
  professionalSummary: string;
  technicalSkills: Array<{
    category: string;
    skills: string[];
  }>;
  professionalExperience: Array<{
    role: string;
    department: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | 'Present';
    bulletPoints: string[];
  }>;
  projects: Array<{
    title: string;
    technologies: string[];
    bulletPoints: string[];
  }>;
  education: Array<{
    institution: string;
    fieldOfStudy: string;
    completionDate: string;
  }>;
}

export type PortfolioData = {
  siteContent: SiteContent;
  projects: Array<Project>;
  resume: Resume;
};

export const PORTFOLIO_PROJECT_KEY = 'personal-project';
export const PORTFOLIO_COLLECTION_PATH = 'portfolio';
export const SITE_CONTENT_DOC_ID = 'site-content';
export const PROJECTS_DOC_ID = 'projects';
export const RESUME_DOC_ID = 'resume';

export const SITE_CONTENT: SiteContent = {
  title: 'William Strothe',
  header: 'Welcome to My Portfolio',
  subHeader: 'Senior Software Engineer (Angular) | Full Stack Experience (MERN)',
  aboutMe:
    'Senior TypeScript engineer with strong ownership of production web platforms, specializing in scalable front-end architecture, state management, and reliability. At Rocket Mortgage Capital Markets, I lead modernization efforts (Angular upgrades, Signals adoption, zoneless change detection), improve developer workflows through shared patterns and documentation, and mentor engineers through code reviews and architecture guidance. I also bring hands-on full-stack project experience (React, Node/Express, REST APIs, Nx monorepos, SQL/NoSQL) and am continuing to deepen backend/DevOps foundations through the MIT xPro Full Stack program (GraphQL, Docker, AWS CI/CD, security, automated testing).',
  profilePicture: '/images/profile-picture.jpg',
  links: [
    { name: 'Projects', link: '/projects' },
    { name: 'Resume', link: '/resume' },
  ],
  contactEmail: 'william.strothe@gmail.com',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/william-strothe',
    github: 'https://github.com/wwstrothe',
  },
};

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
    description:
      "This project takes provided starter code for a database enabled budget tracker and converts it into a functional Progressive Web Application (PWA) with offline access and functionality. The browser Cache API is used to store the application's HTML, CSS, and JavaScript, controlled by a service worker. Offline transactions are stored using Indexed DB and are automatically uploaded when a connection is restored. A manifest file is also provided to allow the application to be downloaded to a browser, tablet, or phone.",
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

export const RESUME: Resume = {
  name: 'William Strothe',
  subHeader:
    'Software Engineer (TypeScript) | Frontend Architecture + Full-Stack Project Experience (Nx/Angular/React/Node)',
  location: 'Glendale, AZ',
  cellPhone: '(208) 651-7152',
  email: 'william.strothe@gmail.com',
  professionalSummary:
    'Senior-leaning TypeScript engineer with strong ownership of production web platforms, specializing in scalable front-end architecture, state management, and reliability. At Rocket Mortgage Capital Markets, I lead modernization efforts (Angular upgrades, Signals adoption, zoneless change detection), improve developer workflows through shared patterns and documentation, and mentor engineers through code reviews and architecture guidance. I also bring hands-on full-stack project experience (React, Node/Express, REST APIs, Nx monorepos, SQL/NoSQL) and am continuing to deepen backend/DevOps foundations through the MIT xPro Full Stack program (GraphQL, Docker, AWS CI/CD, security, automated testing) ',
  technicalSkills: [
    {
      category: 'Languages',
      skills: ['TypeScript', 'JavaScript'],
    },
    {
      category: 'Frontend',
      skills: ['Angular', 'RxJS', 'NgRx', 'HTML/CSS/SCSS', 'React'],
    },
    {
      category: 'Backend & APIs',
      skills: [
        'RESTful API design',
        'Node.js/Express',
        'Firebase Authentication',
        'Firestore',
        'MongoDB/Mongoose',
      ],
    },
    {
      category: 'Databases',
      skills: ['Firestore', 'SQL', 'NoSQL', 'MongoDB'],
    },
    {
      category: 'Architecture & Tooling',
      skills: ['Nx monorepos', 'pnpm', 'Git', 'GitHub', 'CI/CD fundamentals', 'Cloudflare Pages'],
    },
    {
      category: 'Testing',
      skills: ['Jest', 'React Testing Library', 'Playwright'],
    },
  ],
  professionalExperience: [
    {
      role: 'Information Developer',
      department: 'Capital Markets (Engineering)',
      company: 'Rocket Mortgage',
      location: 'Phoenix, AZ',
      startDate: 'Dec 2022',
      endDate: 'Present',
      bulletPoints: [
        'Own end-to-end delivery for internal platforms used by Origination and Servicing teams: requirements -> implementation -> rollout -> support and iteration.',
        'Lead modernization initiatives from Angular v16 -> v19, including Signals adoption and performance-focused architecture patterns (zoneless change detection).',
        'Built a Cloud Run audit service to track Firestore data changes and improve transparency/compliance reporting.',
        'Drive leverage through reusable UI/state patterns, shared abstractions, and developer documentation/templates that improve consistency and onboarding.',
        'Mentor engineers through code reviews, pairing, and architecture guidance; communicate technical tradeoffs clearly to technical and non-technical partners.',
      ],
    },
    {
      role: 'Senior SOS Product Specialist',
      department: 'Capital Markets',
      company: 'Rocket Mortgage',
      location: 'Phoenix, AZ',
      startDate: 'Jan 2021',
      endDate: 'Dec 2022',
      bulletPoints: [
        'Resolved high-severity production issues through investigation and root-cause analysis; coordinated fixes across teams and communicated outcomes to stakeholders.',
        'Created internal guidance and repeatable processes that improved operational consistency and reduced repeat support inquiries.',
      ],
    },
  ],
  projects: [
    {
      title: 'Nx Portfolio Monorepo',
      technologies: [
        'Nx',
        'Typescript',
        'Angular(primary)',
        'React',
        'Node.js',
        'Firebase',
        'Jest',
        'Playwright',
        'Github Actions',
        'Cloudflare Pages',
      ],
      bulletPoints: [
        'Built an Nx monorepo with multiple applications and shared libraries to mirror enterprise patterns (apps/libs separation, reusable libraries).',
        'Implemented shared design tokens intended to be reusable across frameworks within the workspace.',
        'Configured automated CI with quality gates and branch-based deployments (main -> production, beta -> pre-production, feature branches -> preview).',
        'Designed an SSO-style auth flow for independently deployed apps using Firebase Authentication and short-lived token handoff.',
      ],
    },
    {
      title: 'React Photo Portfolio Website',
      technologies: ['React17', 'Javascript', 'Jest', 'React Testing', 'Github Pages'],
      bulletPoints: [
        'Developed a responsive single-page photo portfolio with dynamic category filtering (Commercial, Portraits, Food, Landscape) and modal image viewer.',
        'Implemented a contact form with real-time client-side validation (including regex email validation) and conditional rendering between gallery and contact views.',
        'Built a component-based UI with reusable components and state management via React Hooks (useState) for navigation, modal behavior, and validation.',
        'Added unit tests with Jest + React Testing Library (including snapshot tests) and configured deployment to GitHub Pages.',
      ],
    },
    {
      title: 'Employee Tracker (SQL CLI)',
      technologies: ['Node.js', 'Express', 'MySQL', 'Inquirer', 'dotenv'],
      bulletPoints: [
        'Built a command-line application to view, create, and update employee data using a relational database.',
        'Implemented interactive workflows via Inquirer prompts and structured output to support admin-style operations.',
      ],
    },
    {
      title: 'NoSQL Social Network API',
      technologies: ['Node.js', 'Express', 'MongoDB/Mongoose'],
      bulletPoints: [
        "Built a REST API for a social network where users can share thoughts, react to others' thoughts, and manage a friends list.",
        'Structured code into controllers/models/routes to keep endpoints maintainable and easy to extend.',
      ],
    },
  ],
  education: [
    {
      institution: 'MIT xPro',
      fieldOfStudy: 'Full Stack Development with MERN',
      completionDate: 'In Progress, August 18th completion',
    },
    {
      institution: 'Chegg Skills',
      fieldOfStudy: 'Applying AI in Web Design Certificate',
      completionDate: 'November 2024',
    },
    {
      institution: 'Michigan State University',
      fieldOfStudy: 'Full-Stack Web Development Bootcamp (React/MERN foundations; project-based)',
      completionDate: 'July 2022',
    },
    {
      institution: 'SAFE',
      fieldOfStudy: 'Mortgage Origination Certificate',
      completionDate: 'November 2020',
    },
  ],
};
