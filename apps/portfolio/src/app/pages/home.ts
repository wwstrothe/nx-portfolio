import { JsonPipe } from '@angular/common';
import { Component, computed, inject, isDevMode, signal, Signal } from '@angular/core';
import { FirestoreService } from '../shared/services/firestore.service';

type TestDoc = {
  message: string;
  createdAt: number;
  updatedAt?: number;
};

type TestDocWithId = TestDoc & { id: string };

type TestDocTools = {
  docs: Signal<TestDocWithId[]>;
  add(doc: TestDoc): Promise<string>;
  update(id: string, patch: Partial<TestDoc>): Promise<void>;
  remove(id: string): Promise<void>;
};

type EnvKey = 'emulator' | 'prod';

type EnvVm = {
  key: EnvKey;
  label: string;
  tools: TestDocTools | null;
  docs: Signal<TestDocWithId[]>;
  sortedDocs: Signal<TestDocWithId[]>;
};

const IS_DEV = isDevMode();

@Component({
  selector: 'portfolio-home',
  imports: [JsonPipe],
  template: `
    <h1>{{ title }}</h1>

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
      } }
    </div>

    <hr />
  `,
})
export default class Home {
  protected title = 'William Strothe Portfolio';
  protected readonly isDev = IS_DEV;

  private readonly projectKey = 'personal-project' as const;
  private readonly firestoreService = inject(FirestoreService);
  private readonly collectionPath = 'test' as const;

  private readonly prodTools = this.firestoreService.createCollectionTools<TestDoc>({
    collectionPath: this.collectionPath,
    projectKey: this.projectKey,
    initialValue: [] as TestDocWithId[],
  });

  private readonly emulatorTools = this.isDev
    ? this.firestoreService.createCollectionTools<TestDoc>({
        collectionPath: this.collectionPath,
        projectKey: this.projectKey,
        environment: 'emulator',
        initialValue: [] as TestDocWithId[],
      })
    : null;

  readonly envs: EnvVm[] = [
    this.makeEnv('emulator', 'Emulator', this.emulatorTools),
    this.makeEnv('prod', 'Production', this.prodTools),
  ];

  private makeEnv(key: EnvKey, label: string, tools: EnvVm['tools']): EnvVm {
    const docs = tools?.docs ?? signal<TestDocWithId[]>([]);
    const sortedDocs = computed(() =>
      [...docs()].sort(
        (a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt)
      )
    );

    return { key, label, tools, docs, sortedDocs };
  }

  async addDoc(env: EnvVm) {
    if (!env.tools) return;
    await env.tools.add({
      message: `Hello from Angular (${
        env.label
      }) @ ${new Date().toLocaleTimeString()}`,
      createdAt: Date.now(),
    });
  }

  async quickEdit(env: EnvVm, item: TestDocWithId) {
    if (!env.tools) return;
    await env.tools.update(item.id, {
      message: `${item.message}|`,
      updatedAt: Date.now(),
    });
  }

  async deleteDoc(env: EnvVm, item: TestDocWithId) {
    if (!env.tools) return;
    await env.tools.remove(item.id);
  }
}
