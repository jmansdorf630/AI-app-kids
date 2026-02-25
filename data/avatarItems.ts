export type AvatarItemType = "color" | "eyes" | "headgear" | "accessory" | "effect";
export type AvatarRarity = "common" | "rare" | "epic" | "legendary";

export type UnlockKind = "none" | "complete_tier" | "min_xp" | "streak_days";
export type TierValue = "beginner" | "explorer" | "master";

export interface AvatarItemUnlock {
  kind: UnlockKind;
  value?: number | TierValue;
}

export interface AvatarItem {
  id: string;
  type: AvatarItemType;
  name: string;
  description: string;
  xpCost: number;
  rarity: AvatarRarity;
  unlock?: AvatarItemUnlock;
  previewEmoji?: string;
  /** Value stored in progress.avatar.equipped (e.g. "blue" for color_blue) */
  equipValue: string;
}

export const avatarItems: AvatarItem[] = [
  // Colors
  { id: "color_blue", type: "color", name: "Blue", description: "Classic blue robot", xpCost: 0, rarity: "common", equipValue: "blue", previewEmoji: "🔵" },
  { id: "color_green", type: "color", name: "Green", description: "Fresh green style", xpCost: 25, rarity: "common", equipValue: "green", previewEmoji: "🟢" },
  { id: "color_purple", type: "color", name: "Purple", description: "Royal purple", xpCost: 40, rarity: "rare", equipValue: "purple", previewEmoji: "🟣" },
  { id: "color_gold", type: "color", name: "Gold", description: "Golden champion", xpCost: 80, rarity: "epic", equipValue: "gold", previewEmoji: "🟡" },
  // Eyes
  { id: "eyes_happy", type: "eyes", name: "Happy", description: "Friendly happy eyes", xpCost: 0, rarity: "common", equipValue: "happy", previewEmoji: "😊" },
  { id: "eyes_star", type: "eyes", name: "Star Eyes", description: "Sparkly star eyes", xpCost: 30, rarity: "common", equipValue: "star", previewEmoji: "🌟" },
  { id: "eyes_pixel", type: "eyes", name: "Pixel", description: "Retro pixel eyes", xpCost: 35, rarity: "rare", equipValue: "pixel", previewEmoji: "👾" },
  { id: "eyes_sunglasses", type: "eyes", name: "Sunglasses", description: "Cool shades", xpCost: 50, rarity: "rare", equipValue: "sunglasses", previewEmoji: "😎" },
  // Headgear - earned + purchase
  { id: "headgear_graduation", type: "headgear", name: "Graduation Cap", description: "Complete Beginner to unlock", xpCost: 0, rarity: "rare", equipValue: "graduation", previewEmoji: "🎓", unlock: { kind: "complete_tier", value: "beginner" } },
  { id: "headgear_headset", type: "headgear", name: "Headset", description: "Complete Explorer to unlock", xpCost: 0, rarity: "rare", equipValue: "headset", previewEmoji: "🎧", unlock: { kind: "complete_tier", value: "explorer" } },
  { id: "headgear_crown", type: "headgear", name: "Crown", description: "Complete Master to unlock", xpCost: 0, rarity: "epic", equipValue: "crown", previewEmoji: "👑", unlock: { kind: "complete_tier", value: "master" } },
  { id: "headgear_rocket", type: "headgear", name: "Rocket Helmet", description: "Space-ready helmet", xpCost: 60, rarity: "rare", equipValue: "rocket", previewEmoji: "🚀" },
  // Accessories
  { id: "accessory_cape", type: "accessory", name: "Cape", description: "Hero cape", xpCost: 45, rarity: "rare", equipValue: "cape", previewEmoji: "🦸" },
  { id: "accessory_backpack", type: "accessory", name: "Backpack", description: "Adventure backpack", xpCost: 35, rarity: "common", equipValue: "backpack", previewEmoji: "🎒" },
  { id: "accessory_jetpack", type: "accessory", name: "Jetpack", description: "Jetpack for flying", xpCost: 70, rarity: "epic", equipValue: "jetpack", previewEmoji: "🚀" },
  // Effects
  { id: "effect_sparkle", type: "effect", name: "Sparkle", description: "Reach 300 XP to unlock", xpCost: 40, rarity: "rare", equipValue: "sparkle", previewEmoji: "✨", unlock: { kind: "min_xp", value: 300 } },
  { id: "effect_flame", type: "effect", name: "Flame Aura", description: "7-day streak to unlock", xpCost: 50, rarity: "epic", equipValue: "flame", previewEmoji: "🔥", unlock: { kind: "streak_days", value: 7 } },
  { id: "effect_hologram", type: "effect", name: "Hologram", description: "Reach 500 XP to unlock", xpCost: 80, rarity: "legendary", equipValue: "hologram", previewEmoji: "💫", unlock: { kind: "min_xp", value: 500 } },
];

export function getAvatarItemById(id: string): AvatarItem | undefined {
  return avatarItems.find((i) => i.id === id);
}

export function getAvatarItemsByType(type: AvatarItemType): AvatarItem[] {
  return avatarItems.filter((i) => i.type === type);
}
