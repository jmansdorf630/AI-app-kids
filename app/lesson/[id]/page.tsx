"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { getLessonById } from "@/data/lessons";
import { loadProgress, saveProgress, completeLesson, isLessonUnlocked } from "@/lib/progress";
import { lessonIds } from "@/data/lessons";
import type { ProgressState } from "@/types";
import { StepRenderer } from "@/components/StepRenderer";
import { ProgressBar } from "@/components/ProgressBar";

function fireConfetti() {
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
  setTimeout(() => confetti({ particleCount: 50, spread: 100, origin: { y: 0.8 } }), 200);
}

export default function LessonPage() {
  const params = useParams();
  const id = params.id as string;
  const lesson = getLessonById(id);

  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const lessonIndex = lessonIds.indexOf(id);
  const unlocked = progress != null && isLessonUnlocked(lessonIds, lessonIndex, progress);

  const handleStepComplete = useCallback(
    (correct: boolean) => {
      if (correct) setCorrectCount((c) => c + 1);
      if (!lesson || stepIndex >= lesson.steps.length - 1) {
        const total = lesson?.steps.length ?? 0;
        const finalCorrect = correctCount + (correct ? 1 : 0);
        const score = total ? Math.round((finalCorrect / total) * 100) : 0;
        const xp = lesson?.xpReward ?? 0;
        setXpEarned(xp);
        setFinished(true);
        if (progress != null) {
          const newState = completeLesson(progress, id, score, xp);
          setProgress(newState);
          saveProgress(newState);
        }
        fireConfetti();
      } else {
        setStepIndex((i) => i + 1);
      }
    },
    [lesson, stepIndex, correctCount, id, progress]
  );

  if (lesson == null) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Lesson not found.</p>
        <Link href="/learn" className="text-indigo-600 font-semibold underline mt-2 inline-block">
          Back to Learn
        </Link>
      </div>
    );
  }

  if (progress != null && !unlocked) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">🔒 Complete the previous lesson first!</p>
        <Link href="/learn" className="text-indigo-600 font-semibold underline mt-2 inline-block">
          Back to Learn
        </Link>
      </div>
    );
  }

  if (finished) {
    const total = lesson.steps.length;
    const finalCorrect = correctCount;
    const score = total ? Math.round((finalCorrect / total) * 100) : 0;

    return (
      <div className="space-y-6 text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800">Lesson complete!</h1>
        <p className="text-lg">
          Score: <strong>{score}%</strong>
        </p>
        <p className="text-amber-700 font-bold text-lg">+{xpEarned} XP</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="py-3 px-6 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-600"
          >
            Home
          </Link>
          <Link
            href="/learn"
            className="py-3 px-6 rounded-xl border-2 border-indigo-300 text-indigo-700 font-bold"
          >
            Lesson map
          </Link>
        </div>
      </div>
    );
  }

  const step = lesson.steps[stepIndex];
  const progressPct = lesson.steps.length ? ((stepIndex + 1) / lesson.steps.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/learn" className="text-indigo-600 font-semibold">← Back</Link>
        <span className="text-gray-500 font-semibold">
          Step {stepIndex + 1} of {lesson.steps.length}
        </span>
      </div>
      <ProgressBar value={progressPct} />
      <div className="rounded-2xl border-2 border-indigo-100 bg-white p-6">
        <StepRenderer key={step.id} step={step} onComplete={handleStepComplete} />
      </div>
    </div>
  );
}
