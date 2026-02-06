import { Footer, Header, SideNav } from '@portfolio/shared/react/layouts-react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import styles from './app.module.scss';
import Home from './pages/home';
import Projects from './pages/projects';
import Resume from './pages/resume';

export function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsNavOpen(true);
  };

  const handleNavClose = () => {
    setIsNavOpen(false);
  };

  return (
    <div className={styles.app}>
      <Header onMenuOpen={handleMenuOpen} brandLabel="William Strothe" />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </main>
      {isNavOpen && (
        <>
          <SideNav open={isNavOpen} onClose={handleNavClose} />
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
        emailHref="mailto:you@example.com"
        linkedinHref="https://linkedin.com/in/your-handle"
        githubHref="https://github.com/your-handle"
      />
    </div>
  );
}

export default App;
