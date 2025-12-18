import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'lib-portfolio-header',
  imports: [RouterLink, RouterLinkActive, ThemeToggle],
  template: `
    <header class="header">
      <div class="inner">
        <a class="brand" routerLink="/">William Strothe</a>
        <button
          class="menu-btn"
          aria-label="Open navigation"
          (click)="menuOpen.emit()"
        >
          <span class="material-symbols-outlined" aria-hidden="true">menu</span>
        </button>

        <nav class="nav">
          <a routerLink="/projects" routerLinkActive="active">Projects</a>
          <a routerLink="/resume" routerLinkActive="active">Resume</a>
          <lib-portfolio-theme-toggle />
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      @use 'variables' as tokens;
      @use 'mixins' as *;

      .header {
        background-color: var(--color-header-bg);
        border-bottom: 1px solid var(--color-header-border);
        position: sticky;
        top: 0;
        z-index: tokens.$z-sticky;
        @include elevation(sm);
      }

      .inner {
        @include flex-between;
        padding: tokens.space(16) tokens.space(24);
        max-width: 1280px;
        margin: 0 auto;

        @include media-md {
          padding: tokens.space(24) tokens.space(32);
        }
      }

      .menu-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border: 1px solid var(--color-border);
        border-radius: tokens.$border-radius-md;
        background: var(--color-bg);
        color: var(--color-text);
        cursor: pointer;
        @include transition(background-color, base);

        &:hover {
          background-color: var(--color-bg-secondary);
        }

        // Hide the menu button on medium and up (desktop)
        @include media-md {
          display: none;
        }
      }

      /* Icon sizing is standardized globally via .material-symbols-outlined */

      .brand {
        font-size: tokens.$font-size-xl;
        font-weight: tokens.$font-weight-bold;
        color: var(--color-text);
        @include transition(color, base);

        &:hover {
          color: var(--color-primary);
        }
      }

      .nav {
        @include flex-between;
        gap: tokens.space(32);

        // Hide nav links on small screens; show from md and up
        display: none;
        @include media-md {
          display: flex;
        }

        a {
          color: var(--color-text-secondary);
          font-weight: tokens.$font-weight-medium;
          font-size: tokens.$font-size-md;
          @include transition(color, base);
          position: relative;

          &:hover {
            color: var(--color-primary);
          }

          &.active {
            color: var(--color-primary);

            &::after {
              content: '';
              position: absolute;
              bottom: -0.5rem;
              left: 0;
              right: 0;
              height: 2px;
              background-color: var(--color-primary);
              border-radius: tokens.$border-radius-full;
            }
          }
        }
      }
    `,
  ],
})
export class Header {
  menuOpen = output<void>();
}
