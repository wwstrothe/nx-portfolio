import type { FirebaseProjectKey } from '@portfolio/shared/config';

import {
  CollectionPath,
  createTargetCrudTools,
  DocPath,
  SetOptions,
  sortDocsByKeys,
  WithId,
  type BatchOp,
} from '@portfolio/shared/firestore';

import {
  getAdapter,
  getEnvironmentOptions,
  type Targets,
} from '@portfolio/shared/react/firebase-config-react';

const targetCrud = createTargetCrudTools((projectKey, target) => {
  const options = getEnvironmentOptions(projectKey, target);
  return getAdapter(options);
});

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
  docPath: DocPath,
): Promise<WithId<T> | null> {
  return targetCrud.getByPath<T>(projectKey, target, docPath);
}

/**
 * List all documents in a collection
 */
export async function firestoreListCollection<T extends Record<string, unknown>>(
  projectKey: FirebaseProjectKey,
  target: Targets,
  collectionPath: CollectionPath,
): Promise<Array<WithId<T>>> {
  return targetCrud.listCollection<T>(projectKey, target, collectionPath);
}

/**
 * Set a document (create or overwrite)
 */
export async function firestoreSetByPath<T extends Record<string, unknown>>(
  projectKey: FirebaseProjectKey,
  target: Targets,
  docPath: DocPath,
  data: T,
  setOptions?: SetOptions,
): Promise<void> {
  return targetCrud.setByPath(projectKey, target, docPath, data, setOptions);
}

/**
 * Add a new document to a collection (auto-generates ID)
 */
export async function firestoreAddByPath<T extends Record<string, unknown>>(
  projectKey: FirebaseProjectKey,
  target: Targets,
  collectionPath: CollectionPath,
  data: T,
): Promise<string> {
  return targetCrud.addByPath<T>(projectKey, target, collectionPath, data);
}

/**
 * Update specific fields of a document
 */
export async function firestoreUpdateByPath<T extends Record<string, unknown>>(
  projectKey: FirebaseProjectKey,
  target: Targets,
  docPath: DocPath,
  data: Partial<T>,
): Promise<void> {
  return targetCrud.updateByPath<T>(projectKey, target, docPath, data);
}

/**
 * Delete a document
 */
export async function firestoreDeleteByPath(
  projectKey: FirebaseProjectKey,
  target: Targets,
  docPath: DocPath,
): Promise<void> {
  return targetCrud.deleteByPath(projectKey, target, docPath);
}

/**
 * Commit multiple operations in a batch
 */
export async function firestoreCommitBatch(
  projectKey: FirebaseProjectKey,
  target: Targets,
  ops: BatchOp[],
): Promise<void> {
  return targetCrud.commitBatch(projectKey, target, ops);
}

/**
 * Sort documents by one or more fields
 * Sorts in descending order (newest first)
 */
export function sortDocs<T>(docs: T[], sortBy: keyof T | Array<keyof T>): T[] {
  return sortDocsByKeys(docs, sortBy);
}

/**
 * Get collection listeners for both production and emulator environments
 * Returns promises that resolve once data is loaded
 */
export async function firestoreListCollectionEnvironmentPair<T extends Record<string, unknown>>(
  projectKey: FirebaseProjectKey,
  target: Targets,
  collectionPath: CollectionPath,
): Promise<{
  prod: Array<WithId<T>>;
  emulator: Array<WithId<T>> | null;
}> {
  const prod = await firestoreListCollection<T>(projectKey, 'live', collectionPath);

  const emulator = target
    ? await firestoreListCollection<T>(projectKey, 'emulator', collectionPath)
    : null;

  return { prod, emulator };
}

export type { Targets } from '@portfolio/shared/react/firebase-config-react';
