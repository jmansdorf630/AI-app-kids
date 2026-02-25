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

      {/* 1) HERO: Today's Lesson (above Weekly Goal) */}
      {nextLesson && nextUnlocked && (
        <section className="rounded-2xl border-2 border-indigo-300 dark:border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-slate-800/60 p-5 sm:p-6 shadow-lg dark:shadow-indigo-900/20">
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">Today&apos;s lesson</h2>
          <p className="text-sm text-indigo-600 dark:text-indigo-300 mb-1">
            ⚡ Ready to level up?
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            🤖 Start your AI adventure
          </p>
          <p className="font-bold text-xl text-gray-800 dark:text-gray-100 mb-4">
            {nextLesson.emoji} {nextLesson.title}
          </p>
          <Link
            href={`/lesson/${nextLesson.id}`}
            className={`block w-full py-4 rounded-xl bg-indigo-500 text-white font-bold text-center text-lg hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition shadow-md hover:shadow-lg ${focusRing}`}
          >
            Continue →
          </Link>
        </section>
      )}

      {nextLesson && !nextUnlocked && (
        <section className="rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 shadow-md">
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-1">Today&apos;s lesson</h2>
          <p className="font-semibold text-amber-800 dark:text-amber-200">
            Complete the previous lesson or reach the next tier to unlock!
          </p>
          <Link
            href="/learn"
            className={`mt-3 inline-block text-indigo-600 dark:text-indigo-400 font-semibold underline ${focusRing} rounded`}
          >
            Go to Learn →
          </Link>
        </section>
      )}

      {!nextLesson && (
        <section className="rounded-2xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4 shadow-md">
          <p className="font-bold text-green-800 dark:text-green-200">
            🎉 You finished all lessons! Try Daily Challenge or review from Learn.
          </p>
          <Link href="/learn" className={`text-indigo-600 dark:text-indigo-400 font-semibold underline mt-2 inline-block ${focusRing} rounded`}>
            View map →
          </Link>
        </section>
      )}

      {/* 4) Weekly Mission (gamified) */}
      <section className="rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-900/25 p-4 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">📅 Weekly Mission</h2>
          {weeklyComplete ? (
            <span className="text-sm font-bold text-amber-700 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-800/40 px-2 py-0.5 rounded-full">
              {weekly.bonusAwarded ? "Reward claimed ✅" : "Completed! ✅"}
            </span>
          ) : (
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300" aria-hidden>
              🎁
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-200 mb-1">
          Complete <strong>{weeklyTarget}</strong> lessons this week
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mb-2">
          Reward: +{weekly.bonusXP} XP 🎁
        </p>
        <ProgressBar value={weeklyTarget ? (weeklyProgress / weeklyTarget) * 100 : 0} label={`${weeklyProgress}/${weeklyTarget} lessons`} />
      </section>

      {/* 3) Level Progress (single card) + Course progress (secondary) */}
      <section className="rounded-xl border-2 border-indigo-100 dark:border-indigo-900 bg-white dark:bg-slate-800/40 p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Level Progress</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          Level {level} · {Math.round(levelProgress)}% to Level {level + 1}
        </p>
        <ProgressBar value={levelProgress} label={`${xpToNextLevel} XP to next level`} />
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/30 p-3 shadow-sm">
        <ProgressBar value={progressPct} label="Course progress" />
      </section>

      {/* 6) Achievements preview */}
      <section className="rounded-xl border-2 border-amber-100 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/15 p-4 shadow-sm">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">🏅 Achievements</h3>
        {mostRecentBadge ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl">{mostRecentBadge.emoji}</span>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{mostRecentBadge.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{mostRecentBadge.description}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No badges yet — finish a lesson to earn your first!
          </p>
        )}
      </section>

      {/* 8) Action-oriented secondary CTAs */}
      <div className="flex flex-wrap gap-2 pt-2">
        <Link
          href="/daily"
          className={`flex-1 min-w-[100px] py-2.5 rounded-xl border-2 border-amber-200 dark:border-amber-700 text-center text-sm font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 ${focusRing}`}
        >
          ⚡ Daily Challenge
        </Link>
        <Link
          href="/learn"
          className={`flex-1 min-w-[100px] py-2.5 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 text-center text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 ${focusRing}`}
        >
          🗺️ Lesson Map
        </Link>
        <Link
          href="/profile"
          className={`flex-1 min-w-[100px] py-2.5 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 text-center text-sm font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 ${focusRing}`}
        >
          🏆 View Badges
        </Link>
      </div>
    </div>
  );
}
