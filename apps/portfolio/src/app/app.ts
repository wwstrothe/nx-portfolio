import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer, Header, SideNav } from '@portfolio/shared/angular/layouts';
import { SITE_CONTENT } from './data/content';

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
      [emailHref]="siteContent.contactEmail"
      [linkedinHref]="siteContent.socialLinks.linkedin"
      [githubHref]="siteContent.socialLinks.github"
    />
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
        width: 100%;
        padding: 1rem 1rem;

        @media (min-width: 768px) {
          padding: 1.5rem 1.5rem;
        }
      }

      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 1040;
      }
    `,
  ],
})
export class App {
  isNavOpen = false;
  siteContent = SITE_CONTENT;
  title = this.siteContent.title;
  links = this.siteContent.links;

  onMenuOpen() {
    this.isNavOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeNav() {
    this.isNavOpen = false;
    document.body.style.overflow = '';
  }
}
