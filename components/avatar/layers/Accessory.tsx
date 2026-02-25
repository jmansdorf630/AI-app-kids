"use client";

import type { AccessoryKey } from "@/types";

interface AccessoryProps {
  accessory: AccessoryKey;
  zIndex?: "back" | "front";
}

export function AccessoryLayer({ accessory, zIndex = "back" }: AccessoryProps) {
  if (accessory === "cape") {
    return (
      <g fill="#7c3aed" stroke="#5b21b6" strokeWidth={1}>
        <path d="M 72 75 L 60 200 L 80 140 L 72 75 Z" />
        <path d="M 128 75 L 140 200 L 120 140 L 128 75 Z" />
      </g>
    );
  }

  if (accessory === "backpack") {
    return (
      <g fill="#4b5563" stroke="#374151" strokeWidth={1}>
        <rect x={118} y={82} width={24} height={32} rx={4} />
        <path d="M 122 82 L 122 75 L 138 75 L 138 82" stroke="#374151" strokeWidth={2} fill="none" />
        <rect x={124} y={88} width={12} height={8} rx={1} fill="#6b7280" />
      </g>
    );
  }

  if (accessory === "jetpack") {
    return (
      <g fill="#374151" stroke="#1f2937" strokeWidth={1}>
        <rect x={114} y={78} width={32} height={40} rx={4} />
        <rect x={120} y={88} width={8} height={20} rx={2} fill="#6b7280" />
        <rect x={132} y={88} width={8} height={20} rx={2} fill="#6b7280" />
        <path d="M 122 118 L 118 140 L 126 140 Z" fill="#f97316" stroke="#ea580c" />
        <path d="M 138 118 L 142 140 L 134 140 Z" fill="#f97316" stroke="#ea580c" />
      </g>
    );
  }

  return null;
}
