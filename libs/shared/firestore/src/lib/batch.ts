import type { DocPath, SetOptions } from './types';

export type BatchOp =
  | { type: 'set'; path: DocPath; data: unknown; options?: SetOptions }
  | { type: 'update'; path: DocPath; data: Record<string, unknown> }
  | { type: 'delete'; path: DocPath };

export interface BatchAdapter {
  /**
   * Commit a batch of operations atomically.
   * Implementations should enforce batching limits (or assume chunking is done above).
   */
  commitBatch(ops: BatchOp[]): Promise<void>;
}

/**
 * Firestore has per-batch limits (web SDK commonly 500 ops).
 * Keep this configurable so admin/web can differ if needed.
 */
export async function commitInChunks(
  adapter: BatchAdapter,
  ops: BatchOp[],
  chunkSize = 450
): Promise<void> {
  for (let i = 0; i < ops.length; i += chunkSize) {
    const chunk = ops.slice(i, i + chunkSize);
    await adapter.commitBatch(chunk);
  }
}

export function batchSet<T>(
  items: Array<{ path: DocPath; data: T; options?: SetOptions }>
): BatchOp[] {
  return items.map((i) => ({ type: 'set', path: i.path, data: i.data, options: i.options }));
}

export function batchUpdate(
  items: Array<{ path: DocPath; data: Record<string, unknown> }>
): BatchOp[] {
  return items.map((i) => ({ type: 'update', path: i.path, data: i.data }));
}

export function batchDelete(paths: DocPath[]): BatchOp[] {
  return paths.map((p) => ({ type: 'delete', path: p }));
}
