# AI Quest (Kids)

A Duolingo-style MVP web app that teaches LLM/AI basics to kids with short lessons, XP, streaks, and badges.

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- Data stored in **localStorage** (designed so you can swap in a real DB later)
- No external APIs; fully self-contained

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the dev server**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home: today’s lesson, progress, streak, XP, Continue button |
| `/learn` | Lesson map: list of lessons with lock/unlock |
| `/lesson/[id]` | Interactive lesson runner |
| `/profile` | Badges, total XP, streak, reset progress |
| `/admin/content` | Dev: view/edit lesson JSON, export/import |

## Gamification

- **XP**: 10–30 per lesson; confetti on completion.
- **Streak**: Completing at least one lesson per calendar day increments the streak (🔥).
- **Badges**: First lesson, 3-day streak, 100 XP, Hallucination Hunter (lesson 4), Prompt Master (all 8 lessons).

## Lesson engine

Lessons are defined in **`/data/lessons.ts`** as JSON with a consistent schema. Supported step types:

- **info**: title + text + optional emoji
- **mcq**: multiple choice (3–4 options, one correct, explain feedback)
- **match**: matching pairs (click to pair)
- **order**: put items in the correct sequence
- **spot**: “spot the hallucination” — AI answer + “What’s wrong?” with choices

## How to add new lessons

1. Open **`/data/lessons.ts`**.
2. Add a new object to the `lessons` array with:
   - `id`: unique string (e.g. `"9-my-topic"`)
   - `title`, `description`, `emoji`, `xpReward`
   - `steps`: array of steps (each has `id`, `type`, and type-specific fields)
3. No need to touch `lessonIds` — it’s derived from `lessons.map((l) => l.id)`.
4. Optionally add a `badgeId` and define the badge in **`/types/index.ts`** and **`/lib/progress.ts`** (`awardBadges` / `DEFAULT_BADGES`) if the lesson should award a new badge.

See existing lessons in `lessons.ts` for the exact shape of each step type (e.g. `McqStep`, `MatchStep`).

## Progress & persistence

- **`/lib/progress.ts`** exposes:
  - `loadProgress()`, `saveProgress()`
  - `completeLesson(state, lessonId, score, xpEarned)`
  - `computeStreak(state)`, `isLessonUnlocked(lessonIds, index, state)`, `resetProgress()`
- All progress is stored in `localStorage` under the key `ai-quest-progress`.
- To swap in a real DB later, replace the implementation inside `loadProgress`/`saveProgress` (and optionally make `completeLesson` async and persist after updates).

## Sanity checks

Lightweight checks live in **`/lib/sanity.ts`**:

- `sanityCheckLessons()`: validates lesson structure and step types.
- `sanityCheckProgress()`: validates progress logic (complete lesson, XP, badges).

You can run them from the browser console (e.g. in a dev-only page) or from a small Node script that imports and calls `runSanityChecks()`.

## Files created (overview)

- `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/learn/page.tsx`, `app/lesson/[id]/page.tsx`, `app/profile/page.tsx`, `app/admin/content/page.tsx`
- `components/Nav.tsx`, `ProgressBar.tsx`, `XPChip.tsx`, `StreakFlame.tsx`, `BadgeGrid.tsx`, `LessonCard.tsx`, `StepRenderer.tsx`
- `types/index.ts` — Lesson, Step, ProgressState, Badge
- `data/lessons.ts` — 8 seed lessons
- `lib/progress.ts` — progress store (localStorage)
- `lib/sanity.ts` — sanity checks
- `tailwind.config.ts`, `postcss.config.js`, `tsconfig.json`, `next.config.js`, `package.json`

## TODOs for later

- **Database**: Replace localStorage with a real backend (e.g. Supabase, Firebase, or custom API) and persist progress per user.
- **Auth**: Add sign-in so progress is tied to an account (kid-safe flow).
- **Adult version**: Optional “skin” or separate build with more formal copy and no emojis for classroom or parent use.
