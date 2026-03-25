import { Footer, Header, SideNav } from '@portfolio/shared/react/layouts-react';
import {
  PORTFOLIO_LAYOUT_DEFAULTS,
  PORTFOLIO_NAV_ROUTES,
  PORTFOLIO_ROUTE_FULL_PATHS,
} from '@portfolio/shared/config';
import { useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DatabaseProvider, useDatabase } from './data/database';
import styles from './app.module.scss';
import Contact from './pages/contact/contact';
import Home from './pages/home/home';
import Project from './pages/project/project';
import Projects from './pages/projects/projects';
import Resume from './pages/resume/resume';

function AppContent() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { siteContent } = useDatabase();
  const links = useMemo(() => {
    const fromContent =
      siteContent?.links ??
      PORTFOLIO_NAV_ROUTES.map(({ name, fullPath }) => ({ name, link: fullPath }));

    const linksByPath = new Map(fromContent.map((link) => [link.link, link]));
    for (const route of PORTFOLIO_NAV_ROUTES) {
      if (!linksByPath.has(route.fullPath)) {
        linksByPath.set(route.fullPath, { name: route.name, link: route.fullPath });
      }
    }

    return [...linksByPath.values()];
  }, [siteContent?.links]);

  const brandLabel = siteContent?.title ?? PORTFOLIO_LAYOUT_DEFAULTS.brandLabel;
  const emailHref = siteContent?.contactEmail
    ? `mailto:${siteContent.contactEmail}`
    : PORTFOLIO_LAYOUT_DEFAULTS.emailHref;
  const linkedinHref = siteContent?.socialLinks?.linkedin ?? PORTFOLIO_LAYOUT_DEFAULTS.linkedinHref;
  const githubHref = siteContent?.socialLinks?.github ?? PORTFOLIO_LAYOUT_DEFAULTS.githubHref;

  const handleMenuOpen = () => {
    setIsNavOpen(true);
  };

  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  return (
    <div className={styles.app}>
      <Header onMenuOpen={handleMenuOpen} brandLabel={brandLabel} links={links} />
      <main className={styles.main}>
        <Routes>
          <Route path={PORTFOLIO_ROUTE_FULL_PATHS.home} element={<Home />} />
          <Route path={PORTFOLIO_ROUTE_FULL_PATHS.projects} element={<Projects />} />
          <Route path={PORTFOLIO_ROUTE_FULL_PATHS.contact} element={<Contact />} />
          <Route path={PORTFOLIO_ROUTE_FULL_PATHS.resume} element={<Resume />} />
          <Route path={PORTFOLIO_ROUTE_FULL_PATHS.projectDetail} element={<Project />} />
        </Routes>
      </main>
      {isNavOpen && (
        <>
          <SideNav open={isNavOpen} onClose={handleNavClose} links={links} />
          <div
            className={styles.overlay}
            role="button"
            tabIndex={0}
            aria-label="Close navigation"
            onClick={handleNavClose}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleNavClose();
              }
            }}
          />
        </>
      )}
      <Footer
        title={brandLabel}
        emailHref={emailHref}
        linkedinHref={linkedinHref}
        githubHref={githubHref}
      />
    </div>
  );
}

export function App() {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
}

export default App;
