import { Link, NavLink } from 'react-router-dom';

import { ThemeToggle } from '../theme-toggle/theme-toggle';
import styles from './header.module.scss';

export type HeaderProps = {
  onMenuOpen?: () => void;
  brandLabel?: string;
};

export function Header({ onMenuOpen, brandLabel = 'William Strothe' }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/">
          {brandLabel}
        </Link>
        <button
          className={styles.menuBtn}
          aria-label="Open navigation"
          type="button"
          onClick={onMenuOpen}
        >
          <span className="material-symbols-outlined" aria-hidden="true">
            menu
          </span>
        </button>

        <nav className={styles.nav}>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`.trim()
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/resume"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`.trim()
            }
          >
            Resume
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default Header;
