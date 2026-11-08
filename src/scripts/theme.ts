// Theme: follows the system until the visitor chooses; only an explicit choice is stored.
export type Theme = 'light' | 'dark';

const root = document.documentElement;
const media = window.matchMedia('(prefers-color-scheme: dark)');

export function currentTheme(): Theme {
  const set = root.getAttribute('data-theme');
  if (set === 'light' || set === 'dark') return set;
  return media.matches ? 'dark' : 'light';
}

/** Label for the action that switches away from the current theme. */
export function toggleLabel(): string {
  return currentTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
}

export function toggleTheme(): void {
  const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try {
    localStorage.setItem('theme', next);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  document.dispatchEvent(new CustomEvent('themechange'));
}

/** Calls fn now and whenever the effective theme changes. */
export function onThemeChange(fn: () => void): void {
  document.addEventListener('themechange', fn);
  media.addEventListener('change', fn);
  fn();
}
