import { Link, NavLink } from 'react-router-dom';

import { ThemeToggle } from '../theme-toggle/theme-toggle';
import styles from './header.module.scss';

export type HeaderProps = {
  onMenuOpen?: () => void;
  brandLabel?: string;
  links?: Array<{ name: string; link: string }>;
};

const DEFAULT_LINKS = [
  { name: 'Projects', link: '/projects' },
  { name: 'Resume', link: '/resume' },
];

export function Header({
  onMenuOpen,
  brandLabel = 'William Strothe',
  links = DEFAULT_LINKS,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} to="/" data-testid="brand">
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
          {links.map((link) => (
            <NavLink
              key={link.link}
              to={link.link}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`.trim()
              }
            >
              {link.name}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

export default Header;
