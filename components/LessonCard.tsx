"use client";

import Link from "next/link";
import type { Lesson, LearnTierKey } from "@/types";

const focusRing =
  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900";

export type LessonCardState = "completed" | "nextUp" | "locked" | "available";

interface LessonCardProps {
  lesson: Lesson;
  state: LessonCardState;
  bestScore?: number;
  unlockRequirement?: string;
  tier?: LearnTierKey;
}

const XP_PILL_BY_TIER: Record<LearnTierKey, string> = {
  beginner:
    "font-bold text-amber-700 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700",
  explorer:
    "font-bold text-indigo-700 dark:text-indigo-200 bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-600",
  master:
    "font-bold text-amber-600 dark:text-amber-100 bg-amber-200/60 dark:bg-amber-800/40 border border-amber-400 dark:border-amber-600",
};

export function LessonCard({ lesson, state, bestScore, unlockRequirement, tier = "beginner" }: LessonCardProps) {
  const isLocked = state === "locked";
  const isNextUp = state === "nextUp";
  const isCompleted = state === "completed";
  const href = isLocked ? "#" : `/lesson/${lesson.id}`;

  const xpPillClass = XP_PILL_BY_TIER[tier];
  const baseCard =
    "block rounded-2xl border-2 p-4 shadow-sm transition text-left w-full " + focusRing;

  const cardStyle = isLocked
    ? `${baseCard} border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/40 opacity-60 cursor-not-allowed pointer-events-none`
    : isNextUp
      ? `${baseCard} border-indigo-400 dark:border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-md hover:shadow-lg`
      : isCompleted
        ? `${baseCard} border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800/50 hover:shadow-md`
        : `${baseCard} border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800/50 hover:shadow-md`;

  const content = (
    <>
      <div className="flex items-start gap-3">
        <span className="text-4xl flex-shrink-0">
          {isLocked ? "🔒" : lesson.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{lesson.title}</h3>
            {isCompleted && (
              <span className="flex-shrink-0 text-sm font-semibold text-green-600 dark:text-green-400">
                ✅ Completed
              </span>
            )}
            {isNextUp && (
              <span className="flex-shrink-0 text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                👉 Next up
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-0.5">{lesson.description}</p>
          {isLocked && unlockRequirement && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
              {unlockRequirement}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm ${xpPillClass} ${isCompleted ? "opacity-80" : ""}`}
              title={`Earn ${lesson.xpReward} XP`}
            >
              <span>⭐</span>
              <span>{lesson.xpReward} XP</span>
            </span>
            {isCompleted && bestScore != null && (
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Score: {bestScore}%
              </span>
            )}
            {isNextUp && !isLocked && (
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                Continue →
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  if (isLocked) {
    return (
      <div className={cardStyle} aria-disabled="true">
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className={cardStyle}>
      {content}
    </Link>
  );
}
