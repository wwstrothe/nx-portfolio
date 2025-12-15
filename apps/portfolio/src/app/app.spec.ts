import { JsonPipe } from '@angular/common';
import { signal } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { App } from './app';

// --- Keep Firebase/Firestore OUT of the component tests -----------------------

type TestDoc = {
  message: string;
  createdAt: number;
  updatedAt?: number;
};

type TestDocWithId = TestDoc & { id: string };

type EnvKey = 'emulator' | 'prod';

type EnvVm = {
  key: EnvKey;
  label: string;
  tools: any | null;
  docs: ReturnType<typeof signal<TestDocWithId[]>>;
  sortedDocs: unknown;
};

const getFirestoreClientMock = jest.fn();
const createWebFirestoreAdapterMock = jest.fn();
const createCollectionToolsMock = jest.fn();

jest.mock('@portfolio/shared/firebase-core', () => ({
  getFirestoreClient: (...args: unknown[]) => getFirestoreClientMock(...args),
}));

jest.mock('@portfolio/shared/firestore', () => ({
  createWebFirestoreAdapter: (...args: unknown[]) =>
    createWebFirestoreAdapterMock(...args),
  createCollectionTools: (...args: unknown[]) => createCollectionToolsMock(...args),
}));

describe('App', () => {
  let emulatorDocsSig: ReturnType<typeof signal<TestDocWithId[]>>;
  let prodDocsSig: ReturnType<typeof signal<TestDocWithId[]>>;

  let emulatorTools: { docs: typeof emulatorDocsSig; add: jest.Mock; update: jest.Mock; remove: jest.Mock };
  let prodTools: { docs: typeof prodDocsSig; add: jest.Mock; update: jest.Mock; remove: jest.Mock };

  beforeEach(async () => {
    jest.clearAllMocks();

    emulatorDocsSig = signal<TestDocWithId[]>([]);
    prodDocsSig = signal<TestDocWithId[]>([]);

    emulatorTools = {
      docs: emulatorDocsSig,
      add: jest.fn(async () => undefined),
      update: jest.fn(async () => undefined),
      remove: jest.fn(async () => undefined),
    };

    prodTools = {
      docs: prodDocsSig,
      add: jest.fn(async () => undefined),
      update: jest.fn(async () => undefined),
      remove: jest.fn(async () => undefined),
    };

    // getFirestoreClient(projectKey, { allowEmulators })
    getFirestoreClientMock.mockImplementation(
      (_projectKey: unknown, opts?: { allowEmulators?: boolean }) => ({
        __firestore: true,
        allowEmulators: !!opts?.allowEmulators,
      })
    );

    // createWebFirestoreAdapter(firestore) -> adapter marker
    createWebFirestoreAdapterMock.mockImplementation((firestore: any) => ({
      __adapter: true,
      allowEmulators: !!firestore?.allowEmulators,
    }));

    // createCollectionTools({ db, collectionPath, initialValue }) -> our fake tools
    createCollectionToolsMock.mockImplementation((args: any) => {
      if (args?.db?.allowEmulators) return emulatorTools;
      return prodTools;
    });

    await TestBed.configureTestingModule({
      imports: [App, JsonPipe],
    }).compileComponents();
  });

  it('renders both columns and initializes tools (emulator + prod) in dev mode', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    // two db clients: emulator + prod
    expect(getFirestoreClientMock).toHaveBeenCalledTimes(2);
    expect(getFirestoreClientMock).toHaveBeenCalledWith('personal-project', {
      allowEmulators: true,
    });
    expect(getFirestoreClientMock).toHaveBeenCalledWith('personal-project', {
      allowEmulators: false,
    });

    // two adapters
    expect(createWebFirestoreAdapterMock).toHaveBeenCalledTimes(2);

    // two toolsets
    expect(createCollectionToolsMock).toHaveBeenCalledTimes(2);
    expect(createCollectionToolsMock.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        collectionPath: 'test',
        initialValue: [],
      })
    );
    expect(createCollectionToolsMock.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        collectionPath: 'test',
        initialValue: [],
      })
    );

    const h2s = fixture.debugElement.queryAll(By.css('h2'));
    expect(h2s.map((d) => d.nativeElement.textContent.trim())).toEqual([
      'Emulator',
      'Production',
    ]);

    // One "Add document" button per env section (no docs yet, so no quick edit/delete)
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons).toHaveLength(2);
    expect(buttons[0].nativeElement.textContent).toContain('Add document');
    expect(buttons[1].nativeElement.textContent).toContain('Add document');

    const liveCounts = fixture.debugElement.queryAll(By.css('span b'));
    expect(liveCounts.map((d) => d.nativeElement.textContent.trim())).toEqual(['0', '0']);
  });

  it('updates the Emulator column when emulator docs signal changes', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    emulatorDocsSig.set([{ id: 'e1', message: 'hello emulator', createdAt: 1 }]);
    fixture.detectChanges();

    // component-level view model uses the tools.docs signal, so it should reflect it
    const envs = fixture.componentInstance.envs as unknown as EnvVm[];
    const emulatorEnv = envs.find((e) => e.key === 'emulator')!;
    const prodEnv = envs.find((e) => e.key === 'prod')!;

    expect(emulatorEnv.docs()).toEqual([{ id: 'e1', message: 'hello emulator', createdAt: 1 }]);
    expect(prodEnv.docs()).toEqual([]);

    // Live docs counts should be [1, 0]
    const liveCounts = fixture.debugElement.queryAll(By.css('span b'));
    expect(liveCounts.map((d) => d.nativeElement.textContent.trim())).toEqual(['1', '0']);
  });

  it('updates the Production column when prod docs signal changes', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    prodDocsSig.set([{ id: 'p1', message: 'hello prod', createdAt: 2 }]);
    fixture.detectChanges();

    const envs = fixture.componentInstance.envs as unknown as EnvVm[];
    const emulatorEnv = envs.find((e) => e.key === 'emulator')!;
    const prodEnv = envs.find((e) => e.key === 'prod')!;

    expect(prodEnv.docs()).toEqual([{ id: 'p1', message: 'hello prod', createdAt: 2 }]);
    expect(emulatorEnv.docs()).toEqual([]);

    const liveCounts = fixture.debugElement.queryAll(By.css('span b'));
    expect(liveCounts.map((d) => d.nativeElement.textContent.trim())).toEqual(['0', '1']);
  });

  it('clicking Emulator "Add document" calls env.tools.add with expected payload', fakeAsync(() => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const envs = fixture.componentInstance.envs as any[];
    const emulatorEnv = envs.find((e) => e.key === 'emulator');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    // first section is Emulator
    buttons[0].triggerEventHandler('click', new MouseEvent('click'));
    tick(); // resolve async addDoc()

    expect(emulatorTools.add).toHaveBeenCalledTimes(1);

    const [payload] = emulatorTools.add.mock.calls[0] as [TestDoc];
    expect(payload).toEqual(
      expect.objectContaining({
        message: expect.stringContaining('Hello from Angular (Emulator)'),
        createdAt: expect.any(Number),
      })
    );

    // sanity: we really clicked emulator env
    expect(emulatorEnv.label).toBe('Emulator');
    expect(prodTools.add).not.toHaveBeenCalled();
  }));

  it('clicking Production "Add document" calls env.tools.add with expected payload', fakeAsync(() => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const envs = fixture.componentInstance.envs as any[];
    const prodEnv = envs.find((e) => e.key === 'prod');

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    // second section is Production
    buttons[1].triggerEventHandler('click', new MouseEvent('click'));
    tick();

    expect(prodTools.add).toHaveBeenCalledTimes(1);

    const [payload] = prodTools.add.mock.calls[0] as [TestDoc];
    expect(payload).toEqual(
      expect.objectContaining({
        message: expect.stringContaining('Hello from Angular (Production)'),
        createdAt: expect.any(Number),
      })
    );

    expect(prodEnv.label).toBe('Production');
    expect(emulatorTools.add).not.toHaveBeenCalled();
  }));

  it('renders Quick edit / Delete buttons when docs exist and calls update/remove', fakeAsync(() => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    // Put one doc in prod so we get the two action buttons rendered inside that section
    prodDocsSig.set([{ id: 'p1', message: 'm1', createdAt: 1 }]);
    fixture.detectChanges();

    // Buttons now:
    // - 2x "Add document"
    // - 1x "Quick edit" (for p1)
    // - 1x "Delete" (for p1)
    const allButtons = fixture.debugElement.queryAll(By.css('button'));
    const texts = allButtons.map((b) => b.nativeElement.textContent.trim());
    expect(texts).toEqual(
      expect.arrayContaining(['Add document', 'Add document', 'Quick edit', 'Delete'])
    );

    // Click Quick edit then Delete (for the prod item)
    const quickEditBtn = allButtons.find(
      (b) => b.nativeElement.textContent.trim() === 'Quick edit'
    )!;
    const deleteBtn = allButtons.find(
      (b) => b.nativeElement.textContent.trim() === 'Delete'
    )!;

    quickEditBtn.triggerEventHandler('click', new MouseEvent('click'));
    tick();

    expect(prodTools.update).toHaveBeenCalledTimes(1);
    expect(prodTools.update.mock.calls[0][0]).toBe('p1');
    expect(prodTools.update.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        message: 'm1|',
        updatedAt: expect.any(Number),
      })
    );

    deleteBtn.triggerEventHandler('click', new MouseEvent('click'));
    tick();

    expect(prodTools.remove).toHaveBeenCalledTimes(1);
    expect(prodTools.remove).toHaveBeenCalledWith('p1');
  }));

  it('destroy does not throw', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    expect(() => fixture.destroy()).not.toThrow();
  });
});
