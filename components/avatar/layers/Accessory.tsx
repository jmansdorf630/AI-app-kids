"use client";

import { useId } from "react";
import type { AccessoryKey } from "@/types";

interface AccessoryProps {
  accessory: AccessoryKey;
  zIndex?: "back" | "front";
}

export function AccessoryLayer({ accessory, zIndex = "back" }: AccessoryProps) {
  const uid = useId().replace(/:/g, "");

  if (accessory === "cape") {
    return (
      <g>
        <defs>
          <linearGradient id={`cape-left-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
          <linearGradient id={`cape-right-${uid}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#5b21b6" />
          </linearGradient>
        </defs>
        {/* Tiny shadow where cape meets shoulders */}
        <path d="M 72 78 L 76 82 L 124 82 L 128 78 Z" fill="rgba(0,0,0,0.15)" />
        <path d="M 72 75 L 60 200 L 80 140 L 72 75 Z" fill={`url(#cape-left-${uid})`} stroke="#5b21b6" strokeWidth={1} />
        <path d="M 128 75 L 140 200 L 120 140 L 128 75 Z" fill={`url(#cape-right-${uid})`} stroke="#5b21b6" strokeWidth={1} />
      </g>
    );
  }

  if (accessory === "backpack") {
    return (
      <g>
        <defs>
          <linearGradient id={`backpack-main-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id={`backpack-pocket-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>
        </defs>
        {/* Shadow where straps meet body */}
        <path d="M 122 80 L 122 76 L 138 76 L 138 80 Z" fill="rgba(0,0,0,0.2)" />
        <rect x={118} y={82} width={24} height={32} rx={4} fill={`url(#backpack-main-${uid})`} stroke="#374151" strokeWidth={1} />
        <path d="M 122 82 L 122 75 L 138 75 L 138 82" stroke="#374151" strokeWidth={2} fill="none" />
        <rect x={124} y={88} width={12} height={8} rx={1} fill={`url(#backpack-pocket-${uid})`} stroke="#4b5563" strokeWidth={0.5} />
        <path d="M 126 90 L 130 90" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} strokeLinecap="round" />
      </g>
    );
  }

  if (accessory === "jetpack") {
    return (
      <g>
        <defs>
          <linearGradient id={`jetpack-body-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id={`jetpack-thruster-${uid}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="40%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>
          <radialGradient id={`jetpack-exhaust-${uid}`} cx="50%" cy="100%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.5} />
            <stop offset="70%" stopColor="#f97316" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* Shadow where jetpack meets body */}
        <path d="M 114 82 L 114 78 L 146 78 L 146 82 Z" fill="rgba(0,0,0,0.2)" />
        <rect x={114} y={78} width={32} height={40} rx={4} fill={`url(#jetpack-body-${uid})`} stroke="#1f2937" strokeWidth={1} />
        <rect x={120} y={88} width={8} height={20} rx={2} fill="#6b7280" stroke="#4b5563" strokeWidth={0.5} />
        <rect x={132} y={88} width={8} height={20} rx={2} fill="#6b7280" stroke="#4b5563" strokeWidth={0.5} />
        <path d="M 122 118 L 118 140 L 126 140 Z" fill={`url(#jetpack-thruster-${uid})`} stroke="#ea580c" strokeWidth={0.5} />
        <path d="M 138 118 L 142 140 L 134 140 Z" fill={`url(#jetpack-thruster-${uid})`} stroke="#ea580c" strokeWidth={0.5} />
        {/* Static exhaust glow */}
        <ellipse cx={122} cy={145} rx={6} ry={4} fill={`url(#jetpack-exhaust-${uid})`} />
        <ellipse cx={138} cy={145} rx={6} ry={4} fill={`url(#jetpack-exhaust-${uid})`} />
      </g>
    );
  }

  return null;
}
