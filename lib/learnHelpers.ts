import type { ProgressState } from "@/types";
import type { LessonTier } from "@/types";
import { getIsLessonUnlocked } from "./progress";
import { lessons, beginnerIds, explorerIds, masterIds } from "@/data/lessons";
import { getLessonById } from "@/data/lessons";
import type { LearnTierKey } from "@/types";

const MASTER_TIER_XP_THRESHOLD = 300;

const TIER_IDS: Record<LearnTierKey, string[]> = {
  beginner: beginnerIds,
  explorer: explorerIds,
  master: masterIds,
};

export interface TierProgress {
  completed: number;
  total: number;
  percent: number;
}

export function getTierProgress(state: ProgressState, tier: LearnTierKey): TierProgress {
  const ids = TIER_IDS[tier];
  const total = ids.length;
  const completed = ids.filter((id) => state.lessons[id]?.completed).length;
  const percent = total > 0 ? (completed / total) * 100 : 0;
  return { completed, total, percent };
}

export function isTierLocked(tier: LearnTierKey, state: ProgressState): boolean {
  if (tier === "beginner") return false;
  if (tier === "explorer") {
    return !beginnerIds.every((id) => state.lessons[id]?.completed === true);
  }
  // master
  if (!explorerIds.every((id) => state.lessons[id]?.completed === true)) return true;
  return state.totalXp < MASTER_TIER_XP_THRESHOLD;
}

/** First unlocked, not-yet-completed lesson across all tiers (in order). */
export function getNextUpLessonId(state: ProgressState): string | null {
  const order: LearnTierKey[] = ["beginner", "explorer", "master"];
  for (const t of order) {
    if (isTierLocked(t, state)) continue;
    const ids = TIER_IDS[t];
    for (const id of ids) {
      if (state.lessons[id]?.completed) continue;
      const unlocked = getIsLessonUnlocked(id, t as LessonTier, state, beginnerIds, explorerIds, masterIds);
      if (unlocked) return id;
    }
  }
  return null;
}

export function getUnlockRequirement(
  lessonId: string,
  tier: LearnTierKey,
  state: ProgressState
): string {
  if (tier === "explorer") {
    const allBeginnerDone = beginnerIds.every((id) => state.lessons[id]?.completed === true);
    if (!allBeginnerDone) return "Finish Beginner to unlock Explorer lessons";
  }
  if (tier === "master") {
    const allExplorerDone = explorerIds.every((id) => state.lessons[id]?.completed === true);
    if (!allExplorerDone) return "Finish Explorer to unlock Master lessons";
    if (state.totalXp < MASTER_TIER_XP_THRESHOLD) return "Reach 300 XP to unlock Master";
  }
  const ids = TIER_IDS[tier];
  const i = ids.indexOf(lessonId);
  if (i <= 0) return "";
  const prev = getLessonById(ids[i - 1]);
  return prev ? `Complete "${prev.title}" to unlock` : "Complete the previous lesson to unlock";
}

/** Tier reward copy (placeholder badges). */
export const TIER_REWARDS: Record<LearnTierKey, { badge: string; emoji: string }> = {
  beginner: { badge: "AI Starter", emoji: "🏅" },
  explorer: { badge: "AI Explorer", emoji: "🧠" },
  master: { badge: "AI Master", emoji: "👑" },
};
