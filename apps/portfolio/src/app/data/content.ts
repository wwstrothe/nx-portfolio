import { Project, PROJECTS } from './projects';

export interface SiteContent {
  title: string;
  header: string;
  subHeader: string;
  aboutMe: string;
  profilePicture: string;
  links: Array<{ name: string; link: string }>;
  projects: Array<Project>;
  contactEmail: string;
  socialLinks: {
    linkedin: string;
    github: string;
  };
}

export const SITE_CONTENT: SiteContent = {
  title: 'William Strothe',
  header: 'Welcome to My Portfolio',
  subHeader:
    'Software Engineer (TypeScript) | Frontend Architecture + Full-Stack Project Experience (Nx/Angular/React/Node)',
  aboutMe: ` Senior-leaning TypeScript engineer with strong ownership of production web platforms, specializing in scalable front-end architecture, state management, and reliability. At Rocket Mortgage Capital Markets, I lead modernization efforts (Angular upgrades, Signals adoption, zoneless change detection), improve developer workflows through shared patterns and documentation, and mentor engineers through code reviews and architecture guidance. I also bring hands-on full-stack project experience (React, Node/Express, REST APIs, Nx monorepos, SQL/NoSQL) and am continuing to deepen backend/DevOps foundations through the MIT xPro Full Stack program (GraphQL, Docker, AWS CI/CD, security, automated testing).`,
  profilePicture: '/images/profile-picture.jpg',
  projects: PROJECTS,
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
