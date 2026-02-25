import type { ThemeMode } from "@/types";
import { loadProgress } from "./progress";

export function getTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const progress = loadProgress();
  return progress.settings.theme ?? "light";
}

export function setTheme(theme: ThemeMode): void {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/** Call on app load to apply stored theme. Run client-side only (e.g. from a client component mount). */
export function initTheme(): void {
  if (typeof window === "undefined") return;
  const theme = getTheme();
  setTheme(theme);
}
