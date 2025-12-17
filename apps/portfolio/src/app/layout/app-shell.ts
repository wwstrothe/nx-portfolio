import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer';
import { Header } from './header';

@Component({
  selector: 'portfolio-app-shell',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <div class="shell">
      <portfolio-header />
      <main class="main">
        <router-outlet />
      </main>
      <portfolio-footer />
    </div>
  `,
  styles: [
    `
      .shell {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      .main {
        flex: 1;
        max-width: 1100px;
        width: 100%;
        margin: 0 auto;
      }
    `,
  ],
})
export default class AppShell {}
