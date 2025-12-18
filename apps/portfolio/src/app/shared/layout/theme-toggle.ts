import { Component, OnInit, output } from '@angular/core';

@Component({
  selector: 'portfolio-theme-toggle',
  standalone: true,
  template: `
    <button
      class="theme-toggle"
      (click)="toggleTheme()"
      [attr.aria-label]="
        isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
      "
      title="{{ isDarkMode ? 'Light mode' : 'Dark mode' }}"
    >
      <span class="icon">
        {{ isDarkMode ? '☀️' : '🌙' }}
      </span>
    </button>
  `,
  styles: [
    `
      @use 'variables' as tokens;
      @use 'mixins' as *;

      .theme-toggle {
        @include flex-center;
        width: 2.5rem;
        height: 2.5rem;
        padding: 0;
        background: none;
        border: 1px solid var(--color-border);
        border-radius: tokens.$border-radius-md;
        cursor: pointer;
        transition: all tokens.$transition-base;
        color: var(--color-text);

        &:hover {
          background-color: var(--color-bg-secondary);
          border-color: var(--color-border-secondary);
        }

        &:active {
          transform: scale(0.95);
        }

        &:focus-visible {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px rgba(tokens.$color-primary, 0.2),
            0 0 0 5px tokens.$color-primary;
        }
      }

      .icon {
        font-size: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `,
  ],
})
export class ThemeToggle implements OnInit {
  isDarkMode = false;
  private readonly THEME_KEY = 'theme';
  themeChange = output<'dark' | 'light'>();

  ngOnInit() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);

    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
    } else {
      // Check system preference
      this.isDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
    }

    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
    localStorage.setItem(this.THEME_KEY, this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    const html = document.documentElement;
    if (this.isDarkMode) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
    this.themeChange.emit(this.isDarkMode ? 'dark' : 'light');
  }
}
