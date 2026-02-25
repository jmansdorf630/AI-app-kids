"use client";

import type { HeadgearKey } from "@/types";

interface HeadgearProps {
  headgear: HeadgearKey;
}

export function HeadgearLayer({ headgear }: HeadgearProps) {
  if (headgear === "grad_cap") {
    return (
      <g fill="#1f2937" stroke="#111827" strokeWidth={1}>
        <path d="M 60 32 L 140 32 L 130 28 L 70 28 Z" />
        <rect x={98} y={22} width={4} height={20} />
        <circle cx={100} cy={18} r={6} fill="#eab308" stroke="#a16207" strokeWidth={1} />
      </g>
    );
  }

  if (headgear === "headset") {
    return (
      <g fill="#374151" stroke="#1f2937" strokeWidth={1}>
        <path d="M 72 38 Q 72 28 100 28 Q 128 28 128 38 L 128 48 Q 128 52 124 52 L 76 52 Q 72 52 72 48 Z" />
        <circle cx={76} cy={52} r={8} fill="#4b5563" stroke="#1f2937" strokeWidth={1} />
        <circle cx={124} cy={52} r={8} fill="#4b5563" stroke="#1f2937" strokeWidth={1} />
      </g>
    );
  }

  if (headgear === "crown") {
    return (
      <g fill="#eab308" stroke="#a16207" strokeWidth={1}>
        <path d="M 68 42 L 100 28 L 132 42 L 120 40 L 100 34 L 80 40 Z" />
        <rect x={78} y={40} width={44} height={6} />
      </g>
    );
  }

  if (headgear === "rocket_helmet") {
    return (
      <g fill="#6b7280" stroke="#4b5563" strokeWidth={1}>
        <ellipse cx={100} cy={42} rx={38} ry={22} />
        <path d="M 100 20 L 100 14 L 98 8 L 102 8 Z" fill="#9ca3af" stroke="#6b7280" />
        <rect x={96} y={28} width={8} height={12} rx={2} fill="#9ca3af" />
      </g>
    );
  }

  return null;
}
