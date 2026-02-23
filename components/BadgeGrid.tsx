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
          className={`rounded-2xl border-2 p-4 text-center transition ${b.earnedAt ? "bg-amber-50 border-amber-300" : "bg-gray-100 border-gray-200 opacity-60"}`}
          title={b.earnedAt ? b.description : `Locked: ${b.description}`}
        >
          <div className="text-3xl mb-1">{b.earnedAt ? b.emoji : "🔒"}</div>
          <div className="font-bold text-sm text-gray-800">{b.name}</div>
          {b.earnedAt && (
            <div className="text-xs text-gray-500 mt-0.5">Earned!</div>
          )}
        </div>
      ))}
    </div>
  );
}
