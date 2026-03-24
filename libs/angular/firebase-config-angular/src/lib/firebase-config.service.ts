import { Injectable, Signal } from '@angular/core';

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
  docs: Signal<T[]>;
  sortedDocs: Signal<T[]>;
};

type FirestoreAdapterWithRealtime = ReturnType<typeof createWebFirestoreAdapter>;

@Injectable({
  providedIn: 'root',
})
export class FirebaseConfigService {
  getAdapter(options?: FirestoreTargetOptions): FirestoreAdapterWithRealtime {
    return getSharedAdapter(options);
  }

  getEnvironmentOptions(projectKey: FirebaseProjectKey, target: Targets): FirestoreTargetOptions {
    return getSharedEnvironmentOptions(projectKey, target);
  }
}
