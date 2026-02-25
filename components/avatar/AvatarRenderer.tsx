"use client";

import type { AvatarEquipped, BodyColorKey, EyesKey, HeadgearKey, AccessoryKey, EffectKey } from "@/types";
import { RobotBase } from "./layers/RobotBase";
import { EyesLayer } from "./layers/Eyes";
import { HeadgearLayer } from "./layers/Headgear";
import { AccessoryLayer } from "./layers/Accessory";
import { EffectLayer } from "./layers/Effect";

const SIZE_PX = { sm: 96, md: 160, lg: 240 } as const;
const VIEWBOX = "0 0 200 200";

interface AvatarRendererProps {
  equipped: AvatarEquipped;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function normalizeEquipped(equipped: AvatarEquipped): {
  bodyColor: BodyColorKey;
  eyes: EyesKey;
  headgear: HeadgearKey | null;
  accessory: AccessoryKey | null;
  effect: EffectKey | null;
} {
  const bodyColors: BodyColorKey[] = ["blue", "green", "purple", "gold"];
  const eyesKeys: EyesKey[] = ["happy", "star", "pixel", "sunglasses"];
  const headgearKeys: HeadgearKey[] = ["grad_cap", "headset", "crown", "rocket_helmet"];
  const accessoryKeys: AccessoryKey[] = ["cape", "backpack", "jetpack"];
  const effectKeys: EffectKey[] = ["sparkles", "glow", "flame"];

  return {
    bodyColor: bodyColors.includes(equipped.bodyColor as BodyColorKey) ? (equipped.bodyColor as BodyColorKey) : "blue",
    eyes: eyesKeys.includes(equipped.eyes as EyesKey) ? (equipped.eyes as EyesKey) : "happy",
    headgear: equipped.headgear && headgearKeys.includes(equipped.headgear as HeadgearKey) ? (equipped.headgear as HeadgearKey) : null,
    accessory: equipped.accessory && accessoryKeys.includes(equipped.accessory as AccessoryKey) ? (equipped.accessory as AccessoryKey) : null,
    effect: equipped.effect && effectKeys.includes(equipped.effect as EffectKey) ? (equipped.effect as EffectKey) : null,
  };
}

export function AvatarRenderer({ equipped, size = "md", className = "" }: AvatarRendererProps) {
  const eq = normalizeEquipped(equipped);
  const px = SIZE_PX[size];

  return (
    <svg
      viewBox={VIEWBOX}
      width={px}
      height={px}
      className={`avatar-stage ${className}`}
      role="img"
      aria-label="Robot avatar"
    >
      <defs>
        {/* Spotlight: light center behind head, fades outward */}
        <radialGradient id="avatar-spotlight" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity={0.5} />
          <stop offset="50%" stopColor="#e2e8f0" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Backdrop: radial gradient "stage" */}
      <circle cx={100} cy={100} r={95} fill="url(#avatar-spotlight)" />
      <circle cx={100} cy={100} r={95} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth={1} />

      {/* Soft ground shadow ellipse beneath robot */}
      <ellipse cx={100} cy={158} rx={38} ry={8} fill="rgba(0,0,0,0.12)" />

      {/* 1) Effect behind */}
      {eq.effect && <EffectLayer effect={eq.effect} variant="back" />}

      {/* 2) Accessory behind body */}
      {eq.accessory && <AccessoryLayer accessory={eq.accessory} zIndex="back" />}

      {/* 3) Robot base */}
      <RobotBase bodyColor={eq.bodyColor} />

      {/* 4) Eyes */}
      <EyesLayer eyes={eq.eyes} />

      {/* 5) Headgear */}
      {eq.headgear && <HeadgearLayer headgear={eq.headgear} />}
    </svg>
  );
}
