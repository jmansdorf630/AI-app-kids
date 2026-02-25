"use client";

import { useId } from "react";
import type { BodyColorKey } from "@/types";

const BODY_GRADIENTS: Record<
  BodyColorKey,
  { main: string; light: string; dark: string; rim: string }
> = {
  blue: { main: "#3b82f6", light: "#60a5fa", dark: "#2563eb", rim: "#93c5fd" },
  green: { main: "#22c55e", light: "#4ade80", dark: "#16a34a", rim: "#86efac" },
  purple: { main: "#a855f7", light: "#c084fc", dark: "#7c3aed", rim: "#d8b4fe" },
  gold: { main: "#fbbf24", light: "#fcd34d", dark: "#f59e0b", rim: "#fde68a" },
};

interface RobotBaseProps {
  bodyColor: BodyColorKey;
}

export function RobotBase({ bodyColor }: RobotBaseProps) {
  const uid = useId().replace(/:/g, "");
  const c = BODY_GRADIENTS[bodyColor] ?? BODY_GRADIENTS.blue;
  const id = `rb-${bodyColor}-${uid}`;

  return (
    <g>
      <defs>
        {/* Light from top-left → lighter top-left, darker bottom-right */}
        <linearGradient id={`${id}-head`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="50%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
        <linearGradient id={`${id}-body`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.light} />
          <stop offset="45%" stopColor={c.main} />
          <stop offset="100%" stopColor={c.dark} />
        </linearGradient>
        {/* Soft drop shadow */}
        <filter id={`${id}-shadow`} x="-20%" y="-10%" width="140%" height="120%">
          <feDropShadow dx={0} dy={4} stdDeviation={3} floodColor="#000" floodOpacity={0.2} />
        </filter>
      </defs>

      {/* Shadow shape (behind robot, no fill in defs - we use filter on group) */}
      <g filter={`url(#${id}-shadow)`}>
        {/* Body: rounded rect with gradient + inner shadow feel */}
        <rect
          x={72}
          y={75}
          width={56}
          height={65}
          rx={12}
          ry={12}
          fill={`url(#${id}-body)`}
          stroke={c.dark}
          strokeWidth={2}
        />
        {/* Body panel line (subtle) */}
        <rect x={80} y={85} width={40} height={1} rx={0.5} fill="rgba(0,0,0,0.08)" />
        {/* Body panel detail */}
        <ellipse cx={100} cy={115} rx={12} ry={8} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1} />

        {/* Head: rounded rect with gradient */}
        <rect
          x={68}
          y={30}
          width={64}
          height={40}
          rx={12}
          ry={12}
          fill={`url(#${id}-head)`}
          stroke={c.dark}
          strokeWidth={2}
        />
        {/* Head rim highlight (top-left edge) */}
        <path
          d="M 80 30 L 120 30 Q 132 30 132 42 L 132 50"
          fill="none"
          stroke={c.rim}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.9}
        />
        <path
          d="M 72 42 L 72 55 Q 72 70 80 70 L 88 70"
          fill="none"
          stroke={c.rim}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Head inner shadow feel */}
        <path
          d="M 68 30 L 132 30 L 132 70 L 68 70 Z"
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={1}
        />
        {/* Head panel line */}
        <path d="M 78 50 L 122 50" stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeLinecap="round" />

        {/* Antenna (gradient-style: lighter top) */}
        <line x1={100} y1={30} x2={100} y2={18} stroke={c.dark} strokeWidth={2} />
        <circle cx={100} cy={14} r={4} fill={c.main} stroke={c.dark} strokeWidth={1} />
        <circle cx={99} cy={13} r={1} fill="rgba(255,255,255,0.5)" />
      </g>
    </g>
  );
}
