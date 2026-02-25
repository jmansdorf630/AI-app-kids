"use client";

import type { AvatarEquipped } from "@/types";

const BODY_COLORS: Record<string, string> = {
  blue: "bg-blue-500 dark:bg-blue-600",
  green: "bg-green-500 dark:bg-green-600",
  purple: "bg-purple-500 dark:bg-purple-600",
  gold: "bg-amber-400 dark:bg-amber-500",
};

const SIZE_CLASS = {
  sm: "w-16 h-20",
  md: "w-24 h-28",
  lg: "w-32 h-36",
};

interface RobotAvatarProps {
  equipped: AvatarEquipped;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RobotAvatar({ equipped, size = "md", className = "" }: RobotAvatarProps) {
  const bodyColor = BODY_COLORS[equipped.bodyColor] ?? BODY_COLORS.blue;
  const s = SIZE_CLASS[size];
  const headSize = size === "sm" ? "w-12 h-12" : size === "md" ? "w-14 h-14" : "w-16 h-16";
  const eyeSize = size === "sm" ? "w-2 h-2" : size === "md" ? "w-2.5 h-2.5" : "w-3 h-3";

  return (
    <div className={`relative inline-flex flex-col items-center ${s} ${className}`} role="img" aria-label="Robot avatar">
      {/* Effect layer (behind) - static when reduce-motion */}
      {equipped.effect && (
        <div
          className={`absolute inset-0 rounded-full pointer-events-none ${
            equipped.effect === "sparkle"
              ? "bg-amber-200/40 dark:bg-amber-400/20 animate-pulse motion-reduce:animate-none"
              : equipped.effect === "flame"
                ? "bg-orange-300/30 dark:bg-orange-400/20"
                : equipped.effect === "hologram"
                  ? "bg-indigo-300/25 dark:bg-indigo-400/20"
                  : ""
          }`}
          style={{ transform: "scale(1.3)" }}
        />
      )}

      {/* Head */}
      <div className={`relative ${headSize} rounded-2xl ${bodyColor} border-2 border-gray-800/20 dark:border-gray-200/20 flex items-center justify-center flex-shrink-0 shadow-md`}>
        {/* Eyes */}
        <div className="flex items-center justify-center gap-1">
          {equipped.eyes === "happy" && (
            <>
              <span className={`${eyeSize} rounded-full bg-gray-800 dark:bg-gray-100`} />
              <span className={`${eyeSize} rounded-full bg-gray-800 dark:bg-gray-100`} />
            </>
          )}
          {equipped.eyes === "star" && (
            <span className="text-lg leading-none" aria-hidden>🌟</span>
          )}
          {equipped.eyes === "pixel" && (
            <>
              <span className={`${eyeSize} bg-gray-900 dark:bg-white rounded-none`} />
              <span className={`${eyeSize} bg-gray-900 dark:bg-white rounded-none`} />
            </>
          )}
          {equipped.eyes === "sunglasses" && (
            <span className="text-base leading-none" aria-hidden>😎</span>
          )}
          {!["happy", "star", "pixel", "sunglasses"].includes(equipped.eyes) && (
            <>
              <span className={`${eyeSize} rounded-full bg-gray-800 dark:bg-gray-100`} />
              <span className={`${eyeSize} rounded-full bg-gray-800 dark:bg-gray-100`} />
            </>
          )}
        </div>

        {/* Headgear overlay */}
        {equipped.headgear && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xl leading-none" aria-hidden>
            {equipped.headgear === "graduation" && "🎓"}
            {equipped.headgear === "headset" && "🎧"}
            {equipped.headgear === "crown" && "👑"}
            {equipped.headgear === "rocket" && "🚀"}
          </div>
        )}
      </div>

      {/* Body */}
      <div className={`mt-1 w-14 rounded-xl ${bodyColor} border-2 border-gray-800/20 dark:border-gray-200/20 flex-1 min-h-[2rem] flex items-center justify-center relative shadow-md ${size === "sm" ? "min-h-[1.5rem] w-10" : size === "lg" ? "min-h-[2.5rem] w-20" : ""}`}>
        {/* Accessory on body */}
        {equipped.accessory && (
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm leading-none" aria-hidden>
            {equipped.accessory === "cape" && "🦸"}
            {equipped.accessory === "backpack" && "🎒"}
            {equipped.accessory === "jetpack" && "🚀"}
          </span>
        )}
      </div>
    </div>
  );
}
