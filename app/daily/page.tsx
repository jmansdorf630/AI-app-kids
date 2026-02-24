"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { lessons } from "@/data/lessons";
import { loadProgress, saveProgress, canAccessDailyChallenge, completeDailyChallenge } from "@/lib/progress";
import type { ProgressState } from "@/types";
import type { Step } from "@/types";
import { StepRenderer } from "@/components/StepRenderer";

const DAILY_STEPS = 5;
const DAILY_BONUS_XP = 20;

function getRandomStepsFromCompletedLessons(progress: ProgressState): { step: Step; lessonId: string }[] {
  const completedLessonIds = lessons.filter((l) => progress.lessons[l.id]?.completed).map((l) => l.id);
  if (completedLessonIds.length === 0) return [];
  const allSteps: { step: Step; lessonId: string }[] = [];
  for (const lesson of lessons) {
    if (!progress.lessons[lesson.id]?.completed) continue;
    for (const step of lesson.steps) {
      if (step.type === "info") continue;
      allSteps.push({ step: { ...step, id: `${lesson.id}-${step.id}-${Math.random()}` }, lessonId: lesson.id });
    }
  }
  if (allSteps.length <= DAILY_STEPS) return allSteps;
  const shuffled = [...allSteps].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, DAILY_STEPS);
}

export default function DailyPage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const dailySteps = useMemo(() => (progress ? getRandomStepsFromCompletedLessons(progress) : []), [progress]);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const available = progress != null && canAccessDailyChallenge(progress);
  const hasCompletedLessons = progress != null && Object.values(progress.lessons).some((l) => l.completed);

  const handleStepComplete = (correct: boolean) => {
    if (correct) setCorrectCount((c) => c + 1);
    if (stepIndex >= dailySteps.length - 1) {
      const xp = DAILY_BONUS_XP + correctCount + (correct ? 1 : 0);
      if (progress != null) {
        const newState = completeDailyChallenge(progress, xp);
        setProgress(newState);
        saveProgress(newState);
      }
      setFinished(true);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  if (progress == null) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (!hasCompletedLessons) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">⚡ Daily Challenge</h1>
        <p className="text-gray-600">Complete at least one lesson to unlock the Daily Challenge!</p>
        <Link href="/learn" className="text-indigo-600 font-semibold underline">
          Go to Learn →
        </Link>
      </div>
    );
  }

  if (!available && !finished) {
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">⚡ Daily Challenge</h1>
        <p className="text-gray-600">You already did today&apos;s challenge. Come back tomorrow!</p>
        <Link href="/" className="text-indigo-600 font-semibold underline">
          Home →
        </Link>
      </div>
    );
  }

  if (finished) {
    const total = dailySteps.length;
    const xpEarned = DAILY_BONUS_XP + correctCount;
    return (
      <div className="space-y-6 text-center">
        <div className="text-5xl">⚡</div>
        <h1 className="text-2xl font-bold text-gray-800">Daily Challenge complete!</h1>
        <p className="text-lg">
          {correctCount} / {total} correct
        </p>
        <p className="text-amber-700 font-bold text-lg">+{xpEarned} XP bonus</p>
        <Link href="/" className="inline-block py-3 px-6 rounded-xl bg-indigo-500 text-white font-bold">
          Home
        </Link>
      </div>
    );
  }

  if (dailySteps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        No quiz steps in completed lessons. Complete more lessons with questions!
      </div>
    );
  }

  const current = dailySteps[stepIndex];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">⚡ Daily Challenge</h1>
      <p className="text-sm text-gray-600">
        Question {stepIndex + 1} of {dailySteps.length}
      </p>
      <div className="rounded-2xl border-2 border-amber-200 bg-white p-6">
        <StepRenderer key={current.step.id} step={current.step} onComplete={handleStepComplete} />
      </div>
    </div>
  );
}
