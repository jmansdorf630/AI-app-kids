"use client";

import { useEffect, useState } from "react";
import { loadProgress, isLessonUnlocked } from "@/lib/progress";
import type { ProgressState } from "@/types";
import { lessons, lessonIds } from "@/data/lessons";
import { LessonCard } from "@/components/LessonCard";

export default function LearnPage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (progress == null) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-800">📚 Lesson map</h1>
      <p className="text-gray-600">Complete lessons in order. New ones unlock as you go!</p>

      <div className="space-y-3">
        {lessons.map((lesson, i) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            unlocked={isLessonUnlocked(lessonIds, i, progress)}
            completed={progress.lessons[lesson.id]?.completed}
            bestScore={progress.lessons[lesson.id]?.bestScore}
          />
        ))}
      </div>
    </div>
  );
}
