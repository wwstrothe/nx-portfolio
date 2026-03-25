import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamesDatabase } from '../../../data/games-database';
import { ColumnDef, SnakeScoreEntry } from '../../../data/leaderboard.types';
import { LeaderboardTableComponent } from '../../../shared/leaderboard-table/leaderboard-table';

@Component({
  selector: 'games-snake-leaderboard',
  imports: [RouterLink, LeaderboardTableComponent],
  template: `
    <div class="snake-lb">
      <header class="snake-lb__header">
        <a routerLink="/" class="snake-lb__back">← Games</a>
        <h1>Snake — Leaderboard</h1>
      </header>

      <div class="snake-lb__content">
        <games-leaderboard-table
          [entries]="displayedEntries()"
          [extraColumns]="extraColumns"
          [tabs]="availableTabs()"
          [activeTab]="activeTab()"
          (tabChange)="activeTab.set($event)" />
      </div>
    </div>
  `,
  styleUrl: './snake-leaderboard.scss',
})
export default class SnakeLeaderboard {
  private readonly db = inject(GamesDatabase);

  private readonly allScores = this.db.listenLeaderboard<SnakeScoreEntry>('snake');

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
    { header: 'Grid', value: (e) => (e as SnakeScoreEntry).gridSize },
    { header: 'Speed', value: (e) => (e as SnakeScoreEntry).speedPreset },
  ];
}
