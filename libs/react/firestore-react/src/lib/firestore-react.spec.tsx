jest.mock('@portfolio/shared/react/firebase-config-react', () => ({
  getAdapter: jest.fn(() => ({ id: 'mock-adapter' })),
  getEnvironmentOptions: jest.fn((projectKey, target) => ({
    projectKey,
    environment: target,
  })),
}));

jest.mock('@portfolio/shared/firestore', () => ({
  createTargetCrudTools: jest.fn(() => ({
    getByPath: jest.fn(),
    listCollection: jest.fn(),
    setByPath: jest.fn(),
    addByPath: jest.fn(),
    updateByPath: jest.fn(),
    deleteByPath: jest.fn(),
    commitBatch: jest.fn(),
    listenDoc$: jest.fn(),
    listenCollection$: jest.fn(),
  })),
  sortDocsByKeys: jest.fn((docs) => docs),
}));

import { firestoreAddByPath, firestoreGetByPath, firestoreListCollection } from './firestore-react';

describe('Firestore React', () => {
  it('should export firestore functions', () => {
    expect(firestoreGetByPath).toBeDefined();
    expect(firestoreListCollection).toBeDefined();
    expect(firestoreAddByPath).toBeDefined();
  });
});
