"use client";

interface StreakFlameProps {
  streak: number;
  className?: string;
}

export function StreakFlame({ streak, className = "" }: StreakFlameProps) {
  if (streak <= 0) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold text-orange-600 bg-orange-100 border border-orange-200 rounded-full px-3 py-1 ${className}`}
      title={`${streak} day streak!`}
    >
      <span className="text-xl" aria-hidden>🔥</span>
      <span>{streak}</span>
    </span>
  );
}
