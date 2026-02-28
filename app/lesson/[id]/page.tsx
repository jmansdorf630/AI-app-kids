"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { getLessonById, beginnerIds, explorerIds, masterIds } from "@/data/lessons";
import {
  loadProgress,
  saveProgress,
  completeLesson,
  getIsLessonUnlocked,
  addSkillXp,
  updateWeeklyGoalOnLessonComplete,
  setLastLessonRun,
} from "@/lib/progress";
import { initSfx, playSfx } from "@/lib/sfx";
import { vibrate } from "@/lib/haptics";
import { shouldReduceMotion } from "@/lib/accessibility";
import { streakMultiplier, levelFromXp } from "@/types";
import type { ProgressState } from "@/types";
import type { Step } from "@/types";
import type { SkillTag } from "@/types";
import { StepRenderer } from "@/components/StepRenderer";
import { ProgressBar } from "@/components/ProgressBar";

function fireConfetti() {
  if (shouldReduceMotion()) return;
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 } });
  setTimeout(() => confetti({ particleCount: 50, spread: 100, origin: { y: 0.8 } }), 200);
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const lesson = getLessonById(id);

  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [skillXPEarnedBySkill, setSkillXPEarnedBySkill] = useState<Partial<Record<SkillTag, number>>>({});
  const stepContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    stepContentRef.current?.focus({ preventScroll: true });
  }, [stepIndex]);

  const unlocked =
    progress != null &&
    lesson != null &&
    getIsLessonUnlocked(lesson.id, lesson.tier, progress, beginnerIds, explorerIds, masterIds);

  const handleStepComplete = useCallback(
    (correct: boolean, fastBonus?: boolean) => {
      if (typeof window !== "undefined") {
        initSfx(() => loadProgress().settings.soundMuted);
        if (correct) {
          playSfx("correct");
          vibrate("success", loadProgress().settings.hapticsEnabled);
        } else {
          playSfx("wrong");
          vibrate("error", loadProgress().settings.hapticsEnabled);
        }
      }

      const currentStep = lesson?.steps[stepIndex] as Step | undefined;
      if (correct && currentStep?.skillTag != null && currentStep?.skillXP != null && progress != null) {
        const xp = currentStep.skillXP;
        setSkillXPEarnedBySkill((prev) => ({
          ...prev,
          [currentStep.skillTag!]: (prev[currentStep.skillTag!] ?? 0) + xp,
        }));
        const newState = addSkillXp(progress, currentStep.skillTag, xp);
        setProgress(newState);
        saveProgress(newState);
      }
      if (correct) setCorrectCount((c) => c + 1);

      if (!lesson || progress == null || stepIndex >= lesson.steps.length - 1) {
        if (progress == null || !lesson) return;
        const currentLesson = lesson;
        const total = currentLesson.steps.length;
        const finalCorrect = correctCount + (correct ? 1 : 0);
        const score = total ? Math.round((finalCorrect / total) * 100) : 0;
        const baseXp = currentLesson.xpReward ?? 0;
        const mult = streakMultiplier(progress.currentStreak);
        const bonus = fastBonus ? 1.25 : 1;
        const xpEarned = Math.round(baseXp * mult * bonus);

        let newState = completeLesson(progress, id, score, baseXp);
        if (fastBonus) {
          const extra = Math.round(baseXp * (mult * 0.25));
          newState = { ...newState, totalXp: newState.totalXp + extra };
        }

        const badgesAwarded = newState.badges
          .filter((b) => b.earnedAt && !progress.badges.find((p) => p.id === b.id)?.earnedAt)
          .map((b) => b.id);

        const levelBefore = levelFromXp(progress.totalXp);
        const levelAfter = levelFromXp(newState.totalXp);
        const leveledUp = levelAfter > levelBefore;

        const { state: stateWithWeekly, weeklyGoalJustCompleted } = updateWeeklyGoalOnLessonComplete(
          newState,
          id,
          xpEarned
        );
        if (weeklyGoalJustCompleted) {
          if (typeof window !== "undefined") {
            playSfx("complete");
            fireConfetti();
          }
        }

        const finalSkillXP = { ...skillXPEarnedBySkill };
        if (correct && currentStep?.skillTag != null && currentStep?.skillXP != null) {
          finalSkillXP[currentStep.skillTag] = (finalSkillXP[currentStep.skillTag] ?? 0) + currentStep.skillXP;
        }
        newState = setLastLessonRun(stateWithWeekly, {
          lessonId: id,
          xpEarned,
          skillXPEarnedBySkill: finalSkillXP,
          badgesAwarded,
          leveledUp,
          newLevel: levelFromXp(stateWithWeekly.totalXp),
        });

        setProgress(newState);
        saveProgress(newState);

        if (typeof window !== "undefined") {
          playSfx("complete");
          if (leveledUp) playSfx("levelup");
          fireConfetti();
        }

        router.push(`/lesson/${id}/complete`);
      } else {
        setStepIndex((i) => i + 1);
      }
    },
    [lesson, stepIndex, correctCount, id, progress, skillXPEarnedBySkill, router]
  );

  if (lesson == null) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-white">Lesson not found.</p>
        <Link href="/learn" className="text-indigo-600 dark:text-indigo-400 font-semibold underline mt-2 inline-block focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded">
          Back to Learn
        </Link>
      </div>
    );
  }

  if (progress != null && !unlocked) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-white">🔒 Complete the previous lesson or reach the required tier!</p>
        <Link href="/learn" className="text-indigo-600 dark:text-indigo-400 font-semibold underline mt-2 inline-block focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded">
          Back to Learn
        </Link>
      </div>
    );
  }

  const step = lesson.steps[stepIndex];
  const progressPct = lesson.steps.length ? ((stepIndex + 1) / lesson.steps.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Link href="/learn" className="text-[var(--quest-primary)] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--quest-primary)] focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded">
          ← Back
        </Link>
        <span
          className="rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1.5 text-sm font-bold text-indigo-800 dark:text-indigo-200"
          aria-label={`Step ${stepIndex + 1} of ${lesson.steps.length}`}
        >
          Step {stepIndex + 1} of {lesson.steps.length}
        </span>
      </div>
      <ProgressBar value={progressPct} />
      <div
        ref={stepContentRef}
        tabIndex={-1}
        className="rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 bg-white dark:bg-slate-800/50 p-6 outline-none focus:outline-none"
        aria-label={`Lesson step ${stepIndex + 1}`}
      >
        <StepRenderer key={step.id} step={step} onComplete={handleStepComplete} />
      </div>
    </div>
  );
}
