import type { Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { Observable } from 'rxjs';

import { QueryConstraint } from 'firebase/firestore';
import type { FirestoreAdapter, WithId } from './types';

type ListenCollection = <T extends Record<string, unknown>>(
  collectionPath: string,
  constraints?: QueryConstraint[]
) => Observable<Array<WithId<T>>>;

type DbWithListen = FirestoreAdapter & { listenCollection$: ListenCollection };

export function createCollectionTools<T extends Record<string, unknown>>(args: {
  db: DbWithListen;
  collectionPath: string;
  constraints?: QueryConstraint[];
  initialValue?: Array<WithId<T>>;
}) {
  const { db, collectionPath } = args;

  const docs: Signal<Array<WithId<T>>> = toSignal(
    db.listenCollection$<T>(collectionPath, args.constraints ?? []),
    { initialValue: (args.initialValue ?? []) as Array<WithId<T>> }
  );

  const add = async (doc: T) => {
    const id = crypto.randomUUID();
    await db.setDoc(`${collectionPath}/${id}`, doc);
    return id;
  };

  const update = async (id: string, patch: Partial<T>) => {
    await db.updateDoc<T>(`${collectionPath}/${id}`, patch);
  };

  const remove = async (id: string) => {
    await db.deleteDoc(`${collectionPath}/${id}`);
  };

  return { docs, add, update, remove } as const;
}
