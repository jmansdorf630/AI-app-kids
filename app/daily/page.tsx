"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { lessons } from "@/data/lessons";
import { loadProgress, saveProgress, canAccessDailyChallenge, completeDailyChallenge } from "@/lib/progress";
import { shouldReduceMotion } from "@/lib/accessibility";
import type { ProgressState } from "@/types";
import type { Step } from "@/types";
import { StepRenderer } from "@/components/StepRenderer";
import { PageSkeleton } from "@/components/PageSkeleton";

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
      if (!shouldReduceMotion()) confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  if (progress == null) {
    return <PageSkeleton />;
  }

  if (!hasCompletedLessons) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">⚡ Daily Challenge</h1>
        <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-8 text-center">
          <p className="text-4xl mb-4" aria-hidden>🔒</p>
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">No challenge yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Complete a lesson to unlock the Daily Challenge. Then come back here for a quick review!
          </p>
          <Link href="/learn" className="inline-block py-3 px-6 rounded-xl bg-[var(--quest-primary)] text-white font-bold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900">
            Go to Learn →
          </Link>
        </div>
      </div>
    );
  }

  if (!available && !finished) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">⚡ Daily Challenge</h1>
        <div className="rounded-2xl border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-8 text-center">
          <p className="text-4xl mb-4" aria-hidden>✅</p>
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">You&apos;re done for today!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You already did today&apos;s challenge. Come back tomorrow for a new set of questions.
          </p>
          <Link href="/" className="inline-block py-3 px-6 rounded-xl bg-[var(--quest-primary)] text-white font-bold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900">
            Home →
          </Link>
        </div>
      </div>
    );
  }

  if (finished) {
    const total = dailySteps.length;
    const xpEarned = DAILY_BONUS_XP + correctCount;
    return (
      <div className="space-y-6 text-center">
        <div className="text-5xl">⚡</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Daily Challenge complete!</h1>
        <p className="text-lg text-gray-700 dark:text-gray-200">
          {correctCount} / {total} correct
        </p>
        <p className="text-amber-700 dark:text-amber-300 font-bold text-lg">+{xpEarned} XP bonus</p>
        <Link href="/" className="inline-block py-3 px-6 rounded-xl bg-[var(--quest-primary)] text-white font-bold focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900">
          Home
        </Link>
      </div>
    );
  }

  if (dailySteps.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">⚡ Daily Challenge</h1>
        <div className="rounded-2xl border-2 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/40 p-8 text-center">
          <p className="text-4xl mb-4" aria-hidden>📚</p>
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">Not enough questions yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Complete more lessons that have quiz steps — then you&apos;ll get a challenge here!
          </p>
          <Link href="/learn" className="inline-block py-3 px-6 rounded-xl bg-[var(--quest-primary)] text-white font-bold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900">
            Go to Learn →
          </Link>
        </div>
      </div>
    );
  }

  const current = dailySteps[stepIndex];
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">⚡ Daily Challenge</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Question {stepIndex + 1} of {dailySteps.length}
      </p>
      <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-800/50 p-6">
        <StepRenderer key={current.step.id} step={current.step} onComplete={handleStepComplete} />
      </div>
    </div>
  );
}
