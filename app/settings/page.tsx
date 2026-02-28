"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, updateSettings, setWeeklyGoalTarget, saveProgress } from "@/lib/progress";
import { setTheme } from "@/lib/theme";
import { applyAccessibilitySettings } from "@/lib/accessibility";
import type { ProgressState, ThemeMode } from "@/types";
import { initSfx } from "@/lib/sfx";
import { PageSkeleton } from "@/components/PageSkeleton";

export default function SettingsPage() {
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

  const handleSoundToggle = () => {
    if (!progress) return;
    initSfx(() => loadProgress().settings.soundMuted);
    const next = updateSettings(progress, { soundMuted: !progress.settings.soundMuted });
    saveProgress(next);
    setProgress(next);
  };

  const handleHapticsToggle = () => {
    if (!progress) return;
    const next = updateSettings(progress, { hapticsEnabled: !progress.settings.hapticsEnabled });
    saveProgress(next);
    setProgress(next);
  };

  const handleWeeklyTarget = (target: number) => {
    if (!progress) return;
    const next = setWeeklyGoalTarget(progress, target);
    saveProgress(next);
    setProgress(next);
  };

  if (progress == null) {
    return <PageSkeleton />;
  }

  const focusRing = "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900";

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">⚙️ Settings</h1>

      <section>
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3">🌓 Theme & accessibility</h2>
        <div className="space-y-4 rounded-xl border-2 border-indigo-100 dark:border-indigo-800 bg-white dark:bg-slate-800/50 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-gray-700 dark:text-white">Theme</span>
            <div className="flex gap-1">
              {(["light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleThemeChange(t)}
                  className={`px-3 py-1 rounded-lg border-2 font-medium ${focusRing} ${progress.settings.theme === t ? "border-indigo-500 bg-indigo-100 dark:bg-indigo-900/50 dark:border-indigo-400 text-indigo-800 dark:text-indigo-100" : "border-gray-200 dark:border-slate-600 text-gray-600 dark:text-white"}`}
                >
                  {t === "light" ? "☀️ Light" : "🌙 Dark"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-white">Larger text</span>
            <button
              type="button"
              onClick={handleLargeTextToggle}
              className={`px-3 py-1 rounded-lg border-2 border-indigo-200 dark:border-indigo-600 font-medium text-gray-800 dark:text-gray-100 ${focusRing} ${progress.settings.largeText ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-500" : ""}`}
            >
              {progress.settings.largeText ? "On" : "Off"}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-white">Reduce motion</span>
            <button
              type="button"
              onClick={handleReduceMotionToggle}
              className={`px-3 py-1 rounded-lg border-2 border-indigo-200 dark:border-indigo-600 font-medium text-gray-800 dark:text-gray-100 ${focusRing} ${progress.settings.reduceMotion ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-500" : ""}`}
            >
              {progress.settings.reduceMotion ? "On" : "Off"}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-white">When Off, system preference may still apply.</p>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3">🔊 Sound & volume</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-white">Sound effects</span>
            <button
              type="button"
              onClick={handleSoundToggle}
              className={`px-3 py-1 rounded-lg border-2 border-indigo-200 dark:border-indigo-600 font-medium text-gray-800 dark:text-gray-100 ${focusRing}`}
            >
              {progress.settings.soundMuted ? "🔇 Off" : "🔊 On"}
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-white">
            Clicks, correct/wrong, level-up, and lesson complete. Muted = no sounds.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-3">📳 Haptic feedback</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-white">Vibration (mobile)</span>
            <button
              type="button"
              onClick={handleHapticsToggle}
              className={`px-3 py-1 rounded-lg border-2 border-indigo-200 dark:border-indigo-600 font-medium text-gray-800 dark:text-gray-100 ${focusRing}`}
            >
              {progress.settings.hapticsEnabled ? "On" : "Off"}
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-white">
            Light vibration on correct/incorrect answers when supported.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">📅 Weekly goal</h2>
        <p className="text-sm text-gray-600 dark:text-white mb-2">
          Complete <strong className="dark:text-gray-100">{progress.weeklyGoal.targetLessons}</strong> lessons this week for +<strong className="dark:text-gray-100">{progress.weeklyGoal.bonusXP}</strong> XP bonus.
        </p>
        <div className="flex gap-2">
          {[3, 5, 7].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleWeeklyTarget(t)}
              className={`px-3 py-1 rounded-lg border-2 font-medium text-gray-800 dark:text-gray-100 ${focusRing} ${progress.weeklyGoal.targetLessons === t ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 dark:border-indigo-400" : "border-gray-200 dark:border-slate-600 dark:text-white"}`}
            >
              {t} lessons
            </button>
          ))}
        </div>
      </section>

      <p className="text-sm text-gray-500 dark:text-white">
        <Link href="/profile" className="text-[var(--quest-primary)] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded">
          ← Back to Profile
        </Link>
      </p>

      <section>
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">🛠 Admin</h2>
        <p className="text-sm text-gray-600 dark:text-white mb-2">Manage lesson content and admin options.</p>
        <Link href="/admin/content" className="inline-block py-2 px-4 rounded-xl border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900">
          Open Admin →
        </Link>
      </section>
    </div>
  );
}
