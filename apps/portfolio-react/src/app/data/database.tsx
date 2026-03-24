import {
  PORTFOLIO_COLLECTION_PATH,
  PORTFOLIO_PROJECT_KEY,
  PROJECTS,
  PROJECTS_DOC_ID,
  RESUME,
  RESUME_DOC_ID,
  SITE_CONTENT,
  SITE_CONTENT_DOC_ID,
  type PortfolioData,
  type Project,
  type Resume,
  type SiteContent,
} from '@portfolio/shared/config';
import {
  firestoreListenCollection,
  firestoreSetByPath,
  type Targets,
} from '@portfolio/shared/react/firestore-react';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type { SiteContent, Project, Resume, PortfolioData };

type Status = 'idle' | 'loading' | 'saving' | 'complete' | 'error';

type DatabaseContextValue = {
  siteContent: SiteContent | null;
  siteContentStatus: Status;
  projects: Array<Project> | null;
  projectsStatus: Status;
  resume: Resume | null;
  resumeStatus: Status;
  lastError: Error | null;
  getProjectBySlug: (slug: string) => Project | null;
  saveInitialData: () => Promise<void>;
};

const DatabaseContext = createContext<DatabaseContextValue | null>(null);

const target: Targets = import.meta.env.DEV ? 'emulator' : 'live';

type PortfolioDoc = Record<string, unknown> & { id: string };

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [siteContentStatus, setSiteContentStatus] = useState<Status>('idle');

  const [projects, setProjects] = useState<Array<Project> | null>(null);
  const [projectsStatus, setProjectsStatus] = useState<Status>('idle');

  const [resume, setResume] = useState<Resume | null>(null);
  const [resumeStatus, setResumeStatus] = useState<Status>('idle');

  const [lastError, setLastError] = useState<Error | null>(null);

  useEffect(() => {
    setSiteContentStatus('loading');
    setProjectsStatus('loading');
    setResumeStatus('loading');

    const sub = firestoreListenCollection<PortfolioData>(
      PORTFOLIO_PROJECT_KEY,
      target,
      PORTFOLIO_COLLECTION_PATH,
    ).subscribe({
      next: (docs) => {
        const normalized = docs as unknown as PortfolioDoc[];

        const site = normalized.find((d) => d.id === SITE_CONTENT_DOC_ID) as unknown as
          | SiteContent
          | undefined;
        const projectsDoc = normalized.find((d) => d.id === PROJECTS_DOC_ID) as unknown as
          | { items: Project[] }
          | undefined;
        const resumeDoc = normalized.find((d) => d.id === RESUME_DOC_ID) as unknown as
          | Resume
          | undefined;

        setSiteContent(site ?? null);
        setSiteContentStatus('complete');

        setProjects(projectsDoc?.items ?? null);
        setProjectsStatus('complete');

        setResume(resumeDoc ?? null);
        setResumeStatus('complete');
      },
      error: (err) => {
        const error = err as Error;
        setLastError(error);
        setSiteContentStatus('error');
        setProjectsStatus('error');
        setResumeStatus('error');
      },
    });

    return () => sub.unsubscribe();
  }, []);

  const saveInitialData = async () => {
    setSiteContentStatus('saving');
    setProjectsStatus('saving');
    setResumeStatus('saving');

    try {
      await Promise.all([
        firestoreSetByPath(
          PORTFOLIO_PROJECT_KEY,
          target,
          `${PORTFOLIO_COLLECTION_PATH}/${SITE_CONTENT_DOC_ID}`,
          SITE_CONTENT,
        ),
        firestoreSetByPath(
          PORTFOLIO_PROJECT_KEY,
          target,
          `${PORTFOLIO_COLLECTION_PATH}/${PROJECTS_DOC_ID}`,
          { items: PROJECTS },
        ),
        firestoreSetByPath(
          PORTFOLIO_PROJECT_KEY,
          target,
          `${PORTFOLIO_COLLECTION_PATH}/${RESUME_DOC_ID}`,
          RESUME,
        ),
      ]);

      setSiteContent(SITE_CONTENT);
      setSiteContentStatus('complete');

      setProjects(PROJECTS);
      setProjectsStatus('complete');

      setResume(RESUME);
      setResumeStatus('complete');
    } catch (err) {
      const error = err as Error;
      setLastError(error);
      setSiteContentStatus('error');
      setProjectsStatus('error');
      setResumeStatus('error');
    }
  };

  const value = useMemo<DatabaseContextValue>(
    () => ({
      siteContent,
      siteContentStatus,
      projects,
      projectsStatus,
      resume,
      resumeStatus,
      lastError,
      getProjectBySlug: (slug: string) => projects?.find((p) => p.slug === slug) ?? null,
      saveInitialData,
    }),
    [siteContent, siteContentStatus, projects, projectsStatus, resume, resumeStatus, lastError],
  );

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}
