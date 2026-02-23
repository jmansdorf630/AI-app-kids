"use client";

import Link from "next/link";
import type { Lesson } from "@/types";
import { XPChip } from "./XPChip";

interface LessonCardProps {
  lesson: Lesson;
  unlocked: boolean;
  completed?: boolean;
  bestScore?: number;
}

export function LessonCard({ lesson, unlocked, completed, bestScore }: LessonCardProps) {
  const href = unlocked ? `/lesson/${lesson.id}` : "#";
  const opacity = unlocked ? "" : "opacity-60 pointer-events-none";

  return (
    <Link
      href={href}
      className={`block rounded-2xl border-2 p-4 bg-white shadow-sm hover:shadow-md transition border-indigo-200 ${opacity}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-4xl flex-shrink-0">{unlocked ? lesson.emoji : "🔒"}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-lg text-gray-800">{lesson.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{lesson.description}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <XPChip xp={lesson.xpReward} size="sm" />
            {completed && (
              <span className="text-sm font-semibold text-green-600">✓ Done {bestScore != null ? `(${bestScore}%)` : ""}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
