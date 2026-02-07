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
          <a [href]="linkedinHref()" target="_blank" rel="noreferrer">LinkedIn</a>
          <a [href]="githubHref()" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background-color: var(--color-footer-bg);
        color: var(--color-footer-text);
        border-top: 1px solid var(--color-header-border);
        margin-top: auto;
      }

      .inner {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 1rem 1.5rem;
        max-width: 1280px;
        margin: 0 auto;
      }

      @media (min-width: 768px) {
        .inner {
          padding: 1.5rem 2rem;
        }
      }

      .copyright {
        font-size: 0.75rem;
        color: var(--color-footer-text-secondary);
      }

      .links {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
      }

      .links a {
        color: var(--color-footer-text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        transition: color 0.2s;
      }

      .links a:hover {
        color: var(--color-primary);
      }

      .links a:focus-visible {
        outline: 2px solid transparent;
        outline-offset: 2px;
        box-shadow:
          0 0 0 3px rgba(var(--color-primary-rgb), 0.2),
          0 0 0 5px var(--color-primary);
        border-radius: 0.375rem;
      }
    `,
  ],
})
export class Footer {
  title = input<string>('');
  emailHref = input<string>('mailto:you@example.com');
  linkedinHref = input<string>('https://linkedin.com/in/your-handle');
  githubHref = input<string>('https://github.com/your-handle');

  year = new Date().getFullYear();
}
