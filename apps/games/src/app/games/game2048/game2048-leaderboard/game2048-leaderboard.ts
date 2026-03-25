import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamesDatabase } from '../../../data/games-database';
import { ColumnDef, Game2048ScoreEntry } from '../../../data/leaderboard.types';
import { LeaderboardTableComponent } from '../../../shared/leaderboard-table/leaderboard-table';

@Component({
  selector: 'games-game2048-leaderboard',
  imports: [RouterLink, LeaderboardTableComponent],
  template: `
    <div class="g2048-lb">
      <header class="g2048-lb__header">
        <a routerLink="/" class="g2048-lb__back">← Games</a>
        <h1>2048 — Leaderboard</h1>
      </header>

      <div class="g2048-lb__content">
        <games-leaderboard-table
          [entries]="displayedEntries()"
          [extraColumns]="extraColumns"
          [tabs]="availableTabs()"
          [activeTab]="activeTab()"
          (tabChange)="activeTab.set($event)" />
      </div>
    </div>
  `,
  styleUrl: './game2048-leaderboard.scss',
})
export default class Game2048Leaderboard {
  private readonly db = inject(GamesDatabase);

  private readonly allScores = this.db.listenLeaderboard<Game2048ScoreEntry>('game2048');

  protected readonly activeTab = signal('all');

  protected readonly availableTabs = computed(() =>
    Object.keys(this.allScores()).filter((k) => this.allScores()[k].length > 0),
  );

  protected readonly displayedEntries = computed(() => {
    const tab = this.activeTab();
    const scores = this.allScores();
    if (tab === 'all') {
      return Object.values(scores)
        .flat()
        .sort((a, b) => b.score - a.score);
    }
    return scores[tab] ?? [];
  });

  protected readonly extraColumns: ColumnDef[] = [
    { header: 'Grid', value: (e) => (e as Game2048ScoreEntry).gridSize },
    { header: 'Max Tile', value: (e) => String((e as Game2048ScoreEntry).maxTile) },
  ];
}
