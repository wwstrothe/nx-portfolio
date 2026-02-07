import styles from './footer.module.scss';

export type FooterProps = {
  emailHref?: string;
  linkedinHref?: string;
  githubHref?: string;
};

export function Footer({
  emailHref = 'mailto:you@example.com',
  linkedinHref = 'https://linkedin.com/in/your-handle',
  githubHref = 'https://github.com/your-handle',
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copyright}>© {year} William Strothe</span>

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
