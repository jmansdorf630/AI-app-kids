"use client";

import { useEffect, useState } from "react";
import { loadProgress, getIsLessonUnlocked } from "@/lib/progress";
import type { ProgressState } from "@/types";
import { lessons, beginnerIds, explorerIds, masterIds } from "@/data/lessons";
import { LessonCard } from "@/components/LessonCard";

const TIERS: { key: "beginner" | "explorer" | "master"; label: string; emoji: string }[] = [
  { key: "beginner", label: "Beginner", emoji: "🌱" },
  { key: "explorer", label: "Explorer", emoji: "🧭" },
  { key: "master", label: "Master", emoji: "👑" },
];

export default function LearnPage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (progress == null) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  const getLessonsForTier = (tier: "beginner" | "explorer" | "master") =>
    lessons.filter((l) => l.tier === tier);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold text-gray-800">📚 Lesson map</h1>
      <p className="text-gray-600">Complete lessons in each tier. Explorer unlocks after Beginner; Master unlocks at 300+ XP after Explorer.</p>

      {TIERS.map(({ key, label, emoji }) => {
        const tierLessons = getLessonsForTier(key);
        if (tierLessons.length === 0) return null;
        return (
          <section key={key}>
            <h2 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
              <span>{emoji}</span> {label}
            </h2>
            <div className="space-y-3">
              {tierLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  unlocked={getIsLessonUnlocked(lesson.id, lesson.tier, progress, beginnerIds, explorerIds, masterIds)}
                  completed={progress.lessons[lesson.id]?.completed}
                  bestScore={progress.lessons[lesson.id]?.bestScore}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
