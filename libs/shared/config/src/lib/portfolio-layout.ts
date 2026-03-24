import { SITE_CONTENT } from './portfolio-content';

export type PortfolioNavLink = {
  name: string;
  link: string;
};

export const PORTFOLIO_LAYOUT_DEFAULTS = {
  brandLabel: SITE_CONTENT.title,
  links: SITE_CONTENT.links.map((link) => ({ ...link })) as PortfolioNavLink[],
  emailHref: `mailto:${SITE_CONTENT.contactEmail}`,
  linkedinHref: SITE_CONTENT.socialLinks.linkedin,
  githubHref: SITE_CONTENT.socialLinks.github,
} as const;

export const PORTFOLIO_LAYOUT_LABELS = {
  openNavigation: 'Open navigation',
  closeNavigation: 'Close navigation',
  navigationDialogLabel: 'Navigation',
  themeLabel: 'Theme',
  switchToLightMode: 'Switch to light mode',
  switchToDarkMode: 'Switch to dark mode',
  lightModeTitle: 'Light mode',
  darkModeTitle: 'Dark mode',
} as const;
