import { workspaceConfig, type FirebaseProjectKey } from '@portfolio/shared/config';
import admin from 'firebase-admin';

export type Target = 'emulator' | FirebaseProjectKey;

const adminApps = new Map<Target, admin.app.App>();
const firestoreClients = new Map<Target, admin.firestore.Firestore>();

function getDefaultWorkspaceProjectId(): string {
  const firstProject = Object.values(workspaceConfig.firebase.projects)[0];
  if (!firstProject) {
    throw new Error('No Firebase projects are configured in workspaceConfig');
  }

  return firstProject.projectId;
}

function getOrInitAdminApp(target: Target): admin.app.App {
  const existing = adminApps.get(target);
  if (existing) return existing;

  const app =
    target === 'emulator'
      ? admin.initializeApp({ projectId: getDefaultWorkspaceProjectId() }, 'emulator')
      : admin.initializeApp(
          {
            credential: admin.credential.applicationDefault(),
            projectId: workspaceConfig.firebase.projects[target].projectId,
          },
          target,
        );

  adminApps.set(target, app);
  return app;
}

export function getFirestore(target: Target): admin.firestore.Firestore {
  const existing = firestoreClients.get(target);
  if (existing) return existing;

  const app = getOrInitAdminApp(target);
  const db = app.firestore();

  if (target === 'emulator') {
    // Keep emulator host explicit for Admin SDK calls in local development.
    process.env.FIRESTORE_EMULATOR_HOST = `${workspaceConfig.firebase.emulators.firestore.host}:${workspaceConfig.firebase.emulators.firestore.port}`;
    db.settings({
      host: `${workspaceConfig.firebase.emulators.firestore.host}:${workspaceConfig.firebase.emulators.firestore.port}`,
      ssl: false,
    });
  }

  firestoreClients.set(target, db);
  return db;
}
