import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface GameCard {
  title: string;
  description: string;
  route: string;
  leaderboardRoute: string;
  icon: string;
}

@Component({
  selector: 'games-home',
  imports: [RouterLink],
  template: `
    <div class="home">
      <div class="home__grid">
        @for (game of games; track game.route) {
          <div class="game-card">
            <span class="game-card__icon">{{ game.icon }}</span>
            <h2 class="game-card__title">{{ game.title }}</h2>
            <p class="game-card__description">{{ game.description }}</p>
            <div class="game-card__actions">
              <a class="game-card__play-btn" [routerLink]="game.route">Play</a>
              <a class="game-card__lb-btn" [routerLink]="game.leaderboardRoute">Leaderboard</a>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './home.scss',
})
export default class Home {
  protected readonly games: GameCard[] = [
    {
      title: 'Snake',
      description: 'Classic snake game. Eat food, grow longer, avoid yourself.',
      route: '/snake',
      leaderboardRoute: '/leaderboard/snake',
      icon: '🐍',
    },
    {
      title: '2048',
      description: 'Slide tiles to combine them. Reach 2048 to win!',
      route: '/game2048',
      leaderboardRoute: '/leaderboard/game2048',
      icon: '🎮',
    },
  ];
}
