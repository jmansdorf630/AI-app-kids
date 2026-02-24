"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, updateSettings, setWeeklyGoalTarget, saveProgress } from "@/lib/progress";
import type { ProgressState } from "@/types";
import { initSfx } from "@/lib/sfx";

export default function SettingsPage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

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
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold text-gray-800">⚙️ Settings</h1>

      <section>
        <h2 className="font-bold text-lg text-gray-800 mb-3">🔊 Sound & volume</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Sound effects</span>
            <button
              type="button"
              onClick={handleSoundToggle}
              className="px-3 py-1 rounded-lg border-2 border-indigo-200 font-medium"
            >
              {progress.settings.soundMuted ? "🔇 Off" : "🔊 On"}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Clicks, correct/wrong, level-up, and lesson complete. Muted = no sounds.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg text-gray-800 mb-3">📳 Haptic feedback</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Vibration (mobile)</span>
            <button
              type="button"
              onClick={handleHapticsToggle}
              className="px-3 py-1 rounded-lg border-2 border-indigo-200 font-medium"
            >
              {progress.settings.hapticsEnabled ? "On" : "Off"}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Light vibration on correct/incorrect answers when supported.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-bold text-lg text-gray-800 mb-2">📅 Weekly goal</h2>
        <p className="text-sm text-gray-600 mb-2">
          Complete <strong>{progress.weeklyGoal.targetLessons}</strong> lessons this week for +{progress.weeklyGoal.bonusXP} XP bonus.
        </p>
        <div className="flex gap-2">
          {[3, 5, 7].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleWeeklyTarget(t)}
              className={`px-3 py-1 rounded-lg border-2 font-medium ${progress.weeklyGoal.targetLessons === t ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}
            >
              {t} lessons
            </button>
          ))}
        </div>
      </section>

      <p className="text-sm text-gray-500">
        <Link href="/profile" className="text-indigo-600 font-medium hover:underline">
          ← Back to Profile
        </Link>
      </p>
    </div>
  );
}
