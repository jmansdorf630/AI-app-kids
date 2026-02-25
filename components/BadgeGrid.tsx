"use client";

import type { Badge } from "@/types";

interface BadgeGridProps {
  badges: Badge[];
  className?: string;
}

export function BadgeGrid({ badges, className = "" }: BadgeGridProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${className}`}>
      {badges.map((b) => (
        <div
          key={b.id}
          className={`rounded-2xl border-2 p-4 text-center transition ${b.earnedAt ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700" : "bg-gray-100 dark:bg-slate-700/50 border-gray-200 dark:border-slate-600 opacity-60"}`}
          title={b.earnedAt ? b.description : `Locked: ${b.description}`}
        >
          <div className="text-3xl mb-1">{b.earnedAt ? b.emoji : "🔒"}</div>
          <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{b.name}</div>
          {b.earnedAt && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Earned!</div>
          )}
        </div>
      ))}
    </div>
  );
}
