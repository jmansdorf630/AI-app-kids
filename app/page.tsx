"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, getIsLessonUnlocked } from "@/lib/progress";
import type { ProgressState } from "@/types";
import { levelFromXp, xpProgressInLevel, xpForNextLevel } from "@/types";
import { lessons, beginnerIds, explorerIds, masterIds } from "@/data/lessons";
import { ProgressBar } from "@/components/ProgressBar";
import { XPChip } from "@/components/XPChip";
import { AvatarRenderer } from "@/components/avatar/AvatarRenderer";
import { PageSkeleton } from "@/components/PageSkeleton";

const focusRing =
  "focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900";

export default function HomePage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (progress == null) {
    return <PageSkeleton />;
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
  const weeklyRemaining = Math.max(0, weeklyTarget - weekly.completedLessons);

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

  const isNewUser = completedCount === 0;
  const progressDefaultOpen = isNewUser || completedCount < 3;
  const closeToLevel = levelProgress >= 70 && levelProgress < 100;
  const closeToWeekly = weeklyTarget > 0 && weeklyRemaining === 1 && !weeklyComplete;

  return (
    <div className="space-y-6">
      {/* Hero: avatar as focus, personalized copy, compact stats */}
      <section className="text-center">
        <div className="avatar-stage inline-block mb-3">
          <AvatarRenderer equipped={avatarEquipped} size="md" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-100">
          {isNewUser ? "Ready to learn? 🤖" : "Welcome back!"}
        </h1>
        <p className="text-gray-600 dark:text-white mt-1">
          {isNewUser
            ? "Learn how AI and LLMs work — one short lesson at a time."
            : "Your next adventure is waiting."}
        </p>
        <div className="flex flex-wrap gap-2 justify-center items-center mt-4">
          <XPChip xp={progress.totalXp} size="sm" />
          {progress.currentStreak > 0 ? (
            <span
              className="inline-flex items-center gap-1 font-bold text-orange-600 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 border border-orange-200 dark:border-orange-700 rounded-full px-2.5 py-0.5 text-sm animate-pulse motion-reduce:animate-none"
              title={`${progress.currentStreak} day streak!`}
            >
              <span aria-hidden>🔥</span>
              <span>{progress.currentStreak}d</span>
            </span>
          ) : (
            <span className="text-sm font-medium text-gray-500 dark:text-white italic">Start a streak!</span>
          )}
          <span className="font-bold text-[var(--quest-primary)] text-sm">Lv {level}</span>
        </div>
      </section>

      {/* PRIMARY CTA: dynamic label, single action */}
      {nextLesson && nextUnlocked && (
        <section className="rounded-2xl border-2 border-indigo-400 dark:border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-slate-800/60 p-6 sm:p-8 shadow-xl dark:shadow-indigo-900/30">
          <p className="font-bold text-xl sm:text-2xl text-gray-800 dark:text-gray-100 mb-1">
            {nextLesson.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-white mb-6">
            {isNewUser ? "Your first lesson — tap to start!" : "Your next lesson — ready when you are!"}
          </p>
          <Link
            href={`/lesson/${nextLesson.id}`}
            className={`block w-full py-5 rounded-xl text-white font-bold text-center text-lg sm:text-xl transition shadow-lg hover:shadow-xl bg-[var(--quest-primary)] hover:opacity-90 ${focusRing}`}
          >
            {isNewUser ? `Start ${nextLesson.title} →` : `Continue →`}
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
            className={`block w-full py-4 rounded-xl bg-[var(--quest-accent)] text-white font-bold text-center hover:opacity-90 ${focusRing}`}
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
          <Link href="/learn" className={`block w-full py-4 rounded-xl bg-[var(--quest-success)] text-white font-bold text-center hover:opacity-90 ${focusRing}`}>
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

      {/* Collapsible: Your progress — default open for new users, show next milestone when close */}
      <details className="rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-gray-50/50 dark:bg-slate-800/30 overflow-hidden" open={progressDefaultOpen}>
        <summary className="px-4 py-3 font-bold text-gray-800 dark:text-gray-100 cursor-pointer list-none flex items-center justify-between gap-2">
          <span>Your progress</span>
          <span className="text-sm font-normal text-gray-500 dark:text-white">
            {completedCount}/{totalLessons} lessons · Lv {level}
          </span>
        </summary>
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-gray-200 dark:border-slate-600">
          {(closeToLevel || closeToWeekly) && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-3 text-sm">
              {closeToLevel && <p className="font-semibold text-amber-800 dark:text-amber-200">Almost there! {xpToNextLevel} XP to Level {level + 1}.</p>}
              {closeToWeekly && !weeklyComplete && <p className="font-semibold text-amber-800 dark:text-amber-200">1 more lesson to complete your weekly mission!</p>}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-white mb-1">Level · {Math.round(levelProgress)}% to Level {level + 1}</p>
            <ProgressBar value={levelProgress} label={`${xpToNextLevel} XP to next level`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-white mb-1">Course</p>
            <ProgressBar value={progressPct} label={`${completedCount} of ${totalLessons} lessons`} />
          </div>
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-sm font-medium text-gray-700 dark:text-white">📅 Weekly Mission</p>
              {weeklyComplete && <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Done ✅</span>}
            </div>
            <ProgressBar value={weeklyTarget ? (weeklyProgress / weeklyTarget) * 100 : 0} label={`${weeklyProgress}/${weeklyTarget} lessons · +${weekly.bonusXP} XP reward`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-white mb-2">🏅 Achievements</p>
            {mostRecentBadge ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{mostRecentBadge.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{mostRecentBadge.name}</p>
                  <p className="text-xs text-gray-600 dark:text-white">{mostRecentBadge.description}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-white">Earn your first badge by completing a lesson!</p>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}
