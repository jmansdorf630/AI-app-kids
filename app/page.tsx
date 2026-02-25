"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, getIsLessonUnlocked } from "@/lib/progress";
import type { ProgressState } from "@/types";
import { levelFromXp, xpProgressInLevel } from "@/types";
import { lessons, beginnerIds, explorerIds, masterIds } from "@/data/lessons";
import { ProgressBar } from "@/components/ProgressBar";
import { XPChip } from "@/components/XPChip";
import { StreakFlame } from "@/components/StreakFlame";

export default function HomePage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (progress == null) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  const completedCount = Object.values(progress.lessons).filter((l) => l.completed).length;
  const totalLessons = lessons.length;
  const progressPct = totalLessons ? (completedCount / totalLessons) * 100 : 0;
  const level = levelFromXp(progress.totalXp);
  const levelProgress = xpProgressInLevel(progress.totalXp);

  const weekly = progress.weeklyGoal;
  const weeklyProgress = Math.min(weekly.completedLessons, weekly.targetLessons);
  const weeklyTarget = weekly.targetLessons;

  const orderedIds = [...beginnerIds, ...explorerIds, ...masterIds];
  const nextLesson = orderedIds
    .map((id) => lessons.find((l) => l.id === id))
    .find((l) => l && !progress.lessons[l.id]?.completed);
  const nextUnlocked =
    nextLesson &&
    getIsLessonUnlocked(nextLesson.id, nextLesson.tier, progress, beginnerIds, explorerIds, masterIds);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">Welcome to AI Quest! 🤖</h1>
      <p className="text-gray-600 dark:text-gray-300">Learn how AI and LLMs work — one short lesson at a time.</p>

      <div className="flex flex-wrap gap-3 items-center">
        <XPChip xp={progress.totalXp} />
        <StreakFlame streak={progress.currentStreak} />
        <span className="font-bold text-indigo-600 dark:text-indigo-400">Level {level}</span>
      </div>

      <ProgressBar value={levelProgress} label={`Level ${level} → ${level + 1}`} />
      <ProgressBar value={progressPct} label="Course progress" />

      <div className="rounded-2xl border-2 border-amber-100 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-900/20 p-4">
        <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-1">📅 Weekly goal</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          {weeklyProgress}/{weeklyTarget} lessons this week
          {!weekly.bonusAwarded && weeklyTarget > 0 && (
            <span className="ml-1 font-medium text-amber-700 dark:text-amber-300"> · +{weekly.bonusXP} XP when complete</span>
          )}
        </p>
        <ProgressBar value={weeklyTarget ? (weeklyProgress / weeklyTarget) * 100 : 0} />
      </div>

      {nextLesson && nextUnlocked && (
        <div className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800/50 p-4">
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">Today&apos;s lesson</h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
            {nextLesson.emoji} {nextLesson.title}
          </p>
          <Link
            href={`/lesson/${nextLesson.id}`}
            className="inline-block w-full py-3 rounded-xl bg-indigo-500 text-white font-bold text-center hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            Continue →
          </Link>
        </div>
      )}

      {nextLesson && !nextUnlocked && (
        <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
          <p className="font-semibold text-amber-800 dark:text-amber-200">Complete the previous lesson or reach the next tier to unlock!</p>
          <Link href="/learn" className="text-indigo-600 dark:text-indigo-400 font-semibold underline mt-2 inline-block focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded">
            Go to Learn →
          </Link>
        </div>
      )}

      {!nextLesson && (
        <div className="rounded-2xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
          <p className="font-bold text-green-800 dark:text-green-200">🎉 You finished all lessons! Try Daily Challenge or review from Learn.</p>
          <Link href="/learn" className="text-indigo-600 dark:text-indigo-400 font-semibold underline mt-2 inline-block focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded">
            View map →
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/learn" className="flex-1 min-w-[120px] py-2 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 text-center font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
          📚 Lesson map
        </Link>
        <Link href="/daily" className="flex-1 min-w-[120px] py-2 rounded-xl border-2 border-amber-200 dark:border-amber-700 text-center font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
          ⚡ Daily
        </Link>
        <Link href="/profile" className="flex-1 min-w-[120px] py-2 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 text-center font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
          👤 Profile
        </Link>
      </div>
    </div>
  );
}
