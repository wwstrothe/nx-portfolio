import { PORTFOLIO_LAYOUT_DEFAULTS, PORTFOLIO_LAYOUT_LABELS } from '@portfolio/shared/config';
import { Link, NavLink } from 'react-router-dom';

import { ThemeToggle } from '../theme-toggle/theme-toggle';
import styles from './header.module.scss';

export type HeaderProps = {
  onMenuOpen?: () => void;
  brandLabel?: string;
  links?: Array<{ name: string; link: string }>;
};

const DEFAULT_LINKS = PORTFOLIO_LAYOUT_DEFAULTS.links;

export function Header({
  onMenuOpen,
  brandLabel = PORTFOLIO_LAYOUT_DEFAULTS.brandLabel,
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
          aria-label={PORTFOLIO_LAYOUT_LABELS.openNavigation}
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
