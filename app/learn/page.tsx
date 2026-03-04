"use client";

import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/progress";
import type { ProgressState, LearningTrack } from "@/types";
import { getLessonsForTrack } from "@/data/lessons";
import {
  isLessonUnlockedForTrack,
  getNextUpLessonIdForTrack,
  getUnlockRequirementForTrack,
} from "@/lib/trackHelpers";
import { LessonCard, type LessonCardState } from "@/components/LessonCard";
import { ProgressBar } from "@/components/ProgressBar";
import { PageSkeleton } from "@/components/PageSkeleton";

const TRACK_LABELS: Record<LearningTrack, string> = {
  little_explorers: "Little Explorers (ages 6–8)",
  ai_adventurers: "AI Adventurers (ages 9–10)",
};

export default function LearnPage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (progress == null) {
    return <PageSkeleton />;
  }

  const track = progress.settings?.learningTrack;
  if (track == null || track === "") {
    return <PageSkeleton />;
  }

  const trackLessons = getLessonsForTrack(track);
  const nextUpId = getNextUpLessonIdForTrack(progress, track);
  const completedCount = trackLessons.filter((l) => progress.lessons[l.id]?.completed).length;
  const totalCount = trackLessons.length;
  const progressPct = totalCount ? (completedCount / totalCount) * 100 : 0;

  const getLessonState = (
    lessonId: string,
    unlocked: boolean,
    completed: boolean
  ): LessonCardState => {
    if (completed) return "completed";
    if (unlocked && lessonId === nextUpId) return "nextUp";
    if (!unlocked) return "locked";
    return "available";
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-[var(--quest-primary)] mb-1">
          {TRACK_LABELS[track]}
        </p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 dark:text-gray-100">
          Lesson map
        </h1>
        <p className="text-gray-600 dark:text-white mt-1">
          Complete lessons in order. Your progress is saved as you go.
        </p>
      </div>

      <div className="rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 bg-white dark:bg-slate-800/40 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-white">Track progress</span>
          <span className="text-sm font-medium text-gray-600 dark:text-white">
            {completedCount} / {totalCount} lessons
          </span>
        </div>
        <ProgressBar value={progressPct} label="" />
      </div>

      <div className="space-y-3">
        {trackLessons.map((lesson) => {
          const unlocked = isLessonUnlockedForTrack(track, lesson.id, progress);
          const completed = progress.lessons[lesson.id]?.completed ?? false;
          const state = getLessonState(lesson.id, unlocked, completed);
          const unlockReq =
            state === "locked"
              ? getUnlockRequirementForTrack(track, lesson.id, progress)
              : undefined;

          return (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              state={state}
              bestScore={progress.lessons[lesson.id]?.bestScore}
              unlockRequirement={unlockReq}
            />
          );
        })}
      </div>
    </div>
  );
}
