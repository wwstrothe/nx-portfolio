import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

import {
  getAuthClient,
  getFirebaseClients,
  getFirestoreClient,
} from './firebase-clients';

import type { FirebaseProjectKey, WorkspaceConfig } from '@portfolio/shared/config';

/* ======================================================
   Test config
   ====================================================== */

const testConfig: WorkspaceConfig = {
  firebase: {
    emulators: {
      enabled: true,
      firestore: { host: 'localhost', port: 8080 },
      auth: { host: 'localhost', port: 9099 },
    },
    projects: {
      'personal-project': {
        apiKey: 'key',
        authDomain: 'domain',
        projectId: 'project',
        storageBucket: 'bucket',
        messagingSenderId: 'sender',
        appId: 'app',
        measurementId: 'measurement',
      },
    },
  },
};

/* ======================================================
   Firebase SDK mocks (INLINE – no hoisting issues)
   ====================================================== */

const mockApp = { name: 'portfolio' } as FirebaseApp;
const mockFirestore = {} as Firestore;
const mockAuth = {} as Auth;

jest.mock('firebase/app', () => ({
  getApps: jest.fn(() => []),
  initializeApp: jest.fn(() => mockApp),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => mockFirestore),
  connectFirestoreEmulator: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => mockAuth),
  connectAuthEmulator: jest.fn(),
}));

/* ======================================================
   Helpers (support flexible signatures safely)
   ====================================================== */

function callGetFirebaseClients(
  projectKey: FirebaseProjectKey,
  config: WorkspaceConfig,
  allowEmulators?: boolean
) {
  return (getFirebaseClients as any)(
    projectKey,
    config,
    allowEmulators === undefined ? undefined : { allowEmulators }
  );
}

function callGetFirestoreClient(
  projectKey: FirebaseProjectKey,
  allowEmulators?: boolean
) {
  return (getFirestoreClient as any)(
    projectKey,
    allowEmulators === undefined ? undefined : { allowEmulators }
  );
}

function callGetAuthClient(
  projectKey: FirebaseProjectKey,
  allowEmulators?: boolean
) {
  return (getAuthClient as any)(
    projectKey,
    allowEmulators === undefined ? undefined : { allowEmulators }
  );
}

/* ======================================================
   Tests
   ====================================================== */

describe('firebase-clients', () => {
  const projectKey = Object.keys(
    testConfig.firebase.projects
  )[0] as FirebaseProjectKey;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes firebase app, firestore, and auth for a project', () => {
    const clients = callGetFirebaseClients(projectKey, testConfig, false);

    expect(clients.app).toBe(mockApp);
    expect(clients.firestore).toBe(mockFirestore);
    expect(clients.auth).toBe(mockAuth);
  });

  it('caches clients per project key', () => {
    const first = callGetFirebaseClients(projectKey, testConfig, false);
    const second = callGetFirebaseClients(projectKey, testConfig, false);

    expect(first).toBe(second);
  });

  it('connects to firestore and auth emulators when enabled', async () => {
    const { connectFirestoreEmulator } = await import('firebase/firestore');
    const { connectAuthEmulator } = await import('firebase/auth');

    callGetFirebaseClients(projectKey, testConfig, true);

    expect(connectFirestoreEmulator).toHaveBeenCalledWith(
      mockFirestore,
      'localhost',
      8080
    );

    expect(connectAuthEmulator).toHaveBeenCalledWith(
      mockAuth,
      'http://localhost:9099',
      { disableWarnings: true }
    );
  });

  it('returns firestore client directly', () => {
    callGetFirebaseClients(projectKey, testConfig, false);

    const firestore = callGetFirestoreClient(projectKey, false);
    expect(firestore).toBe(mockFirestore);
  });

  it('returns auth client directly', () => {
    callGetFirebaseClients(projectKey, testConfig, false);

    const auth = callGetAuthClient(projectKey, false);
    expect(auth).toBe(mockAuth);
  });

  it('throws if firebase project config is missing', () => {
    const missingKey = 'missing-project' as FirebaseProjectKey;

    expect(() =>
      callGetFirebaseClients(missingKey, testConfig, false)
    ).toThrow(`Firebase config missing for project: ${missingKey}`);
  });
});
