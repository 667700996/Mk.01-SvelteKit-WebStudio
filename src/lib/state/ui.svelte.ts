import { browser } from "$app/environment";

export type ThemePreference = "system" | "light" | "dark";

const THEME_KEY = "mk01-theme";

/**
 * Global, client-only UI state. Mutated exclusively from event handlers in
 * the browser, so sharing the module instance during SSR is safe.
 */
class UiState {
  paletteOpen = $state(false);
  gridVisible = $state(false);
  theme = $state<ThemePreference>("system");

  constructor() {
    if (!browser) return;
    try {
      const stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") this.theme = stored;
    } catch {
      // Storage can be unavailable (private mode, blocked cookies). Fall back to system.
    }
  }

  setTheme(preference: ThemePreference) {
    this.theme = preference;
    const root = document.documentElement;
    if (preference === "system") delete root.dataset.theme;
    else root.dataset.theme = preference;
    try {
      if (preference === "system") localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, preference);
    } catch {
      // Non-fatal: the choice still applies for this session.
    }
  }
}

export const ui = new UiState();
