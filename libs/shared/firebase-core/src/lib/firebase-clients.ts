import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from 'firebase/firestore';

import type {
  FirebaseProjectKey,
  WorkspaceConfig,
} from '@portfolio/shared/config';
import { workspaceConfig } from '@portfolio/shared/config';

/* ======================================================
   Types
   ====================================================== */

type Clients = {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
};

type GetClientsOptions = {
  /**
   * HARD gate.
   * Should be true only in local dev (ex: Angular isDevMode()).
   * If false, emulators will NEVER be connected.
   */
  allowEmulators?: boolean;
};

/* ======================================================
   Caches
   ====================================================== */

const clientsByProject = new Map<FirebaseProjectKey, Clients>();

// Emulator connections are GLOBAL per runtime
let firestoreEmulatorConnected = false;
let authEmulatorConnected = false;

/* ======================================================
   Internal helpers
   ====================================================== */

function initAppForProject(
  config: WorkspaceConfig,
  projectKey: FirebaseProjectKey
): FirebaseApp {
  const projectConfig = config.firebase.projects[projectKey];
  if (!projectConfig) {
    throw new Error(`Firebase config missing for project: ${projectKey}`);
  }

  const existing = getApps().find((a) => a.name === projectKey);
  return existing ?? initializeApp(projectConfig, projectKey);
}

function connectEmulatorsOnce(
  config: WorkspaceConfig,
  firestore: Firestore,
  auth: Auth,
  allowEmulators: boolean
): void {
  // HARD STOP: never connect in prod / non-dev
  if (!allowEmulators) return;

  const emulator = config.firebase.emulators;

  // SOFT STOP: dev allowed, but emulators disabled in config
  if (!emulator.enabled) return;

  if (!firestoreEmulatorConnected) {
    connectFirestoreEmulator(
      firestore,
      emulator.firestore.host,
      emulator.firestore.port
    );
    firestoreEmulatorConnected = true;
  }

  if (!authEmulatorConnected) {
    connectAuthEmulator(
      auth,
      `http://${emulator.auth.host}:${emulator.auth.port}`,
      {
        disableWarnings: true,
      }
    );
    authEmulatorConnected = true;
  }
}

/* ======================================================
   Public API
   ====================================================== */

export function getFirebaseClients(
  projectKey: FirebaseProjectKey,
  config: WorkspaceConfig = workspaceConfig,
  options: GetClientsOptions = {}
): Clients {
  const existing = clientsByProject.get(projectKey);
  if (existing) return existing;

  const app = initAppForProject(config, projectKey);
  const firestore = getFirestore(app);
  const auth = getAuth(app);

  connectEmulatorsOnce(
    config,
    firestore,
    auth,
    options.allowEmulators ?? false
  );

  const clients: Clients = { app, firestore, auth };
  clientsByProject.set(projectKey, clients);
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
