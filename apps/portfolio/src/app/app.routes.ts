import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home'),
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects'),
  },
  {
    path: 'project/:slug',
    loadComponent: () => import('./pages/project'),
  },
  {
    path: 'resume',
    loadComponent: () => import('./pages/resume'),
  },
  { path: '**', redirectTo: '' },
];
