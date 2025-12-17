import { Component } from '@angular/core';

@Component({
  selector: 'portfolio-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <div class="inner">
        <span>© {{ year }} William Strothe</span>

        <div class="links">
          <a href="mailto:you@example.com">Email</a>
          <a href="https://linkedin.com/in/your-handle" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/your-handle" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer { border-top: 1px solid rgba(255,255,255,0.08); padding: 18px 0; }
      .inner {
        max-width: 1100px; margin: 0 auto; padding: 0 24px;
        display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap;
      }
      .links { display: flex; gap: 14px; }
      a { text-decoration: none; }
    `,
  ],
})
export class Footer {
  year = new Date().getFullYear();
}
