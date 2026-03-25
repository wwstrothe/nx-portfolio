import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  Signal,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamesDatabase } from '../../data/games-database';
import { SnakeScoreEntry } from '../../data/leaderboard.types';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameState = 'idle' | 'playing' | 'paused' | 'over';
type GridSize = 'small' | 'medium' | 'large';
type SpeedPreset = 'slow' | 'normal' | 'fast';
type SavePhase = 'entry' | 'saving' | 'saved' | 'skipped';

interface Point {
  x: number;
  y: number;
}

interface GridOption {
  value: GridSize;
  label: string;
  cols: number;
  rows: number;
}

interface SpeedOption {
  value: SpeedPreset;
  label: string;
  ms: number;
}

const CELL = 20;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 40;

const GRID_OPTIONS: GridOption[] = [
  { value: 'small', label: 'Small', cols: 10, rows: 10 },
  { value: 'medium', label: 'Medium', cols: 20, rows: 20 },
  { value: 'large', label: 'Large', cols: 30, rows: 30 },
];

const SPEED_OPTIONS: SpeedOption[] = [
  { value: 'slow', label: 'Slow', ms: 250 },
  { value: 'normal', label: 'Normal', ms: 150 },
  { value: 'fast', label: 'Fast', ms: 80 },
];

@Component({
  selector: 'games-snake',
  imports: [RouterLink],
  template: `
    <div class="snake">
      <div class="snake__topbar">
        <h1>Snake</h1>
        <div class="snake__score">
          <span class="snake__score-label">Score</span>
          <span class="snake__score-value">{{ score() }}</span>
        </div>
      </div>

      <div class="snake__arena">
        <canvas #canvas [width]="canvasSize()" [height]="canvasSize()" class="snake__canvas"></canvas>

        @if (gameState() !== 'playing') {
          <div class="snake__overlay">
            @if (gameState() === 'idle') {
              <h2>Snake</h2>
              <p>Use arrow keys or WASD to move</p>
            } @else if (gameState() === 'paused') {
              <h2>Paused</h2>
              <button (click)="resumeGame()">Resume</button>
              <button class="snake__secondary-btn" (click)="startGame()">Restart</button>
              <button class="snake__secondary-btn" (click)="goToMenu()">Menu</button>
            } @else if (gameState() === 'over') {
              <h2>Game Over</h2>
              <p class="snake__final-score">Score: {{ score() }}</p>
              @if (score() === highScore() && score() > 0) {
                <p class="snake__new-high-score">New High Score!</p>
              }
              <p class="snake__high-score">Best: {{ highScore() }}</p>

              @if (savePhase() === 'entry') {
                <div class="snake__name-entry">
                  <label class="snake__name-label" for="snake-initials">Enter initials</label>
                  <input
                    id="snake-initials"
                    class="snake__name-input"
                    [value]="initials()"
                    (input)="onInitialsInput($event)"
                    (keydown.enter)="saveScore()"
                    maxlength="3"
                    placeholder="AAA"
                    autocomplete="off"
                    spellcheck="false" />
                </div>
                <div class="snake__save-actions">
                  <button
                    class="snake__start-btn"
                    [disabled]="initials().length === 0"
                    (click)="saveScore()">
                    Save Score
                  </button>
                  <button class="snake__secondary-btn" (click)="skipSave()">Skip</button>
                </div>
              } @else if (savePhase() === 'saving') {
                <p class="snake__saving">Saving…</p>
              } @else if (savePhase() === 'saved') {
                <p class="snake__saved">Score saved!</p>
                <a routerLink="/leaderboard/snake" class="snake__start-btn">View Leaderboard</a>
              }
            }

            @if (gameState() !== 'paused') {
              <div class="snake__settings">
                <div class="snake__setting-group">
                  <span class="snake__setting-label">Grid</span>
                  <div class="snake__options">
                    @for (opt of gridOptions; track opt.value) {
                      <button
                        class="snake__option"
                        [class.snake__option--active]="gridSize() === opt.value"
                        (click)="setGridSize(opt.value)">
                        {{ opt.label }}
                      </button>
                    }
                  </div>
                </div>
                <div class="snake__setting-group">
                  <span class="snake__setting-label">Speed</span>
                  <div class="snake__options">
                    @for (opt of speedOptions; track opt.value) {
                      <button
                        class="snake__option"
                        [class.snake__option--active]="speedPreset() === opt.value"
                        (click)="setSpeedPreset(opt.value)">
                        {{ opt.label }}
                      </button>
                    }
                  </div>
                </div>
              </div>
            }

            @if (gameState() === 'idle') {
              <button class="snake__start-btn" (click)="startGame()">Start Game</button>
            } @else if (gameState() === 'over') {
              <button class="snake__start-btn" (click)="startGame()">Play Again</button>
            }
          </div>
        }
      </div>

      <footer class="snake__footer">
        <span>Arrow Keys / WASD to move</span>
        <span>P or Escape to pause</span>
        <a routerLink="/leaderboard/snake" class="snake__lb-link">Leaderboard</a>
      </footer>
    </div>
  `,
  styleUrl: './snake.scss',
})
export default class Snake implements OnDestroy {
  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly db = inject(GamesDatabase);

  protected readonly gridOptions = GRID_OPTIONS;
  protected readonly speedOptions = SPEED_OPTIONS;

  private readonly _gridSize = signal<GridSize>('medium');
  private readonly _speedPreset = signal<SpeedPreset>('normal');
  private readonly _score = signal(0);
  private readonly _highScore = signal(this.loadHighScore('medium'));
  private readonly _gameState = signal<GameState>('idle');
  private readonly _initials = signal('');
  private readonly _savePhase = signal<SavePhase>('entry');

  protected readonly gridSize: Signal<GridSize> = this._gridSize.asReadonly();
  protected readonly speedPreset: Signal<SpeedPreset> = this._speedPreset.asReadonly();
  protected readonly score: Signal<number> = this._score.asReadonly();
  protected readonly highScore: Signal<number> = this._highScore.asReadonly();
  protected readonly gameState: Signal<GameState> = this._gameState.asReadonly();
  protected readonly initials: Signal<string> = this._initials.asReadonly();
  protected readonly savePhase: Signal<SavePhase> = this._savePhase.asReadonly();
  protected readonly canvasSize = computed(() => CELL * this.cols);

  private snake: Point[] = [];
  private food: Point = { x: 0, y: 0 };
  private direction: Direction = 'RIGHT';
  private directionQueue: Direction[] = [];
  private loopId: ReturnType<typeof setInterval> | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  private get cols(): number {
    return GRID_OPTIONS.find((o) => o.value === this._gridSize())?.cols ?? 20;
  }

  private get rows(): number {
    return GRID_OPTIONS.find((o) => o.value === this._gridSize())?.rows ?? 20;
  }

  private get baseSpeed(): number {
    return SPEED_OPTIONS.find((o) => o.value === this._speedPreset())?.ms ?? 150;
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  protected setGridSize(size: GridSize): void {
    if (this._gameState() === 'playing') return;
    this._gridSize.set(size);
    this._highScore.set(this.loadHighScore(size));
  }

  protected setSpeedPreset(preset: SpeedPreset): void {
    if (this._gameState() === 'playing') return;
    this._speedPreset.set(preset);
  }

  protected startGame(): void {
    this.initGame();
    this._gameState.set('playing');
    this.startLoop();
    this.canvasRef().nativeElement.focus();
  }

  protected resumeGame(): void {
    this._gameState.set('playing');
    this.startLoop();
  }

  protected goToMenu(): void {
    this.stopLoop();
    this._gameState.set('idle');
  }

  protected onInitialsInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value
      .replace(/[^A-Za-z]/g, '')
      .toUpperCase()
      .slice(0, 3);
    this._initials.set(cleaned);
    input.value = cleaned;
  }

  protected async saveScore(): Promise<void> {
    const name = this._initials();
    if (name.length === 0) return;
    this._savePhase.set('saving');
    const entry: SnakeScoreEntry = {
      name,
      score: this._score(),
      gridSize: this._gridSize(),
      speedPreset: this._speedPreset(),
      date: new Date().toISOString(),
    };
    const key = `${this._gridSize()}-${this._speedPreset()}`;
    try {
      await this.db.addScore('snake', key, entry);
      this._savePhase.set('saved');
    } catch {
      this._savePhase.set('entry'); // allow retry on error
    }
  }

  protected skipSave(): void {
    this._savePhase.set('skipped');
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const key = event.key;

    if (key === 'p' || key === 'P' || key === 'Escape') {
      if (this._gameState() === 'playing') {
        this.pauseGame();
      } else if (this._gameState() === 'paused') {
        this.resumeGame();
      }
      return;
    }

    if (this._gameState() !== 'playing') return;

    const dirMap: Record<string, Direction> = {
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

    const newDir = dirMap[key];
    if (!newDir) return;

    if (key.startsWith('Arrow')) event.preventDefault();

    if (this.directionQueue.length < 2) {
      const last = this.directionQueue[this.directionQueue.length - 1] ?? this.direction;
      if (!this.isOpposite(newDir, last)) {
        this.directionQueue.push(newDir);
      }
    }
  }

  private initGame(): void {
    const midX = Math.floor(this.cols / 2);
    const midY = Math.floor(this.rows / 2);
    this.snake = [
      { x: midX, y: midY },
      { x: midX - 1, y: midY },
      { x: midX - 2, y: midY },
    ];
    this.direction = 'RIGHT';
    this.directionQueue = [];
    this._score.set(0);
    this._initials.set('');
    this._savePhase.set('entry');
    this.spawnFood();
    this.getContext();
    this.draw();
  }

  private getContext(): void {
    this.ctx = this.canvasRef().nativeElement.getContext('2d');
  }

  private startLoop(): void {
    this.stopLoop();
    this.loopId = setInterval(() => this.tick(), this.currentSpeed());
  }

  private stopLoop(): void {
    if (this.loopId !== null) {
      clearInterval(this.loopId);
      this.loopId = null;
    }
  }

  private pauseGame(): void {
    this.stopLoop();
    this._gameState.set('paused');
  }

  private tick(): void {
    if (this.directionQueue.length > 0) {
      const next = this.directionQueue.shift();
      if (next) this.direction = next;
    }

    const head = this.snake[0];
    const next = this.move(head, this.direction);

    if (next.x < 0 || next.x >= this.cols || next.y < 0 || next.y >= this.rows) {
      this.endGame();
      return;
    }

    if (this.snake.slice(0, -1).some((p) => p.x === next.x && p.y === next.y)) {
      this.endGame();
      return;
    }

    const ate = next.x === this.food.x && next.y === this.food.y;
    this.snake.unshift(next);
    if (!ate) {
      this.snake.pop();
    } else {
      const newScore = this._score() + 1;
      this._score.set(newScore);
      this.spawnFood();
      if (newScore % 5 === 0) {
        this.startLoop();
      }
    }

    this.draw();
  }

  private endGame(): void {
    this.stopLoop();
    const score = this._score();
    if (score > this._highScore()) {
      this._highScore.set(score);
      this.saveHighScore(this._gridSize(), score);
    }
    this._gameState.set('over');
  }

  private move(point: Point, dir: Direction): Point {
    const delta: Record<Direction, Point> = {
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
    };
    const d = delta[dir];
    return { x: point.x + d.x, y: point.y + d.y };
  }

  private isOpposite(a: Direction, b: Direction): boolean {
    return (
      (a === 'UP' && b === 'DOWN') ||
      (a === 'DOWN' && b === 'UP') ||
      (a === 'LEFT' && b === 'RIGHT') ||
      (a === 'RIGHT' && b === 'LEFT')
    );
  }

  private spawnFood(): void {
    const occupied = new Set(this.snake.map((p) => `${p.x},${p.y}`));
    let candidate: Point;
    do {
      candidate = {
        x: Math.floor(Math.random() * this.cols),
        y: Math.floor(Math.random() * this.rows),
      };
    } while (occupied.has(`${candidate.x},${candidate.y}`));
    this.food = candidate;
  }

  private currentSpeed(): number {
    const reduction = Math.floor(this._score() / 5) * SPEED_INCREMENT;
    return Math.max(MIN_SPEED, this.baseSpeed - reduction);
  }

  // ── Drawing ──────────────────────────────────────────────────────────────────

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;

    const size = this.canvasSize();
    const cols = this.cols;
    const rows = this.rows;

    const html = document.documentElement;
    const isDark =
      html.classList.contains('dark') ||
      (!html.classList.contains('light') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    const palette = {
      bg: isDark ? '#111827' : '#f9fafb',
      grid: isDark ? '#1f2937' : '#e5e7eb',
      snakeHead: '#2563eb',
      snakeBody: '#3b82f6',
      snakeBorder: '#1e40af',
      food: '#ef4444',
    };

    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = palette.grid;
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, size);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(size, y * CELL);
      ctx.stroke();
    }

    const fx = this.food.x * CELL + CELL / 2;
    const fy = this.food.y * CELL + CELL / 2;
    const glow = ctx.createRadialGradient(fx, fy, 2, fx, fy, CELL);
    glow.addColorStop(0, palette.food);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(this.food.x * CELL - 2, this.food.y * CELL - 2, CELL + 4, CELL + 4);

    ctx.fillStyle = palette.food;
    ctx.beginPath();
    ctx.roundRect(this.food.x * CELL + 3, this.food.y * CELL + 3, CELL - 6, CELL - 6, 4);
    ctx.fill();

    this.snake.forEach((seg, i) => {
      const x = seg.x * CELL;
      const y = seg.y * CELL;
      const inset = 1;

      ctx.fillStyle = i === 0 ? palette.snakeHead : palette.snakeBody;
      ctx.strokeStyle = palette.snakeBorder;
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(x + inset, y + inset, CELL - inset * 2, CELL - inset * 2, i === 0 ? 6 : 4);
      ctx.fill();
      ctx.stroke();

      if (i === 0) {
        ctx.fillStyle = '#ffffff';
        const eyeSize = 3;
        const eyeOffset = 5;
        let e1: Point, e2: Point;
        switch (this.direction) {
          case 'RIGHT':
            e1 = { x: x + CELL - eyeOffset, y: y + eyeOffset };
            e2 = { x: x + CELL - eyeOffset, y: y + CELL - eyeOffset };
            break;
          case 'LEFT':
            e1 = { x: x + eyeOffset - eyeSize, y: y + eyeOffset };
            e2 = { x: x + eyeOffset - eyeSize, y: y + CELL - eyeOffset };
            break;
          case 'UP':
            e1 = { x: x + eyeOffset, y: y + eyeOffset - eyeSize };
            e2 = { x: x + CELL - eyeOffset, y: y + eyeOffset - eyeSize };
            break;
          case 'DOWN':
            e1 = { x: x + eyeOffset, y: y + CELL - eyeOffset };
            e2 = { x: x + CELL - eyeOffset, y: y + CELL - eyeOffset };
            break;
        }
        ctx.beginPath();
        ctx.arc(e1.x, e1.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(e2.x, e2.y, eyeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  private loadHighScore(size: GridSize): number {
    try {
      return parseInt(localStorage.getItem(`snake-high-score-${size}`) ?? '0', 10);
    } catch {
      return 0;
    }
  }

  private saveHighScore(size: GridSize, score: number): void {
    try {
      localStorage.setItem(`snake-high-score-${size}`, String(score));
    } catch {
      // localStorage unavailable
    }
  }
}
