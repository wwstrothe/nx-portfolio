import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

import {
  getAuthClient,
  getFirebaseClients,
  getFirestoreClient,
} from './firebase-clients';

import type {
  FirebaseProjectKey,
  WorkspaceConfig,
} from '@portfolio/shared/config';

/* ======================================================
   Firebase SDK mocks
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
   Tests
   ====================================================== */

describe('firebase-clients', () => {
  const projectKey = 'portfolio' as FirebaseProjectKey;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes firebase app, firestore, and auth for a project', () => {
    const clients = getFirebaseClients(projectKey, testConfig);

    expect(clients.app).toBe(mockApp);
    expect(clients.firestore).toBe(mockFirestore);
    expect(clients.auth).toBe(mockAuth);
  });

  it('caches clients per project key', () => {
    const first = getFirebaseClients(projectKey, testConfig);
    const second = getFirebaseClients(projectKey, testConfig);

    expect(first).toBe(second);
  });

  it('connects to firestore and auth emulators when enabled', async () => {
    const { connectFirestoreEmulator } = await import('firebase/firestore');
    const { connectAuthEmulator } = await import('firebase/auth');

    getFirebaseClients(projectKey, testConfig);

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
    const firestore = getFirestoreClient(projectKey);
    expect(firestore).toBe(mockFirestore);
  });

  it('returns auth client directly', () => {
    const auth = getAuthClient(projectKey);
    expect(auth).toBe(mockAuth);
  });

  it('throws if firebase project config is missing', () => {
    const badConfig: WorkspaceConfig = {
      firebase: {
        emulators: testConfig.firebase.emulators,
        projects: {
          'personal-project': {
            apiKey: '',
            authDomain: '',
            projectId: '',
            storageBucket: '',
            messagingSenderId: '',
            appId: '',
            measurementId: undefined,
          },
        },
      },
    };

    expect(() => getFirebaseClients(projectKey, badConfig)).toThrow(
      'Firebase config missing for project: portfolio'
    );
  });
});
