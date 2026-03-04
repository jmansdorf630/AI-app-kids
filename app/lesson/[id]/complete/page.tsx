"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLessonById, getOrderedLessonIdsForTrack } from "@/data/lessons";
import { loadProgress } from "@/lib/progress";
import { isLessonUnlockedForTrack } from "@/lib/trackHelpers";
import type { ProgressState } from "@/types";
import type { Lesson } from "@/types";
import { LessonCompleteSummary } from "@/components/LessonCompleteSummary";
import { PageSkeleton } from "@/components/PageSkeleton";

function getNextLessonAfter(currentId: string, progress: ProgressState): Lesson | null {
  const track = progress.settings?.learningTrack;
  if (!track) return null;
  const orderedIds = getOrderedLessonIdsForTrack(track);
  const idx = orderedIds.indexOf(currentId);
  if (idx < 0 || idx >= orderedIds.length - 1) return null;
  const nextId = orderedIds[idx + 1];
  const next = getLessonById(nextId);
  if (!next) return null;
  const unlocked = isLessonUnlockedForTrack(track, nextId, progress);
  return unlocked ? next : null;
}

export default function LessonCompletePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const lesson = getLessonById(id);
  const run = progress?.lastLessonRun;
  const nextLesson = progress && lesson ? getNextLessonAfter(id, progress) : null;

  if (progress == null) {
    return <PageSkeleton />;
  }

  if (!lesson || !run || run.lessonId !== id) {
    if (typeof window !== "undefined") router.replace("/learn");
    return null;
  }

  return (
    <div className="rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 bg-white dark:bg-slate-800/50 p-6">
      <LessonCompleteSummary lesson={lesson} run={run} nextLesson={nextLesson} />
    </div>
  );
}
