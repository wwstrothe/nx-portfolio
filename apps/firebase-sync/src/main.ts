import { workspaceConfig, type FirebaseProjectKey } from '@portfolio/shared/config';
import express from 'express';
import { getFirestore, type Target } from './firebase-admin';

const DEFAULT_ALLOWED_ORIGINS = [
  'http://localhost:4200',
  'http://localhost:4201',
  'https://william-strothe.pages.dev',
  'https://william-strothe-react.pages.dev',
  'https://beta.william-strothe.pages.dev',
  'https://beta.william-strothe-react.pages.dev',
];

function getAllowedOrigins(): string[] {
  const configuredOrigins = process.env.ALLOWED_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins?.length ? configuredOrigins : DEFAULT_ALLOWED_ORIGINS;
}

function isOriginAllowed(origin: string, allowedOrigins: string[]): boolean {
  return allowedOrigins.some((allowedOrigin) => {
    if (!allowedOrigin.includes('*')) {
      return allowedOrigin === origin;
    }

    try {
      const requestUrl = new URL(origin);
      const allowedUrl = new URL(allowedOrigin);

      if (requestUrl.protocol !== allowedUrl.protocol) {
        return false;
      }

      const allowedHost = allowedUrl.hostname;
      if (!allowedHost.startsWith('*.')) {
        return false;
      }

      const suffix = allowedHost.slice(1);
      return requestUrl.hostname.endsWith(suffix) && requestUrl.hostname !== allowedHost.slice(2);
    } catch {
      return false;
    }
  });
}

function getDefaultTarget(): Target {
  const configuredTarget = process.env.FIREBASE_TARGET as Target | undefined;

  if (configuredTarget === 'emulator') {
    return configuredTarget;
  }

  if (configuredTarget && configuredTarget in workspaceConfig.firebase.projects) {
    return configuredTarget;
  }

  return process.env.NODE_ENV === 'production' ? 'personal-project' : 'emulator';
}

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();

  if (origin && isOriginAllowed(origin, allowedOrigins)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});

const port = process.env.PORT ? Number(process.env.PORT) : 3333;
const CONTACT_SUBMISSIONS_COLLECTION = 'contact-submissions';

type ContactSubmissionInput = {
  name: unknown;
  email: unknown;
  message: unknown;
};

type ContactSubmission = {
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

function parseContactSubmission(body: unknown): { data?: ContactSubmission; error?: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Invalid request body' };
  }

  const input = body as ContactSubmissionInput;
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';

  if (!name || name.length < 2 || name.length > 80) {
    return { error: 'Name must be between 2 and 80 characters' };
  }

  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Email must be a valid email address' };
  }

  if (!message || message.length < 10 || message.length > 2000) {
    return { error: 'Message must be between 10 and 2000 characters' };
  }

  return {
    data: {
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    },
  };
}

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

/**
 * Returns allowed targets.
 * In prod you’ll later remove "emulator" from this list server-side.
 */
app.get('/targets', (_req, res) => {
  const projectKeys = Object.keys(workspaceConfig.firebase.projects) as FirebaseProjectKey[];
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
  if (!target) return res.status(400).json({ error: 'Missing query param: target' });

  try {
    const db = getFirestore(target);
    const collections = await db.listCollections();
    res.json({ target, collections: collections.map((c) => c.id) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

/**
 * Accepts contact form submissions and stores them in Firestore.
 * POST /contact?target=emulator
 */
app.post('/contact', async (req, res) => {
  const target = (req.query.target as Target | undefined) ?? getDefaultTarget();
  const parsed = parseContactSubmission(req.body);

  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  try {
    const db = getFirestore(target);
    const docRef = await db
      .collection(CONTACT_SUBMISSIONS_COLLECTION)
      .add(parsed.data as ContactSubmission);

    return res.status(201).json({
      id: docRef.id,
      target,
      createdAt: parsed.data?.createdAt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
});

/**
 * Lists most recent contact form submissions for debugging/development.
 * GET /contact/submissions?target=emulator&limit=20
 */
app.get('/contact/submissions', async (req, res) => {
  const target = (req.query.target as Target | undefined) ?? getDefaultTarget();
  const requestedLimit = Number(req.query.limit ?? 20);
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 100)
    : 20;

  try {
    const db = getFirestore(target);
    const snapshot = await db
      .collection(CONTACT_SUBMISSIONS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const submissions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.json({ target, count: submissions.length, submissions });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`firebase-sync listening on http://localhost:${port}`);
});
