/**
 * Lightweight sanity checks for progress and lesson data.
 * Run these in dev or in a simple test script; no Jest required.
 */

import type { ProgressState } from "@/types";
import { DEFAULT_BADGES, DEFAULT_SKILLS, DEFAULT_SETTINGS, DEFAULT_AVATAR_STATE, getWeekStartISO } from "@/types";
import { lessons, lessonIds } from "@/data/lessons";
import { completeLesson } from "./progress";

function getDefaultState(): ProgressState {
  return {
    lessons: {},
    totalXp: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    badges: JSON.parse(JSON.stringify(DEFAULT_BADGES)),
    skills: { ...DEFAULT_SKILLS },
    lastDailyChallengeDate: null,
    settings: { ...DEFAULT_SETTINGS },
    weeklyGoal: {
      weekStartISO: getWeekStartISO(),
      targetLessons: 3,
      completedLessons: 0,
      completedLessonIdsThisWeek: [],
      bonusXP: 30,
      bonusAwarded: false,
    },
    lastLessonRun: null,
    avatar: { equipped: { ...DEFAULT_AVATAR_STATE.equipped }, inventory: [...DEFAULT_AVATAR_STATE.inventory] },
  };
}

export function sanityCheckLessons(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const lesson of lessons) {
    if (!lesson.id || !lesson.title || !lesson.steps?.length) {
      errors.push(`Lesson missing id/title/steps: ${lesson.id ?? lesson.title ?? "?"}`);
    }
    if (ids.has(lesson.id)) errors.push(`Duplicate lesson id: ${lesson.id}`);
    ids.add(lesson.id);

    const stepIds = new Set<string>();
    for (const step of lesson.steps) {
      if (!step.id || !step.type) errors.push(`Step in ${lesson.id} missing id/type`);
      if (stepIds.has(step.id)) errors.push(`Duplicate step id in ${lesson.id}: ${step.id}`);
      stepIds.add(step.id);

      if (step.type === "mcq" || (step as { type: string }).type === "spot") {
        const opts = (step as { options?: { correct: boolean }[] }).options;
        if (!opts?.length) errors.push(`MCQ/spot step ${step.id} has no options`);
        const correctCount = opts?.filter((o) => o.correct).length ?? 0;
        if (correctCount !== 1) errors.push(`MCQ/spot step ${step.id} must have exactly one correct option`);
      }
    }
  }

  if (lessons.length < 8) errors.push(`Expected at least 8 lessons, got ${lessons.length}`);

  return { ok: errors.length === 0, errors };
}

export function sanityCheckProgress(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const state = getDefaultState();

  const after1 = completeLesson(state, "1-what-is-ai", 80, 15);
  if (after1.totalXp !== 15) errors.push(`After lesson 1, totalXp should be 15, got ${after1.totalXp}`);
  if (!after1.lessons["1-what-is-ai"]?.completed) errors.push("Lesson 1 should be completed");

  const after4 = completeLesson(after1, "4-hallucinations", 100, 25);
  const badge = after4.badges.find((b) => b.id === "hallucination_hunter");
  if (!badge?.earnedAt) errors.push("Hallucination Hunter badge should be earned after lesson 4");

  return { ok: errors.length === 0, errors };
}

export function runSanityChecks(): boolean {
  const l = sanityCheckLessons();
  const p = sanityCheckProgress();
  const allOk = l.ok && p.ok;
  if (!l.ok) console.warn("Lesson sanity errors:", l.errors);
  if (!p.ok) console.warn("Progress sanity errors:", p.errors);
  return allOk;
}
