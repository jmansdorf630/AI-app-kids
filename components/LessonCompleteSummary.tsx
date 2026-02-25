"use client";

import Link from "next/link";
import type { Lesson, LastLessonRun, BadgeId } from "@/types";
import { DEFAULT_BADGES } from "@/types";

const SKILL_LABELS: Record<string, string> = {
  prompting: "✏️ Prompting",
  safety: "🛡️ Safety",
  bias: "⚖️ Bias & Fairness",
  hallucination_detection: "🔍 Hallucination Detection",
  ai_understanding: "🧠 AI Understanding",
};

interface LessonCompleteSummaryProps {
  lesson: Lesson;
  run: LastLessonRun;
}

export function LessonCompleteSummary({ lesson, run }: LessonCompleteSummaryProps) {
  const takeaways = lesson.summaryTakeaways ?? [];
  const skillFocus = lesson.skillFocus ?? [];
  const badgeNames = DEFAULT_BADGES.filter((b) => run.badgesAwarded.includes(b.id));

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl mb-2">🎉</div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Lesson Complete!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {lesson.emoji} {lesson.title}
        </p>
      </div>

      {takeaways.length > 0 && (
        <section>
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-2">You learned:</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            {takeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {(Object.keys(run.skillXPEarnedBySkill).length > 0 || skillFocus.length > 0) && (
        <section>
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Skills practiced:</h2>
          <div className="flex flex-wrap gap-2">
            {skillFocus.length > 0
              ? skillFocus.map(({ skill, label }) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 font-medium text-sm"
                  >
                    {label} {run.skillXPEarnedBySkill[skill] != null ? `+${run.skillXPEarnedBySkill[skill]}` : ""}
                  </span>
                ))
              : Object.entries(run.skillXPEarnedBySkill).map(([skill, xp]) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 font-medium text-sm"
                  >
                    {SKILL_LABELS[skill] ?? skill} +{xp}
                  </span>
                ))}
          </div>
        </section>
      )}

      <section className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <p className="text-amber-800 dark:text-amber-200 font-bold text-lg">+{run.xpEarned} XP</p>
      </section>

      {run.leveledUp && (
        <section className="p-4 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-center">
          <p className="text-indigo-800 dark:text-indigo-200 font-bold">⬆️ Level up! You're now Level {run.newLevel}.</p>
        </section>
      )}

      {badgeNames.length > 0 && (
        <section>
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-2">New badges:</h2>
          <div className="flex flex-wrap gap-2">
            {badgeNames.map((b) => (
              <span
                key={b.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 font-medium"
              >
                {b.emoji} {b.name}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-3 justify-center pt-4">
        <Link
          href="/"
          className="py-3 px-6 rounded-xl bg-indigo-500 text-white font-bold hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          Home
        </Link>
        <Link
          href="/learn"
          className="py-3 px-6 rounded-xl border-2 border-indigo-300 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          Lesson map
        </Link>
      </div>
    </div>
  );
}
