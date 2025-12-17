import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'portfolio-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="inner">
        <a class="brand" routerLink="/">William Strothe</a>

        <nav class="nav">
          <a routerLink="/projects" routerLinkActive="active">Projects</a>
          <a routerLink="/resume" routerLinkActive="active">Resume</a>
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        position: sticky; top: 0; z-index: 10;
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(255,255,255,0.08);
      }
      .inner {
        max-width: 1100px; margin: 0 auto; padding: 14px 24px;
        display: flex; align-items: center; justify-content: space-between;
      }
      .brand { font-weight: 700; text-decoration: none; }
      .nav { display: flex; gap: 16px; }
      .nav a { text-decoration: none; opacity: 0.9; }
      .nav a.active { opacity: 1; text-decoration: underline; }
    `,
  ],
})
export class Header {}
