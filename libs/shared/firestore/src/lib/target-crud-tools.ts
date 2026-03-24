import type { FirebaseProjectKey } from '@portfolio/shared/config';
import type { QueryConstraint } from 'firebase/firestore';
import type { Observable } from 'rxjs';

import type { BatchOp } from './batch';
import {
  addByPath,
  deleteByPath,
  getByPath,
  listByCollection,
  setByPath,
  updateByPath,
} from './crud';
import type { Targets } from './firebase-target-adapter';
import type { CollectionPath, DocPath, SetOptions, WithId } from './types';
import { createWebFirestoreAdapter } from './adapters/web-firestore.adapter';

type FirestoreAdapterWithRealtime = ReturnType<typeof createWebFirestoreAdapter>;

export type ResolveTargetAdapter = (
  projectKey: FirebaseProjectKey,
  target: Targets,
) => FirestoreAdapterWithRealtime;

export function createTargetCrudTools(resolveTargetAdapter: ResolveTargetAdapter) {
  return {
    async getByPath<T extends Record<string, unknown>>(
      projectKey: FirebaseProjectKey,
      target: Targets,
      docPath: DocPath,
    ): Promise<WithId<T> | null> {
      return getByPath<T>(resolveTargetAdapter(projectKey, target), docPath);
    },

    async listCollection<T extends Record<string, unknown>>(
      projectKey: FirebaseProjectKey,
      target: Targets,
      collectionPath: CollectionPath,
    ): Promise<Array<WithId<T>>> {
      return listByCollection<T>(resolveTargetAdapter(projectKey, target), collectionPath);
    },

    async setByPath<T extends Record<string, unknown>>(
      projectKey: FirebaseProjectKey,
      target: Targets,
      docPath: DocPath,
      data: T,
      setOptions?: SetOptions,
    ): Promise<void> {
      return setByPath<T>(resolveTargetAdapter(projectKey, target), docPath, data, setOptions);
    },

    async addByPath<T extends Record<string, unknown>>(
      projectKey: FirebaseProjectKey,
      target: Targets,
      collectionPath: CollectionPath,
      data: T,
    ): Promise<string> {
      return addByPath<T>(resolveTargetAdapter(projectKey, target), collectionPath, data);
    },

    async updateByPath<T extends Record<string, unknown>>(
      projectKey: FirebaseProjectKey,
      target: Targets,
      docPath: DocPath,
      data: Partial<T>,
    ): Promise<void> {
      return updateByPath<T>(resolveTargetAdapter(projectKey, target), docPath, data);
    },

    async deleteByPath(
      projectKey: FirebaseProjectKey,
      target: Targets,
      docPath: DocPath,
    ): Promise<void> {
      return deleteByPath(resolveTargetAdapter(projectKey, target), docPath);
    },

    async commitBatch(
      projectKey: FirebaseProjectKey,
      target: Targets,
      ops: BatchOp[],
    ): Promise<void> {
      return resolveTargetAdapter(projectKey, target).commitBatch(ops);
    },

    listenDoc$<T extends Record<string, unknown>>(
      projectKey: FirebaseProjectKey,
      target: Targets,
      docPath: DocPath,
    ): Observable<WithId<T> | null> {
      return resolveTargetAdapter(projectKey, target).listenDoc$<T>(docPath);
    },

    listenCollection$<T extends Record<string, unknown>>(
      projectKey: FirebaseProjectKey,
      target: Targets,
      collectionPath: CollectionPath,
      constraints?: QueryConstraint[],
    ): Observable<Array<WithId<T>>> {
      return resolveTargetAdapter(projectKey, target).listenCollection$<T>(
        collectionPath,
        constraints,
      );
    },
  };
}

export function sortDocsByKeys<T>(docs: T[], sortBy: keyof T | Array<keyof T>): T[] {
  const keys = Array.isArray(sortBy) ? sortBy : [sortBy];

  return [...docs].sort((a, b) => {
    for (const key of keys) {
      const aVal = a[key];
      const bVal = b[key];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        const diff = bVal - aVal;
        if (diff !== 0) return diff;
        continue;
      }

      const cmp = String(bVal ?? '').localeCompare(String(aVal ?? ''));
      if (cmp !== 0) return cmp;
    }
    return 0;
  });
}
