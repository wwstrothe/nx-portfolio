import type { FirebaseProjectKey } from '@portfolio/shared/config';

import {
    addByPath,
    CollectionPath,
    deleteByPath,
    DocPath,
    getByPath,
    listByCollection,
    setByPath,
    SetOptions,
    updateByPath,
    WithId,
    type BatchOp,
} from '@portfolio/shared/firestore';

import {
    getAdapter,
    getEnvironmentOptions,
    type Targets,
} from '@portfolio/shared/react/firebase-config-react';

/**
 * Firestore utilities for React
 * These are async functions (no Observables like Angular)
 * For real-time updates, use custom hooks that build on top of these
 */

/**
 * Get a single document by path
 */
export async function firestoreGetByPath<T extends Record<string, unknown>>(
  projectKey: FirebaseProjectKey,
  target: Targets,
  docPath: DocPath
): Promise<WithId<T> | null> {
  const options = getEnvironmentOptions(projectKey, target);
  return getByPath<T>(getAdapter(options), docPath);
}

/**
 * List all documents in a collection
 */
export async function firestoreListCollection<
  T extends Record<string, unknown>
>(
  projectKey: FirebaseProjectKey,
  target: Targets,
  collectionPath: CollectionPath
): Promise<Array<WithId<T>>> {
  const options = getEnvironmentOptions(projectKey, target);
  return listByCollection<T>(getAdapter(options), collectionPath);
}

/**
 * Set a document (create or overwrite)
 */
export async function firestoreSetByPath<T extends Record<string, unknown>>(
  projectKey: FirebaseProjectKey,
  target: Targets,
  docPath: DocPath,
  data: T,
  setOptions?: SetOptions
): Promise<void> {
  const options = getEnvironmentOptions(projectKey, target);
  const adapter = getAdapter(options);
  return setByPath<T>(adapter, docPath, data, setOptions);
}

/**
 * Add a new document to a collection (auto-generates ID)
 */
export async function firestoreAddByPath<T extends Record<string, unknown>>(
  projectKey: FirebaseProjectKey,
  target: Targets,
  collectionPath: CollectionPath,
  data: T
): Promise<string> {
  const options = getEnvironmentOptions(projectKey, target);
  return addByPath<T>(getAdapter(options), collectionPath, data);
}

/**
 * Update specific fields of a document
 */
export async function firestoreUpdateByPath<T extends Record<string, unknown>>(
  projectKey: FirebaseProjectKey,
  target: Targets,
  docPath: DocPath,
  data: Partial<T>
): Promise<void> {
  const options = getEnvironmentOptions(projectKey, target);
  return updateByPath<T>(getAdapter(options), docPath, data);
}

/**
 * Delete a document
 */
export async function firestoreDeleteByPath(
  projectKey: FirebaseProjectKey,
  target: Targets,
  docPath: DocPath
): Promise<void> {
  const options = getEnvironmentOptions(projectKey, target);
  return deleteByPath(getAdapter(options), docPath);
}

/**
 * Commit multiple operations in a batch
 */
export async function firestoreCommitBatch(
  projectKey: FirebaseProjectKey,
  target: Targets,
  ops: BatchOp[]
): Promise<void> {
  const options = getEnvironmentOptions(projectKey, target);
  return getAdapter(options).commitBatch(ops);
}

/**
 * Sort documents by one or more fields
 * Sorts in descending order (newest first)
 */
export function sortDocs<T>(docs: T[], sortBy: keyof T | Array<keyof T>): T[] {
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

/**
 * Get collection listeners for both production and emulator environments
 * Returns promises that resolve once data is loaded
 */
export async function firestoreListCollectionEnvironmentPair<
  T extends Record<string, unknown>
>(
  projectKey: FirebaseProjectKey,
  target: Targets,
  collectionPath: CollectionPath
): Promise<{
  prod: Array<WithId<T>>;
  emulator: Array<WithId<T>> | null;
}> {
  const prod = await firestoreListCollection<T>(
    projectKey,
    'live',
    collectionPath
  );

  const emulator = target
    ? await firestoreListCollection<T>(projectKey, 'emulator', collectionPath)
    : null;

  return { prod, emulator };
}

export type { Targets } from '@portfolio/shared/react/firebase-config-react';
