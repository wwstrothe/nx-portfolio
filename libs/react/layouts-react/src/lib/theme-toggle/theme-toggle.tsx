import { useEffect, useState } from 'react';

import styles from './theme-toggle.module.scss';

export type ThemeToggleProps = {
  onThemeChange?: (theme: 'dark' | 'light') => void;
};

export function ThemeToggle({ onThemeChange }: ThemeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const themeKey = 'theme';

  useEffect(() => {
    const savedTheme =
      typeof window !== 'undefined'
        ? window.localStorage.getItem(themeKey)
        : null;

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia) {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(themeKey, isDarkMode ? 'dark' : 'light');
    }

    onThemeChange?.(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, onThemeChange]);

  return (
    <button
      className={styles.themeToggle}
      type="button"
      onClick={() => setIsDarkMode((prev) => !prev)}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
    >
      <span className={styles.icon}>{isDarkMode ? '☀️' : '🌙'}</span>
    </button>
  );
}

export default ThemeToggle;
