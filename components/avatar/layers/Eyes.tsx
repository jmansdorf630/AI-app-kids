"use client";

import type { EyesKey } from "@/types";

interface EyesProps {
  eyes: EyesKey;
}

export function EyesLayer({ eyes }: EyesProps) {
  const eyeY = 50;
  const leftX = 85;
  const rightX = 115;

  if (eyes === "happy") {
    return (
      <g fill="#1f2937" stroke="none">
        <rect x={80} y={44} width={12} height={12} rx={3} />
        <rect x={108} y={44} width={12} height={12} rx={3} />
      </g>
    );
  }

  if (eyes === "star") {
    const star = (cx: number, cy: number) => (
      <g transform={`translate(${cx},${cy})`} fill="#1f2937">
        <path d="M0,-4 L1.2,1.5 L4,1.5 L1.8,4 L2.8,8 L0,5.5 L-2.8,8 L-1.8,4 L-4,1.5 L-1.2,1.5 Z" />
      </g>
    );
    return (
      <g>
        {star(leftX, eyeY)}
        {star(rightX, eyeY)}
      </g>
    );
  }

  if (eyes === "pixel") {
    return (
      <g fill="#111827">
        <rect x={80} y={44} width={10} height={10} />
        <rect x={110} y={44} width={10} height={10} />
      </g>
    );
  }

  if (eyes === "sunglasses") {
    return (
      <g>
        <rect x={72} y={46} width={56} height={10} rx={2} fill="#1f2937" />
        <rect x={74} y={48} width={24} height={6} rx={1} fill="#374151" />
        <rect x={102} y={48} width={24} height={6} rx={1} fill="#374151" />
        <rect x={78} y={50} width={4} height={2} fill="rgba(255,255,255,0.4)" />
        <rect x={106} y={50} width={4} height={2} fill="rgba(255,255,255,0.4)" />
      </g>
    );
  }

  return (
    <g fill="#1f2937">
      <rect x={80} y={44} width={12} height={12} rx={3} />
      <rect x={108} y={44} width={12} height={12} rx={3} />
    </g>
  );
}
