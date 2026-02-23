"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress } from "@/lib/progress";
import type { ProgressState } from "@/types";
import { lessons, lessonIds } from "@/data/lessons";
import { isLessonUnlocked } from "@/lib/progress";
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

  const nextLessonIndex = lessonIds.findIndex((id) => !progress.lessons[id]?.completed);
  const nextLesson = nextLessonIndex >= 0 ? lessons[nextLessonIndex] : null;
  const nextUnlocked = nextLesson ? isLessonUnlocked(lessonIds, nextLessonIndex, progress) : false;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-800">Welcome to AI Quest! 🤖</h1>
      <p className="text-gray-600">Learn how AI and LLMs work — one short lesson at a time.</p>

      <div className="flex flex-wrap gap-3 items-center">
        <XPChip xp={progress.totalXp} />
        <StreakFlame streak={progress.currentStreak} />
      </div>

      <ProgressBar value={progressPct} label="Course progress" />

      {nextLesson && nextUnlocked && (
        <div className="rounded-2xl border-2 border-indigo-200 bg-white p-4">
          <h2 className="font-bold text-lg text-gray-800 mb-1">Today&apos;s lesson</h2>
          <p className="text-gray-600 text-sm mb-3">
            {nextLesson.emoji} {nextLesson.title}
          </p>
          <Link
            href={`/lesson/${nextLesson.id}`}
            className="inline-block w-full py-3 rounded-xl bg-indigo-500 text-white font-bold text-center hover:bg-indigo-600 transition"
          >
            Continue →
          </Link>
        </div>
      )}

      {nextLesson && !nextUnlocked && (
        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-800">Complete the previous lesson first to unlock the next one!</p>
          <Link href="/learn" className="text-indigo-600 font-semibold underline mt-2 inline-block">
            Go to Learn →
          </Link>
        </div>
      )}

      {!nextLesson && (
        <div className="rounded-2xl border-2 border-green-200 bg-green-50 p-4">
          <p className="font-bold text-green-800">🎉 You finished all lessons! Review anytime from Learn.</p>
          <Link href="/learn" className="text-indigo-600 font-semibold underline mt-2 inline-block">
            View map →
          </Link>
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/learn" className="flex-1 py-2 rounded-xl border-2 border-indigo-200 text-center font-semibold text-indigo-700 hover:bg-indigo-50">
          📚 Lesson map
        </Link>
        <Link href="/profile" className="flex-1 py-2 rounded-xl border-2 border-indigo-200 text-center font-semibold text-indigo-700 hover:bg-indigo-50">
          👤 Profile
        </Link>
      </div>
    </div>
  );
}
