import { Component, input, output } from '@angular/core';
import { ColumnDef, LeaderboardEntry } from '../../data/leaderboard.types';

@Component({
  selector: 'games-leaderboard-table',
  template: `
    @if (tabs().length > 0) {
      <div class="lb-tabs" role="tablist">
        <button
          role="tab"
          class="lb-tab"
          [class.lb-tab--active]="activeTab() === 'all'"
          (click)="tabChange.emit('all')">
          All
        </button>
        @for (tab of tabs(); track tab) {
          <button
            role="tab"
            class="lb-tab"
            [class.lb-tab--active]="activeTab() === tab"
            (click)="tabChange.emit(tab)">
            {{ formatTab(tab) }}
          </button>
        }
      </div>
    }

    @if (entries().length === 0) {
      <p class="lb-empty">No scores yet — be the first!</p>
    } @else {
      <table class="lb-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Score</th>
            @for (col of extraColumns(); track col.header) {
              <th>{{ col.header }}</th>
            }
            <th class="lb-date">Date</th>
          </tr>
        </thead>
        <tbody>
          @for (entry of entries(); track entry.date + entry.name; let i = $index) {
            <tr [class.lb-row--gold]="i === 0" [class.lb-row--silver]="i === 1" [class.lb-row--bronze]="i === 2">
              <td class="lb-rank">{{ i + 1 }}</td>
              <td class="lb-name">{{ entry.name }}</td>
              <td class="lb-score">{{ entry.score }}</td>
              @for (col of extraColumns(); track col.header) {
                <td class="lb-extra">{{ col.value(entry) }}</td>
              }
              <td class="lb-date">{{ formatDate(entry.date) }}</td>
            </tr>
          }
        </tbody>
      </table>
    }
  `,
  styleUrl: './leaderboard-table.scss',
})
export class LeaderboardTableComponent {
  entries = input.required<LeaderboardEntry[]>();
  extraColumns = input<ColumnDef[]>([]);
  activeTab = input<string>('all');
  tabs = input<string[]>([]);
  tabChange = output<string>();

  protected formatTab(key: string): string {
    return key
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' / ');
  }

  protected formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
