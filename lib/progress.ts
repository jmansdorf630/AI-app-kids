"use client";

import type { ProgressState, LessonProgress, BadgeId } from "@/types";
import { DEFAULT_BADGES } from "@/types";

const STORAGE_KEY = "ai-quest-progress";

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function createDefaultState(): ProgressState {
  return {
    lessons: {},
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    badges: JSON.parse(JSON.stringify(DEFAULT_BADGES)),
  };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return createDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as ProgressState;
    // Ensure badges array exists and has defaults for any missing
    if (!parsed.badges || !Array.isArray(parsed.badges)) {
      parsed.badges = JSON.parse(JSON.stringify(DEFAULT_BADGES));
    }
    return parsed;
  } catch {
    return createDefaultState();
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

function getActivityDates(state: ProgressState): Set<string> {
  const dates = new Set<string>();
  for (const lp of Object.values(state.lessons)) {
    if (lp.lastCompletedDate) dates.add(lp.lastCompletedDate);
  }
  return dates;
}

/**
 * Compute current streak: consecutive days (today, yesterday, ...) with at least one lesson completed.
 */
export function computeStreak(state: ProgressState): number {
  const dates = getActivityDates(state);
  if (dates.size === 0) return 0;

  const today = getTodayDateString();
  let d = new Date(today);
  let streak = 0;
  while (true) {
    const dateStr = d.toISOString().slice(0, 10);
    if (!dates.has(dateStr)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function updateStreaks(state: ProgressState): ProgressState {
  const currentStreak = computeStreak(state);
  const longest = Math.max(state.longestStreak, currentStreak);
  return { ...state, currentStreak, longestStreak: longest };
}

function awardBadges(state: ProgressState, lessonId: string, totalXp: number, completedCount: number): ProgressState {
  const badges = state.badges.map((b) => ({ ...b }));
  const now = new Date().toISOString().slice(0, 10);

  const setBadge = (id: BadgeId) => {
    const b = badges.find((x) => x.id === id);
    if (b && !b.earnedAt) b.earnedAt = now;
  };

  if (completedCount >= 1) setBadge("first_lesson");
  if (state.currentStreak >= 3) setBadge("streak_3");
  if (totalXp >= 100) setBadge("xp_100");
  if (lessonId === "4-hallucinations") setBadge("hallucination_hunter");
  if (completedCount >= 8) setBadge("prompt_master");

  return { ...state, badges };
}

export function completeLesson(
  state: ProgressState,
  lessonId: string,
  score: number,
  xpEarned: number
): ProgressState {
  const today = getTodayDateString();
  const existing: LessonProgress = state.lessons[lessonId] ?? {
    completed: false,
    bestScore: 0,
    lastCompletedDate: null,
    xpEarned: 0,
  };

  const updatedLessons: Record<string, LessonProgress> = {
    ...state.lessons,
    [lessonId]: {
      completed: true,
      bestScore: Math.max(existing.bestScore, score),
      lastCompletedDate: today,
      xpEarned: existing.xpEarned + xpEarned,
    },
  };

  let newState: ProgressState = {
    ...state,
    lessons: updatedLessons,
    totalXp: state.totalXp + xpEarned,
    lastActivityDate: today,
  };

  newState = updateStreaks(newState);
  const completedCount = Object.values(newState.lessons).filter((l) => l.completed).length;
  newState = awardBadges(newState, lessonId, newState.totalXp, completedCount);
  return newState;
}

export function isLessonUnlocked(lessonIds: string[], lessonIndex: number, state: ProgressState): boolean {
  if (lessonIndex === 0) return true;
  const prevId = lessonIds[lessonIndex - 1];
  return state.lessons[prevId]?.completed === true;
}

export function resetProgress(): ProgressState {
  const fresh = createDefaultState();
  if (typeof window !== "undefined") saveProgress(fresh);
  return fresh;
}
