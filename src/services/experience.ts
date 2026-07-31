import { writable } from "svelte/store";
import { appConfig, type ExperienceConfig } from "$config/app.config";
import { browser } from "$app/environment";

type ThemeMode = "day" | "night" | "aurora";

interface ExperienceState {
  theme: ThemeMode;
  isCommandPaletteOpen: boolean;
  isAmbientAudioPlaying: boolean;
  isPerformanceMode: boolean;
  isDevMode: boolean; // Hidden dev mode
}

const defaultState: ExperienceState = {
  theme: "day",
  isCommandPaletteOpen: false,
  isAmbientAudioPlaying: false,
  isPerformanceMode: false,
  isDevMode: false,
};

function createExperienceStore(config: ExperienceConfig) {
  // Load from localStorage if available, but guard against corrupted data.
  const storedState = (() => {
    if (!browser) return {};
    try {
      const raw = localStorage.getItem("mk01_experience");
      if (!raw) return {};
      return JSON.parse(raw);
    } catch (err) {
      console.warn(
        "Resetting mk01_experience store due to storage access or parse error",
        err,
      );
      try {
        localStorage.removeItem("mk01_experience");
      } catch {
        // Ignore if we can't remove
      }
      return {};
    }
  })();

  const initialState: ExperienceState = {
    ...defaultState,
    ...storedState,
    theme:
      storedState.theme ||
      (config.defaultTheme === "system" ? "day" : config.defaultTheme),
    // Always reset transient states
    isCommandPaletteOpen: false,
  };

  const state = writable<ExperienceState>(initialState);

  // Persist changes
  if (browser) {
    state.subscribe((value) => {
      const persistable = {
        theme: value.theme,
        isAmbientAudioPlaying: value.isAmbientAudioPlaying,
        isPerformanceMode: value.isPerformanceMode,
        isDevMode: value.isDevMode,
      };
      localStorage.setItem("mk01_experience", JSON.stringify(persistable));

      // Sync theme with DOM for immediate CSS effect
      document.documentElement.dataset.theme =
        value.theme === "aurora"
          ? "studio-pro-dark"
          : value.theme === "night"
            ? "studio-dark"
            : "studio-light";
    });
  }

  return {
    subscribe: state.subscribe,
    setTheme: (value: ThemeMode) =>
      state.update((current) => ({
        ...current,
        theme: value,
      })),
    toggleTheme: () =>
      state.update((current) => ({
        ...current,
        theme:
          current.theme === "day"
            ? "night"
            : current.theme === "night"
              ? "aurora"
              : "day",
      })),
    openCommandPalette: () =>
      state.update((current) => ({
        ...current,
        isCommandPaletteOpen: true,
      })),
    closeCommandPalette: () =>
      state.update((current) => ({
        ...current,
        isCommandPaletteOpen: false,
      })),
    toggleAmbientAudio: () =>
      state.update((current) => ({
        ...current,
        isAmbientAudioPlaying: !current.isAmbientAudioPlaying,
      })),
    togglePerformanceMode: () =>
      state.update((current) => ({
        ...current,
        isPerformanceMode: !current.isPerformanceMode,
      })),
    toggleDevMode: () =>
      state.update((current) => ({
        ...current,
        isDevMode: !current.isDevMode,
      })),
  };
}

export const experienceStore = createExperienceStore(appConfig.experience);
