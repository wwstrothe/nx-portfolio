import {
  deleteByPath,
  getByPath,
  listByCollection,
  setByPath,
  updateByPath,
} from './crud';

import type { FirestoreAdapter, SetOptions, WithId } from './types';

type TestDoc = { name: string };

describe('crud helpers', () => {
  const getDocMock = jest.fn(async (path: string) => ({
    id: '1',
    name: 'A',
    path,
  }));

  const setDocMock = jest.fn(
    async (path: string, data: Record<string, unknown>, options?: SetOptions) =>
      undefined
  );

  const updateDocMock = jest.fn(
    async (path: string, data: Record<string, unknown>) => undefined
  );

  const deleteDocMock = jest.fn(async (path: string) => undefined);

  const listCollectionMock = jest.fn(async (path: string) => [
    { id: '1', name: 'A', path },
  ]);

  const mockDb: FirestoreAdapter = {
    async getDoc<T extends Record<string, unknown>>(
      path: string
    ): Promise<WithId<T> | null> {
      const v = await getDocMock(path);
      return v as unknown as WithId<T>;
    },

    async setDoc<T extends Record<string, unknown>>(
      path: string,
      data: T,
      options?: SetOptions
    ): Promise<void> {
      await setDocMock(path, data, options);
    },

    async updateDoc<T extends Record<string, unknown>>(
      path: string,
      data: Partial<T>
    ): Promise<void> {
      await updateDocMock(path, data as Record<string, unknown>);
    },

    async deleteDoc(path: string): Promise<void> {
      await deleteDocMock(path);
    },

    async listCollection<T extends Record<string, unknown>>(
      path: string
    ): Promise<Array<WithId<T>>> {
      const v = await listCollectionMock(path);
      return v as unknown as Array<WithId<T>>;
    },
  };

  beforeEach(() => jest.clearAllMocks());

  it('getByPath calls adapter.getDoc', async () => {
    const res = await getByPath<TestDoc>(mockDb, 'test/1');
    expect(getDocMock).toHaveBeenCalledWith('test/1');
    expect(res).toEqual({ id: '1', name: 'A', path: 'test/1' });
  });

  it('setByPath calls adapter.setDoc', async () => {
    await setByPath<TestDoc>(mockDb, 'test/1', { name: 'B' }, { merge: true });
    expect(setDocMock).toHaveBeenCalledWith('test/1', { name: 'B' }, { merge: true });
  });

  it('updateByPath calls adapter.updateDoc', async () => {
    await updateByPath<TestDoc>(mockDb, 'test/1', { name: 'C' });
    expect(updateDocMock).toHaveBeenCalledWith('test/1', { name: 'C' });
  });

  it('deleteByPath calls adapter.deleteDoc', async () => {
    await deleteByPath(mockDb, 'test/1');
    expect(deleteDocMock).toHaveBeenCalledWith('test/1');
  });

  it('listByCollection calls adapter.listCollection', async () => {
    const res = await listByCollection<TestDoc>(mockDb, 'test');
    expect(listCollectionMock).toHaveBeenCalledWith('test');
    expect(res).toEqual([{ id: '1', name: 'A', path: 'test' }]);
  });
});
