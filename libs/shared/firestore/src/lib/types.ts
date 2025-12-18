export type DocPath = string;        // e.g. "users/abc"
export type CollectionPath = string; // e.g. "users"

export type WithId<T> = T & { id: string };

export type SetOptions = {
  merge?: boolean;
};

/**
 * Minimal Firestore contract we can implement for:
 * - Web SDK (Angular/browser)
 * - Admin SDK (Node tool)
 *
 * Keep it SDK-agnostic: plain objects in/out.
 */
export interface FirestoreAdapter {
  getDoc<T extends Record<string, unknown>>(path: DocPath): Promise<WithId<T> | null>;

  setDoc<T extends Record<string, unknown>>(
    path: DocPath,
    data: T,
    options?: SetOptions
  ): Promise<void>;

  addDoc<T extends Record<string, unknown>>(
    collectionPath: CollectionPath,
    data: T
  ): Promise<string>;

  updateDoc<T extends Record<string, unknown>>(
    path: DocPath,
    data: Partial<T>
  ): Promise<void>;

  deleteDoc(path: DocPath): Promise<void>;

  listCollection<T extends Record<string, unknown>>(
    path: CollectionPath
  ): Promise<Array<WithId<T>>>;
}
