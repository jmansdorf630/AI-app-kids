import { loadProgress } from "./progress";

/** Whether reduce-motion should be applied: user setting or prefers-reduced-motion when not overridden. */
export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  const progress = loadProgress();
  const userSetting = progress.settings.reduceMotion;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (userSetting === true) return true;
  if (userSetting === false) return false;
  return prefersReduced;
}

/** Apply accessibility settings from progress to the document. Call client-side on load and when settings change. */
export function applyAccessibilitySettings(): void {
  if (typeof window === "undefined") return;
  const progress = loadProgress();
  const root = document.documentElement;

  if (progress.settings.largeText) {
    root.classList.add("large-text");
  } else {
    root.classList.remove("large-text");
  }

  if (shouldReduceMotion()) {
    root.classList.add("reduce-motion");
  } else {
    root.classList.remove("reduce-motion");
  }
}

/** Initialize theme + accessibility from stored progress. Call from root layout client component. */
export function initAccessibility(): void {
  applyAccessibilitySettings();
}
