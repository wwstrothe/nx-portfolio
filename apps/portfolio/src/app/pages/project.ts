import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'portfolio-project',
  template: `
    <h1>Project Page</h1>
    {{ projectId() }}
  `,
})
export default class Project {
  route = inject(ActivatedRoute);
  params = this.route.params;
  projectId = signal<string | null>(null);

  constructor() {
    this.params.subscribe((params) => {
      console.log('Project ID:', params['id']);
      this.projectId.set(params['id'] || null);
    });
  }
}
