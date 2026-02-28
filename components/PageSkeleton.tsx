"use client";

/**
 * Branded loading skeleton for page content (home, learn, profile, daily).
 * Uses quest theme colors for a consistent loading state.
 */
export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="flex justify-center">
        <div className="h-24 w-24 rounded-full bg-indigo-200/60 dark:bg-indigo-800/40" />
      </div>
      <div className="text-center space-y-2">
        <div className="h-8 w-48 mx-auto rounded-lg bg-gray-200 dark:bg-slate-600" />
        <div className="h-4 w-64 mx-auto rounded bg-gray-200/80 dark:bg-slate-600/80" />
      </div>
      <div className="flex justify-center gap-2">
        <div className="h-8 w-16 rounded-full bg-amber-200/60 dark:bg-amber-800/40" />
        <div className="h-8 w-12 rounded-full bg-gray-200 dark:bg-slate-600" />
      </div>
      <div className="rounded-2xl border-2 border-gray-200 dark:border-slate-600 p-6 space-y-4">
        <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-slate-600" />
        <div className="h-4 w-full rounded bg-gray-200/80 dark:bg-slate-600/80" />
        <div className="h-14 w-full rounded-xl bg-[var(--quest-primary)]/20" />
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-11 rounded-xl bg-gray-200 dark:bg-slate-600" />
        <div className="flex-1 h-11 rounded-xl bg-gray-200 dark:bg-slate-600" />
      </div>
    </div>
  );
}
