// Lesson & step types for the lesson engine

export type StepType =
  | "info"
  | "mcq"
  | "match"
  | "order"
  | "spot"
  | "build_prompt"
  | "detect_risk"
  | "scenario"
  | "next_word_prediction";

export type SkillTag =
  | "prompting"
  | "safety"
  | "bias"
  | "hallucination_detection"
  | "ai_understanding";

export type LessonTier = "beginner" | "explorer" | "master";

export interface BaseStep {
  id: string;
  type: StepType;
  /** Optional: which skill this step trains */
  skillTag?: SkillTag;
  /** XP added to that skill when answered correctly */
  skillXP?: number;
  /** Optional timer in seconds (for mcq, detect_risk) */
  timerSeconds?: number;
}

export interface InfoStep extends BaseStep {
  type: "info";
  title: string;
  text: string;
  emoji?: string;
  imageUrl?: string;
}

export interface McqOption {
  id: string;
  text: string;
  correct: boolean;
  explain?: string;
}

export interface McqStep extends BaseStep {
  type: "mcq";
  question: string;
  options: McqOption[];
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface MatchStep extends BaseStep {
  type: "match";
  instruction: string;
  pairs: MatchPair[];
}

export interface OrderStep extends BaseStep {
  type: "order";
  instruction: string;
  items: string[];
}

export interface SpotStep extends BaseStep {
  type: "spot";
  instruction: string;
  aiAnswer: string;
  question: string;
  options: McqOption[];
}

export interface BuildPromptStep extends BaseStep {
  type: "build_prompt";
  question: string;
  fragments: string[];
  correctCombination: string[];
  explanation: string;
}

export interface DetectRiskStep extends BaseStep {
  type: "detect_risk";
  aiAnswer: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ScenarioStep extends BaseStep {
  type: "scenario";
  story: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NextWordPredictionStep extends BaseStep {
  type: "next_word_prediction";
  sentence: string;
  options: string[];
  correctIndex: number;
}

export type Step =
  | InfoStep
  | McqStep
  | MatchStep
  | OrderStep
  | SpotStep
  | BuildPromptStep
  | DetectRiskStep
  | ScenarioStep
  | NextWordPredictionStep;

export interface Lesson {
  id: string;
  title: string;
  description: string;
  emoji: string;
  tier: LessonTier;
  xpReward: number;
  steps: Step[];
  badgeId?: string;
  badgeOnCompletion?: string;
  /** 2–5 bullets shown on lesson complete summary */
  summaryTakeaways?: string[];
  /** Skills this lesson focuses on (for summary) */
  skillFocus?: Array<{ skill: SkillTag; label: string }>;
}

// Progress & gamification

export interface LessonProgress {
  completed: boolean;
  bestScore: number;
  lastCompletedDate: string | null;
  xpEarned: number;
}

export interface SkillScores {
  prompting: number;
  safety: number;
  bias: number;
  hallucination_detection: number;
  ai_understanding: number;
}

export const DEFAULT_SKILLS: SkillScores = {
  prompting: 0,
  safety: 0,
  bias: 0,
  hallucination_detection: 0,
  ai_understanding: 0,
};

export type BadgeId =
  | "first_lesson"
  | "streak_3"
  | "xp_100"
  | "hallucination_hunter"
  | "prompt_master";

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  emoji: string;
  earnedAt: string | null;
}

export type ThemeMode = "light" | "dark";

export interface ProgressSettings {
  theme: ThemeMode;
  soundMuted: boolean;
  hapticsEnabled: boolean;
  largeText: boolean;
  /** When undefined, respect prefers-reduced-motion; when true/false, user override. */
  reduceMotion?: boolean;
}

export interface WeeklyGoalState {
  weekStartISO: string;
  targetLessons: number;
  completedLessons: number;
  completedLessonIdsThisWeek: string[];
  bonusXP: number;
  bonusAwarded: boolean;
}

export interface LastLessonRun {
  lessonId: string;
  xpEarned: number;
  skillXPEarnedBySkill: Partial<Record<SkillTag, number>>;
  badgesAwarded: BadgeId[];
  leveledUp: boolean;
  newLevel: number;
}

export type LearnTierKey = "beginner" | "explorer" | "master";

export interface LearnUIState {
  learnTierCollapsed?: Partial<Record<LearnTierKey, boolean>>;
}

export interface AvatarEquipped {
  bodyColor: string;
  eyes: string;
  headgear: string | null;
  accessory: string | null;
  effect: string | null;
}

export interface AvatarState {
  equipped: AvatarEquipped;
  inventory: string[];
}

export const DEFAULT_AVATAR_EQUIPPED: AvatarEquipped = {
  bodyColor: "blue",
  eyes: "happy",
  headgear: null,
  accessory: null,
  effect: null,
};

export const DEFAULT_AVATAR_INVENTORY = ["color_blue", "eyes_happy"];

export const DEFAULT_AVATAR_STATE: AvatarState = {
  equipped: { ...DEFAULT_AVATAR_EQUIPPED },
  inventory: [...DEFAULT_AVATAR_INVENTORY],
};

export interface ProgressState {
  lessons: Record<string, LessonProgress>;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  badges: Badge[];
  skills: SkillScores;
  lastDailyChallengeDate: string | null;
  settings: ProgressSettings;
  weeklyGoal: WeeklyGoalState;
  lastLessonRun: LastLessonRun | null;
  ui?: LearnUIState;
  avatar?: AvatarState;
}

export const DEFAULT_BADGES: Badge[] = [
  { id: "first_lesson", name: "First Step", description: "Complete your first lesson", emoji: "🌟", earnedAt: null },
  { id: "streak_3", name: "On Fire", description: "3-day streak", emoji: "🔥", earnedAt: null },
  { id: "xp_100", name: "Century", description: "Earn 100 XP", emoji: "💯", earnedAt: null },
  { id: "hallucination_hunter", name: "Hallucination Hunter", description: "Complete the Hallucinations lesson", emoji: "🔍", earnedAt: null },
  { id: "prompt_master", name: "Prompt Master", description: "Complete all 8 lessons", emoji: "🎓", earnedAt: null },
];

// Level from XP: Level = floor(totalXP / 100) + 1
export function levelFromXp(totalXp: number): number {
  return Math.floor(totalXp / 100) + 1;
}

export function xpForNextLevel(totalXp: number): number {
  const currentLevel = levelFromXp(totalXp);
  return currentLevel * 100;
}

export function xpProgressInLevel(totalXp: number): number {
  const levelStart = (levelFromXp(totalXp) - 1) * 100;
  const levelEnd = levelFromXp(totalXp) * 100;
  const need = levelEnd - levelStart;
  const have = totalXp - levelStart;
  return need > 0 ? (have / need) * 100 : 0;
}

export const DEFAULT_SETTINGS: ProgressSettings = {
  theme: "light",
  soundMuted: false,
  hapticsEnabled: true,
  largeText: false,
  reduceMotion: undefined, /* respect OS prefers-reduced-motion when undefined */
};

export function getWeekStartISO(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

// Streak XP multiplier
export function streakMultiplier(streak: number): number {
  if (streak >= 14) return 2;
  if (streak >= 7) return 1.5;
  if (streak >= 3) return 1.2;
  return 1;
}
