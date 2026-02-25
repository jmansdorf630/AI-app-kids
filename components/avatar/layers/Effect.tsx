"use client";

import { useId } from "react";
import type { EffectKey } from "@/types";

interface EffectProps {
  effect: EffectKey;
  variant?: "back" | "front";
}

export function EffectLayer({ effect, variant = "back" }: EffectProps) {
  const uid = useId().replace(/:/g, "");

  if (effect === "sparkles") {
    return (
      <g>
        <defs>
          <linearGradient id={`sparkle-fill-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>
        <g fill={`url(#sparkle-fill-${uid})`} stroke="#f59e0b" strokeWidth={0.5} opacity={0.95}>
          <path d="M 40 50 L 42 56 L 48 58 L 42 60 L 40 66 L 38 60 L 32 58 L 38 56 Z" />
          <path d="M 160 70 L 162 76 L 168 78 L 162 80 L 160 86 L 158 80 L 152 78 L 158 76 Z" />
          <path d="M 50 130 L 52 136 L 58 138 L 52 140 L 50 146 L 48 140 L 42 138 L 48 136 Z" />
          <path d="M 150 120 L 152 126 L 158 128 L 152 130 L 150 136 L 148 130 L 142 128 L 148 126 Z" />
        </g>
        <g fill="rgba(255,255,255,0.4)">
          <circle cx={44} cy={58} r={1} />
          <circle cx={164} cy={78} r={1} />
        </g>
      </g>
    );
  }

  if (effect === "glow") {
    return (
      <g>
        <defs>
          <radialGradient id={`glow-soft-${uid}`} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity={0.35} />
            <stop offset="70%" stopColor="#818cf8" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={100} cy={95} rx={65} ry={75} fill={`url(#glow-soft-${uid})`} />
        <ellipse cx={100} cy={95} rx={65} ry={75} fill="none" stroke="#818cf8" strokeWidth={2} opacity={0.4} />
      </g>
    );
  }

  if (effect === "flame") {
    return (
      <g>
        <defs>
          <linearGradient id={`flame-inner-${uid}`} x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="60%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <linearGradient id={`flame-outer-${uid}`} x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#c2410c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <path d="M 70 135 Q 65 120 75 110 Q 70 100 80 95 Q 75 85 90 90 Q 85 75 100 85 Q 95 70 110 80 Q 105 90 115 100 Q 125 110 120 135 Z" fill={`url(#flame-outer-${uid})`} stroke="#ea580c" strokeWidth={0.5} opacity={0.85} />
        <path d="M 130 135 Q 135 120 125 110 Q 130 100 120 95 Q 125 85 110 90 Q 115 75 100 85 Q 105 70 90 80 Q 95 90 85 100 Q 75 110 80 135 Z" fill={`url(#flame-outer-${uid})`} stroke="#ea580c" strokeWidth={0.5} opacity={0.85} />
        <path d="M 75 125 Q 78 115 88 108 Q 92 98 98 92 Q 100 82 108 88 Q 108 98 112 108 Q 118 118 118 128 Z" fill={`url(#flame-inner-${uid})`} opacity={0.6} />
      </g>
    );
  }

  return null;
}
