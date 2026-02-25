"use client";

import { useId } from "react";
import type { HeadgearKey } from "@/types";

interface HeadgearProps {
  headgear: HeadgearKey;
}

export function HeadgearLayer({ headgear }: HeadgearProps) {
  const uid = useId().replace(/:/g, "");

  if (headgear === "grad_cap") {
    return (
      <g>
        <defs>
          <linearGradient id={`grad-cap-cloth-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </linearGradient>
          <linearGradient id={`grad-cap-tassel-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
        {/* Shadow under brim on head */}
        <ellipse cx={100} cy={34} rx={38} ry={4} fill="rgba(0,0,0,0.2)" />
        <path d="M 60 32 L 140 32 L 130 28 L 70 28 Z" fill={`url(#grad-cap-cloth-${uid})`} stroke="#111827" strokeWidth={1} />
        <rect x={98} y={22} width={4} height={20} fill="#4b5563" stroke="#374151" strokeWidth={0.5} />
        <circle cx={100} cy={18} r={6} fill={`url(#grad-cap-tassel-${uid})`} stroke="#a16207" strokeWidth={1} />
        <circle cx={99} cy={17} r={1.5} fill="rgba(255,255,255,0.4)" />
      </g>
    );
  }

  if (headgear === "headset") {
    return (
      <g>
        <defs>
          <linearGradient id={`headset-band-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="30%" stopColor="#4b5563" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id={`headset-cup-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>
        </defs>
        {/* Glossy highlight on band (top-left) */}
        <path d="M 72 38 Q 72 28 100 28 Q 128 28 128 38 L 128 48 Q 128 52 124 52 L 76 52 Q 72 52 72 48 Z" fill={`url(#headset-band-${uid})`} stroke="#1f2937" strokeWidth={1} />
        <path d="M 76 32 Q 88 30 100 30" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1} strokeLinecap="round" />
        {/* Shadow where cups meet head */}
        <ellipse cx={76} cy={54} rx={6} ry={2} fill="rgba(0,0,0,0.15)" />
        <ellipse cx={124} cy={54} rx={6} ry={2} fill="rgba(0,0,0,0.15)" />
        <circle cx={76} cy={52} r={8} fill={`url(#headset-cup-${uid})`} stroke="#1f2937" strokeWidth={1} />
        <circle cx={124} cy={52} r={8} fill={`url(#headset-cup-${uid})`} stroke="#1f2937" strokeWidth={1} />
        <circle cx={74} cy={50} r={2} fill="rgba(255,255,255,0.2)" />
        <circle cx={122} cy={50} r={2} fill="rgba(255,255,255,0.2)" />
      </g>
    );
  }

  if (headgear === "crown") {
    return (
      <g>
        <defs>
          <linearGradient id={`crown-gold-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
        </defs>
        <path d="M 68 42 L 100 28 L 132 42 L 120 40 L 100 34 L 80 40 Z" fill={`url(#crown-gold-${uid})`} stroke="#a16207" strokeWidth={1} />
        <rect x={78} y={40} width={44} height={6} fill={`url(#crown-gold-${uid})`} stroke="#a16207" strokeWidth={0.5} />
        <path d="M 100 28 L 102 26" stroke="rgba(255,255,255,0.5)" strokeWidth={1} strokeLinecap="round" />
      </g>
    );
  }

  if (headgear === "rocket_helmet") {
    return (
      <g>
        <defs>
          <linearGradient id={`helmet-dome-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="40%" stopColor="#6b7280" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>
          <linearGradient id={`helmet-fin-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
        </defs>
        {/* Shadow under helmet on head */}
        <ellipse cx={100} cy={46} rx={36} ry={6} fill="rgba(0,0,0,0.18)" />
        <ellipse cx={100} cy={42} rx={38} ry={22} fill={`url(#helmet-dome-${uid})`} stroke="#4b5563" strokeWidth={1} />
        <path d="M 98 42 Q 96 30 100 22" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeLinecap="round" />
        <path d="M 100 20 L 100 14 L 98 8 L 102 8 Z" fill={`url(#helmet-fin-${uid})`} stroke="#6b7280" strokeWidth={0.5} />
        <rect x={96} y={28} width={8} height={12} rx={2} fill="#9ca3af" stroke="#6b7280" strokeWidth={0.5} />
      </g>
    );
  }

  return null;
}
