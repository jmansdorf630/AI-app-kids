"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, resetProgress, saveProgress } from "@/lib/progress";
import type { ProgressState } from "@/types";
import { levelFromXp, xpProgressInLevel, streakMultiplier } from "@/types";
import { XPChip } from "@/components/XPChip";
import { StreakFlame } from "@/components/StreakFlame";
import { BadgeGrid } from "@/components/BadgeGrid";
import { ProgressBar } from "@/components/ProgressBar";
import { SkillProgress } from "@/components/SkillProgress";
import { AvatarRenderer } from "@/components/avatar/AvatarRenderer";
import { PageSkeleton } from "@/components/PageSkeleton";
import { lessons } from "@/data/lessons";

const focusRing = "focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900";

export default function ProfilePage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const handleReset = () => {
    if (typeof window === "undefined") return;
    if (!confirm("Reset all progress? You'll lose XP, streaks, badges, and skills.")) return;
    setProgress(resetProgress());
  };

  if (progress == null) {
    return <PageSkeleton />;
  }

  const completedCount = Object.values(progress.lessons).filter((l) => l.completed).length;
  const progressPct = lessons.length ? (completedCount / lessons.length) * 100 : 0;
  const level = levelFromXp(progress.totalXp);
  const levelProgress = xpProgressInLevel(progress.totalXp);
  const mult = streakMultiplier(progress.currentStreak);

  const avatarEquipped = progress.avatar?.equipped ?? { bodyColor: "blue", eyes: "happy", headgear: null, accessory: null, effect: null };
  const inventoryCount = progress.avatar?.inventory?.length ?? 0;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-100">👤 Profile</h1>

      <section className="rounded-xl border-2 border-indigo-100 dark:border-indigo-900 bg-white dark:bg-slate-800/50 p-4 flex flex-col sm:flex-row items-center gap-4">
        <AvatarRenderer equipped={avatarEquipped} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 dark:text-gray-100">Your Avatar</p>
          <p className="text-sm text-gray-600 dark:text-white">{inventoryCount} items in collection</p>
          <p className="text-sm text-gray-600 dark:text-white mt-1">
            Equipped: {avatarEquipped.bodyColor}, {avatarEquipped.eyes}
            {avatarEquipped.headgear && `, ${avatarEquipped.headgear}`}
            {avatarEquipped.accessory && `, ${avatarEquipped.accessory}`}
            {avatarEquipped.effect && `, ${avatarEquipped.effect}`}
          </p>
          <Link
            href="/avatar"
            className={`inline-block mt-2 px-4 py-2 rounded-xl bg-[var(--quest-primary)] text-white font-semibold hover:opacity-90 ${focusRing}`}
          >
            Customize Avatar
          </Link>
        </div>
      </section>

      <div className="flex flex-wrap gap-4 items-center">
        <XPChip xp={progress.totalXp} />
        <StreakFlame streak={progress.currentStreak} />
        <span className="font-bold text-indigo-600 dark:text-indigo-400">Level {level}</span>
        <span className="text-gray-600 dark:text-white font-semibold">
          Longest streak: <strong>{progress.longestStreak}</strong> days
        </span>
      </div>

      {mult > 1 && (
        <p className="text-sm text-amber-700 dark:text-amber-300 font-semibold">
          🔥 Streak bonus: {mult}x XP ({(mult - 1) * 100}% extra)
        </p>
      )}

      <ProgressBar value={levelProgress} label={`Level ${level} → ${level + 1}`} />
      <ProgressBar value={progressPct} label="Lessons completed" />

      <p className="text-sm text-gray-600 dark:text-white">
        <Link href="/settings" className="text-[var(--quest-primary)] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded">
          ⚙️ Sound, theme, accessibility & weekly goal →
        </Link>
      </p>

      <section>
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3">📊 Skills</h2>
        <SkillProgress skills={progress.skills} />
      </section>

      <section>
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3">🏆 Badges</h2>
        <BadgeGrid badges={progress.badges} />
      </section>

      <section>
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">Reset progress</h2>
        <p className="text-sm text-gray-600 dark:text-white mb-2">
          Start over from zero. All XP, streaks, badges, and skills will be cleared.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className={`py-2 px-4 rounded-xl border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 ${focusRing}`}
        >
          Reset progress
        </button>
      </section>
    </div>
  );
}
