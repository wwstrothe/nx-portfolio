import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from 'firebase/firestore';

import type {
  FirebaseProjectKey,
  WorkspaceConfig,
} from '@portfolio/shared/config';
import { workspaceConfig } from '@portfolio/shared/config';

type Clients = {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
};

type GetClientsOptions = {
  allowEmulators?: boolean;
};

type ClientMode = 'emulator' | 'live';
type ClientKey = `${FirebaseProjectKey}::${ClientMode}`;

const clientsByKey = new Map<ClientKey, Clients>();

function appName(projectKey: FirebaseProjectKey, mode: ClientMode): string {
  return `${projectKey}::${mode}`;
}

function initAppForProject(
  config: WorkspaceConfig,
  projectKey: FirebaseProjectKey,
  mode: ClientMode
): FirebaseApp {
  const projectConfig = config.firebase.projects[projectKey];
  if (!projectConfig)
    throw new Error(`Firebase config missing for project: ${projectKey}`);

  const name = appName(projectKey, mode);
  const existing = getApps().find((app) => app.name === name);
  return existing ?? initializeApp(projectConfig, name);
}

function connectEmulatorsIfNeeded(
  config: WorkspaceConfig,
  firestore: Firestore,
  auth: Auth
): void {
  const emulator = config.firebase.emulators;
  if (!emulator.enabled) return;

  connectFirestoreEmulator(firestore, emulator.firestore.host, emulator.firestore.port);

  connectAuthEmulator(auth, `http://${emulator.auth.host}:${emulator.auth.port}`, {
    disableWarnings: true,
  });
}

export function getFirebaseClients(
  projectKey: FirebaseProjectKey,
  config: WorkspaceConfig = workspaceConfig,
  options: GetClientsOptions = {}
): Clients {
  const allowEmulators = options.allowEmulators ?? false;
  const mode: ClientMode = allowEmulators ? 'emulator' : 'live';
  const key = `${projectKey}::${mode}` as ClientKey;

  const existing = clientsByKey.get(key);
  if (existing) return existing;

  const app = initAppForProject(config, projectKey, mode);
  const firestore = getFirestore(app);
  const auth = getAuth(app);

  if (mode === 'emulator') {
    // only connect emulator for emulator-mode clients
    connectEmulatorsIfNeeded(config, firestore, auth);
  }

  const clients: Clients = { app, firestore, auth };
  clientsByKey.set(key, clients);
  return clients;
}

export function getFirestoreClient(
  projectKey: FirebaseProjectKey,
  options?: GetClientsOptions
): Firestore {
  return getFirebaseClients(projectKey, workspaceConfig, options).firestore;
}

export function getAuthClient(
  projectKey: FirebaseProjectKey,
  options?: GetClientsOptions
): Auth {
  return getFirebaseClients(projectKey, workspaceConfig, options).auth;
}
