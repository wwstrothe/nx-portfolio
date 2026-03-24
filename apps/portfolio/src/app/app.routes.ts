import { Route } from '@angular/router';
import { PORTFOLIO_ROUTE_PATHS } from '@portfolio/shared/config';

export const appRoutes: Route[] = [
  {
    path: PORTFOLIO_ROUTE_PATHS.home,
    loadComponent: () => import('./pages/home/home'),
  },
  {
    path: PORTFOLIO_ROUTE_PATHS.projects,
    loadComponent: () => import('./pages/projects/projects'),
  },
  {
    path: PORTFOLIO_ROUTE_PATHS.projectDetail,
    loadComponent: () => import('./pages/project/project'),
  },
  {
    path: PORTFOLIO_ROUTE_PATHS.resume,
    loadComponent: () => import('./pages/resume/resume'),
  },
  { path: PORTFOLIO_ROUTE_PATHS.wildcard, redirectTo: PORTFOLIO_ROUTE_PATHS.home },
];
