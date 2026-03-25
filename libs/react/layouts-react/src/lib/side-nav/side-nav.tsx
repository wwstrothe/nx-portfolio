import { PORTFOLIO_LAYOUT_DEFAULTS, PORTFOLIO_LAYOUT_LABELS } from '@portfolio/shared/config';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import { ThemeToggle } from '../theme-toggle/theme-toggle';
import styles from './side-nav.module.scss';

export type SideNavProps = {
  open?: boolean;
  onClose?: () => void;
  links?: Array<{ name: string; link: string }>;
};

const DEFAULT_LINKS = PORTFOLIO_LAYOUT_DEFAULTS.links;

export function SideNav({ open = false, onClose, links = DEFAULT_LINKS }: SideNavProps) {
  const panelRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  return (
    <aside
      className={`${styles.sidenav} ${open ? styles.open : ''}`}
      tabIndex={-1}
      role="dialog"
      aria-label={PORTFOLIO_LAYOUT_LABELS.navigationDialogLabel}
      aria-modal="true"
      ref={panelRef}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose?.();
      }}
    >
      <div className={styles.inner}>
        <div className={styles.content}>
          <button
            className={styles.closeBtn}
            type="button"
            aria-label={PORTFOLIO_LAYOUT_LABELS.closeNavigation}
            onClick={onClose}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              close
            </span>
          </button>

          <nav className={styles.links}>
            {links.map((link) => (
              <NavLink
                key={link.link}
                to={link.link}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`.trim()
                }
                onClick={onClose}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className={styles.themeRow}>
          <span className={styles.themeLabel}>{PORTFOLIO_LAYOUT_LABELS.themeLabel}</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

export default SideNav;
