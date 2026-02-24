"use client";

import { useEffect, useState } from "react";
import { loadProgress, resetProgress } from "@/lib/progress";
import type { ProgressState } from "@/types";
import { levelFromXp, xpProgressInLevel, streakMultiplier } from "@/types";
import { XPChip } from "@/components/XPChip";
import { StreakFlame } from "@/components/StreakFlame";
import { BadgeGrid } from "@/components/BadgeGrid";
import { ProgressBar } from "@/components/ProgressBar";
import { SkillProgress } from "@/components/SkillProgress";
import { lessons } from "@/data/lessons";


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
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  const completedCount = Object.values(progress.lessons).filter((l) => l.completed).length;
  const progressPct = lessons.length ? (completedCount / lessons.length) * 100 : 0;
  const level = levelFromXp(progress.totalXp);
  const levelProgress = xpProgressInLevel(progress.totalXp);
  const mult = streakMultiplier(progress.currentStreak);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold text-gray-800">👤 Profile</h1>

      <div className="flex flex-wrap gap-4 items-center">
        <XPChip xp={progress.totalXp} />
        <StreakFlame streak={progress.currentStreak} />
        <span className="font-bold text-indigo-600">Level {level}</span>
        <span className="text-gray-600 font-semibold">
          Longest streak: <strong>{progress.longestStreak}</strong> days
        </span>
      </div>

      {mult > 1 && (
        <p className="text-sm text-amber-700 font-semibold">
          🔥 Streak bonus: {mult}x XP ({(mult - 1) * 100}% extra)
        </p>
      )}

      <ProgressBar value={levelProgress} label={`Level ${level} → ${level + 1}`} />
      <ProgressBar value={progressPct} label="Lessons completed" />

      <section>
        <h2 className="font-bold text-lg text-gray-800 mb-3">📊 Skills</h2>
        <SkillProgress skills={progress.skills} />
      </section>

      <section>
        <h2 className="font-bold text-lg text-gray-800 mb-3">🏆 Badges</h2>
        <BadgeGrid badges={progress.badges} />
      </section>

      <section>
        <h2 className="font-bold text-lg text-gray-800 mb-2">Reset progress</h2>
        <p className="text-sm text-gray-600 mb-2">
          Start over from zero. All XP, streaks, badges, and skills will be cleared.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="py-2 px-4 rounded-xl border-2 border-red-200 text-red-700 font-semibold hover:bg-red-50"
        >
          Reset progress
        </button>
      </section>
    </div>
  );
}
