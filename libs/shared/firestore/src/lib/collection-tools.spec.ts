import { of } from 'rxjs';

import { createCollectionTools } from './collection-tools';

// We mock toSignal so tests don't require Angular injection context
jest.mock('@angular/core/rxjs-interop', () => ({
  toSignal: jest.fn(),
}));

import { toSignal } from '@angular/core/rxjs-interop';

type TestDoc = {
  message: string;
  createdAt: number;
};

type WithId<T> = T & { id: string };

describe('createCollectionTools', () => {
  const collectionPath = 'test';

  // Minimal adapter shape expected by createCollectionTools
  const makeDb = () => {
    return {
      listenCollection$: jest.fn(() => of([])),
      setDoc: jest.fn(async () => undefined),
      updateDoc: jest.fn(async () => undefined),
      deleteDoc: jest.fn(async () => undefined),
      // other FirestoreAdapter methods are irrelevant for these tests
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Deterministic UUID for tests
    (globalThis.crypto ??= {} as Crypto);
    // @ts-expect-error - test environment
    globalThis.crypto.randomUUID = jest.fn(() => 'uuid-123');
  });

  it('creates docs signal via toSignal with provided initialValue and constraints', () => {
    const db = makeDb();

    // Arrange: make toSignal return a stable "signal-like" function
    const fakeSignal = (() => [{ id: 'a', message: 'x', createdAt: 1 }]) as any;
    (toSignal as jest.Mock).mockReturnValue(fakeSignal);

    const constraints = [{ __type: 'fakeConstraint' } as any]; // QueryConstraint at runtime is opaque

    const initialValue: Array<WithId<TestDoc>> = [
      { id: 'seed', message: 'seed', createdAt: 0 },
    ];

    const tools = createCollectionTools<TestDoc>({
      db: db as any,
      collectionPath,
      constraints,
      initialValue,
    });

    // toSignal should be called with the observable returned by listenCollection$
    expect(db.listenCollection$).toHaveBeenCalledTimes(1);
    expect(db.listenCollection$).toHaveBeenCalledWith(collectionPath, constraints);

    expect(toSignal).toHaveBeenCalledTimes(1);

    // First arg is the observable returned from listenCollection$.
    const calledWithObservable = (toSignal as jest.Mock).mock.calls[0][0];
    expect(calledWithObservable).toBe((db.listenCollection$ as jest.Mock).mock.results[0].value);

    // Second arg should contain our initialValue
    expect((toSignal as jest.Mock).mock.calls[0][1]).toEqual({
      initialValue,
    });

    // Returned docs should be whatever toSignal returned
    expect(tools.docs).toBe(fakeSignal);
  });

  it('defaults constraints to an empty array when not provided', () => {
    const db = makeDb();

    const fakeSignal = (() => []) as any;
    (toSignal as jest.Mock).mockReturnValue(fakeSignal);

    createCollectionTools<TestDoc>({
      db: db as any,
      collectionPath,
      // constraints omitted
      // initialValue omitted
    });

    expect(db.listenCollection$).toHaveBeenCalledWith(collectionPath, []);
    expect(toSignal).toHaveBeenCalledWith(expect.anything(), { initialValue: [] });
  });

  it('add() generates an id, writes to `${collectionPath}/${id}`, and returns the id', async () => {
    const db = makeDb();
    const fakeSignal = (() => []) as any;
    (toSignal as jest.Mock).mockReturnValue(fakeSignal);

    const tools = createCollectionTools<TestDoc>({
      db: db as any,
      collectionPath,
    });

    const doc: TestDoc = { message: 'hello', createdAt: 123 };

    const id = await tools.add(doc);

    expect(globalThis.crypto.randomUUID).toHaveBeenCalledTimes(1);
    expect(db.setDoc).toHaveBeenCalledTimes(1);
    expect(db.setDoc).toHaveBeenCalledWith(`${collectionPath}/uuid-123`, doc);
    expect(id).toBe('uuid-123');
  });

  it('update() calls updateDoc on `${collectionPath}/${id}` with the patch', async () => {
    const db = makeDb();
    const fakeSignal = (() => []) as any;
    (toSignal as jest.Mock).mockReturnValue(fakeSignal);

    const tools = createCollectionTools<TestDoc>({
      db: db as any,
      collectionPath,
    });

    await tools.update('doc-1', { message: 'updated' });

    expect(db.updateDoc).toHaveBeenCalledTimes(1);
    expect(db.updateDoc).toHaveBeenCalledWith(`${collectionPath}/doc-1`, {
      message: 'updated',
    });
  });

  it('remove() calls deleteDoc on `${collectionPath}/${id}`', async () => {
    const db = makeDb();
    const fakeSignal = (() => []) as any;
    (toSignal as jest.Mock).mockReturnValue(fakeSignal);

    const tools = createCollectionTools<TestDoc>({
      db: db as any,
      collectionPath,
    });

    await tools.remove('doc-9');

    expect(db.deleteDoc).toHaveBeenCalledTimes(1);
    expect(db.deleteDoc).toHaveBeenCalledWith(`${collectionPath}/doc-9`);
  });
});
