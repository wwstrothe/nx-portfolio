import { JsonPipe } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import type { Subscription } from 'rxjs';

import { getFirestoreClient } from '@portfolio/shared/firebase-core';
import { createWebFirestoreAdapter } from '@portfolio/shared/firestore';

type TestDoc = {
  message: string;
  createdAt: number;
};

@Component({
  imports: [RouterModule, JsonPipe],
  selector: 'portfolio-root',
  template: `
    <h1>{{ title }}</h1>

    <div style="display:flex; gap:24px; align-items:flex-start; margin: 12px 0;">
      <!-- Emulator column -->
      <section style="flex:1; border:1px solid #333; padding:12px; border-radius:8px;">
        <h2 style="margin:0 0 8px 0;">Emulator</h2>

        <div style="display:flex; gap:12px; align-items:center; margin-bottom: 12px;">
          <button (click)="addDocEmulator()">Add document to /test (Emulator)</button>
          <span>Live docs: <b>{{ emulatorDocs().length }}</b></span>
        </div>

        <pre style="margin:0;">{{ emulatorDocs() | json }}</pre>
      </section>

      <!-- Production column -->
      <section style="flex:1; border:1px solid #333; padding:12px; border-radius:8px;">
        <h2 style="margin:0 0 8px 0;">Production</h2>

        <div style="display:flex; gap:12px; align-items:center; margin-bottom: 12px;">
          <button (click)="addDocProd()">Add document to /test (Prod)</button>
          <span>Live docs: <b>{{ prodDocs().length }}</b></span>
        </div>

        <pre style="margin:0;">{{ prodDocs() | json }}</pre>
      </section>
    </div>

    <hr />

    <router-outlet></router-outlet>
  `,
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  protected title = 'William Strothe Portfolio';

  // change this to whatever key you have in workspaceConfig.firebase.projects
  private readonly projectKey = 'personal-project' as const;

  // Two separate state buckets
  readonly emulatorDocs = signal<Array<TestDoc & { id: string }>>([]);
  readonly prodDocs = signal<Array<TestDoc & { id: string }>>([]);

  private emulatorSub: Subscription | null = null;
  private prodSub: Subscription | null = null;

  constructor() {
    this.startListeningEmulator();
    this.startListeningProd();
  }

  ngOnDestroy(): void {
    this.emulatorSub?.unsubscribe();
    this.prodSub?.unsubscribe();
  }

  async addDocEmulator(): Promise<void> {
    const db = this.getDb({ useEmulator: true });
    const id = crypto.randomUUID();

    await db.setDoc(`test/${id}`, {
      message: `Hello from Angular (Emulator) @ ${new Date().toLocaleTimeString()}`,
      createdAt: Date.now(),
    });
  }

  async addDocProd(): Promise<void> {
    const db = this.getDb({ useEmulator: false });
    const id = crypto.randomUUID();

    await db.setDoc(`test/${id}`, {
      message: `Hello from Angular (Prod) @ ${new Date().toLocaleTimeString()}`,
      createdAt: Date.now(),
    });
  }

  private startListeningEmulator(): void {
    this.emulatorSub?.unsubscribe();
    this.emulatorDocs.set([]);

    const db = this.getDb({ useEmulator: true });

    this.emulatorSub = db
      .listenCollection$<TestDoc>('test')
      .subscribe((items) => this.emulatorDocs.set(items));
  }

  private startListeningProd(): void {
    this.prodSub?.unsubscribe();
    this.prodDocs.set([]);

    const db = this.getDb({ useEmulator: false });

    this.prodSub = db
      .listenCollection$<TestDoc>('test')
      .subscribe((items) => this.prodDocs.set(items));
  }

  private getDb(options: { useEmulator: boolean }) {
    const firestore = getFirestoreClient(this.projectKey, {
      allowEmulators: options.useEmulator,
    });
    return createWebFirestoreAdapter(firestore);
  }
}
