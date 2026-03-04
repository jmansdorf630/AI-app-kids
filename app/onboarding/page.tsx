"use client";

import { useRouter } from "next/navigation";
import { loadProgress, updateSettings, saveProgress } from "@/lib/progress";
import type { LearningTrack } from "@/types";

const TRACK_BY_AGE: Record<string, LearningTrack> = {
  "6-8": "little_explorers",
  "9-10": "ai_adventurers",
};

export default function OnboardingPage() {
  const router = useRouter();

  const handleAgeSelect = (ageKey: string) => {
    const track = TRACK_BY_AGE[ageKey];
    if (!track) return;
    const state = loadProgress();
    const next = updateSettings(state, { learningTrack: track });
    saveProgress(next);
    router.replace("/");
  };

  return (
    <div className="space-y-8 max-w-md mx-auto pt-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-white">
          Welcome to AI Quest!
        </h1>
        <p className="text-gray-600 dark:text-white mt-2">
          How old are you? We&apos;ll pick the best lessons for you.
        </p>
      </div>
      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => handleAgeSelect("6-8")}
          className="w-full py-5 px-6 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 text-left hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <span className="font-bold text-lg text-gray-800 dark:text-white block">Ages 6–8</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">Little Explorers</span>
        </button>
        <button
          type="button"
          onClick={() => handleAgeSelect("9-10")}
          className="w-full py-5 px-6 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/40 text-left hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          <span className="font-bold text-lg text-gray-800 dark:text-white block">Ages 9–10</span>
          <span className="text-sm text-gray-600 dark:text-gray-300">AI Adventurers</span>
        </button>
      </div>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Grown-ups can change this later in Settings.
      </p>
    </div>
  );
}
