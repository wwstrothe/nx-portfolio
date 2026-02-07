import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { PROJECTS } from '../data/projects';
import { TitleCasePipe } from '@angular/common';

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
  styles: [
    `
      .section-title {
        font-size: 2rem;
        margin-bottom: 2rem;
        color: var(--color-primary);
      }

      .projects {
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr;
      }

      @media (min-width: 768px) {
        .projects {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      .project-card {
        padding: 1.5rem;
        background-color: var(--color-bg-secondary);
        border-radius: 1rem;
        border: 1px solid var(--color-border);
        cursor: pointer;
        transition: all 250ms ease-in-out;
      }

      .project-card:hover {
        border-color: var(--color-primary);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .project-card:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }

      .tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin: 1rem 0;
      }

      .tag {
        font-size: 0.875rem;
        padding: 0.25rem 0.75rem;
        background-color: var(--color-primary);
        color: white;
        border-radius: 0.25rem;
      }

      .status {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        font-size: 0.75rem;
        border-radius: 0.25rem;
        font-weight: 600;
        text-transform: uppercase;
      }

      .status-active {
        background-color: var(--color-success);
        color: white;
      }

      .status-wip {
        background-color: var(--color-warning);
        color: white;
      }

      .status-archived {
        background-color: var(--color-error);
        color: white;
      }

      .links {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
      }

      .links a {
        color: var(--color-primary);
        text-decoration: none;
      }

      .links a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export default class Projects {
  private router = inject(Router);

  projects = PROJECTS;
  useShortDescription = input(false);

  navigateToProject(slug: string) {
    this.router.navigate(['/project', slug]);
  }
}
