import type { ProgressState, AvatarEquipped } from "@/types";
import { DEFAULT_AVATAR_STATE } from "@/types";
import type { LearnTierKey } from "@/types";
import { beginnerIds, explorerIds, masterIds } from "@/data/lessons";
import { getAvatarItemById, type AvatarItem, type TierValue } from "@/data/avatarItems";

function getTierIds(tier: LearnTierKey): string[] {
  if (tier === "beginner") return beginnerIds;
  if (tier === "explorer") return explorerIds;
  return masterIds;
}

/** Tier is complete when all lessons in that tier are completed. */
export function isTierComplete(progress: ProgressState, tier: LearnTierKey): boolean {
  const ids = getTierIds(tier);
  return ids.length > 0 && ids.every((id) => progress.lessons[id]?.completed === true);
}

export function meetsUnlockRequirement(progress: ProgressState, item: AvatarItem): boolean {
  const u = item.unlock;
  if (!u || u.kind === "none") return true;
  if (u.kind === "complete_tier") {
    const tier = u.value as TierValue;
    return isTierComplete(progress, tier);
  }
  if (u.kind === "min_xp") return progress.totalXp >= (u.value as number);
  if (u.kind === "streak_days") return progress.currentStreak >= (u.value as number);
  return true;
}

export function canAfford(progress: ProgressState, item: AvatarItem): boolean {
  return progress.totalXp >= item.xpCost;
}

export function getUnlockRequirementText(item: AvatarItem): string | null {
  const u = item.unlock;
  if (!u || u.kind === "none") return null;
  if (u.kind === "complete_tier") return `Unlock by completing ${String(u.value).charAt(0).toUpperCase() + String(u.value).slice(1)}`;
  if (u.kind === "min_xp") return `Unlock at ${u.value} XP`;
  if (u.kind === "streak_days") return `Unlock with a ${u.value}-day streak`;
  return null;
}

export function ownsItem(progress: ProgressState, itemId: string): boolean {
  const inv = progress.avatar?.inventory ?? [];
  return inv.includes(itemId);
}

/** Deduct XP and add item to inventory. Does not equip. Caller should also equip if desired. */
export function buyItem(progress: ProgressState, itemId: string): ProgressState | null {
  const item = getAvatarItemById(itemId);
  if (!item) return null;
  if (ownsItem(progress, itemId)) return null;
  if (!meetsUnlockRequirement(progress, item)) return null;
  if (!canAfford(progress, item)) return null;

  const avatar = progress.avatar ?? { equipped: { ...DEFAULT_AVATAR_STATE.equipped }, inventory: [...DEFAULT_AVATAR_STATE.inventory] };
  const newInventory = [...avatar.inventory, itemId];
  return {
    ...progress,
    totalXp: progress.totalXp - item.xpCost,
    avatar: {
      ...avatar,
      inventory: newInventory,
      equipped: { ...avatar.equipped },
    },
  };
}

/** Equip an item. Item must be owned, or be a starter default, or be earned (xpCost 0 + unlock met). */
export function equipItem(progress: ProgressState, itemId: string): ProgressState | null {
  const item = getAvatarItemById(itemId);
  if (!item) return null;
  const inv = progress.avatar?.inventory ?? [];
  const owned = inv.includes(itemId);
  const isStarter = item.xpCost === 0 && (item.type === "color" || item.type === "eyes");
  const isEarned = item.xpCost === 0 && meetsUnlockRequirement(progress, item);
  if (!owned && !isStarter && !isEarned) return null;

  const avatar = progress.avatar ?? { equipped: { ...DEFAULT_AVATAR_STATE.equipped }, inventory: [...DEFAULT_AVATAR_STATE.inventory] };
  const eq: AvatarEquipped = { ...avatar.equipped };

  switch (item.type) {
    case "color":
      eq.bodyColor = item.equipValue;
      break;
    case "eyes":
      eq.eyes = item.equipValue;
      break;
    case "headgear":
      eq.headgear = item.equipValue;
      break;
    case "accessory":
      eq.accessory = item.equipValue;
      break;
    case "effect":
      eq.effect = item.equipValue;
      break;
    default:
      return null;
  }

  const newInventory = owned || inv.includes(itemId) ? avatar.inventory : [...avatar.inventory, itemId];
  return {
    ...progress,
    avatar: { ...avatar, equipped: eq, inventory: newInventory },
  };
}
