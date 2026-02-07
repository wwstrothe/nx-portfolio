import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-portfolio-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="inner">
        <span class="copyright">© {{ year }} {{ title() }}</span>

        <div class="links">
          <a [href]="emailHref()">Email</a>
          <a [href]="linkedinHref()" target="_blank" rel="noreferrer"
            >LinkedIn</a
          >
          <a [href]="githubHref()" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      @use 'variables' as tokens;
      @use 'mixins' as *;

      .footer {
        background-color: var(--color-footer-bg);
        color: var(--color-footer-text);
        border-top: 1px solid var(--color-header-border);
        margin-top: auto;
      }

      .inner {
        @include flex-between;
        flex-wrap: wrap;
        gap: tokens.space(16);
        padding: tokens.space(16) tokens.space(24);
        max-width: 1280px;
        margin: 0 auto;

        @include media-md {
          padding: tokens.space(24) tokens.space(32);
        }
      }

      .copyright {
        font-size: tokens.$font-size-xs;
        color: var(--color-footer-text-secondary);
      }

      .links {
        @include flex-between;
        gap: tokens.space(16);

        a {
          color: var(--color-footer-text-secondary);
          font-size: tokens.$font-size-sm;
          font-weight: tokens.$font-weight-medium;
          @include transition(color, base);

          &:hover {
            color: var(--color-primary);
          }

          &:focus-visible {
            outline: 2px solid transparent;
            outline-offset: 2px;
            box-shadow:
              0 0 0 3px rgba(tokens.$color-primary, 0.2),
              0 0 0 5px tokens.$color-primary;
            border-radius: tokens.$border-radius-sm;
          }
        }
      }
    `,
  ],
})
export class Footer {
  emailHref = input<string>('mailto:you@example.com');
  linkedinHref = input<string>('https://linkedin.com/in/your-handle');
  githubHref = input<string>('https://github.com/your-handle');

  year = new Date().getFullYear();
}
