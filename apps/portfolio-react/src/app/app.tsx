import { Footer, Header, SideNav } from '@portfolio/shared/react/layouts-react';
import { PORTFOLIO_NAV_ROUTES, PORTFOLIO_ROUTE_FULL_PATHS } from '@portfolio/shared/config';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DatabaseProvider, useDatabase } from './data/database';
import styles from './app.module.scss';
import Home from './pages/home/home';
import Project from './pages/project/project';
import Projects from './pages/projects/projects';
import Resume from './pages/resume/resume';

function AppContent() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { siteContent } = useDatabase();
  const links =
    siteContent?.links ??
    PORTFOLIO_NAV_ROUTES.map(({ name, fullPath }) => ({ name, link: fullPath }));

  const handleMenuOpen = () => {
    setIsNavOpen(true);
  };

  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  return (
    <div className={styles.app}>
      <Header
        onMenuOpen={handleMenuOpen}
        brandLabel={siteContent?.title ?? 'William Strothe'}
        links={links}
      />
      <main className={styles.main}>
        <Routes>
          <Route path={PORTFOLIO_ROUTE_FULL_PATHS.home} element={<Home />} />
          <Route path={PORTFOLIO_ROUTE_FULL_PATHS.projects} element={<Projects />} />
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
        emailHref={`mailto:${siteContent?.contactEmail ?? 'william.strothe@gmail.com'}`}
        linkedinHref={
          siteContent?.socialLinks?.linkedin ?? 'https://linkedin.com/in/william-strothe'
        }
        githubHref={siteContent?.socialLinks?.github ?? 'https://github.com/wwstrothe'}
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
