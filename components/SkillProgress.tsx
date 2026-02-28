"use client";

import type { SkillScores } from "@/types";
import { ProgressBar } from "./ProgressBar";

const SKILL_LABELS: { key: keyof SkillScores; label: string; emoji: string }[] = [
  { key: "prompting", label: "Prompting", emoji: "✏️" },
  { key: "safety", label: "Safety", emoji: "🛡️" },
  { key: "bias", label: "Bias & Fairness", emoji: "⚖️" },
  { key: "hallucination_detection", label: "Hallucination Detection", emoji: "🔍" },
  { key: "ai_understanding", label: "AI Understanding", emoji: "🧠" },
];

const MAX_SKILL = 100;

export function SkillProgress({ skills }: { skills: SkillScores }) {
  return (
    <div className="space-y-3">
      {SKILL_LABELS.map(({ key, label, emoji }) => {
        const value = Math.min(MAX_SKILL, skills[key] ?? 0);
        return (
          <div key={key}>
            <div className="flex justify-between text-sm font-semibold text-gray-700 dark:text-white mb-1">
              <span>{emoji} {label}</span>
              <span>{value} / {MAX_SKILL}</span>
            </div>
            <ProgressBar value={value} max={MAX_SKILL} />
          </div>
        );
      })}
    </div>
  );
}
