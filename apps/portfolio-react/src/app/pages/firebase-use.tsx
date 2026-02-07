import {
  firestoreAddByPath,
  firestoreDeleteByPath,
  firestoreListCollection,
  firestoreUpdateByPath,
  sortDocs,
} from '@portfolio/shared/react/firestore-react';
import React, { useEffect, useState } from 'react';

type TestDoc = {
  id?: string;
  message: string;
  createdAt: number;
  updatedAt?: number;
};

type EnvKey = 'emulator' | 'live';

type LoadState<T> = {
  data: Array<T>;
  isLoading: boolean;
  error: string | null;
};

type SavingState = {
  isSaving: boolean;
  savingError: string | null;
  message: string | null;
};

type EnvEntry = {
  key: EnvKey;
  label: string;
};

const PROJECT_KEY = 'personal-project';
const COLLECTION_PATH = 'test';
const isDev = import.meta.env.DEV;

export function FirebaseUse() {
  const [liveState, setLiveState] = useState<LoadState<TestDoc>>({
    data: [],
    isLoading: true,
    error: null,
  });

  const [emulatorState, setEmulatorState] = useState<LoadState<TestDoc>>({
    data: [],
    isLoading: true,
    error: null,
  });

  const [savingState, setSavingState] = useState<Record<EnvKey, SavingState>>({
    emulator: { isSaving: false, savingError: null, message: null },
    live: { isSaving: false, savingError: null, message: null },
  });

  const envs: EnvEntry[] = [
    { key: 'emulator', label: 'Emulator' },
    { key: 'live', label: 'Production' },
  ];

  const loadCollection = async (target: EnvKey) => {
    try {
      const target_state = target === 'emulator' ? setEmulatorState : setLiveState;
      target_state((prev) => ({ ...prev, isLoading: true }));

      const docs = await firestoreListCollection<TestDoc>(PROJECT_KEY, target, COLLECTION_PATH);

      const sorted = sortDocs<TestDoc>(docs, ['updatedAt', 'createdAt']);

      target_state({
        data: sorted,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const target_state = target === 'emulator' ? setEmulatorState : setLiveState;
      target_state({
        data: [],
        isLoading: false,
        error: formatError(err),
      });
    }
  };

  useEffect(() => {
    loadCollection('live');
    if (isDev) {
      loadCollection('emulator');
    }
  }, []);

  const formatError = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return String(error);
  };

  const beginSaving = (envKey: EnvKey, message: string) => {
    setSavingState((prev) => ({
      ...prev,
      [envKey]: {
        ...prev[envKey],
        isSaving: true,
        savingError: null,
        message,
      },
    }));
  };

  const finishSaving = (envKey: EnvKey) => {
    setSavingState((prev) => ({
      ...prev,
      [envKey]: {
        ...prev[envKey],
        isSaving: false,
        message: null,
      },
    }));
    loadCollection(envKey);
  };

  const failSaving = (envKey: EnvKey, error: unknown) => {
    setSavingState((prev) => ({
      ...prev,
      [envKey]: {
        ...prev[envKey],
        isSaving: false,
        message: null,
        savingError: formatError(error),
      },
    }));
  };

  const addDoc = async (env: EnvEntry) => {
    beginSaving(env.key, 'Sending new document');
    try {
      await firestoreAddByPath<TestDoc>(PROJECT_KEY, env.key, COLLECTION_PATH, {
        message: `Hello from React (${env.label}) @ ${new Date().toLocaleTimeString()}`,
        createdAt: Date.now(),
      });
      finishSaving(env.key);
    } catch (err) {
      failSaving(env.key, err);
    }
  };

  const quickEdit = async (env: EnvEntry, item: TestDoc) => {
    const docRef = `${COLLECTION_PATH}/${item.id}`;
    beginSaving(env.key, 'Updating document');
    try {
      await firestoreUpdateByPath<TestDoc>(PROJECT_KEY, env.key, docRef, {
        message: `${item.message}|`,
        updatedAt: Date.now(),
      });
      finishSaving(env.key);
    } catch (err) {
      failSaving(env.key, err);
    }
  };

  const deleteDoc = async (env: EnvEntry, item: TestDoc) => {
    const docRef = `${COLLECTION_PATH}/${item.id}`;
    beginSaving(env.key, 'Deleting document');
    try {
      await firestoreDeleteByPath(PROJECT_KEY, env.key, docRef);
      finishSaving(env.key);
    } catch (err) {
      failSaving(env.key, err);
    }
  };

  return (
    <div>
      {envs.map((env) =>
        env.key !== 'emulator' || isDev ? (
          <React.Fragment key={env.key}>
            <section>
              <h2>{env.label}</h2>

              {(() => {
                const vm = env.key === 'emulator' ? emulatorState : liveState;
                const envState = savingState[env.key];

                if (vm.isLoading) {
                  return <p>Loading {env.label} data…</p>;
                } else if (vm.error) {
                  return (
                    <p style={{ color: 'red' }}>
                      Error loading {env.label}: {vm.error}
                    </p>
                  );
                } else {
                  return (
                    <div>
                      <div>
                        <button onClick={() => addDoc(env)}>Add document</button>
                        <span>
                          Live docs: <b>{vm.data.length}</b>
                        </span>
                      </div>

                      {envState.isSaving && (
                        <p>
                          Saving to {env.label}… {envState.message}
                        </p>
                      )}
                      {envState.savingError && (
                        <p style={{ color: 'red' }}>Save error: {envState.savingError}</p>
                      )}

                      {vm.data.map((item) => (
                        <div key={item.id}>
                          <div>{item.message}</div>
                          <div>
                            <button onClick={() => quickEdit(env, item)}>Quick edit</button>
                            <button onClick={() => deleteDoc(env, item)}>Delete</button>
                          </div>
                        </div>
                      ))}

                      <details>
                        <summary>Raw JSON</summary>
                        <pre>{JSON.stringify(vm.data, null, 2)}</pre>
                      </details>
                    </div>
                  );
                }
              })()}
            </section>
            <hr />
          </React.Fragment>
        ) : null,
      )}
    </div>
  );
}

export default FirebaseUse;
