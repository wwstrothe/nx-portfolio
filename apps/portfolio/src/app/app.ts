import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer, Header, SideNav } from '@portfolio/shared/angular/layouts';

@Component({
  selector: 'portfolio-root',
  imports: [RouterOutlet, SideNav, Footer, Header],
  template: `
    <lib-portfolio-header [title]="title" [links]="links" (menuOpen)="onMenuOpen()" />
    <main>
      <router-outlet />
    </main>
    @if (isNavOpen) {
      <lib-portfolio-side-nav [links]="links" [open]="isNavOpen" (closeSidenav)="closeNav()" />
      <div
        class="overlay"
        role="button"
        tabindex="0"
        aria-label="Close navigation"
        (click)="closeNav()"
        (keydown.enter)="closeNav()"
        (keydown.space)="closeNav()"
      ></div>
    }
    <lib-portfolio-footer
      [title]="title"
      emailHref="mailto:your-email@example.com"
      linkedinHref="https://linkedin.com/in/your-linkedin"
      githubHref="https://github.com/your-github"
    />
  `,
  styles: [
    `
      @use 'variables' as tokens;
      @use 'mixins' as *;

      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      main {
        flex: 1;
        width: 100%;
        padding: tokens.space(16) tokens.space(16);

        @media (min-width: 768px) {
          padding: tokens.space(24) tokens.space(24);
        }
      }

      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: tokens.$z-modal-backdrop;
      }
    `,
  ],
})
export class App {
  title = 'William Strothe';
  links: Array<{ name: string; link: string }> = [
    { name: 'Projects', link: '/projects' },
    { name: 'Resume', link: '/resume' },
  ];
  isNavOpen = false;

  onMenuOpen() {
    this.isNavOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeNav() {
    this.isNavOpen = false;
    document.body.style.overflow = '';
  }
}
