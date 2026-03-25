import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home'),
  },
  {
    path: 'snake',
    loadComponent: () => import('./games/snake/snake'),
  },
  {
    path: 'leaderboard/snake',
    loadComponent: () => import('./games/snake/snake-leaderboard/snake-leaderboard'),
  },
  {
    path: 'game2048',
    loadComponent: () => import('./games/game2048/game2048'),
  },
  {
    path: 'leaderboard/game2048',
    loadComponent: () => import('./games/game2048/game2048-leaderboard/game2048-leaderboard'),
  },
  { path: '**', redirectTo: '' },
];
