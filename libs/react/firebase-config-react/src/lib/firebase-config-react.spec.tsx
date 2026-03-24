jest.mock('@portfolio/shared/firebase-core', () => ({
  getFirestoreClient: jest.fn(() => ({})),
}));

jest.mock('@portfolio/shared/firestore', () => ({
  getAdapter: jest.fn(() => ({ id: 'mock-adapter' })),
  getEnvironmentOptions: jest.fn((projectKey, target) => ({
    projectKey,
    environment: target,
  })),
  createWebFirestoreAdapter: jest.fn(() => ({ id: 'mock-adapter' })),
}));

import { getAdapter, getEnvironmentOptions } from './firebase-config-react';

describe('Firebase Config React', () => {
  it('should get adapter with default options', () => {
    const adapter = getAdapter();
    expect(adapter).toBeTruthy();
  });

  it('should get environment options', () => {
    const options = getEnvironmentOptions('personal-project', 'live');
    expect(options.projectKey).toBe('personal-project');
    expect(options.environment).toBe('live');
  });

  it('should resolve emulator environment', () => {
    const options = getEnvironmentOptions('personal-project', 'emulator');
    expect(options.environment).toBe('emulator');
  });
});
