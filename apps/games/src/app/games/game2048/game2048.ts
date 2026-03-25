import { Component, HostListener, Signal, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamesDatabase } from '../../data/games-database';
import { Game2048ScoreEntry, GridSize2048 } from '../../data/leaderboard.types';

type GameState2048 = 'idle' | 'playing' | 'won' | 'over';
type SavePhase = 'entry' | 'saving' | 'saved' | 'skipped';
type MoveDir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew: boolean;
  isMerged: boolean;
}

interface GridOption {
  value: GridSize2048;
  label: string;
  size: number;
}

// Classic 2048 tile colors: [background, text]
const TILE_COLORS: Record<number, [string, string]> = {
  2: ['#eee4da', '#776e65'],
  4: ['#ede0c8', '#776e65'],
  8: ['#f2b179', '#f9f6f2'],
  16: ['#f59563', '#f9f6f2'],
  32: ['#f67c5f', '#f9f6f2'],
  64: ['#f65e3b', '#f9f6f2'],
  128: ['#edcf72', '#f9f6f2'],
  256: ['#edcc61', '#f9f6f2'],
  512: ['#edc850', '#f9f6f2'],
  1024: ['#edc53f', '#f9f6f2'],
  2048: ['#edc22e', '#f9f6f2'],
};

const GRID_OPTIONS: GridOption[] = [
  { value: '3x3', label: '3×3', size: 3 },
  { value: '4x4', label: '4×4', size: 4 },
  { value: '5x5', label: '5×5', size: 5 },
];

@Component({
  selector: 'games-game2048',
  imports: [RouterLink],
  template: `
    <div class="g2048">
      <div class="g2048__topbar">
        <h1>2048</h1>
        <div class="g2048__scores">
          <div class="g2048__score-box">
            <span class="g2048__score-label">Score</span>
            <span class="g2048__score-value">{{ score() }}</span>
          </div>
          <div class="g2048__score-box">
            <span class="g2048__score-label">Best</span>
            <span class="g2048__score-value">{{ highScore() }}</span>
          </div>
        </div>
      </div>

      <div class="g2048__arena" [style.--n]="gridDimension()">
        <div class="g2048__grid">
          @for (cell of gridCells(); track $index) {
            <div class="g2048__cell"></div>
          }
        </div>

        @for (tile of tiles(); track tile.id) {
          <div [class]="tileClass(tile)" [style]="tileStyle(tile)">{{ tile.value }}</div>
        }

        @if (gameState() !== 'playing') {
          <div class="g2048__overlay">
            @if (gameState() === 'idle') {
              <h2>2048</h2>
              <p>Combine tiles to reach 2048!</p>
              <p class="g2048__hint">Arrow Keys / WASD to move</p>
            } @else if (gameState() === 'won') {
              <h2>You Win!</h2>
              <p class="g2048__final-score">Score: {{ score() }}</p>
              @if (isNewHighScore()) {
                <p class="g2048__new-high-score">New High Score!</p>
              }
              @if (savePhase() === 'entry') {
                <div class="g2048__name-entry">
                  <label class="g2048__name-label" for="g2048-initials">Enter initials</label>
                  <input
                    id="g2048-initials"
                    class="g2048__name-input"
                    [value]="initials()"
                    (input)="onInitialsInput($event)"
                    (keydown.enter)="saveScore()"
                    maxlength="3"
                    placeholder="AAA"
                    autocomplete="off"
                    spellcheck="false" />
                </div>
                <div class="g2048__save-actions">
                  <button
                    class="g2048__start-btn"
                    [disabled]="initials().length === 0"
                    (click)="saveScore()">
                    Save Score
                  </button>
                  <button class="g2048__secondary-btn" (click)="skipSave()">Skip</button>
                </div>
              } @else if (savePhase() === 'saving') {
                <p class="g2048__saving">Saving…</p>
              } @else if (savePhase() === 'saved') {
                <p class="g2048__saved">Score saved!</p>
                <a routerLink="/leaderboard/game2048" class="g2048__start-btn">View Leaderboard</a>
              }
              <button class="g2048__secondary-btn" (click)="continueGame()">Keep Going</button>
              <button class="g2048__start-btn" (click)="startGame()">New Game</button>
            } @else if (gameState() === 'over') {
              <h2>Game Over</h2>
              <p class="g2048__final-score">Score: {{ score() }}</p>
              @if (isNewHighScore()) {
                <p class="g2048__new-high-score">New High Score!</p>
              }
              <p class="g2048__high-score">Best: {{ highScore() }}</p>
              @if (savePhase() === 'entry') {
                <div class="g2048__name-entry">
                  <label class="g2048__name-label" for="g2048-initials-over">Enter initials</label>
                  <input
                    id="g2048-initials-over"
                    class="g2048__name-input"
                    [value]="initials()"
                    (input)="onInitialsInput($event)"
                    (keydown.enter)="saveScore()"
                    maxlength="3"
                    placeholder="AAA"
                    autocomplete="off"
                    spellcheck="false" />
                </div>
                <div class="g2048__save-actions">
                  <button
                    class="g2048__start-btn"
                    [disabled]="initials().length === 0"
                    (click)="saveScore()">
                    Save Score
                  </button>
                  <button class="g2048__secondary-btn" (click)="skipSave()">Skip</button>
                </div>
              } @else if (savePhase() === 'saving') {
                <p class="g2048__saving">Saving…</p>
              } @else if (savePhase() === 'saved') {
                <p class="g2048__saved">Score saved!</p>
                <a routerLink="/leaderboard/game2048" class="g2048__start-btn">View Leaderboard</a>
              }
            }

            @if (gameState() === 'idle' || gameState() === 'over') {
              <div class="g2048__settings">
                <div class="g2048__setting-group">
                  <span class="g2048__setting-label">Grid</span>
                  <div class="g2048__options">
                    @for (opt of gridOptions; track opt.value) {
                      <button
                        class="g2048__option"
                        [class.g2048__option--active]="gridSize() === opt.value"
                        (click)="setGridSize(opt.value)">
                        {{ opt.label }}
                      </button>
                    }
                  </div>
                </div>
              </div>
            }

            @if (gameState() === 'idle') {
              <button class="g2048__start-btn" (click)="startGame()">Start Game</button>
            } @else if (gameState() === 'over') {
              <button class="g2048__start-btn" (click)="startGame()">Play Again</button>
            }
          </div>
        }
      </div>

      <footer class="g2048__footer">
        <span>Arrow Keys / WASD to move</span>
        <a routerLink="/leaderboard/game2048" class="g2048__lb-link">Leaderboard</a>
      </footer>
    </div>
  `,
  styleUrl: './game2048.scss',
})
export default class Game2048 {
  private readonly db = inject(GamesDatabase);

  protected readonly gridOptions = GRID_OPTIONS;

  private readonly _gridSize = signal<GridSize2048>('4x4');
  private readonly _tiles = signal<Tile[]>([]);
  private readonly _score = signal(0);
  private readonly _highScore = signal(this.loadHighScore('4x4'));
  private readonly _gameState = signal<GameState2048>('idle');
  private readonly _initials = signal('');
  private readonly _savePhase = signal<SavePhase>('entry');

  protected readonly gridSize: Signal<GridSize2048> = this._gridSize.asReadonly();
  protected readonly tiles: Signal<Tile[]> = this._tiles.asReadonly();
  protected readonly score: Signal<number> = this._score.asReadonly();
  protected readonly highScore: Signal<number> = this._highScore.asReadonly();
  protected readonly gameState: Signal<GameState2048> = this._gameState.asReadonly();
  protected readonly initials: Signal<string> = this._initials.asReadonly();
  protected readonly savePhase: Signal<SavePhase> = this._savePhase.asReadonly();

  protected readonly gridDimension = computed(
    () => GRID_OPTIONS.find((o) => o.value === this._gridSize())?.size ?? 4,
  );

  protected readonly gridCells = computed(() =>
    Array.from({ length: this.gridDimension() ** 2 }),
  );

  protected readonly maxTile = computed(() =>
    this._tiles().reduce((max, t) => Math.max(max, t.value), 0),
  );

  protected readonly isNewHighScore = computed(
    () => this._score() > 0 && this._score() === this._highScore(),
  );

  private _nextId = 0;
  private _hasWon = false;

  protected tileClass(tile: Tile): string {
    let cls = 'g2048__tile';
    if (tile.value >= 1024) cls += ' g2048__tile--xs-text';
    else if (tile.value >= 128) cls += ' g2048__tile--sm-text';
    if (tile.isNew) cls += ' g2048__tile--new';
    if (tile.isMerged) cls += ' g2048__tile--merged';
    return cls;
  }

  protected tileStyle(tile: Tile): { [key: string]: string } {
    const colors = TILE_COLORS[Math.min(tile.value, 2048)] ?? ['#3c3a32', '#f9f6f2'];
    return {
      '--r': String(tile.row),
      '--c': String(tile.col),
      'background-color': colors[0],
      color: colors[1],
    };
  }

  protected setGridSize(size: GridSize2048): void {
    if (this._gameState() === 'playing') return;
    this._gridSize.set(size);
    this._highScore.set(this.loadHighScore(size));
  }

  protected startGame(): void {
    this._score.set(0);
    this._initials.set('');
    this._savePhase.set('entry');
    this._hasWon = false;

    const n = this.gridDimension();
    const tiles: Tile[] = [];
    this.spawnTile(tiles, n);
    this.spawnTile(tiles, n);
    this._tiles.set(tiles);
    this._gameState.set('playing');
  }

  protected continueGame(): void {
    this._gameState.set('playing');
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (document.activeElement?.tagName === 'INPUT') return;
    if (this._gameState() !== 'playing') return;

    const dirMap: Record<string, MoveDir> = {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
      w: 'UP',
      s: 'DOWN',
      a: 'LEFT',
      d: 'RIGHT',
      W: 'UP',
      S: 'DOWN',
      A: 'LEFT',
      D: 'RIGHT',
    };

    const dir = dirMap[event.key];
    if (!dir) return;
    if (event.key.startsWith('Arrow')) event.preventDefault();

    this.executeMove(dir);
  }

  protected onInitialsInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 3);
    this._initials.set(cleaned);
    input.value = cleaned;
  }

  protected async saveScore(): Promise<void> {
    const name = this._initials();
    if (name.length === 0) return;
    this._savePhase.set('saving');
    const entry: Game2048ScoreEntry = {
      name,
      score: this._score(),
      gridSize: this._gridSize(),
      maxTile: this.maxTile(),
      date: new Date().toISOString(),
    };
    try {
      await this.db.addScore('game2048', this._gridSize(), entry);
      this._savePhase.set('saved');
    } catch {
      this._savePhase.set('entry');
    }
  }

  protected skipSave(): void {
    this._savePhase.set('skipped');
  }

  private executeMove(dir: MoveDir): void {
    const before = this.toMatrix();
    const { matrix, scoreDelta, mergedSet } = this.applyMove(dir, before);

    if (this.matricesEqual(before, matrix)) return;

    const n = this.gridDimension();
    const newTiles: Tile[] = [];

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r][c] === 0) continue;
        newTiles.push({
          id: this._nextId++,
          value: matrix[r][c],
          row: r,
          col: c,
          isNew: false,
          isMerged: mergedSet.has(`${r},${c}`),
        });
      }
    }

    const newScore = this._score() + scoreDelta;
    this._score.set(newScore);

    if (newScore > this._highScore()) {
      this._highScore.set(newScore);
      this.saveHighScore(this._gridSize(), newScore);
    }

    this.spawnTile(newTiles, n);
    this._tiles.set(newTiles);

    setTimeout(() => {
      this._tiles.update((tiles) => tiles.map((t) => ({ ...t, isNew: false, isMerged: false })));
    }, 200);

    this.checkGameConditions(newTiles, n);
  }

  private toMatrix(): number[][] {
    const n = this.gridDimension();
    const m: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    for (const t of this._tiles()) {
      m[t.row][t.col] = t.value;
    }
    return m;
  }

  private applyMove(
    dir: MoveDir,
    matrix: number[][],
  ): { matrix: number[][]; scoreDelta: number; mergedSet: Set<string> } {
    let m = matrix.map((row) => [...row]);
    let total = 0;
    const mergedLines: boolean[][] = [];

    if (dir === 'RIGHT') m = this.reverseRows(m);
    else if (dir === 'UP') m = this.transpose(m);
    else if (dir === 'DOWN') {
      m = this.transpose(m);
      m = this.reverseRows(m);
    }

    m = m.map((row) => {
      const { result, scoreDelta, mergedFlags } = this.slideLine(row);
      total += scoreDelta;
      mergedLines.push(mergedFlags);
      return result;
    });

    let mergedMatrix: number[][] = mergedLines.map((row) => row.map((v) => (v ? 1 : 0)));

    if (dir === 'RIGHT') {
      m = this.reverseRows(m);
      mergedMatrix = this.reverseRows(mergedMatrix);
    } else if (dir === 'UP') {
      m = this.transpose(m);
      mergedMatrix = this.transpose(mergedMatrix);
    } else if (dir === 'DOWN') {
      m = this.reverseRows(m);
      mergedMatrix = this.reverseRows(mergedMatrix);
      m = this.transpose(m);
      mergedMatrix = this.transpose(mergedMatrix);
    }

    const mergedSet = new Set<string>();
    for (let r = 0; r < mergedMatrix.length; r++) {
      for (let c = 0; c < mergedMatrix[r].length; c++) {
        if (mergedMatrix[r][c]) mergedSet.add(`${r},${c}`);
      }
    }

    return { matrix: m, scoreDelta: total, mergedSet };
  }

  private slideLine(line: number[]): {
    result: number[];
    scoreDelta: number;
    mergedFlags: boolean[];
  } {
    const nonZero = line.filter((v) => v !== 0);
    const result: number[] = [];
    const mergedFlags: boolean[] = [];
    let scoreDelta = 0;
    let i = 0;

    while (i < nonZero.length) {
      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        const v = nonZero[i] * 2;
        result.push(v);
        mergedFlags.push(true);
        scoreDelta += v;
        i += 2;
      } else {
        result.push(nonZero[i]);
        mergedFlags.push(false);
        i++;
      }
    }

    while (result.length < line.length) {
      result.push(0);
      mergedFlags.push(false);
    }

    return { result, scoreDelta, mergedFlags };
  }

  private transpose(m: number[][]): number[][] {
    return m[0].map((_, i) => m.map((row) => row[i]));
  }

  private reverseRows(m: number[][]): number[][] {
    return m.map((row) => [...row].reverse());
  }

  private matricesEqual(a: number[][], b: number[][]): boolean {
    return a.every((row, r) => row.every((v, c) => v === b[r][c]));
  }

  private spawnTile(tiles: Tile[], n: number): void {
    const occupied = new Set(tiles.map((t) => `${t.row},${t.col}`));
    const empty: { row: number; col: number }[] = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (!occupied.has(`${r},${c}`)) empty.push({ row: r, col: c });
      }
    }
    if (empty.length === 0) return;
    const pos = empty[Math.floor(Math.random() * empty.length)];
    tiles.push({
      id: this._nextId++,
      value: Math.random() < 0.9 ? 2 : 4,
      row: pos.row,
      col: pos.col,
      isNew: true,
      isMerged: false,
    });
  }

  private checkGameConditions(tiles: Tile[], n: number): void {
    if (!this._hasWon && tiles.some((t) => t.value >= 2048)) {
      this._hasWon = true;
      this.finalizeScore();
      this._gameState.set('won');
      return;
    }
    if (tiles.length === n * n && !this.hasValidMoves(tiles, n)) {
      this.finalizeScore();
      this._gameState.set('over');
    }
  }

  private hasValidMoves(tiles: Tile[], n: number): boolean {
    const m: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    tiles.forEach((t) => {
      m[t.row][t.col] = t.value;
    });
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n - 1; c++) {
        if (m[r][c] === m[r][c + 1]) return true;
      }
    }
    for (let r = 0; r < n - 1; r++) {
      for (let c = 0; c < n; c++) {
        if (m[r][c] === m[r + 1][c]) return true;
      }
    }
    return false;
  }

  private finalizeScore(): void {
    this._savePhase.set('entry');
    this._initials.set('');
  }

  private loadHighScore(size: GridSize2048): number {
    try {
      return parseInt(localStorage.getItem(`game2048-high-score-${size}`) ?? '0', 10);
    } catch {
      return 0;
    }
  }

  private saveHighScore(size: GridSize2048, score: number): void {
    try {
      localStorage.setItem(`game2048-high-score-${size}`, String(score));
    } catch {
      // localStorage unavailable
    }
  }
}
