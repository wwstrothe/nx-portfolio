import { Injectable } from '@angular/core';
import type { QueryConstraint } from 'firebase/firestore';

import { FirebaseProjectKey, workspaceConfig } from '@portfolio/shared/config';
import { getFirestoreClient } from '@portfolio/shared/firebase-core';
import {
  CollectionPath,
  createCollectionTools,
  createWebFirestoreAdapter,
  deleteByPath,
  DocPath,
  getByPath,
  listByCollection,
  setByPath,
  SetOptions,
  updateByPath,
  WithId,
} from '@portfolio/shared/firestore';

export type FirestoreEnvironment = 'production' | 'emulator';

export type FirestoreTargetOptions = {
  projectKey?: FirebaseProjectKey;
  useEmulator?: boolean;
  environment?: FirestoreEnvironment;
};

export type FirestoreCollectionToolsOptions<T extends Record<string, unknown>> =
  FirestoreTargetOptions & {
    collectionPath: CollectionPath;
    constraints?: QueryConstraint[];
    initialValue?: Array<WithId<T>>;
  };

const projectKeys = Object.keys(workspaceConfig.firebase.projects) as FirebaseProjectKey[];
const DEFAULT_PROJECT_KEY: FirebaseProjectKey = projectKeys[0] ?? 'personal-project';

type FirestoreAdapterWithRealtime = ReturnType<typeof createWebFirestoreAdapter>;
type AdapterKey = `${FirebaseProjectKey}::${FirestoreEnvironment}`;

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private readonly adapters = new Map<AdapterKey, FirestoreAdapterWithRealtime>();

  private getAdapterKey(projectKey: FirebaseProjectKey, environment: FirestoreEnvironment) {
    return `${projectKey}::${environment}` as AdapterKey;
  }

  private resolveEnvironment(options?: FirestoreTargetOptions): FirestoreEnvironment {
    if (options?.useEmulator !== undefined) {
      return options.useEmulator ? 'emulator' : 'production';
    }

    if (options?.environment) {
      return options.environment;
    }

    return 'production';
  }

  private resolveProjectKey(options?: FirestoreTargetOptions): FirebaseProjectKey {
    return options?.projectKey ?? DEFAULT_PROJECT_KEY;
  }

  private getAdapter(options?: FirestoreTargetOptions): FirestoreAdapterWithRealtime {
    const environment = this.resolveEnvironment(options);
    const projectKey = this.resolveProjectKey(options);

    const key = this.getAdapterKey(projectKey, environment);
    const existing = this.adapters.get(key);
    if (existing) return existing;

    const firestore = getFirestoreClient(projectKey, {
      allowEmulators: environment === 'emulator',
    });

    const adapter = createWebFirestoreAdapter(firestore);
    this.adapters.set(key, adapter);
    return adapter;
  }

  createCollectionTools<T extends Record<string, unknown>>(
    options: FirestoreCollectionToolsOptions<T>
  ) {
    const adapter = this.getAdapter(options);
    return createCollectionTools<T>({
      db: adapter,
      collectionPath: options.collectionPath,
      constraints: options.constraints,
      initialValue: options.initialValue,
    });
  }

  async getByPath<T extends Record<string, unknown>>(
    docPath: DocPath,
    options?: FirestoreTargetOptions
  ): Promise<WithId<T> | null> {
    return getByPath<T>(this.getAdapter(options), docPath);
  }

  async setByPath<T extends Record<string, unknown>>(
    docPath: DocPath,
    data: T,
    options?: FirestoreTargetOptions & { setOptions?: SetOptions }
  ): Promise<void> {
    const adapter = this.getAdapter(options);
    return setByPath<T>(adapter, docPath, data, options?.setOptions);
  }

  async updateByPath<T extends Record<string, unknown>>(
    docPath: DocPath,
    data: Partial<T>,
    options?: FirestoreTargetOptions
  ): Promise<void> {
    return updateByPath<T>(this.getAdapter(options), docPath, data);
  }

  async deleteByPath(docPath: DocPath, options?: FirestoreTargetOptions): Promise<void> {
    return deleteByPath(this.getAdapter(options), docPath);
  }

  async listCollection<T extends Record<string, unknown>>(
    collectionPath: CollectionPath,
    options?: FirestoreTargetOptions
  ): Promise<Array<WithId<T>>> {
    return listByCollection<T>(this.getAdapter(options), collectionPath);
  }
}
