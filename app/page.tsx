"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, getIsLessonUnlocked } from "@/lib/progress";
import type { ProgressState } from "@/types";
import { levelFromXp, xpProgressInLevel, xpForNextLevel } from "@/types";
import { lessons, beginnerIds, explorerIds, masterIds } from "@/data/lessons";
import { ProgressBar } from "@/components/ProgressBar";
import { XPChip } from "@/components/XPChip";
import { StreakFlame } from "@/components/StreakFlame";
import { AvatarRenderer } from "@/components/avatar/AvatarRenderer";

const focusRing =
  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900";

export default function HomePage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (progress == null) {
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  const completedCount = Object.values(progress.lessons).filter((l) => l.completed).length;
  const totalLessons = lessons.length;
  const progressPct = totalLessons ? (completedCount / totalLessons) * 100 : 0;
  const level = levelFromXp(progress.totalXp);
  const levelProgress = xpProgressInLevel(progress.totalXp);
  const xpToNextLevel = Math.max(0, xpForNextLevel(progress.totalXp) - progress.totalXp);

  const weekly = progress.weeklyGoal;
  const weeklyProgress = Math.min(weekly.completedLessons, weekly.targetLessons);
  const weeklyTarget = weekly.targetLessons;
  const weeklyComplete = weeklyTarget > 0 && weekly.completedLessons >= weekly.targetLessons;

  const orderedIds = [...beginnerIds, ...explorerIds, ...masterIds];
  const nextLesson = orderedIds
    .map((id) => lessons.find((l) => l.id === id))
    .find((l) => l && !progress.lessons[l.id]?.completed);
  const nextUnlocked =
    nextLesson &&
    getIsLessonUnlocked(nextLesson.id, nextLesson.tier, progress, beginnerIds, explorerIds, masterIds);

  const earnedBadges = progress.badges.filter((b) => b.earnedAt);
  const mostRecentBadge = earnedBadges.length > 0
    ? [...earnedBadges].sort(
        (a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime()
      )[0]
    : null;

  const avatarEquipped = progress.avatar?.equipped ?? { bodyColor: "blue", eyes: "happy", headgear: null, accessory: null, effect: null };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <AvatarRenderer equipped={avatarEquipped} size="sm" />
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">Welcome to AI Quest! 🤖</h1>
          <p className="text-gray-600 dark:text-gray-300">Learn how AI and LLMs work — one short lesson at a time.</p>
        </div>
      </div>

      {/* Top summary: XP, Streak, Level */}
      <div className="flex flex-wrap gap-3 items-center">
        <XPChip xp={progress.totalXp} />
        {progress.currentStreak > 0 ? (
          <span
            className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-700 rounded-full px-3 py-1 animate-pulse motion-reduce:animate-none"
            title={`${progress.currentStreak} day streak!`}
          >
            <span className="text-xl" aria-hidden>🔥</span>
            <span>Streak: {progress.currentStreak} days</span>
          </span>
        ) : (
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 italic">
            Start a streak today!
          </span>
        )}
        <span className="font-bold text-indigo-600 dark:text-indigo-400">Level {level}</span>
      </div>

      {/* PRIMARY CTA: one dominant action */}
      {nextLesson && nextUnlocked && (
        <section className="rounded-2xl border-2 border-indigo-400 dark:border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-slate-800/60 p-6 sm:p-8 shadow-xl dark:shadow-indigo-900/30">
          <p className="font-bold text-xl sm:text-2xl text-gray-800 dark:text-gray-100 mb-1">
            {nextLesson.emoji} {nextLesson.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Your next lesson — ready when you are!
          </p>
          <Link
            href={`/lesson/${nextLesson.id}`}
            className={`block w-full py-5 rounded-xl bg-indigo-500 text-white font-bold text-center text-lg sm:text-xl hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition shadow-lg hover:shadow-xl ${focusRing}`}
          >
            Continue →
          </Link>
        </section>
      )}

      {nextLesson && !nextUnlocked && (
        <section className="rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-md">
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">Next up</h2>
          <p className="text-amber-800 dark:text-amber-200 mb-4">
            Complete the previous lesson or reach the next tier to unlock.
          </p>
          <Link
            href="/learn"
            className={`block w-full py-4 rounded-xl bg-amber-500 text-white font-bold text-center hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 ${focusRing}`}
          >
            Go to Learn →
          </Link>
        </section>
      )}

      {!nextLesson && (
        <section className="rounded-2xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-5 shadow-md">
          <p className="font-bold text-green-800 dark:text-green-200 mb-4">
            🎉 You finished all lessons! Try Daily Challenge or review from Learn.
          </p>
          <Link href="/learn" className={`block w-full py-4 rounded-xl bg-green-500 text-white font-bold text-center hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 ${focusRing}`}>
            View map →
          </Link>
        </section>
      )}

      {/* Secondary CTAs */}
      <div className="flex flex-wrap gap-2">
        <Link href="/daily" className={`flex-1 min-w-[100px] py-2.5 rounded-xl border-2 border-amber-200 dark:border-amber-700 text-center text-sm font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 ${focusRing}`}>
          ⚡ Daily Challenge
        </Link>
        <Link href="/learn" className={`flex-1 min-w-[100px] py-2.5 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 text-center text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 ${focusRing}`}>
          🗺️ Lesson Map
        </Link>
        <Link href="/profile" className={`flex-1 min-w-[100px] py-2.5 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 text-center text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 ${focusRing}`}>
          🏆 Profile
        </Link>
      </div>

      {/* Collapsible: Your progress */}
      <details className="rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-800/30 overflow-hidden">
        <summary className="px-4 py-3 font-bold text-gray-800 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between gap-2">
          <span>Your progress</span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            {completedCount}/{totalLessons} lessons · Lv {level}
          </span>
        </summary>
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-gray-200 dark:border-slate-600">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Level · {Math.round(levelProgress)}% to Level {level + 1}</p>
            <ProgressBar value={levelProgress} label={`${xpToNextLevel} XP to next level`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</p>
            <ProgressBar value={progressPct} label={`${completedCount} of ${totalLessons} lessons`} />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">📅 Weekly Mission</p>
              {weeklyComplete && <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Done ✅</span>}
            </div>
            <ProgressBar value={weeklyTarget ? (weeklyProgress / weeklyTarget) * 100 : 0} label={`${weeklyProgress}/${weeklyTarget} lessons · +${weekly.bonusXP} XP reward`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">🏅 Achievements</p>
            {mostRecentBadge ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{mostRecentBadge.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{mostRecentBadge.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{mostRecentBadge.description}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Earn your first badge by completing a lesson!</p>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}
