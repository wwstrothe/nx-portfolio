import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer, Header, SideNav } from '@portfolio/shared/angular/layouts';

const NAV_LINKS = [
  { name: 'Snake', link: '/snake' },
  { name: '2048', link: '/game2048' },
];

@Component({
  imports: [RouterOutlet, Header, Footer, SideNav],
  selector: 'games-root',
  template: `
    <lib-portfolio-header title="Games" [links]="[]" (menuOpen)="sideNavOpen.set(true)" />
    <lib-portfolio-side-nav
      [open]="sideNavOpen()"
      [links]="navLinks"
      (closeSidenav)="sideNavOpen.set(false)" />
    <main>
      <router-outlet />
    </main>
    <lib-portfolio-footer title="Games" />
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }
      main {
        flex: 1;
      }
    `,
  ],
})
export class App {
  protected readonly navLinks = NAV_LINKS;
  protected readonly sideNavOpen = signal(false);
}
