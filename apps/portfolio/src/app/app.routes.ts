import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home'),
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects'),
  },
  {
    path: 'project/:slug',
    loadComponent: () => import('./pages/project/project'),
  },
  {
    path: 'resume',
    loadComponent: () => import('./pages/resume/resume'),
  },
  { path: '**', redirectTo: '' },
];
