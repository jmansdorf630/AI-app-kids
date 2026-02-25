"use client";

import { useId } from "react";
import type { EyesKey } from "@/types";

interface EyesProps {
  eyes: EyesKey;
}

export function EyesLayer({ eyes }: EyesProps) {
  const uid = useId().replace(/:/g, "");
  const eyeY = 50;
  const leftX = 85;
  const rightX = 115;

  if (eyes === "happy") {
    return (
      <g>
        <defs>
          <linearGradient id={`eye-happy-shade-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
        </defs>
        <rect x={80} y={44} width={12} height={12} rx={3} fill={`url(#eye-happy-shade-${uid})`} stroke="#111827" strokeWidth={0.5} />
        <rect x={108} y={44} width={12} height={12} rx={3} fill={`url(#eye-happy-shade-${uid})`} stroke="#111827" strokeWidth={0.5} />
        {/* Slight shadow under eyes */}
        <ellipse cx={86} cy={57} rx={5} ry={2} fill="rgba(0,0,0,0.12)" />
        <ellipse cx={114} cy={57} rx={5} ry={2} fill="rgba(0,0,0,0.12)" />
        {/* Highlight dots */}
        <circle cx={84} cy={48} r={2} fill="rgba(255,255,255,0.7)" />
        <circle cx={112} cy={48} r={2} fill="rgba(255,255,255,0.7)" />
      </g>
    );
  }

  if (eyes === "star") {
    const star = (cx: number, cy: number) => (
      <g transform={`translate(${cx},${cy})`}>
        <path d="M0,-4 L1.2,1.5 L4,1.5 L1.8,4 L2.8,8 L0,5.5 L-2.8,8 L-1.8,4 L-4,1.5 L-1.2,1.5 Z" fill="#1f2937" stroke="#111827" strokeWidth={0.5} />
        <circle r={0.8} cx={-0.5} cy={1} fill="rgba(255,255,255,0.5)" />
      </g>
    );
    return (
      <g>
        <ellipse cx={85} cy={52} rx={6} ry={3} fill="rgba(0,0,0,0.12)" />
        <ellipse cx={115} cy={52} rx={6} ry={3} fill="rgba(0,0,0,0.12)" />
        {star(leftX, eyeY)}
        {star(rightX, eyeY)}
      </g>
    );
  }

  if (eyes === "pixel") {
    return (
      <g>
        <rect x={80} y={46} width={10} height={4} rx={0} fill="rgba(0,0,0,0.2)" />
        <rect x={110} y={46} width={10} height={4} rx={0} fill="rgba(0,0,0,0.2)" />
        <rect x={80} y={44} width={10} height={10} fill="#111827" stroke="#0f172a" strokeWidth={0.5} />
        <rect x={110} y={44} width={10} height={10} fill="#111827" stroke="#0f172a" strokeWidth={0.5} />
        <rect x={82} y={46} width={2} height={2} fill="rgba(255,255,255,0.5)" />
        <rect x={112} y={46} width={2} height={2} fill="rgba(255,255,255,0.5)" />
      </g>
    );
  }

  if (eyes === "sunglasses") {
    return (
      <g>
        <defs>
          <linearGradient id={`sunglasses-lens-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4b5563" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
        </defs>
        {/* Shadow under glasses on face */}
        <ellipse cx={100} cy={56} rx={32} ry={4} fill="rgba(0,0,0,0.15)" />
        <rect x={72} y={46} width={56} height={10} rx={2} fill="#1f2937" stroke="#111827" strokeWidth={1} />
        <rect x={74} y={48} width={24} height={6} rx={1} fill={`url(#sunglasses-lens-${uid})`} stroke="#374151" strokeWidth={0.5} />
        <rect x={102} y={48} width={24} height={6} rx={1} fill={`url(#sunglasses-lens-${uid})`} stroke="#374151" strokeWidth={0.5} />
        {/* Shine streak across both lenses */}
        <path d="M 76 49 L 96 51 L 104 51 L 124 49" stroke="rgba(255,255,255,0.45)" strokeWidth={1.2} strokeLinecap="round" fill="none" />
      </g>
    );
  }

  return (
    <g>
      <rect x={80} y={44} width={12} height={12} rx={3} fill="#1f2937" stroke="#111827" strokeWidth={0.5} />
      <rect x={108} y={44} width={12} height={12} rx={3} fill="#1f2937" stroke="#111827" strokeWidth={0.5} />
      <ellipse cx={86} cy={57} rx={5} ry={2} fill="rgba(0,0,0,0.12)" />
      <ellipse cx={114} cy={57} rx={5} ry={2} fill="rgba(0,0,0,0.12)" />
      <circle cx={84} cy={48} r={2} fill="rgba(255,255,255,0.6)" />
      <circle cx={112} cy={48} r={2} fill="rgba(255,255,255,0.6)" />
    </g>
  );
}
