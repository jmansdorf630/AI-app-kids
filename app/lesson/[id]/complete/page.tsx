"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getLessonById } from "@/data/lessons";
import { loadProgress } from "@/lib/progress";
import type { ProgressState } from "@/types";
import { LessonCompleteSummary } from "@/components/LessonCompleteSummary";

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

  if (progress == null) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (!lesson || !run || run.lessonId !== id) {
    if (typeof window !== "undefined") router.replace("/learn");
    return null;
  }

  return (
    <div className="rounded-2xl border-2 border-indigo-100 bg-white p-6">
      <LessonCompleteSummary lesson={lesson} run={run} />
    </div>
  );
}
