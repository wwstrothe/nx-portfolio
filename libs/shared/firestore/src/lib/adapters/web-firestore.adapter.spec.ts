import type { Firestore, QueryConstraint } from 'firebase/firestore';
import { createWebFirestoreAdapter } from './web-firestore.adapter';

const docMock = jest.fn();
const collectionMock = jest.fn();
const getDocMock = jest.fn();
const getDocsMock = jest.fn();
const setDocMock = jest.fn();
const addDocMock = jest.fn();
const updateDocMock = jest.fn();
const deleteDocMock = jest.fn();
const writeBatchMock = jest.fn();
const onSnapshotMock = jest.fn();
const queryMock = jest.fn();

jest.mock('firebase/firestore', () => {
  return {
    doc: (...args: unknown[]) => docMock(...args),
    collection: (...args: unknown[]) => collectionMock(...args),
    getDoc: (...args: unknown[]) => getDocMock(...args),
    getDocs: (...args: unknown[]) => getDocsMock(...args),
    setDoc: (...args: unknown[]) => setDocMock(...args),
    addDoc: (...args: unknown[]) => addDocMock(...args),
    updateDoc: (...args: unknown[]) => updateDocMock(...args),
    deleteDoc: (...args: unknown[]) => deleteDocMock(...args),
    writeBatch: (...args: unknown[]) => writeBatchMock(...args),
    onSnapshot: (...args: unknown[]) => onSnapshotMock(...args),
    query: (...args: unknown[]) => queryMock(...args),
  };
});

type TestDoc = { message: string; createdAt: number };

function makeDocSnap(opts: { exists: boolean; id: string; data?: unknown }) {
  return {
    id: opts.id,
    exists: () => opts.exists,
    data: () => opts.data,
  };
}

describe('createWebFirestoreAdapter', () => {
  const db = {} as unknown as Firestore;

  beforeEach(() => {
    jest.clearAllMocks();

    docMock.mockImplementation((_db: unknown, path: string) => ({
      __type: 'doc',
      path,
    }));
    collectionMock.mockImplementation((_db: unknown, path: string) => ({
      __type: 'col',
      path,
    }));

    queryMock.mockImplementation((base: unknown, ...constraints: unknown[]) => ({
      __type: 'query',
      base,
      constraints,
    }));
  });

  it('getDoc returns null when snapshot does not exist', async () => {
    getDocMock.mockResolvedValueOnce(makeDocSnap({ exists: false, id: 'x' }));

    const adapter = createWebFirestoreAdapter(db);
    const res = await adapter.getDoc<TestDoc>('test/x');

    expect(docMock).toHaveBeenCalledWith(db, 'test/x');
    expect(getDocMock).toHaveBeenCalledWith({ __type: 'doc', path: 'test/x' });
    expect(res).toBeNull();
  });

  it('getDoc returns WithId when snapshot exists', async () => {
    getDocMock.mockResolvedValueOnce(
      makeDocSnap({
        exists: true,
        id: '1',
        data: { message: 'hi', createdAt: 123 },
      })
    );

    const adapter = createWebFirestoreAdapter(db);
    const res = await adapter.getDoc<TestDoc>('test/1');

    expect(res).toEqual({ id: '1', message: 'hi', createdAt: 123 });
  });

  it('setDoc passes merge options when provided', async () => {
    setDocMock.mockResolvedValueOnce(undefined);

    const adapter = createWebFirestoreAdapter(db);
    await adapter.setDoc<TestDoc>('test/1', { message: 'x', createdAt: 1 }, { merge: true });

    expect(setDocMock).toHaveBeenCalledWith(
      { __type: 'doc', path: 'test/1' },
      { message: 'x', createdAt: 1 },
      { merge: true }
    );
  });

  it('setDoc does not pass options when not provided', async () => {
    setDocMock.mockResolvedValueOnce(undefined);

    const adapter = createWebFirestoreAdapter(db);
    await adapter.setDoc<TestDoc>('test/1', { message: 'x', createdAt: 1 });

    expect(setDocMock).toHaveBeenCalledWith(
      { __type: 'doc', path: 'test/1' },
      { message: 'x', createdAt: 1 }
    );
  });

  it('addDoc calls firebase addDoc with collection ref and returns doc id', async () => {
    addDocMock.mockResolvedValueOnce({ id: 'auto-id-123' });

    const adapter = createWebFirestoreAdapter(db);
    const docId = await adapter.addDoc<TestDoc>('test', { message: 'new', createdAt: 999 });

    expect(collectionMock).toHaveBeenCalledWith(db, 'test');
    expect(addDocMock).toHaveBeenCalledWith(
      { __type: 'col', path: 'test' },
      { message: 'new', createdAt: 999 }
    );
    expect(docId).toBe('auto-id-123');
  });

  it('updateDoc calls firebase updateDoc with doc ref', async () => {
    updateDocMock.mockResolvedValueOnce(undefined);

    const adapter = createWebFirestoreAdapter(db);
    await adapter.updateDoc<TestDoc>('test/1', { message: 'updated' });

    expect(updateDocMock).toHaveBeenCalledWith(
      { __type: 'doc', path: 'test/1' },
      { message: 'updated' }
    );
  });

  it('deleteDoc calls firebase deleteDoc with doc ref', async () => {
    deleteDocMock.mockResolvedValueOnce(undefined);

    const adapter = createWebFirestoreAdapter(db);
    await adapter.deleteDoc('test/1');

    expect(deleteDocMock).toHaveBeenCalledWith({
      __type: 'doc',
      path: 'test/1',
    });
  });

  it('listCollection maps docs to WithId', async () => {
    getDocsMock.mockResolvedValueOnce({
      docs: [
        { id: 'a', data: () => ({ message: 'A', createdAt: 1 }) },
        { id: 'b', data: () => ({ message: 'B', createdAt: 2 }) },
      ],
    });

    const adapter = createWebFirestoreAdapter(db);
    const res = await adapter.listCollection<TestDoc>('test');

    expect(getDocsMock).toHaveBeenCalledWith({ __type: 'col', path: 'test' });
    expect(res).toEqual([
      { id: 'a', message: 'A', createdAt: 1 },
      { id: 'b', message: 'B', createdAt: 2 },
    ]);
  });

  it('commitBatch routes ops to writeBatch.set/update/delete and commits', async () => {
    const batchSet = jest.fn();
    const batchUpdate = jest.fn();
    const batchDelete = jest.fn();
    const batchCommit = jest.fn(async () => undefined);

    writeBatchMock.mockReturnValueOnce({
      set: batchSet,
      update: batchUpdate,
      delete: batchDelete,
      commit: batchCommit,
    });

    const adapter = createWebFirestoreAdapter(db);

    await adapter.commitBatch([
      {
        type: 'set',
        path: 'test/1',
        data: { message: 'x' },
        options: { merge: true },
      },
      { type: 'update', path: 'test/2', data: { message: 'y' } },
      { type: 'delete', path: 'test/3' },
    ]);

    expect(writeBatchMock).toHaveBeenCalledWith(db);

    expect(batchSet).toHaveBeenCalledWith(
      { __type: 'doc', path: 'test/1' },
      { message: 'x' },
      { merge: true }
    );
    expect(batchUpdate).toHaveBeenCalledWith({ __type: 'doc', path: 'test/2' }, { message: 'y' });
    expect(batchDelete).toHaveBeenCalledWith({ __type: 'doc', path: 'test/3' });
    expect(batchCommit).toHaveBeenCalledTimes(1);
  });

  it('listenDoc$ emits null for missing docs and unsubscribes', () => {
    const unsub = jest.fn();

    onSnapshotMock.mockImplementation((_ref: unknown, next: (snap: any) => void) => {
      next(makeDocSnap({ exists: false, id: 'x' }));
      next(
        makeDocSnap({
          exists: true,
          id: '1',
          data: { message: 'hi', createdAt: 1 },
        })
      );
      return unsub;
    });

    const adapter = createWebFirestoreAdapter(db);

    const seen: Array<unknown> = [];
    const sub = adapter.listenDoc$<TestDoc>('test/1').subscribe((v) => seen.push(v));

    expect(seen).toEqual([null, { id: '1', message: 'hi', createdAt: 1 }]);

    sub.unsubscribe();
    expect(unsub).toHaveBeenCalledTimes(1);
  });

  it('listenCollection$ builds a query with constraints and maps docs to WithId', () => {
    const unsub = jest.fn();

    const constraintA = { __constraint: 'A' } as unknown as QueryConstraint;

    onSnapshotMock.mockImplementation((_q: unknown, next: (snap: any) => void) => {
      next({
        docs: [
          { id: 'a', data: () => ({ message: 'A', createdAt: 1 }) },
          { id: 'b', data: () => ({ message: 'B', createdAt: 2 }) },
        ],
      });
      return unsub;
    });

    const adapter = createWebFirestoreAdapter(db);

    const seen: Array<unknown> = [];
    const sub = adapter
      .listenCollection$<TestDoc>('test', [constraintA])
      .subscribe((v) => seen.push(v));

    expect(collectionMock).toHaveBeenCalledWith(db, 'test');
    expect(queryMock).toHaveBeenCalledWith({ __type: 'col', path: 'test' }, constraintA);

    expect(seen).toEqual([
      [
        { id: 'a', message: 'A', createdAt: 1 },
        { id: 'b', message: 'B', createdAt: 2 },
      ],
    ]);

    sub.unsubscribe();
    expect(unsub).toHaveBeenCalledTimes(1);
  });
});
