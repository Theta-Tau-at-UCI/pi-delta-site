const STORAGE_KEY = 'theme';

function isDark(): boolean {
  return document.documentElement.classList.contains('dark');
}

function syncToggleState(button: HTMLElement, dark: boolean): void {
  button.setAttribute('aria-pressed', dark ? 'true' : 'false');
  button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

export function initThemeToggle(): void {
  const buttons = document.querySelectorAll<HTMLElement>('[data-theme-toggle]');
  if (buttons.length === 0) return;

  buttons.forEach((btn) => syncToggleState(btn, isDark()));

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextDark = !isDark();
      document.documentElement.classList.toggle('dark', nextDark);
      try {
        localStorage.setItem(STORAGE_KEY, nextDark ? 'dark' : 'light');
      } catch {
        // localStorage unavailable, class still toggles for the session.
      }
      buttons.forEach((b) => syncToggleState(b, nextDark));
    });
  });
}
