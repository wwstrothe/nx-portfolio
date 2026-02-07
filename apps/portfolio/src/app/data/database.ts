import { computed, DestroyRef, inject, Injectable, isDevMode, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FirestoreService } from '@portfolio/shared/angular/firestore-angular';
import { forkJoin } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { SITE_CONTENT } from './content';
import { PROJECTS } from './projects';
import { RESUME } from './resume';

export interface SiteContent extends Record<string, unknown> {
  title: string;
  header: string;
  subHeader: string;
  aboutMe: string;
  profilePicture: string;
  links: Array<{ name: string; link: string }>;
  contactEmail: string;
  socialLinks: {
    linkedin: string;
    github: string;
  };
}

export interface Project extends Record<string, unknown> {
  id: string;
  slug: string;
  status: 'active' | 'archived' | 'wip';
  title: string;
  shortDescription: string;
  description: string;
  repoLink: string;
  liveLink?: string;
  tags: string[];
  thumbnailUrl?: string;
  galleryUrls?: string[];
  videoUrl?: string;
}

export interface Resume extends Record<string, unknown> {
  name: string;
  subHeader: string;
  location: string;
  cellPhone: string;
  email: string;
  professionalSummary: string;
  technicalSkills: Array<{
    category: string;
    skills: string[];
  }>;
  professionalExperience: Array<{
    role: string;
    department: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string | 'Present';
    bulletPoints: string[];
  }>;
  projects: Array<{
    title: string;
    technologies: string[];
    bulletPoints: string[];
  }>;
  education: Array<{
    institution: string;
    fieldOfStudy: string;
    completionDate: string;
  }>;
}

export type PortfolioData = {
  siteContent: SiteContent;
  projects: Array<Project>;
  resume: Resume;
};

const PROJECT_KEY = 'personal-project',
  COLLECTION_PATH = 'portfolio',
  SITE_CONTENT_DOC_ID = 'site-content',
  PROJECTS_DOC_ID = 'projects',
  RESUME_DOC_ID = 'resume';

@Injectable({
  providedIn: 'root',
})
export class Database {
  private readonly firestoreService = inject(FirestoreService);
  private destroyRef = inject(DestroyRef);

  private target: 'emulator' | 'live' = isDevMode() ? 'emulator' : 'live';

  // Signals for each slice of the portfolio data
  siteContent = signal<SiteContent | null>(null);
  siteContentStatus = signal<'idle' | 'loading' | 'saving' | 'complete' | 'error'>('idle');

  projects = signal<Array<Project> | null>(null);
  projectsStatus = signal<'idle' | 'loading' | 'saving' | 'complete' | 'error'>('idle');

  resume = signal<Resume | null>(null);
  resumeStatus = signal<'idle' | 'loading' | 'saving' | 'complete' | 'error'>('idle');

  lastError = signal<Error | null>(null);

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.siteContentStatus.set('loading');
    this.projectsStatus.set('loading');
    this.resumeStatus.set('loading');

    this.firestoreService
      .listenCollection$<PortfolioData>(PROJECT_KEY, this.target, COLLECTION_PATH)
      .pipe(
        map((docs) => {
          const site = docs.find((d) => d.id === SITE_CONTENT_DOC_ID) as unknown as
            | SiteContent
            | undefined;
          const projectsDoc = docs.find((d) => d.id === PROJECTS_DOC_ID) as unknown as
            | { items: Project[] }
            | undefined;
          const resume = docs.find((d) => d.id === RESUME_DOC_ID) as unknown as Resume | undefined;

          return {
            siteContent: site ?? null,
            projects: projectsDoc?.items ?? null,
            resume: resume ?? null,
          } as {
            siteContent: SiteContent | null;
            projects: Project[] | null;
            resume: Resume | null;
          };
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        shareReplay({ bufferSize: 1, refCount: true }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ siteContent, projects, resume }) => {
          this.siteContent.set(siteContent);
          this.siteContentStatus.set('complete');

          this.projects.set(projects);
          this.projectsStatus.set('complete');

          this.resume.set(resume);
          this.resumeStatus.set('complete');
        },
        error: (err) => {
          this.lastError.set(err);
          this.siteContentStatus.set('error');
          this.projectsStatus.set('error');
          this.resumeStatus.set('error');
        },
      });
  }

  saveInitialData() {
    this.siteContentStatus.set('saving');
    this.projectsStatus.set('saving');
    this.resumeStatus.set('saving');

    forkJoin({
      site: this.firestoreService.setByPath$(
        PROJECT_KEY,
        this.target,
        `${COLLECTION_PATH}/${SITE_CONTENT_DOC_ID}`,
        SITE_CONTENT,
      ),
      projects: this.firestoreService.setByPath$(
        PROJECT_KEY,
        this.target,
        `${COLLECTION_PATH}/${PROJECTS_DOC_ID}`,
        { items: PROJECTS },
      ),
      resume: this.firestoreService.setByPath$(
        PROJECT_KEY,
        this.target,
        `${COLLECTION_PATH}/${RESUME_DOC_ID}`,
        RESUME,
      ),
    }).subscribe({
      next: () => {
        this.siteContent.set(SITE_CONTENT);
        this.siteContentStatus.set('complete');

        this.projects.set(PROJECTS);
        this.projectsStatus.set('complete');

        this.resume.set(RESUME);
        this.resumeStatus.set('complete');
      },
      error: (err) => {
        this.lastError.set(err as Error);
        this.siteContentStatus.set('error');
        this.projectsStatus.set('error');
        this.resumeStatus.set('error');
      },
    });
  }

  // Helper to get a computed signal for a project by slug
  getProjectSignal(slug: string): Signal<Project | null> {
    return computed(() => {
      const list = this.projects();
      return list ? (list.find((p) => p.slug === slug) ?? null) : null;
    });
  }

  // Convenience combined status
  overallStatus = computed(() => {
    const statuses = [this.siteContentStatus(), this.projectsStatus(), this.resumeStatus()];
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('loading')) return 'loading';
    if (statuses.includes('saving')) return 'saving';
    if (statuses.every((s) => s === 'complete')) return 'complete';
    return 'idle';
  });
}
