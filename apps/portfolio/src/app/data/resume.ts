import { Resume } from './database';

export const RESUME: Resume = {
  name: 'William Strothe',
  subHeader:
    'Software Engineer (TypeScript) | Frontend Architecture + Full-Stack Project Experience (Nx/Angular/React/Node)',
  location: 'Glendale, AZ',
  cellPhone: '(208) 651-7152',
  email: 'william.strothe@gmail.com',
  professionalSummary: `Senior-leaning TypeScript engineer with strong ownership of production web platforms, specializing in scalable front-end architecture, state management, and reliability. At Rocket Mortgage Capital Markets, I lead modernization efforts (Angular upgrades, Signals adoption, zoneless change detection), improve developer workflows through shared patterns and documentation, and mentor engineers through code reviews and architecture guidance. I also bring hands-on full-stack project experience (React, Node/Express, REST APIs, Nx monorepos, SQL/NoSQL) and am continuing to deepen backend/DevOps foundations through the MIT xPro Full Stack program (GraphQL, Docker, AWS CI/CD, security, automated testing) `,
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
        'Own end-to-end delivery for internal platforms used by Origination and Servicing teams: requirements → implementation → rollout → support and iteration.',
        'Lead modernization initiatives from Angular v16 → v19, including Signals adoption and performance-focused architecture patterns (zoneless change detection).',
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
        'Configured automated CI with quality gates and branch-based deployments (main → production, beta → pre-production, feature branches → preview).',
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
        'Built a REST API for a social network where users can share thoughts, react to others’ thoughts, and manage a friends list.',
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
