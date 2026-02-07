import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PROJECTS } from '../data/projects';
import type { Project } from '../data/projects';

@Component({
  selector: 'portfolio-project',
  imports: [],
  template: `
    @if (project) {
      <div class="project-detail">
        <button class="back-btn" (click)="goBack()">← Back to Projects</button>

        @if (project.thumbnailUrl) {
          <div class="project-thumbnail">
            <img [src]="project.thumbnailUrl" [alt]="project.title" />
          </div>
        }

        <div class="project-header">
          <h1 class="project-title">{{ project.title }}</h1>
          <div class="project-meta">
            <div class="tags">
              @for (tag of project.tags; track tag) {
                <span class="tag">{{ tag }}</span>
              }
            </div>
            <div class="status" [class]="'status-' + project.status">
              {{ project.status === 'wip' ? 'Work in Progress' : project.status }}
            </div>
          </div>
        </div>

        <div class="project-content">
          <p class="project-description">{{ project.description }}</p>

          @if (project.videoUrl) {
            <div class="project-video">
              <iframe
                [src]="project.videoUrl"
                width="100%"
                height="600"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          }

          @if (project.galleryUrls && project.galleryUrls.length > 0) {
            <div class="project-gallery">
              <h3>Gallery</h3>
              <div class="gallery-grid">
                @for (imageUrl of project.galleryUrls; track imageUrl) {
                  <div class="gallery-item">
                    <img [src]="imageUrl" [alt]="project.title" />
                  </div>
                }
              </div>
            </div>
          }

          <div class="project-links">
            <a
              class="link-btn primary"
              [href]="project.repoLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Repository
            </a>
            @if (project.liveLink) {
              <a
                class="link-btn secondary"
                [href]="project.liveLink"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Live
              </a>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="project-not-found">
        <h2>Project not found</h2>
        <button (click)="goBack()">← Back to Projects</button>
      </div>
    }
  `,
  styles: [
    `
      .project-detail {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1.5rem;
      }

      .back-btn {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 1rem;
        background-color: transparent;
        color: var(--color-primary);
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 250ms ease-in-out;
        margin-bottom: 2rem;
      }

      .back-btn:hover {
        background-color: var(--color-bg-secondary);
        border-color: var(--color-primary);
      }

      .project-thumbnail {
        margin-bottom: 2rem;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .project-thumbnail img {
        width: 100%;
        height: auto;
        display: block;
      }

      .project-header {
        margin-bottom: 2rem;
      }

      .project-title {
        font-size: 2.25rem;
        font-weight: 700;
        line-height: 1.2;
        color: var(--color-primary);
        margin-bottom: 1rem;
      }

      .project-meta {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }

      .tag {
        font-size: 0.75rem;
        font-weight: 500;
        padding: 0.375rem 0.75rem;
        background-color: var(--color-primary);
        color: white;
        border-radius: 0.25rem;
      }

      .status {
        font-size: 0.875rem;
        font-weight: 600;
        padding: 0.375rem 0.75rem;
        border-radius: 0.25rem;
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

      .project-content {
        background-color: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: 1rem;
        padding: 2rem;
      }

      .project-description {
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.75;
        color: var(--color-text);
        margin-bottom: 2rem;
        white-space: pre-wrap;
        word-break: break-word;
      }

      .project-video {
        margin-bottom: 2rem;
        border-radius: 0.5rem;
        overflow: hidden;
      }

      .project-video iframe {
        display: block;
        border-radius: 0.5rem;
      }

      .project-gallery {
        margin-bottom: 2rem;
      }

      .project-gallery h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text);
        margin-bottom: 1rem;
      }

      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .gallery-item {
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
        transition: transform 250ms ease-in-out;
      }

      .gallery-item:hover {
        transform: scale(1.02);
      }

      .gallery-item img {
        width: 100%;
        height: auto;
        display: block;
      }

      .project-links {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--color-border);
      }

      .link-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-weight: 600;
        transition: all 250ms ease-in-out;
        border: 2px solid transparent;
      }

      .link-btn.primary {
        background-color: var(--color-primary);
        color: white;
      }

      .link-btn.primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .link-btn.secondary {
        background-color: transparent;
        color: var(--color-primary);
        border-color: var(--color-primary);
      }

      .link-btn.secondary:hover {
        background-color: var(--color-primary);
        color: white;
      }

      .project-not-found {
        text-align: center;
        padding: 4rem 2rem;
      }

      .project-not-found h2 {
        color: var(--color-text-secondary);
        margin-bottom: 1rem;
      }
    `,
  ],
})
export default class ProjectDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  project: Project | null = null;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      this.project = PROJECTS.find((p) => p.slug === slug) || null;
    });
  }

  goBack() {
    this.router.navigate(['/projects']);
  }
}
