import type { Signal } from '@angular/core';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import type { FirebaseProjectKey } from '@portfolio/shared/config';
import type { QueryConstraint } from 'firebase/firestore';
import { defer, from, type Observable } from 'rxjs';

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
  FirebaseConfigService,
  type FirestoreTargetOptions,
  type Targets,
} from '@portfolio/shared/angular/firebase-config-angular';

export type FirestoreCollectionToolsOptions<T extends Record<string, unknown>> =
  FirestoreTargetOptions & {
    collectionPath: CollectionPath;
    constraints?: QueryConstraint[];
    initialValue?: Array<WithId<T>>;
  };

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private readonly configService = inject(FirebaseConfigService);

  /**
   * Convert a collection listener to a Signal.
   * Useful for streaming data with automatic signal conversion.
   */
  listenCollectionAsSignal<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    collectionPath: CollectionPath,
    constraints?: QueryConstraint[]
  ): Signal<Array<WithId<T>>> {
    return toSignal(
      this.listenCollection$<T>(
        projectKey,
        target,
        collectionPath,
        constraints
      ),
      { initialValue: [] as Array<WithId<T>> }
    );
  }

  async getByPath<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    docPath: DocPath
  ): Promise<WithId<T> | null> {
    const options = this.configService.getEnvironmentOptions(
      projectKey,
      target
    );
    return getByPath<T>(this.configService.getAdapter(options), docPath);
  }

  async listCollection<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    collectionPath: CollectionPath
  ): Promise<Array<WithId<T>>> {
    const options = this.configService.getEnvironmentOptions(
      projectKey,
      target
    );
    return listByCollection<T>(
      this.configService.getAdapter(options),
      collectionPath
    );
  }

  async setByPath<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    docPath: DocPath,
    data: T,
    setOptions?: SetOptions
  ): Promise<void> {
    const options = this.configService.getEnvironmentOptions(
      projectKey,
      target
    );
    const adapter = this.configService.getAdapter(options);
    return setByPath<T>(adapter, docPath, data, setOptions);
  }

  async addByPath<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    collectionPath: CollectionPath,
    data: T
  ): Promise<string> {
    const options = this.configService.getEnvironmentOptions(
      projectKey,
      target
    );
    return addByPath<T>(
      this.configService.getAdapter(options),
      collectionPath,
      data
    );
  }

  async updateByPath<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    docPath: DocPath,
    data: Partial<T>
  ): Promise<void> {
    const options = this.configService.getEnvironmentOptions(
      projectKey,
      target
    );
    return updateByPath<T>(
      this.configService.getAdapter(options),
      docPath,
      data
    );
  }

  async deleteByPath(
    projectKey: FirebaseProjectKey,
    target: Targets,
    docPath: DocPath
  ): Promise<void> {
    const options = this.configService.getEnvironmentOptions(
      projectKey,
      target
    );
    return deleteByPath(this.configService.getAdapter(options), docPath);
  }

  async commitBatch(
    projectKey: FirebaseProjectKey,
    target: Targets,
    ops: BatchOp[]
  ): Promise<void> {
    const options = this.configService.getEnvironmentOptions(
      projectKey,
      target
    );
    return this.configService.getAdapter(options).commitBatch(ops);
  }

  listenDoc$<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    docPath: DocPath
  ): Observable<WithId<T> | null> {
    const options = this.configService.getEnvironmentOptions(
      projectKey,
      target
    );
    return this.configService.getAdapter(options).listenDoc$<T>(docPath);
  }

  listenCollection$<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    collectionPath: CollectionPath,
    constraints?: QueryConstraint[]
  ): Observable<Array<WithId<T>>> {
    const options = this.configService.getEnvironmentOptions(
      projectKey,
      target
    );
    return this.configService
      .getAdapter(options)
      .listenCollection$<T>(collectionPath, constraints);
  }

  setByPath$<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    docPath: DocPath,
    data: T,
    setOptions?: SetOptions
  ): Observable<void> {
    return defer(() =>
      from(this.setByPath(projectKey, target, docPath, data, setOptions))
    );
  }

  addByPath$<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    collectionPath: CollectionPath,
    data: T
  ): Observable<string> {
    return defer(() =>
      from(this.addByPath(projectKey, target, collectionPath, data))
    );
  }

  updateByPath$<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    docPath: DocPath,
    data: Partial<T>
  ): Observable<void> {
    return defer(() =>
      from(this.updateByPath(projectKey, target, docPath, data))
    );
  }

  deleteByPath$(
    projectKey: FirebaseProjectKey,
    target: Targets,
    docPath: DocPath
  ): Observable<void> {
    return defer(() => from(this.deleteByPath(projectKey, target, docPath)));
  }

  commitBatch$(
    projectKey: FirebaseProjectKey,
    target: Targets,
    ops: BatchOp[]
  ): Observable<void> {
    return defer(() => from(this.commitBatch(projectKey, target, ops)));
  }

  sortDocs<T>(docs: T[], sortBy: keyof T | Array<keyof T>): T[] {
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
   * Setup environment-aware collection signals for both prod and emulator.
   * Emulator automatically falls back to production if not in dev mode.
   */
  listenCollectionAsEnvironmentPair<T extends Record<string, unknown>>(
    projectKey: FirebaseProjectKey,
    target: Targets,
    collectionPath: CollectionPath,
    constraints?: QueryConstraint[]
  ): {
    prod: Signal<Array<WithId<T>>>;
    emulator: Signal<Array<WithId<T>>> | null;
  } {
    const prod = this.listenCollectionAsSignal<T>(
      projectKey,
      'live',
      collectionPath,
      constraints
    );

    const emulator = target
      ? this.listenCollectionAsSignal<T>(
          projectKey,
          'emulator',
          collectionPath,
          constraints
        )
      : null;

    return { prod, emulator };
  }
}
