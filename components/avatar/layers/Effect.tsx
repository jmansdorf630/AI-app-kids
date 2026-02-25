"use client";

import type { EffectKey } from "@/types";

interface EffectProps {
  effect: EffectKey;
  variant?: "back" | "front";
}

export function EffectLayer({ effect, variant = "back" }: EffectProps) {
  if (effect === "sparkles") {
    return (
      <g fill="#fbbf24" opacity={0.9}>
        <path d="M 40 50 L 42 56 L 48 58 L 42 60 L 40 66 L 38 60 L 32 58 L 38 56 Z" />
        <path d="M 160 70 L 162 76 L 168 78 L 162 80 L 160 86 L 158 80 L 152 78 L 158 76 Z" />
        <path d="M 50 130 L 52 136 L 58 138 L 52 140 L 50 146 L 48 140 L 42 138 L 48 136 Z" />
        <path d="M 150 120 L 152 126 L 158 128 L 152 130 L 150 136 L 148 130 L 142 128 L 148 126 Z" />
      </g>
    );
  }

  if (effect === "glow") {
    return (
      <g fill="none" stroke="#818cf8" strokeWidth={3} opacity={0.5}>
        <ellipse cx={100} cy={95} rx={65} ry={75} />
      </g>
    );
  }

  if (effect === "flame") {
    return (
      <g fill="#f97316" opacity={0.6}>
        <path d="M 70 135 Q 65 120 75 110 Q 70 100 80 95 Q 75 85 90 90 Q 85 75 100 85 Q 95 70 110 80 Q 105 90 115 100 Q 125 110 120 135 Z" />
        <path d="M 130 135 Q 135 120 125 110 Q 130 100 120 95 Q 125 85 110 90 Q 115 75 100 85 Q 105 70 90 80 Q 95 90 85 100 Q 75 110 80 135 Z" />
      </g>
    );
  }

  return null;
}
