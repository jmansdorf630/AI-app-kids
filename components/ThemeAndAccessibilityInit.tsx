"use client";

import { useEffect } from "react";
import { initTheme } from "@/lib/theme";
import { initAccessibility } from "@/lib/accessibility";

/** Runs theme, accessibility, and service worker registration on mount. Renders nothing. */
export function ThemeAndAccessibilityInit() {
  useEffect(() => {
    initTheme();
    initAccessibility();

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then(
          (reg) => {
            if (process.env.NODE_ENV === "development") {
              console.log("[AI Quest] Service worker registered", reg.scope);
            }
          },
          (err) => {
            if (process.env.NODE_ENV === "development") {
              console.warn("[AI Quest] Service worker registration failed", err);
            }
          }
        );
      });
    }
  }, []);
  return null;
}
