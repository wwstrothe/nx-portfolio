import type {
  CollectionPath,
  DocPath,
  FirestoreAdapter,
  SetOptions,
  WithId,
} from './types';

export async function getByPath<T extends Record<string, unknown>>(
  db: FirestoreAdapter,
  docPath: DocPath
): Promise<WithId<T> | null> {
  return db.getDoc<T>(docPath);
}

export async function setByPath<T extends Record<string, unknown>>(
  db: FirestoreAdapter,
  docPath: DocPath,
  data: T,
  options?: SetOptions
): Promise<void> {
  return db.setDoc<T>(docPath, data, options);
}

export async function addByPath<T extends Record<string, unknown>>(
  db: FirestoreAdapter,
  collectionPath: CollectionPath,
  data: T
): Promise<string> {
  return db.addDoc<T>(collectionPath, data);
}

export async function updateByPath<T extends Record<string, unknown>>(
  db: FirestoreAdapter,
  docPath: DocPath,
  data: Partial<T>
): Promise<void> {
  return db.updateDoc<T>(docPath, data);
}

export async function deleteByPath(
  db: FirestoreAdapter,
  docPath: DocPath
): Promise<void> {
  return db.deleteDoc(docPath);
}

export async function listByCollection<T extends Record<string, unknown>>(
  db: FirestoreAdapter,
  collectionPath: CollectionPath
): Promise<Array<WithId<T>>> {
  return db.listCollection<T>(collectionPath);
}
