import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import type { Project } from '../../data/projects';
import { PROJECTS } from '../../data/projects';

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
  styleUrls: ['./project.scss'],
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
