import { type FirebaseProjectKey, workspaceConfig } from '@portfolio/shared/config';
import { getFirestoreClient } from '@portfolio/shared/firebase-core';

import { createWebFirestoreAdapter } from './adapters/web-firestore.adapter';

export type Targets = 'live' | 'emulator';

export type FirestoreTargetOptions = {
  projectKey?: FirebaseProjectKey;
  useEmulator?: boolean;
  environment?: Targets;
};

type FirestoreAdapterWithRealtime = ReturnType<typeof createWebFirestoreAdapter>;
type AdapterKey = `${FirebaseProjectKey}::${Targets}`;

const projectKeys = Object.keys(workspaceConfig.firebase.projects) as FirebaseProjectKey[];
const DEFAULT_PROJECT_KEY: FirebaseProjectKey = projectKeys[0] ?? 'personal-project';

const adapters = new Map<AdapterKey, FirestoreAdapterWithRealtime>();

function getAdapterKey(projectKey: FirebaseProjectKey, environment: Targets): AdapterKey {
  return `${projectKey}::${environment}` as AdapterKey;
}

function resolveEnvironment(options?: FirestoreTargetOptions): Targets {
  if (options?.useEmulator !== undefined) {
    return options.useEmulator ? 'emulator' : 'live';
  }

  if (options?.environment) {
    return options.environment;
  }

  return 'live';
}

function resolveProjectKey(options?: FirestoreTargetOptions): FirebaseProjectKey {
  return options?.projectKey ?? DEFAULT_PROJECT_KEY;
}

export function getAdapter(options?: FirestoreTargetOptions): FirestoreAdapterWithRealtime {
  const environment = resolveEnvironment(options);
  const projectKey = resolveProjectKey(options);

  const key = getAdapterKey(projectKey, environment);
  const existing = adapters.get(key);
  if (existing) return existing;

  const firestore = getFirestoreClient(projectKey, {
    allowEmulators: environment === 'emulator',
  });

  const adapter = createWebFirestoreAdapter(firestore);
  adapters.set(key, adapter);
  return adapter;
}

/**
 * Get environment-aware options.
 * In dev mode: uses emulator
 * In prod mode: uses production (emulator falls back to prod)
 */
export function getEnvironmentOptions(
  projectKey: FirebaseProjectKey,
  target: Targets,
): FirestoreTargetOptions {
  return {
    projectKey,
    environment: target === 'emulator' ? 'emulator' : 'live',
  };
}
