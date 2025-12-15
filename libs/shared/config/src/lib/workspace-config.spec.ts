import { workspaceConfig } from './workspace-config';

describe('workspaceConfig', () => {
  it('should define firebase configuration', () => {
    expect(workspaceConfig.firebase).toBeDefined();
  });

  it('should define emulator configuration', () => {
    const emulators = workspaceConfig.firebase.emulators;

    expect(typeof emulators.enabled).toBe('boolean');
    expect(emulators.firestore).toEqual(
      expect.objectContaining({
        host: expect.any(String),
        port: expect.any(Number),
      })
    );
    expect(emulators.auth).toEqual(
      expect.objectContaining({
        host: expect.any(String),
        port: expect.any(Number),
      })
    );
  });

  it('should define at least one firebase project', () => {
    const projects = workspaceConfig.firebase.projects;

    expect(Object.keys(projects).length).toBeGreaterThan(0);
  });

  it('each firebase project should have required fields', () => {
    Object.values(workspaceConfig.firebase.projects).forEach((project) => {
      expect(project).toEqual(
        expect.objectContaining({
          apiKey: expect.any(String),
          authDomain: expect.any(String),
          projectId: expect.any(String),
          storageBucket: expect.any(String),
          messagingSenderId: expect.any(String),
          appId: expect.any(String),
          measurementId: expect.any(String),
        })
      );
    });
  });
});
