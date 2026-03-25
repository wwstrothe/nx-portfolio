import { Injectable, Signal, inject, isDevMode } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { FirestoreService } from '@portfolio/shared/angular/firestore-angular';
import { PORTFOLIO_PROJECT_KEY } from '@portfolio/shared/config';
import { LeaderboardEntry, ScoresDoc } from './leaderboard.types';

@Injectable({ providedIn: 'root' })
export class GamesDatabase {
  private readonly firestore = inject(FirestoreService);
  private readonly target = isDevMode() ? 'emulator' : ('live' as const);

  async addScore<T extends LeaderboardEntry>(game: string, key: string, entry: T): Promise<void> {
    const docPath = `high-scores/${game}`;
    const doc = await this.firestore.getByPath<ScoresDoc<T>>(
      PORTFOLIO_PROJECT_KEY,
      this.target,
      docPath,
    );
    const existing: T[] = doc?.scores?.[key] ?? [];
    const updated = [entry, ...existing].sort((a, b) => b.score - a.score).slice(0, 20);
    // Write back the full scores map to avoid partial-merge ambiguity
    const newScores: Record<string, T[]> = { ...(doc?.scores ?? {}), [key]: updated };
    await this.firestore.setByPath(PORTFOLIO_PROJECT_KEY, this.target, docPath, {
      scores: newScores,
    });
  }

  // Returns a Signal of the raw scores map so the consumer can compute tabs + filtered views
  listenLeaderboard<T extends LeaderboardEntry>(game: string): Signal<Record<string, T[]>> {
    const obs = this.firestore
      .listenDoc$<ScoresDoc<T>>(PORTFOLIO_PROJECT_KEY, this.target, `high-scores/${game}`)
      .pipe(map((doc) => (doc?.scores ?? {}) as Record<string, T[]>));
    return toSignal(obs, { initialValue: {} as Record<string, T[]> });
  }
}
