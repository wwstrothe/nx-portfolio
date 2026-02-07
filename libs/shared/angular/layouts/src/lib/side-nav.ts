import { AfterViewInit, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'lib-portfolio-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeToggle],
  template: `
    <aside
      class="sidenav"
      [class.open]="open()"
      tabindex="-1"
      (keydown.escape)="onEsc()"
      #panel
      role="dialog"
      aria-label="Navigation"
      aria-modal="true"
    >
      <div class="inner">
        <div class="content">
          <button
            class="close-btn"
            type="button"
            aria-label="Close navigation"
            (click)="closeSidenav.emit()"
          >
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>

          <nav class="links">
            @for (link of links(); track $index) {
              <a [routerLink]="link.link" routerLinkActive="active" (click)="closeSidenav.emit()">
                {{ link.name }}
              </a>
            }
          </nav>
        </div>

        @if (themeToggle()) {
          <div class="theme-row">
            <span class="theme-label">Theme</span>
            <lib-portfolio-theme-toggle />
          </div>
        }
      </div>
    </aside>
  `,
  styles: [
    `
      .sidenav {
        position: fixed;
        top: 0;
        right: 0;
        left: auto;
        height: 100vh;
        width: 280px;
        background: var(--color-bg);
        border-left: 1px solid var(--color-border);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        transform: translateX(100%);
        transition: transform 0.15s;
        z-index: 100;
        display: flex;
        flex-direction: column;
      }

      .sidenav.open {
        transform: translateX(0);
      }

      .inner {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 1.5rem;
        height: 100%;
      }

      @media (min-width: 768px) {
        .inner {
          padding: 1.5rem 2rem;
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .close-btn {
        align-self: flex-end;
        width: 2.5rem;
        height: 2.5rem;
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        background: var(--color-bg);
        color: var(--color-text);
        font-size: 1.25rem;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .close-btn:hover {
        background-color: var(--color-bg-secondary);
      }

      .links {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .links a {
        color: var(--color-text);
        font-size: 1rem;
        transition: color 0.2s;
      }

      .links a:hover {
        color: var(--color-primary);
      }

      .links a.active {
        color: var(--color-primary);
      }

      .theme-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--color-border-secondary);
        margin-top: auto;
      }

      .theme-label {
        color: var(--color-text-secondary);
        font-size: 0.875rem;
      }
    `,
  ],
})
export class SideNav implements AfterViewInit {
  open = input<boolean>(false);
  links = input<Array<{ name: string; link: string }>>();
  themeToggle = input(true);
  closeSidenav = output<void>();

  panelRef = viewChild<ElementRef<HTMLElement>>('panel');

  onEsc() {
    this.closeSidenav.emit();
  }

  ngAfterViewInit() {
    if (this.open() && this.panelRef()?.nativeElement) {
      // Move focus to panel when opened for accessibility
      this.panelRef()?.nativeElement.focus();
    }
  }
}
