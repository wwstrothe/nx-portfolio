import {
  workspaceConfig,
  type FirebaseProjectKey,
} from '@portfolio/shared/config';
import express from 'express';
import { getFirestore, type Target } from './firebase-admin';

const app = express();
app.use(express.json());

const port = process.env.PORT ? Number(process.env.PORT) : 3333;

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

/**
 * Returns allowed targets.
 * In prod you’ll later remove "emulator" from this list server-side.
 */
app.get('/targets', (_req, res) => {
  const projectKeys = Object.keys(
    workspaceConfig.firebase.projects
  ) as FirebaseProjectKey[];
  res.json({
    targets: ['emulator', ...projectKeys],
  });
});

/**
 * Lists TOP-LEVEL collection names for a target.
 * /collections?target=emulator
 * /collections?target=personal-project
 */
app.get('/collections', async (req, res) => {
  const target = req.query.target as Target | undefined;
  if (!target)
    return res.status(400).json({ error: 'Missing query param: target' });

  try {
    const db = getFirestore(target);
    const collections = await db.listCollections();
    res.json({ target, collections: collections.map((c) => c.id) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`firebase-sync listening on http://localhost:${port}`);
});
