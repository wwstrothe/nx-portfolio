import type { BatchAdapter, BatchOp } from './batch';
import { batchDelete, batchSet, batchUpdate, commitInChunks } from './batch';

describe('batch helpers', () => {
  beforeEach(() => jest.clearAllMocks());

  it('batchSet maps items to set ops (including options)', () => {
    const ops = batchSet([
      { path: 'test/1', data: { a: 1 }, options: { merge: true } },
      { path: 'test/2', data: { a: 2 } },
    ]);

    expect(ops).toEqual<BatchOp[]>([
      { type: 'set', path: 'test/1', data: { a: 1 }, options: { merge: true } },
      { type: 'set', path: 'test/2', data: { a: 2 }, options: undefined },
    ]);
  });

  it('batchUpdate maps items to update ops', () => {
    const ops = batchUpdate([
      { path: 'test/1', data: { a: 1 } },
      { path: 'test/2', data: { b: 2 } },
    ]);

    expect(ops).toEqual<BatchOp[]>([
      { type: 'update', path: 'test/1', data: { a: 1 } },
      { type: 'update', path: 'test/2', data: { b: 2 } },
    ]);
  });

  it('batchDelete maps paths to delete ops', () => {
    const ops = batchDelete(['test/1', 'test/2']);
    expect(ops).toEqual<BatchOp[]>([
      { type: 'delete', path: 'test/1' },
      { type: 'delete', path: 'test/2' },
    ]);
  });

  it('commitInChunks commits sequentially in chunkSize slices', async () => {
    const commitBatch = jest.fn(async (_ops: BatchOp[]) => undefined);
    const adapter: BatchAdapter = { commitBatch };

    const ops: BatchOp[] = Array.from({ length: 10 }, (_, i) => ({
      type: 'delete',
      path: `test/${i}`,
    }));

    await commitInChunks(adapter, ops, 4);

    expect(commitBatch).toHaveBeenCalledTimes(3);
    expect(commitBatch.mock.calls[0][0]).toEqual(ops.slice(0, 4));
    expect(commitBatch.mock.calls[1][0]).toEqual(ops.slice(4, 8));
    expect(commitBatch.mock.calls[2][0]).toEqual(ops.slice(8, 10));
  });
});
