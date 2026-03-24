import { FirebaseProjectKey } from '@portfolio/shared/config';
import {
  getAdapter as getSharedAdapter,
  getEnvironmentOptions as getSharedEnvironmentOptions,
  type FirestoreTargetOptions,
  type Targets,
} from '@portfolio/shared/firestore';
import { createWebFirestoreAdapter } from '@portfolio/shared/firestore';

export type { Targets, FirestoreTargetOptions };

export type EnvVm<T> = {
  key: Targets;
  label: string;
  docs: T[];
  sortedDocs: T[];
};

type FirestoreAdapterWithRealtime = ReturnType<typeof createWebFirestoreAdapter>;

export function getAdapter(options?: FirestoreTargetOptions): FirestoreAdapterWithRealtime {
  return getSharedAdapter(options);
}

export function getEnvironmentOptions(
  projectKey: FirebaseProjectKey,
  target: Targets,
): FirestoreTargetOptions {
  return getSharedEnvironmentOptions(projectKey, target);
}
