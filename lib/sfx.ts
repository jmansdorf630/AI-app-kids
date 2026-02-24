"use client";

export type SfxName = "click" | "correct" | "wrong" | "levelup" | "complete";

const SFX_PATHS: Record<SfxName, string> = {
  click: "/sfx/click.mp3",
  correct: "/sfx/correct.mp3",
  wrong: "/sfx/wrong.mp3",
  levelup: "/sfx/levelup.mp3",
  complete: "/sfx/complete.mp3",
};

let audioCache: Partial<Record<SfxName, HTMLAudioElement>> = {};
let initialized = false;
let muted = false;
let getMutedRef: (() => boolean) | null = null;

/** Call after first user gesture (e.g. first click). Respects iOS autoplay. */
export function initSfx(getMuted: () => boolean): void {
  if (typeof window === "undefined") return;
  getMutedRef = getMuted;
  muted = getMuted();
  if (initialized) return;
  initialized = true;
  (Object.keys(SFX_PATHS) as SfxName[]).forEach((name) => {
    const audio = new Audio(SFX_PATHS[name]);
    audio.preload = "auto";
    audio.volume = 0.6;
    audioCache[name] = audio;
  });
}

export function playSfx(name: SfxName): void {
  if (typeof window === "undefined") return;
  const isMuted = getMutedRef ? getMutedRef() : muted;
  if (isMuted) return;
  const audio = audioCache[name];
  if (!audio) return;
  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

export function setMuted(value: boolean): void {
  muted = value;
}

export function getMuted(): boolean {
  return getMutedRef ? getMutedRef() : muted;
}

export function setMutedRef(fn: () => boolean): void {
  getMutedRef = fn;
}
