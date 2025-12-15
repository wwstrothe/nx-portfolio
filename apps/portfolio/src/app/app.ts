import { JsonPipe } from '@angular/common';
import { Component, Signal, computed, isDevMode, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { getFirestoreClient } from '@portfolio/shared/firebase-core';
import {
  createCollectionTools,
  createWebFirestoreAdapter,
} from '@portfolio/shared/firestore';

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
  tools: ReturnType<typeof createCollectionTools<TestDoc>> | null;
  docs: Signal<TestDocWithId[]>;
  sortedDocs: Signal<TestDocWithId[]>;
};

const IS_DEV = isDevMode();

@Component({
  imports: [RouterModule, JsonPipe],
  selector: 'portfolio-root',
  template: `
    <h1>{{ title }}</h1>

    <div
      style="display:flex; gap:24px; align-items:flex-start; margin: 12px 0;"
    >
      @for (env of envs; track env.key) { @if (env.key !== 'emulator' || isDev)
      {
      <section
        style="flex:1; border:1px solid #333; padding:12px; border-radius:8px;"
      >
        <h2 style="margin:0 0 8px 0;">{{ env.label }}</h2>

        <div
          style="display:flex; gap:12px; align-items:center; margin-bottom: 12px;"
        >
          <button (click)="addDoc(env)">Add document</button>
          <span
            >Live docs: <b>{{ env.docs().length }}</b></span
          >
        </div>

        @for (item of env.sortedDocs(); track item.id) {
        <div
          style="border:1px solid #333; border-radius:8px; padding:10px; margin-bottom:8px;"
        >
          <div>{{ item.message }}</div>
          <div style="display:flex; gap:8px; margin-top:6px;">
            <button (click)="quickEdit(env, item)">Quick edit</button>
            <button (click)="deleteDoc(env, item)">Delete</button>
          </div>
        </div>
        }

        <details style="margin-top: 12px;">
          <summary style="cursor:pointer;">Raw JSON</summary>
          <pre style="margin:8px 0 0 0; white-space:pre-wrap;">{{
            env.docs() | json
          }}</pre>
        </details>
      </section>
      } }
    </div>

    <hr />
    <router-outlet></router-outlet>
  `,
  styleUrl: './app.scss',
})
export class App {
  protected title = 'William Strothe Portfolio';
  protected readonly isDev = IS_DEV;

  private readonly projectKey = 'personal-project' as const;
  private readonly collectionPath = 'test' as const;

  private getDb(options: { useEmulator: boolean }) {
    const firestore = getFirestoreClient(this.projectKey, {
      allowEmulators: options.useEmulator,
    });
    return createWebFirestoreAdapter(firestore);
  }

  private readonly prodTools = createCollectionTools<TestDoc>({
    db: this.getDb({ useEmulator: false }),
    collectionPath: this.collectionPath,
    initialValue: [] as TestDocWithId[],
  });

  private readonly emulatorTools = this.isDev
    ? createCollectionTools<TestDoc>({
        db: this.getDb({ useEmulator: true }),
        collectionPath: this.collectionPath,
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
