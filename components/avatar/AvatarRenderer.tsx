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
      className={className}
      role="img"
      aria-label="Robot avatar"
    >
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
