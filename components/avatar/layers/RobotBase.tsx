"use client";

import type { BodyColorKey } from "@/types";

const BODY_COLORS: Record<BodyColorKey, { fill: string; stroke: string }> = {
  blue: { fill: "#3b82f6", stroke: "#1d4ed8" },
  green: { fill: "#22c55e", stroke: "#15803d" },
  purple: { fill: "#a855f7", stroke: "#6d28d9" },
  gold: { fill: "#fbbf24", stroke: "#d97706" },
};

interface RobotBaseProps {
  bodyColor: BodyColorKey;
}

export function RobotBase({ bodyColor }: RobotBaseProps) {
  const { fill, stroke } = BODY_COLORS[bodyColor] ?? BODY_COLORS.blue;

  return (
    <g>
      {/* Body: rounded rect, y 75–150 */}
      <rect
        x={72}
        y={75}
        width={56}
        height={65}
        rx={12}
        ry={12}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
      />
      {/* Optional highlight (flat, minimal) */}
      <rect x={78} y={82} width={12} height={8} rx={2} fill="rgba(255,255,255,0.35)" />

      {/* Head: rounded rect, y 30–70 */}
      <rect
        x={68}
        y={30}
        width={64}
        height={40}
        rx={12}
        ry={12}
        fill={fill}
        stroke={stroke}
        strokeWidth={2}
      />

      {/* Antenna */}
      <line x1={100} y1={30} x2={100} y2={18} stroke={stroke} strokeWidth={2} />
      <circle cx={100} cy={14} r={4} fill={fill} stroke={stroke} strokeWidth={1} />
    </g>
  );
}
