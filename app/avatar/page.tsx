"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, saveProgress } from "@/lib/progress";
import { initSfx, playSfx } from "@/lib/sfx";
import {
  buyItem,
  equipItem,
  meetsUnlockRequirement,
  canAfford,
  ownsItem,
  getUnlockRequirementText,
} from "@/lib/avatar";
import { avatarItems, getAvatarItemsByType, type AvatarItemType } from "@/data/avatarItems";
import { AvatarRenderer } from "@/components/avatar/AvatarRenderer";
import type { ProgressState, AvatarEquipped } from "@/types";

const focusRing =
  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900";

const CATEGORIES: { key: AvatarItemType; label: string; emoji: string }[] = [
  { key: "color", label: "Colors", emoji: "🎨" },
  { key: "eyes", label: "Eyes", emoji: "👀" },
  { key: "headgear", label: "Headgear", emoji: "🎩" },
  { key: "accessory", label: "Accessories", emoji: "🎒" },
  { key: "effect", label: "Effects", emoji: "✨" },
];

function isEquipped(progress: ProgressState, itemId: string, type: AvatarItemType, equipValue: string): boolean {
  const eq = progress.avatar?.equipped;
  if (!eq) return false;
  if (type === "color") return eq.bodyColor === equipValue;
  if (type === "eyes") return eq.eyes === equipValue;
  if (type === "headgear") return eq.headgear === equipValue;
  if (type === "accessory") return eq.accessory === equipValue;
  if (type === "effect") return eq.effect === equipValue;
  return false;
}

function previewEquipped(current: AvatarEquipped, item: { type: AvatarItemType; equipValue: string }): AvatarEquipped {
  const base = { ...current };
  if (item.type === "color") return { ...base, bodyColor: item.equipValue as AvatarEquipped["bodyColor"] };
  if (item.type === "eyes") return { ...base, eyes: item.equipValue as AvatarEquipped["eyes"] };
  if (item.type === "headgear") return { ...base, headgear: item.equipValue as AvatarEquipped["headgear"] };
  if (item.type === "accessory") return { ...base, accessory: item.equipValue as AvatarEquipped["accessory"] };
  if (item.type === "effect") return { ...base, effect: item.equipValue as AvatarEquipped["effect"] };
  return base;
}

export default function AvatarPage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [category, setCategory] = useState<AvatarItemType>("color");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleBuy = (itemId: string) => {
    if (!progress) return;
    const next = buyItem(progress, itemId);
    if (!next) return;
    initSfx(() => loadProgress().settings.soundMuted);
    if (!loadProgress().settings.soundMuted) playSfx("complete");
    saveProgress(next);
    setProgress(next);
    const item = avatarItems.find((i) => i.id === itemId);
    setToast(`Bought ${item?.name ?? itemId}! 🎉`);
    const afterEquip = equipItem(next, itemId);
    if (afterEquip) {
      saveProgress(afterEquip);
      setProgress(afterEquip);
    }
  };

  const handleEquip = (itemId: string) => {
    if (!progress) return;
    const next = equipItem(progress, itemId);
    if (!next) return;
    initSfx(() => loadProgress().settings.soundMuted);
    if (!loadProgress().settings.soundMuted) playSfx("correct");
    saveProgress(next);
    setProgress(next);
    setToast("Equipped!");
  };

  if (progress == null) {
    return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  const equipped = progress.avatar?.equipped ?? { bodyColor: "blue", eyes: "happy", headgear: null, accessory: null, effect: null };
  const items = getAvatarItemsByType(category);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">🤖 Customize Avatar</h1>
        <Link href="/profile" className={`text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline ${focusRing} rounded`}>
          ← Profile
        </Link>
      </div>

      <div className="flex items-center gap-2 text-lg font-bold text-amber-700 dark:text-amber-300">
        <span>⭐</span>
        <span>Your XP: {progress.totalXp}</span>
      </div>

      <section className="flex justify-center py-4 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900 bg-white dark:bg-slate-800/50">
        <AvatarRenderer equipped={equipped} size="lg" />
      </section>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(({ key, label, emoji }) => (
          <button
            key={key}
            type="button"
            onClick={() => setCategory(key)}
            className={`px-3 py-2 rounded-xl border-2 text-sm font-semibold ${focusRing} ${
              category === key
                ? "border-indigo-500 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200"
                : "border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300"
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const owned = ownsItem(progress, item.id);
          const unlocked = meetsUnlockRequirement(progress, item);
          const afford = canAfford(progress, item);
          const equippedNow = isEquipped(progress, item.id, item.type, item.equipValue);
          const unlockText = getUnlockRequirementText(item);
          const canBuy = !owned && unlocked && afford && item.xpCost > 0;
          const canBuyEarned = !owned && unlocked && item.xpCost === 0;
          const needMoreXp = item.xpCost > 0 && progress.totalXp < item.xpCost;
          const xpShortfall = needMoreXp ? item.xpCost - progress.totalXp : 0;
          const preview = previewEquipped(equipped, item);

          return (
            <div
              key={item.id}
              className={`rounded-xl border-2 p-4 ${
                equippedNow
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:border-indigo-500"
                  : "border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-24 h-24 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-700/50">
                  <AvatarRenderer equipped={preview} size="sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-100">{item.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mt-1">
                    {item.xpCost === 0 ? "Free (earned)" : `${item.xpCost} XP`}
                  </p>
                  {unlockText && !unlocked && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">{unlockText}</p>
                  )}
                  {owned && <p className="text-xs font-semibold text-green-600 dark:text-green-400 mt-1">Owned</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {equippedNow ? (
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 text-sm font-semibold">
                    Equipped
                  </span>
                ) : (owned || canBuyEarned) && unlocked ? (
                  <button
                    type="button"
                    onClick={() => handleEquip(item.id)}
                    className={`px-3 py-1.5 rounded-lg border-2 border-indigo-300 dark:border-indigo-600 font-semibold text-sm text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 ${focusRing}`}
                  >
                    Equip
                  </button>
                ) : null}
                {canBuy && (
                  <button
                    type="button"
                    onClick={() => handleBuy(item.id)}
                    className={`px-3 py-1.5 rounded-lg bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 ${focusRing}`}
                  >
                    Buy
                  </button>
                )}
                {!unlocked && !owned && (
                  <span className="px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400">Locked</span>
                )}
                {unlocked && !afford && !owned && item.xpCost > 0 && (
                  <span className="px-3 py-1.5 text-sm text-amber-700 dark:text-amber-300">Need {xpShortfall} more XP</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg z-50 animate-pulse motion-reduce:animate-none"
          role="status"
          aria-live="polite"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
