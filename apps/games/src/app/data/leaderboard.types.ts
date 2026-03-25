// Base entry shared by every game's leaderboard
export interface LeaderboardEntry {
  name: string; // 3 uppercase letters
  score: number;
  date: string; // ISO 8601
}

// Column definition for the reusable LeaderboardTableComponent
export interface ColumnDef {
  header: string;
  value: (entry: LeaderboardEntry) => string;
}

// Snake-specific extension
export interface SnakeScoreEntry extends LeaderboardEntry {
  gridSize: 'small' | 'medium' | 'large';
  speedPreset: 'slow' | 'normal' | 'fast';
}

// 2048-specific extension
export type GridSize2048 = '3x3' | '4x4' | '5x5';

export interface Game2048ScoreEntry extends LeaderboardEntry {
  gridSize: GridSize2048;
  maxTile: number;
}

// Firestore document shape — keyed by game-specific combination string
export interface ScoresDoc<T extends LeaderboardEntry> extends Record<string, unknown> {
  scores: Record<string, T[]>;
}
