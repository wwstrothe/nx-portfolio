import { Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Database, Project } from '../../data/database';

@Component({
  selector: 'portfolio-project',
  imports: [],
  template: `
    @if (project(); as projectData) {
      <div class="project-detail">
        <button class="back-btn" (click)="goBack()">← Back to Projects</button>

        @if (projectData.thumbnailUrl) {
          <div class="project-thumbnail">
            <img [src]="projectData.thumbnailUrl" [alt]="projectData.title" />
          </div>
        }

        <div class="project-header">
          <h1 class="project-title">{{ projectData.title }}</h1>
          <div class="project-meta">
            <div class="tags">
              @for (tag of projectData.tags; track tag) {
                <span class="tag">{{ tag }}</span>
              }
            </div>
            <div class="status" [class]="'status-' + projectData.status">
              {{ projectData.status === 'wip' ? 'Work in Progress' : projectData.status }}
            </div>
          </div>
        </div>

        <div class="project-content">
          <p class="project-description">{{ projectData.description }}</p>

          @if (projectData.videoUrl) {
            <div class="project-video">
              <iframe
                [src]="projectData.videoUrl"
                width="100%"
                height="600"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          }

          @if (projectData.galleryUrls && projectData.galleryUrls.length > 0) {
            <div class="project-gallery">
              <h3>Gallery</h3>
              <div class="gallery-grid">
                @for (imageUrl of projectData.galleryUrls; track imageUrl) {
                  <div class="gallery-item">
                    <img [src]="imageUrl" [alt]="projectData.title" />
                  </div>
                }
              </div>
            </div>
          }

          <div class="project-links">
            <a
              class="link-btn primary"
              [href]="projectData.repoLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Repository
            </a>
            @if (projectData.liveLink) {
              <a
                class="link-btn secondary"
                [href]="projectData.liveLink"
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
  styleUrls: ['./project.scss'],
})
export default class ProjectDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private database = inject(Database);

  protected project!: Signal<Project | null>;

  constructor() {
    // set initial project signal based on current route (and update on param changes)
    const setProjectFromSlug = (slug?: string) => {
      if (slug) {
        this.project = this.database.getProjectSignal(slug);
      } else {
        // fallback to a null computed signal
        this.project = computed(() => null);
      }
    };

    const initialSlug = this.route.snapshot.params['slug'];
    setProjectFromSlug(initialSlug);

    this.route.params.subscribe((params) => {
      setProjectFromSlug(params['slug']);
    });
  }

  goBack() {
    this.router.navigate(['/projects']);
  }
}
