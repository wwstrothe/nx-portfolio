import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { App } from './app';

// --- Mocks (keep Firebase out of component tests) -----------------------------

type TestDoc = { message: string; createdAt: number };
type WithId<T> = T & { id: string };

type SetDocFn = (path: string, data: unknown, options?: unknown) => Promise<void>;

const getFirestoreClientMock = jest.fn();

const listenEmulator$ = new Subject<Array<WithId<TestDoc>>>();
const listenProd$ = new Subject<Array<WithId<TestDoc>>>();

const emulatorSetDocMock = jest.fn<ReturnType<SetDocFn>, Parameters<SetDocFn>>(
  async () => undefined
);
const prodSetDocMock = jest.fn<ReturnType<SetDocFn>, Parameters<SetDocFn>>(
  async () => undefined
);

const createWebFirestoreAdapterMock = jest.fn();

jest.mock('@portfolio/shared/firebase-core', () => ({
  getFirestoreClient: (...args: unknown[]) => getFirestoreClientMock(...args),
}));

jest.mock('@portfolio/shared/firestore', () => ({
  createWebFirestoreAdapter: (...args: unknown[]) =>
    createWebFirestoreAdapterMock(...args),
}));

describe('App', () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    // Ensure crypto exists (some jsdom environments stub it strangely)
    if (!globalThis.crypto) {
      const { webcrypto } = await import('node:crypto');
      (globalThis as any).crypto = webcrypto as any;
    }

    // Ensure randomUUID exists and is stable for tests
    if (!('randomUUID' in globalThis.crypto)) {
      Object.defineProperty(globalThis.crypto, 'randomUUID', {
        value: jest.fn(() => 'uuid-123'),
        writable: true,
      });
    } else {
      jest.spyOn(globalThis.crypto as any, 'randomUUID').mockReturnValue('uuid-123');
    }

    // Return two different "firestore" markers depending on allowEmulators
    getFirestoreClientMock.mockImplementation(
      (_projectKey: unknown, opts?: { allowEmulators?: boolean }) => ({
        __firestore: true,
        allowEmulators: !!opts?.allowEmulators,
      })
    );

    // Return two different adapters depending on allowEmulators
    createWebFirestoreAdapterMock.mockImplementation((firestore: any) => {
      if (firestore?.allowEmulators) {
        return {
          listenCollection$: jest.fn(() => listenEmulator$.asObservable()),
          setDoc: emulatorSetDocMock,
        };
      }
      return {
        listenCollection$: jest.fn(() => listenProd$.asObservable()),
        setDoc: prodSetDocMock,
      };
    });

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('renders both columns and starts listening to both collections', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    // It should create two firestore clients: emulator + prod
    expect(getFirestoreClientMock).toHaveBeenCalledTimes(2);

    expect(getFirestoreClientMock).toHaveBeenCalledWith('personal-project', {
      allowEmulators: true,
    });
    expect(getFirestoreClientMock).toHaveBeenCalledWith('personal-project', {
      allowEmulators: false,
    });

    const h2s = fixture.debugElement.queryAll(By.css('h2'));
    expect(h2s.map((d) => d.nativeElement.textContent.trim())).toEqual([
      'Emulator',
      'Production',
    ]);

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons).toHaveLength(2);
    expect(buttons[0].nativeElement.textContent).toContain('Emulator');
    expect(buttons[1].nativeElement.textContent).toContain('Prod');
  });

  it('updates emulatorDocs when emulator listener emits', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    listenEmulator$.next([
      { id: 'e1', message: 'hello emulator', createdAt: 1 },
    ]);
    fixture.detectChanges();

    expect(fixture.componentInstance.emulatorDocs()).toEqual([
      { id: 'e1', message: 'hello emulator', createdAt: 1 },
    ]);

    expect(fixture.componentInstance.prodDocs()).toEqual([]);
  });

  it('updates prodDocs when prod listener emits', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    listenProd$.next([{ id: 'p1', message: 'hello prod', createdAt: 2 }]);
    fixture.detectChanges();

    expect(fixture.componentInstance.prodDocs()).toEqual([
      { id: 'p1', message: 'hello prod', createdAt: 2 },
    ]);

    expect(fixture.componentInstance.emulatorDocs()).toEqual([]);
  });

  it(
    'clicking emulator button calls setDoc on emulator adapter with test/{uuid}',
    fakeAsync(() => {
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('button'));

      // Trigger click through Angular
      buttons[0].triggerEventHandler('click', new MouseEvent('click'));
      fixture.detectChanges();

      // Flush the Promise from setDoc
      tick();

      expect(emulatorSetDocMock).toHaveBeenCalledTimes(1);

      const calls = emulatorSetDocMock.mock.calls as Array<[string, any, any?]>;
      const [path, payload] = calls[0];

      expect(path).toBe('test/uuid-123');
      expect(payload).toEqual(
        expect.objectContaining({
          message: expect.stringContaining('Hello from Angular (Emulator)'),
          createdAt: expect.any(Number),
        })
      );

      expect(prodSetDocMock).not.toHaveBeenCalled();
    })
  );

  it(
    'clicking prod button calls setDoc on prod adapter with test/{uuid}',
    fakeAsync(() => {
      const fixture = TestBed.createComponent(App);
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('button'));

      buttons[1].triggerEventHandler('click', new MouseEvent('click'));
      fixture.detectChanges();

      tick();

      expect(prodSetDocMock).toHaveBeenCalledTimes(1);

      const calls = prodSetDocMock.mock.calls as Array<[string, any, any?]>;
      const [path, payload] = calls[0];

      expect(path).toBe('test/uuid-123');
      expect(payload).toEqual(
        expect.objectContaining({
          message: expect.stringContaining('Hello from Angular (Prod)'),
          createdAt: expect.any(Number),
        })
      );

      expect(emulatorSetDocMock).not.toHaveBeenCalled();
    })
  );

  it('unsubscribes both listeners on destroy', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const component = fixture.componentInstance as any;

    const emulatorUnsub = jest.fn();
    const prodUnsub = jest.fn();

    // Replace internal subs with our spies
    component.emulatorSub = { unsubscribe: emulatorUnsub };
    component.prodSub = { unsubscribe: prodUnsub };

    fixture.destroy();

    expect(emulatorUnsub).toHaveBeenCalledTimes(1);
    expect(prodUnsub).toHaveBeenCalledTimes(1);
  });
});
