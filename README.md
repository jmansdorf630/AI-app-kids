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
| `/lesson/[id]/complete` | Lesson complete summary (takeaways, skills, XP, badges) |
| `/profile` | Badges, XP, streak, settings (sound, haptics), weekly goal |
| `/admin/content` | Dev: view/edit lesson JSON, export/import |

## Gamification

- **XP**: 10–30 per lesson; confetti on completion.
- **Streak**: Completing at least one lesson per calendar day increments the streak (🔥); 3/7/14-day streaks give XP multipliers.
- **Weekly goal**: Complete N lessons per week (default 3) for bonus XP (default 30). Target is configurable in Profile (3, 5, or 7 lessons).
- **Badges**: First lesson, 3-day streak, 100 XP, Hallucination Hunter (lesson 4), Prompt Master (all 8 lessons).
- **Lesson complete summary**: After each lesson, a summary screen shows “You learned” bullets, skills practiced, XP earned, new badges, and level-up (if any).

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

See existing lessons in **`/data/kids/lessons.ts`** for the exact shape. Each lesson can also include:

- **`summaryTakeaways`**: `string[]` — 2–5 bullets shown on the lesson-complete summary (“You learned:”).
- **`skillFocus`**: `Array<{ skill: SkillTag, label: string }>` — skills this lesson focuses on (shown as chips on the summary).

## Progress & persistence

- **`/lib/progress.ts`** exposes:
  - `loadProgress()`, `saveProgress()`
  - `completeLesson()`, `updateWeeklyGoalOnLessonComplete()`, `setLastLessonRun()`
  - `updateSettings()`, `setWeeklyGoalTarget()`, `resetProgress()`
- Progress is stored in `localStorage` under `ai-quest-progress`, including:
  - `settings.soundMuted`, `settings.hapticsEnabled`
  - `weeklyGoal` (week start, target lessons, completed count, bonus awarded)
  - `lastLessonRun` (for the lesson-complete summary screen)
- Migration: missing `settings`, `weeklyGoal`, or `lastLessonRun` are initialized with defaults; if the calendar week changes, the weekly goal resets and is persisted on next load.

## Sound effects

- **`/lib/sfx.ts`**: `initSfx(getMuted)`, `playSfx(name)`, `setMuted()`, `getMuted()`.
- **Where to add sound files**: Place short MP3s in **`/public/sfx/`**: `click.mp3`, `correct.mp3`, `wrong.mp3`, `levelup.mp3`, `complete.mp3`. See `/public/sfx/README.md`. If files are missing, the app runs without sound.
- **Mute**: Toggle in the top nav (🔊/🔇) and in Profile → Settings. Persisted as `progress.settings.soundMuted`.
- **iOS**: Audio is initialized on first user interaction (e.g. first tap) to respect autoplay rules.

## Haptic feedback

- **`/lib/haptics.ts`**: `canVibrate()`, `vibrate(type: "light" | "success" | "error")`. Uses `navigator.vibrate` where available.
- **Toggle**: Profile → Settings → Haptic feedback. Persisted as `progress.settings.hapticsEnabled` (default true).
- **When**: Success vibration on correct answer; error vibration on wrong answer.

## Weekly goal

- **Edit target**: Profile → Weekly goal → choose 3, 5, or 7 lessons per week. Persisted in `progress.weeklyGoal.targetLessons`. Bonus XP default is 30 (see `DEFAULT_WEEKLY_BONUS_XP` in `lib/progress.ts`).

## Sanity checks

Lightweight checks live in **`/lib/sanity.ts`**:

- `sanityCheckLessons()`: validates lesson structure and step types.
- `sanityCheckProgress()`: validates progress logic (complete lesson, XP, badges).

You can run them from the browser console (e.g. in a dev-only page) or from a small Node script that imports and calls `runSanityChecks()`.

## Files (overview)

- **App**: `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/learn/page.tsx`, `app/lesson/[id]/page.tsx`, `app/lesson/[id]/complete/page.tsx`, `app/profile/page.tsx`, `app/daily/page.tsx`, `app/admin/content/page.tsx`
- **Components**: `Nav.tsx`, `ProgressBar.tsx`, `XPChip.tsx`, `StreakFlame.tsx`, `BadgeGrid.tsx`, `LessonCard.tsx`, `StepRenderer.tsx`, `LessonCompleteSummary.tsx`, `SkillProgress.tsx`
- **Types**: `types/index.ts` — Lesson, Step, ProgressState, ProgressSettings, WeeklyGoalState, LastLessonRun, Badge
- **Data**: `data/lessons.ts` (re-exports), `data/kids/lessons.ts` — 12 lessons with tiers, `summaryTakeaways`, `skillFocus`
- **Lib**: `lib/progress.ts`, `lib/sfx.ts`, `lib/haptics.ts`, `lib/sanity.ts`
- **Public**: `public/sfx/README.md` — add `click.mp3`, `correct.mp3`, `wrong.mp3`, `levelup.mp3`, `complete.mp3` for sound

## TODOs for later

- **Database**: Replace localStorage with a real backend (e.g. Supabase, Firebase, or custom API) and persist progress per user.
- **Auth**: Add sign-in so progress is tied to an account (kid-safe flow).
- **Adult version**: Optional “skin” or separate build with more formal copy and no emojis for classroom or parent use.
