"use client";

import { useEffect, useState } from "react";
import { loadProgress, getIsLessonUnlocked, saveProgress, setLearnTierCollapsed } from "@/lib/progress";
import type { ProgressState, LearnTierKey } from "@/types";
import { lessons, beginnerIds, explorerIds, masterIds } from "@/data/lessons";
import {
  getTierProgress,
  isTierLocked,
  getNextUpLessonId,
  getUnlockRequirement,
  TIER_REWARDS,
} from "@/lib/learnHelpers";
import { LessonCard, type LessonCardState } from "@/components/LessonCard";
import { ProgressBar } from "@/components/ProgressBar";
import { PageSkeleton } from "@/components/PageSkeleton";

const TIERS: {
  key: LearnTierKey;
  label: string;
  description: string;
}[] = [
  { key: "beginner", label: "Beginner", description: "Learn the basics of AI and prompts." },
  { key: "explorer", label: "Explorer", description: "Go deeper into how AI predicts and learns." },
  { key: "master", label: "Master", description: "Advanced topics and real-world impacts." },
];

const LOCKED_COPY: Record<LearnTierKey, string> = {
  beginner: "",
  explorer: "Locked — complete Beginner to unlock",
  master: "Locked — reach 300 XP to unlock",
};

function getDefaultCollapsed(progress: ProgressState): Record<LearnTierKey, boolean> {
  return {
    beginner: false,
    explorer: isTierLocked("explorer", progress),
    master: isTierLocked("master", progress),
  };
}

export default function LearnPage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (progress == null) {
    return <PageSkeleton />;
  }

  const nextUpId = getNextUpLessonId(progress);

  const getLessonState = (
    lessonId: string,
    tier: LearnTierKey,
    unlocked: boolean,
    completed: boolean
  ): LessonCardState => {
    if (completed) return "completed";
    if (unlocked && lessonId === nextUpId) return "nextUp";
    if (!unlocked) return "locked";
    return "available";
  };

  const isTierCollapsed = (tier: LearnTierKey): boolean => {
    const collapsed = progress.ui?.learnTierCollapsed;
    if (collapsed && collapsed[tier] !== undefined) return collapsed[tier];
    return getDefaultCollapsed(progress)[tier];
  };

  const toggleTier = (tier: LearnTierKey) => {
    const next = setLearnTierCollapsed(progress, tier, !isTierCollapsed(tier));
    saveProgress(next);
    setProgress(next);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-100">📚 Lesson map</h1>
      <p className="text-gray-600 dark:text-gray-300">
        Complete lessons in each tier. Explorer unlocks after Beginner; Master unlocks at 300+ XP after Explorer.
      </p>

      {TIERS.map(({ key, label, description }) => {
        const tierLessons = lessons.filter((l) => l.tier === key);
        if (tierLessons.length === 0) return null;

        const tierLocked = isTierLocked(key, progress);
        const tierProg = getTierProgress(progress, key);
        const tierComplete = tierProg.total > 0 && tierProg.completed === tierProg.total;
        const collapsed = isTierCollapsed(key);
        const reward = TIER_REWARDS[key];

        return (
          <section
            key={key}
            className={`rounded-2xl border-2 p-4 transition ${
              tierLocked
                ? "border-gray-200 dark:border-slate-700 bg-gray-50/60 dark:bg-slate-800/30 opacity-90"
                : "border-indigo-100 dark:border-indigo-900 bg-white dark:bg-slate-800/40"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleTier(key)}
              className="w-full flex items-center justify-between gap-2 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded-lg py-1"
              aria-expanded={!collapsed}
            >
              <div>
                <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  {label}
                  <span
                    className={`inline-block transition-transform ${collapsed ? "" : "rotate-180"}`}
                    aria-hidden
                  >
                    ▼
                  </span>
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{description}</p>
                {tierLocked ? (
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mt-1">
                    {LOCKED_COPY[key]}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {tierProg.completed} / {tierProg.total} completed
                  </p>
                )}
              </div>
            </button>

            {!tierLocked && (
              <div className="mt-2 mb-3">
                <ProgressBar
                  value={tierProg.percent}
                  label={`${tierProg.completed} / ${tierProg.total} completed`}
                />
              </div>
            )}

            {!collapsed && (
              <div className={`space-y-3 ${tierLocked ? "pointer-events-none" : ""}`}>
                {tierLessons.map((lesson) => {
                  const unlocked = !tierLocked && getIsLessonUnlocked(lesson.id, lesson.tier, progress, beginnerIds, explorerIds, masterIds);
                  const completed = progress.lessons[lesson.id]?.completed ?? false;
                  const state = getLessonState(lesson.id, key, unlocked, completed);
                  const unlockReq = state === "locked" ? getUnlockRequirement(lesson.id, key, progress) : undefined;

                  return (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      state={state}
                      bestScore={progress.lessons[lesson.id]?.bestScore}
                      unlockRequirement={unlockReq}
                      tier={key}
                    />
                  );
                })}
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
              {tierComplete ? (
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Reward earned ✅ {reward.emoji} {reward.badge}
                </p>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Finish {label} → Earn {reward.emoji} {reward.badge} badge
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
