import { WorkspaceConfig } from './workspace-config.model';

export const workspaceConfig = {
  firebase: {
    emulators: {
      enabled: true,
      firestore: { host: 'localhost', port: 8080 },
      auth: { host: 'localhost', port: 9099 },
    },

    projects: {
      'personal-project': {
        apiKey: 'AIzaSyDy1Ym-5y42tsfkpOQUIqWDYisf8rqFgsk',
        authDomain: 'personal-project-da68a.firebaseapp.com',
        projectId: 'personal-project-da68a',
        storageBucket: 'personal-project-da68a.firebasestorage.app',
        messagingSenderId: '369124476464',
        appId: '1:369124476464:web:b75365ccb657079f52cff5',
        measurementId: 'G-YGMV58046K',
      },
    },
  },
} as const satisfies WorkspaceConfig;
