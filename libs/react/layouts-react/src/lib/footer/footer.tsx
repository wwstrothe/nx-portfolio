import { PORTFOLIO_LAYOUT_DEFAULTS } from '@portfolio/shared/config';
import styles from './footer.module.scss';

export type FooterProps = {
  title?: string;
  emailHref?: string;
  linkedinHref?: string;
  githubHref?: string;
};

export function Footer({
  title = PORTFOLIO_LAYOUT_DEFAULTS.brandLabel,
  emailHref = PORTFOLIO_LAYOUT_DEFAULTS.emailHref,
  linkedinHref = PORTFOLIO_LAYOUT_DEFAULTS.linkedinHref,
  githubHref = PORTFOLIO_LAYOUT_DEFAULTS.githubHref,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copyright}>
          © {year} {title}
        </span>

        <div className={styles.links}>
          <a href={emailHref}>Email</a>
          <a href={linkedinHref} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={githubHref} target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
