import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer, Header, SideNav } from '@portfolio/shared/angular/layouts';

@Component({
  selector: 'portfolio-root',
  imports: [RouterOutlet, SideNav, Footer, Header],
  template: `
    <lib-portfolio-header (menuOpen)="onMenuOpen()" />
    <main>
      <router-outlet />
    </main>
    @if (isNavOpen) {
    <lib-portfolio-side-nav [open]="isNavOpen" (closeSidenav)="closeNav()" />
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
    <lib-portfolio-footer />
  `,
  styles: [
    `
      @use '../../../../libs/shared/design-tokens/src/lib/variables' as tokens;
      @use '../../../../libs/shared/design-tokens/src/lib/mixins' as *;

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
