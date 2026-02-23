// Lesson & step types for the lesson engine

export type StepType = "info" | "mcq" | "match" | "order" | "spot";

export interface BaseStep {
  id: string;
  type: StepType;
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
  items: string[]; // correct order
}

export interface SpotStep extends BaseStep {
  type: "spot";
  instruction: string;
  aiAnswer: string;
  question: string;
  options: McqOption[]; // one correct = the hallucination/mistake
}

export type Step = InfoStep | McqStep | MatchStep | OrderStep | SpotStep;

export interface Lesson {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  steps: Step[];
  badgeId?: string; // optional badge awarded on completion (e.g. lesson 4 = Hallucination Hunter)
}

// Progress & gamification

export interface LessonProgress {
  completed: boolean;
  bestScore: number; // 0-100
  lastCompletedDate: string | null; // ISO date
  xpEarned: number;
}

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
  earnedAt: string | null; // ISO date or null if not earned
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null; // ISO date (last day user did a lesson)
  badges: Badge[];
}

export const DEFAULT_BADGES: Badge[] = [
  { id: "first_lesson", name: "First Step", description: "Complete your first lesson", emoji: "🌟", earnedAt: null },
  { id: "streak_3", name: "On Fire", description: "3-day streak", emoji: "🔥", earnedAt: null },
  { id: "xp_100", name: "Century", description: "Earn 100 XP", emoji: "💯", earnedAt: null },
  { id: "hallucination_hunter", name: "Hallucination Hunter", description: "Complete the Hallucinations lesson", emoji: "🔍", earnedAt: null },
  { id: "prompt_master", name: "Prompt Master", description: "Complete all 8 lessons", emoji: "🎓", earnedAt: null },
];
