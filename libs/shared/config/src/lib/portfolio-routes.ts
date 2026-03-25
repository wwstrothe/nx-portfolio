export type PortfolioRouteMeta = {
  name: string;
  path: string;
  fullPath: string;
};

export const PORTFOLIO_ROUTE_PATHS = {
  home: '',
  projects: 'projects',
  projectDetail: 'project/:slug',
  resume: 'resume',
  contact: 'contact',
  wildcard: '**',
} as const;

export const PORTFOLIO_ROUTE_FULL_PATHS = {
  home: '/',
  projects: '/projects',
  projectDetail: '/project/:slug',
  resume: '/resume',
  contact: '/contact',
} as const;

export const PORTFOLIO_NAV_ROUTES: PortfolioRouteMeta[] = [
  {
    name: 'Projects',
    path: PORTFOLIO_ROUTE_PATHS.projects,
    fullPath: PORTFOLIO_ROUTE_FULL_PATHS.projects,
  },
  {
    name: 'Resume',
    path: PORTFOLIO_ROUTE_PATHS.resume,
    fullPath: PORTFOLIO_ROUTE_FULL_PATHS.resume,
  },
  {
    name: 'Contact',
    path: PORTFOLIO_ROUTE_PATHS.contact,
    fullPath: PORTFOLIO_ROUTE_FULL_PATHS.contact,
  },
];
