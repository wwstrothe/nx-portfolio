import type { Observable } from 'rxjs';
import { Observable as RxObservable } from 'rxjs';

import type { Firestore } from 'firebase/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  writeBatch,
  type DocumentData,
  type QueryConstraint,
  type Unsubscribe,
} from 'firebase/firestore';

import type { BatchAdapter, BatchOp } from '../batch';
import type { FirestoreAdapter, SetOptions, WithId } from '../types';

function withId<T>(id: string, data: T): WithId<T> {
  return { ...(data as object), id } as WithId<T>;
}

function toFirestoreSetOptions(options?: SetOptions) {
  return options ? { merge: options.merge } : undefined;
}

export type { QueryConstraint };
export function createWebFirestoreAdapter(db: Firestore): FirestoreAdapter &
  BatchAdapter & {
    listenDoc$<T extends Record<string, unknown>>(
      docPath: string
    ): Observable<WithId<T> | null>;
    listenCollection$<T extends Record<string, unknown>>(
      collectionPath: string,
      constraints?: QueryConstraint[]
    ): Observable<Array<WithId<T>>>;
  } {
  return {
    async getDoc<T extends Record<string, unknown>>(
      path: string
    ): Promise<WithId<T> | null> {
      const ref = doc(db, path); // DocumentReference<DocumentData>
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      return withId<T>(snap.id, snap.data() as T);
    },

    async setDoc<T extends Record<string, unknown>>(
      path: string,
      data: T,
      options?: SetOptions
    ): Promise<void> {
      const ref = doc(db, path);
      const fsOpts = toFirestoreSetOptions(options);
      if (fsOpts) await setDoc(ref, data as unknown as DocumentData, fsOpts);
      else await setDoc(ref, data as unknown as DocumentData);
    },

    async addDoc<T extends Record<string, unknown>>(
      collectionPath: string,
      data: T
    ): Promise<string> {
      const ref = collection(db, collectionPath);
      const docRef = await addDoc(ref, data as unknown as DocumentData);
      return docRef.id;
    },

    async updateDoc<T extends Record<string, unknown>>(
      path: string,
      data: Partial<T>
    ): Promise<void> {
      const ref = doc(db, path);
      await updateDoc(ref, data as unknown as Partial<DocumentData>);
    },

    async deleteDoc(path: string): Promise<void> {
      await deleteDoc(doc(db, path));
    },

    async listCollection<T extends Record<string, unknown>>(
      path: string
    ): Promise<Array<WithId<T>>> {
      const snap = await getDocs(collection(db, path));
      return snap.docs.map((d) => withId<T>(d.id, d.data() as T));
    },

    async commitBatch(ops: BatchOp[]): Promise<void> {
      const batch = writeBatch(db);

      for (const op of ops) {
        const ref = doc(db, op.path);

        if (op.type === 'set') {
          const fsOpts = toFirestoreSetOptions(op.options);
          if (fsOpts)
            batch.set(ref, op.data as unknown as DocumentData, fsOpts);
          else batch.set(ref, op.data as unknown as DocumentData);
        } else if (op.type === 'update') {
          batch.update(ref, op.data as unknown as Partial<DocumentData>);
        } else {
          batch.delete(ref);
        }
      }

      await batch.commit();
    },

    listenDoc$<T extends Record<string, unknown>>(
      docPath: string
    ): Observable<WithId<T> | null> {
      return new RxObservable<WithId<T> | null>((subscriber) => {
        const ref = doc(db, docPath);

        const unsub: Unsubscribe = onSnapshot(
          ref,
          (snap) => {
            if (!snap.exists()) subscriber.next(null);
            else subscriber.next(withId<T>(snap.id, snap.data() as T));
          },
          (err) => subscriber.error(err)
        );

        return () => unsub();
      });
    },

    listenCollection$<T extends Record<string, unknown>>(
      collectionPath: string,
      constraints: QueryConstraint[] = []
    ): Observable<Array<WithId<T>>> {
      return new RxObservable<Array<WithId<T>>>((subscriber) => {
        const base = collection(db, collectionPath);
        const q = constraints.length
          ? query(base, ...constraints)
          : query(base);

        const unsub: Unsubscribe = onSnapshot(
          q,
          (snap) =>
            subscriber.next(
              snap.docs.map((d) => withId<T>(d.id, d.data() as T))
            ),
          (err) => subscriber.error(err)
        );

        return () => unsub();
      });
    },
  };
}
