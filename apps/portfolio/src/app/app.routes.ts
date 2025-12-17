import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./layout/app-shell'),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home'),
      },
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects'),
      },
      {
        path: 'resume',
        loadComponent: () => import('./pages/resume'),
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
