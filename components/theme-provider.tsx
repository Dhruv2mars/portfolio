"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import {
  THEME_STORAGE_KEY,
  cycleThemePreference,
  parseStoredTheme,
  resolveTheme,
  type ThemeMode,
  type ThemePreference,
} from "@/lib/theme";

const THEME_CHANGE_EVENT = "portfolio-theme-change";

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ThemeMode;
  setPreference: (preference: ThemePreference) => void;
  cycle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredPreference(): ThemePreference {
  try {
    return parseStoredTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return "system";
  }
}

function writeStoredPreference(preference: ThemePreference) {
  try {
    if (preference === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    // Ignore quota / private-mode failures.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

function getSystemPreference(): ThemeMode | null {
  if (typeof window === "undefined" || !window.matchMedia) {
    return null;
  }
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return null;
}

function subscribeSystemPreference(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: light)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function subscribeStoredPreference(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

function applyResolvedTheme(resolved: ThemeMode, animate: boolean) {
  const root = document.documentElement;
  if (
    animate &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 220);
  }
  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");
  root.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useSyncExternalStore(
    subscribeStoredPreference,
    readStoredPreference,
    () => "system" as const,
  );
  const systemPreference = useSyncExternalStore(
    subscribeSystemPreference,
    getSystemPreference,
    () => null,
  );

  const resolved = resolveTheme(preference, systemPreference);

  useEffect(() => {
    applyResolvedTheme(resolved, false);
  }, [resolved]);

  const setPreference = useCallback((next: ThemePreference) => {
    writeStoredPreference(next);
    applyResolvedTheme(resolveTheme(next, getSystemPreference()), true);
  }, []);

  const cycle = useCallback(() => {
    setPreference(cycleThemePreference(preference));
  }, [preference, setPreference]);

  return (
    <ThemeContext.Provider
      value={{ preference, resolved, setPreference, cycle }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}
