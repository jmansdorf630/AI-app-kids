"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, resetProgress, saveProgress, updateSettings } from "@/lib/progress";
import { setTheme } from "@/lib/theme";
import { applyAccessibilitySettings } from "@/lib/accessibility";
import type { ProgressState, ThemeMode } from "@/types";
import { levelFromXp, xpProgressInLevel, streakMultiplier } from "@/types";
import { XPChip } from "@/components/XPChip";
import { StreakFlame } from "@/components/StreakFlame";
import { BadgeGrid } from "@/components/BadgeGrid";
import { ProgressBar } from "@/components/ProgressBar";
import { SkillProgress } from "@/components/SkillProgress";
import { lessons } from "@/data/lessons";

const focusRing = "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900";

export default function ProfilePage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const handleThemeChange = (theme: ThemeMode) => {
    if (!progress) return;
    const next = updateSettings(progress, { theme });
    saveProgress(next);
    setProgress(next);
    setTheme(theme);
  };

  const handleLargeTextToggle = () => {
    if (!progress) return;
    const next = updateSettings(progress, { largeText: !progress.settings.largeText });
    saveProgress(next);
    setProgress(next);
    applyAccessibilitySettings();
  };

  const handleReduceMotionToggle = () => {
    if (!progress) return;
    const next = updateSettings(progress, { reduceMotion: !progress.settings.reduceMotion });
    saveProgress(next);
    setProgress(next);
    applyAccessibilitySettings();
  };

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
      <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">👤 Profile</h1>

      <div className="flex flex-wrap gap-4 items-center">
        <XPChip xp={progress.totalXp} />
        <StreakFlame streak={progress.currentStreak} />
        <span className="font-bold text-indigo-600 dark:text-indigo-400">Level {level}</span>
        <span className="text-gray-600 dark:text-gray-300 font-semibold">
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

      <section>
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3">⚙️ Settings</h2>
        <div className="space-y-4 rounded-xl border-2 border-indigo-100 dark:border-indigo-900 bg-white dark:bg-slate-800/50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-700 dark:text-gray-300">Theme</span>
            <div className="flex gap-1">
              {(["light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleThemeChange(t)}
                  className={`px-3 py-1 rounded-lg border-2 font-medium ${focusRing} ${progress.settings.theme === t ? "border-indigo-500 bg-indigo-100 dark:bg-indigo-900/50 dark:border-indigo-400 text-indigo-800 dark:text-indigo-200" : "border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400"}`}
                >
                  {t === "light" ? "☀️ Light" : "🌙 Dark"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Larger text</span>
            <button
              type="button"
              onClick={handleLargeTextToggle}
              className={`px-3 py-1 rounded-lg border-2 border-indigo-200 dark:border-indigo-700 font-medium ${focusRing} ${progress.settings.largeText ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" : ""}`}
            >
              {progress.settings.largeText ? "On" : "Off"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">Reduce motion</span>
            <button
              type="button"
              onClick={handleReduceMotionToggle}
              className={`px-3 py-1 rounded-lg border-2 border-indigo-200 dark:border-indigo-700 font-medium ${focusRing} ${progress.settings.reduceMotion ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30" : ""}`}
            >
              {progress.settings.reduceMotion ? "On" : "Off"}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">When Off, system preference may still apply.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Link href="/settings" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded">
              Sound, haptics & weekly goal →
            </Link>
          </p>
        </div>
      </section>

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
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
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
