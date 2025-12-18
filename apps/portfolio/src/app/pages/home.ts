import { JsonPipe } from '@angular/common';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  isDevMode,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EnvVm } from '@portfolio/shared/angular/firebase-config-angular';
import { FirestoreService } from '@portfolio/shared/angular/firestore-angular';

type TestDoc = {
  id?: string;
  message: string;
  createdAt: number;
  updatedAt?: number;
};

@Component({
  selector: 'portfolio-home',
  imports: [JsonPipe],
  template: `
    <div>
      @for (env of envs; track env.key) { @if (env.key !== 'emulator' || isDev)
      {
      <section>
        <h2>{{ env.label }}</h2>

        <div>
          <button (click)="addDoc(env)">Add document</button>
          <span
            >Live docs: <b>{{ env.docs().length }}</b></span
          >
        </div>

        @for (item of env.sortedDocs(); track item.id) {
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
          <pre>{{ env.docs() | json }}</pre>
        </details>
      </section>
      }
      <hr />
      }
    </div>
  `,
})
export default class Home {
  protected readonly isDev = isDevMode();

  private readonly projectKey = 'personal-project' as const;
  private readonly firestoreService = inject(FirestoreService);
  private readonly collectionPath = 'test' as const;
  private readonly destroyRef = inject(DestroyRef);

  private readonly prodDocs =
    this.firestoreService.listenCollectionAsSignal<TestDoc>(
      this.projectKey,
      'live',
      this.collectionPath
    );

  private readonly emulatorDocs = this.isDev
    ? this.firestoreService.listenCollectionAsSignal<TestDoc>(
        this.projectKey,
        'emulator',
        this.collectionPath
      )
    : this.prodDocs;

  readonly envs: EnvVm<TestDoc>[] = [
    {
      key: 'emulator',
      label: 'Emulator',
      docs: this.emulatorDocs,
      sortedDocs: computed(() =>
        this.sortDocs(this.emulatorDocs(), 'updatedAt')
      ),
    },
    {
      key: 'live',
      label: 'Production',
      docs: this.prodDocs,
      sortedDocs: computed(() => this.sortDocs(this.prodDocs(), 'updatedAt')),
    },
  ];

  addDoc(env: EnvVm<TestDoc>) {
    this.firestoreService
      .addByPath$<TestDoc>(this.projectKey, env.key, this.collectionPath, {
        message: `Hello from Angular (${
          env.label
        }) @ ${new Date().toLocaleTimeString()}`,
        createdAt: Date.now(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  quickEdit(env: EnvVm<TestDoc>, item: TestDoc) {
    const docRef = `${this.collectionPath}/${item.id}`;
    this.firestoreService
      .updateByPath$<TestDoc>(this.projectKey, env.key, docRef, {
        message: `${item.message}|`,
        updatedAt: Date.now(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  deleteDoc(env: EnvVm<TestDoc>, item: TestDoc) {
    const docRef = `${this.collectionPath}/${item.id}`;
    this.firestoreService
      .deleteByPath$(this.projectKey, env.key, docRef)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private sortDocs(docs: TestDoc[], sortBy: keyof TestDoc): TestDoc[] {
    return [...docs].sort((a, b) => {
      const aVal = a[sortBy] ?? a.createdAt;
      const bVal = b[sortBy] ?? b.createdAt;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return bVal - aVal;
      }

      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');
      return bStr.localeCompare(aStr);
    });
  }
}
