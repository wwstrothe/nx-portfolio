import { Injectable, Signal } from '@angular/core';

import { FirebaseProjectKey, workspaceConfig } from '@portfolio/shared/config';
import { getFirestoreClient } from '@portfolio/shared/firebase-core';
import { createWebFirestoreAdapter } from '@portfolio/shared/firestore';

export type Targets = 'live' | 'emulator';

export type EnvVm<T> = {
  key: Targets;
  label: string;
  docs: Signal<T[]>;
  sortedDocs: Signal<T[]>;
};

export type FirestoreTargetOptions = {
  projectKey?: FirebaseProjectKey;
  useEmulator?: boolean;
  environment?: Targets;
};

type FirestoreAdapterWithRealtime = ReturnType<
  typeof createWebFirestoreAdapter
>;
type AdapterKey = `${FirebaseProjectKey}::${Targets}`;

const projectKeys = Object.keys(
  workspaceConfig.firebase.projects
) as FirebaseProjectKey[];
const DEFAULT_PROJECT_KEY: FirebaseProjectKey =
  projectKeys[0] ?? 'personal-project';

@Injectable({
  providedIn: 'root',
})
export class FirebaseConfigService {
  private readonly adapters = new Map<
    AdapterKey,
    FirestoreAdapterWithRealtime
  >();

  private getAdapterKey(
    projectKey: FirebaseProjectKey,
    environment: Targets
  ): AdapterKey {
    return `${projectKey}::${environment}` as AdapterKey;
  }

  private resolveEnvironment(options?: FirestoreTargetOptions): Targets {
    if (options?.useEmulator !== undefined) {
      return options.useEmulator ? 'emulator' : 'live';
    }

    if (options?.environment) {
      return options.environment;
    }

    return 'live';
  }

  private resolveProjectKey(
    options?: FirestoreTargetOptions
  ): FirebaseProjectKey {
    return options?.projectKey ?? DEFAULT_PROJECT_KEY;
  }

  getAdapter(options?: FirestoreTargetOptions): FirestoreAdapterWithRealtime {
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

  /**
   * Get environment-aware options.
   * In dev mode: uses emulator
   * In prod mode: uses production (emulator falls back to prod)
   */
  getEnvironmentOptions(
    projectKey: FirebaseProjectKey,
    target: Targets
  ): FirestoreTargetOptions {
    return {
      projectKey,
      environment: target === 'emulator' ? 'emulator' : 'live',
    };
  }
}
