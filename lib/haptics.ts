"use client";

export type HapticType = "light" | "success" | "error";

const PATTERNS: Record<HapticType, number | number[]> = {
  light: 10,
  success: [10, 20, 10],
  error: [30, 20, 30],
};

export function canVibrate(): boolean {
  if (typeof navigator === "undefined") return false;
  return "vibrate" in navigator;
}

export function vibrate(type: HapticType, enabled: boolean): void {
  if (typeof navigator === "undefined") return;
  if (!enabled || !canVibrate()) return;
  try {
    navigator.vibrate(PATTERNS[type]);
  } catch {
    // ignore
  }
}
