export type FirebaseEmulatorHost = {
  host: string;
  port: number;
};

export type FirebaseEmulatorsConfig = {
  enabled: boolean;
  firestore: FirebaseEmulatorHost;
  auth: FirebaseEmulatorHost;
};

export type FirebaseWebAppConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

export type FirebaseProjectKey = 'personal-project'

export type FirebaseProjectsMap = Record<FirebaseProjectKey, FirebaseWebAppConfig>;

export type WorkspaceConfig = {
  firebase: {
    emulators: FirebaseEmulatorsConfig;
    projects: FirebaseProjectsMap;
  };
};
