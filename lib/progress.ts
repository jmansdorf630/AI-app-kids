"use client";

import type { ProgressState, LessonProgress, BadgeId, SkillTag, LessonTier } from "@/types";
import { DEFAULT_BADGES, DEFAULT_SKILLS, streakMultiplier } from "@/types";

const STORAGE_KEY = "ai-quest-progress";
const MASTER_TIER_XP_THRESHOLD = 300;

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
    skills: { ...DEFAULT_SKILLS },
    lastDailyChallengeDate: null,
  };
}

function migrateState(parsed: ProgressState): ProgressState {
  if (!parsed.skills) parsed.skills = { ...DEFAULT_SKILLS };
  if (parsed.lastDailyChallengeDate === undefined) parsed.lastDailyChallengeDate = null;
  return parsed;
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return createDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw) as ProgressState;
    if (!parsed.badges || !Array.isArray(parsed.badges)) {
      parsed.badges = JSON.parse(JSON.stringify(DEFAULT_BADGES));
    }
    return migrateState(parsed);
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

export function addSkillXp(state: ProgressState, skillTag: SkillTag, skillXP: number): ProgressState {
  const skills = { ...state.skills, [skillTag]: (state.skills[skillTag] ?? 0) + skillXP };
  return { ...state, skills };
}

/** Apply streak multiplier to base XP */
export function applyStreakMultiplier(baseXp: number, streak: number): number {
  return Math.round(baseXp * streakMultiplier(streak));
}

export function completeLesson(
  state: ProgressState,
  lessonId: string,
  score: number,
  baseXpEarned: number,
  options?: { bonusXpMultiplier?: number }
): ProgressState {
  const today = getTodayDateString();
  const mult = options?.bonusXpMultiplier ?? streakMultiplier(state.currentStreak);
  const xpEarned = Math.round(baseXpEarned * mult);

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

/** Legacy: linear unlock (previous lesson completed). Use for non-tier lists. */
export function isLessonUnlocked(lessonIds: string[], lessonIndex: number, state: ProgressState): boolean {
  if (lessonIndex === 0) return true;
  const prevId = lessonIds[lessonIndex - 1];
  return state.lessons[prevId]?.completed === true;
}

export function getIsLessonUnlocked(
  lessonId: string,
  lessonTier: LessonTier,
  state: ProgressState,
  beginnerIds: string[],
  explorerIds: string[],
  masterIds: string[]
): boolean {
  if (lessonTier === "beginner") {
    const i = beginnerIds.indexOf(lessonId);
    if (i === 0) return true;
    const prevId = beginnerIds[i - 1];
    return state.lessons[prevId]?.completed === true;
  }
  if (lessonTier === "explorer") {
    const allBeginnerDone = beginnerIds.every((id) => state.lessons[id]?.completed === true);
    if (!allBeginnerDone) return false;
    const i = explorerIds.indexOf(lessonId);
    if (i === 0) return true;
    const prevId = explorerIds[i - 1];
    return state.lessons[prevId]?.completed === true;
  }
  // master
  const allExplorerDone = explorerIds.every((id) => state.lessons[id]?.completed === true);
  if (!allExplorerDone) return false;
  if (state.totalXp < MASTER_TIER_XP_THRESHOLD) return false;
  const i = masterIds.indexOf(lessonId);
  if (i === 0) return true;
  const prevId = masterIds[i - 1];
  return state.lessons[prevId]?.completed === true;
}

export function canAccessDailyChallenge(state: ProgressState): boolean {
  const today = getTodayDateString();
  return state.lastDailyChallengeDate !== today;
}

export function completeDailyChallenge(state: ProgressState, xpEarned: number): ProgressState {
  const today = getTodayDateString();
  return {
    ...state,
    totalXp: state.totalXp + xpEarned,
    lastDailyChallengeDate: today,
  };
}

export function resetProgress(): ProgressState {
  const fresh = createDefaultState();
  if (typeof window !== "undefined") saveProgress(fresh);
  return fresh;
}
