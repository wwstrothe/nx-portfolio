import { TitleCasePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { PROJECTS } from '../../data/projects';

@Component({
  selector: 'portfolio-projects',
  imports: [TitleCasePipe],
  template: `
    <h1 class="section-title">Projects</h1>
    <div class="projects">
      @for (project of projects; track project.id) {
        <div
          class="project-card"
          role="button"
          tabindex="0"
          (click)="navigateToProject(project.slug)"
          (keydown.enter)="navigateToProject(project.slug)"
          (keydown.space)="navigateToProject(project.slug)"
        >
          <h3>{{ project.title }}</h3>
          <p>{{ project.shortDescription }}</p>
          <div class="tags">
            @for (tag of project.tags; track tag) {
              <span class="tag">{{ tag }}</span>
            }
          </div>
          <div class="status" [class]="'status-' + project.status">
            {{ project.status === 'wip' ? 'Work in Progress' : (project.status | titlecase) }}
          </div>
          <div class="links">
            <a
              [href]="project.repoLink"
              target="_blank"
              rel="noopener noreferrer"
              (click)="$event.stopPropagation()"
            >
              Repository
            </a>
            @if (project.liveLink) {
              <a
                [href]="project.liveLink"
                target="_blank"
                rel="noopener noreferrer"
                (click)="$event.stopPropagation()"
              >
                Live Demo
              </a>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./projects.scss'],
})
export default class Projects {
  private router = inject(Router);

  projects = PROJECTS;
  useShortDescription = input(false);

  navigateToProject(slug: string) {
    this.router.navigate(['/project', slug]);
  }
}
