import { JsonPipe } from '@angular/common';
import { Component, DestroyRef, inject, isDevMode, Signal, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FirestoreService } from '@portfolio/shared/angular/firestore-angular';
import { catchError, finalize, map, of, startWith } from 'rxjs';

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
  vm: Signal<LoadState<TestDoc>>;
};

const PROJECT_KEY = 'personal-project',
  COLLECTION_PATH = 'test';

@Component({
  selector: 'portfolio-firebase-use',
  imports: [JsonPipe],
  template: `
    <div>
      @for (env of envs; track env.key) {
        @if (env.key !== 'emulator' || isDev) {
          @let vm = env.vm(); @let envState = state()[env.key];
          <section>
            <h2>{{ env.label }}</h2>

            @if (vm.isLoading) {
              <p>Loading {{ env.label }} data…</p>
            } @else if (vm.error) {
              <p class="error">Error loading {{ env.label }}: {{ vm.error }}</p>
            } @else {
              <div>
                <button (click)="addDoc(env)">Add document</button>
                <span
                  >Live docs: <b>{{ vm.data.length }}</b></span
                >
              </div>

              @if (envState.isSaving) {
                <p>Saving to {{ env.label }}… {{ envState.message }}</p>
              }
              @if (envState.savingError) {
                <p class="error">Save error: {{ envState.savingError }}</p>
              }
              @for (item of vm.data; track item.id) {
                <div>
                  <div>{{ item.message }}</div>
                  <div>
                    <button (click)="quickEdit(env, item)">Quick edit</button>
                    <button (click)="deleteDoc(env, item)">Delete</button>
                  </div>
                </div>
              }

              <details>
                <summary>Raw JSON</summary>
                <pre>{{ vm.data | json }}</pre>
              </details>
            }
          </section>
        }
        <hr />
      }
    </div>
  `,
})
export default class FirebaseUse {
  private readonly firestoreService = inject(FirestoreService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly isDev = isDevMode();

  protected state = signal<Record<EnvKey, SavingState>>({
    emulator: { isSaving: false, savingError: null, message: null },
    live: { isSaving: false, savingError: null, message: null },
  });

  private readonly liveVm = this.createCollectionVm('live');
  private readonly emulatorVm = this.isDev ? this.createCollectionVm('emulator') : this.liveVm;

  readonly envs: EnvEntry[] = [
    { key: 'emulator', label: 'Emulator', vm: this.emulatorVm },
    { key: 'live', label: 'Production', vm: this.liveVm },
  ];

  private createCollectionVm(target: EnvKey): Signal<LoadState<TestDoc>> {
    const stream$ = this.firestoreService
      .listenCollection$<TestDoc>(PROJECT_KEY, target, COLLECTION_PATH)
      .pipe(
        map((docs) => ({
          data: this.firestoreService.sortDocs<TestDoc>(docs, ['updatedAt', 'createdAt']),
          isLoading: false,
          error: null,
        })),
        startWith<LoadState<TestDoc>>({
          data: [],
          isLoading: true,
          error: null,
        }),
        catchError((err) =>
          of<LoadState<TestDoc>>({
            data: [],
            isLoading: false,
            error: this.formatError(err),
          }),
        ),
      );

    return toSignal(stream$, {
      initialValue: { data: [], isLoading: true, error: null },
    });
  }

  private beginSaving(envKey: EnvKey, message: string) {
    this.state.update((prev) => ({
      ...prev,
      [envKey]: {
        ...prev[envKey],
        isSaving: true,
        savingError: null,
        message,
      },
    }));
  }

  private finishSaving(envKey: EnvKey) {
    this.state.update((prev) => ({
      ...prev,
      [envKey]: {
        ...prev[envKey],
        isSaving: false,
        message: null,
      },
    }));
  }

  private failSaving(envKey: EnvKey, error: unknown) {
    this.state.update((prev) => ({
      ...prev,
      [envKey]: {
        ...prev[envKey],
        isSaving: false,
        message: null,
        savingError: this.formatError(error),
      },
    }));
  }

  private formatError(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return String(error);
  }

  addDoc(env: EnvEntry) {
    this.beginSaving(env.key, 'Sending new document');
    this.firestoreService
      .addByPath$<TestDoc>(PROJECT_KEY, env.key, COLLECTION_PATH, {
        message: `Hello from Angular (${env.label}) @ ${new Date().toLocaleTimeString()}`,
        createdAt: Date.now(),
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.finishSaving(env.key)),
      )
      .subscribe({
        error: (err) => this.failSaving(env.key, err),
      });
  }

  quickEdit(env: EnvEntry, item: TestDoc) {
    const docRef = `${COLLECTION_PATH}/${item.id}`;
    this.beginSaving(env.key, 'Updating document');
    this.firestoreService
      .updateByPath$<TestDoc>(PROJECT_KEY, env.key, docRef, {
        message: `${item.message}|`,
        updatedAt: Date.now(),
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.finishSaving(env.key)),
      )
      .subscribe({
        error: (err) => this.failSaving(env.key, err),
      });
  }

  deleteDoc(env: EnvEntry, item: TestDoc) {
    const docRef = `${COLLECTION_PATH}/${item.id}`;
    this.beginSaving(env.key, 'Deleting document');
    this.firestoreService
      .deleteByPath$(PROJECT_KEY, env.key, docRef)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.finishSaving(env.key)),
      )
      .subscribe({
        error: (err) => this.failSaving(env.key, err),
      });
  }
}
