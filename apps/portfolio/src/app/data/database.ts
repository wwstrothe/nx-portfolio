import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { FirestoreService } from '@portfolio/shared/angular/firestore-angular';

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
  proffesionalExperience: Array<{
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
  COLLECTION_PATH = 'portfolio';

@Injectable({
  providedIn: 'root',
})
export class Database {
  private readonly firestoreService = inject(FirestoreService);

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
      .listenCollection$<PortfolioData>(PROJECT_KEY, 'emulator', COLLECTION_PATH)
      .subscribe({
        next: (docs) => {
          const siteContentDoc = docs.find((doc) => doc.id === 'site-content');
          if (siteContentDoc) {
            this.siteContent.set(siteContentDoc as unknown as SiteContent);
            this.siteContentStatus.set('complete');
          } else {
            this.siteContent.set(null);
            this.siteContentStatus.set('complete');
          }

          const projectsDoc = docs.find((doc) => doc.id === 'projects');
          if (projectsDoc) {
            const data = projectsDoc as unknown as { items: Array<Project> };
            this.projects.set(data.items || []);
            this.projectsStatus.set('complete');
          } else {
            this.projects.set(null);
            this.projectsStatus.set('complete');
          }

          const resumeDoc = docs.find((doc) => doc.id === 'resume');
          if (resumeDoc) {
            this.resume.set(resumeDoc as unknown as Resume);
            this.resumeStatus.set('complete');
          } else {
            this.resume.set(null);
            this.resumeStatus.set('complete');
          }
        },
        error: (err) => {
          this.lastError.set(err);
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
