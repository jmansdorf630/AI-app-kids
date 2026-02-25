"use client";

import { AvatarRenderer } from "@/components/avatar/AvatarRenderer";
import type { AvatarEquipped } from "@/types";

interface RobotAvatarProps {
  equipped: AvatarEquipped;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Re-export: use AvatarRenderer for the new SVG paper-doll robot. */
export function RobotAvatar(props: RobotAvatarProps) {
  return <AvatarRenderer {...props} />;
}
