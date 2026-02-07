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
