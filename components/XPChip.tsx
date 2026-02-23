"use client";

interface XPChipProps {
  xp: number;
  size?: "sm" | "md";
  className?: string;
}

export function XPChip({ xp, size = "md", className = "" }: XPChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-100 border border-amber-200 rounded-full ${size === "sm" ? "px-2 py-0.5 text-sm" : "px-3 py-1 text-base"} ${className}`}
    >
      <span>⭐</span>
      <span>{xp} XP</span>
    </span>
  );
}
