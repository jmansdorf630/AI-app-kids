import type { ProgressState } from "@/types";
import type { LearningTrack } from "@/types";
import { getOrderedLessonIdsForTrack, getLessonById } from "@/data/lessons";

/** True if the lesson at index in the track's ordered list is unlocked (previous completed or first). */
export function isLessonUnlockedForTrack(
  track: LearningTrack,
  lessonId: string,
  state: ProgressState
): boolean {
  const ids = getOrderedLessonIdsForTrack(track);
  const i = ids.indexOf(lessonId);
  if (i < 0) return false;
  if (i === 0) return true;
  const prevId = ids[i - 1];
  return state.lessons[prevId]?.completed === true;
}

/** First not-completed lesson in the track's order that is unlocked. */
export function getNextUpLessonIdForTrack(
  state: ProgressState,
  track: LearningTrack
): string | null {
  const ids = getOrderedLessonIdsForTrack(track);
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    if (state.lessons[id]?.completed) continue;
    if (isLessonUnlockedForTrack(track, id, state)) return id;
  }
  return null;
}

/** Unlock requirement text for a lesson in the track (e.g. "Complete X to unlock"). */
export function getUnlockRequirementForTrack(
  track: LearningTrack,
  lessonId: string,
  state: ProgressState
): string {
  const ids = getOrderedLessonIdsForTrack(track);
  const i = ids.indexOf(lessonId);
  if (i <= 0) return "";
  const prevId = ids[i - 1];
  const completed = state.lessons[prevId]?.completed === true;
  if (completed) return "";
  const prev = getLessonById(prevId);
  return prev ? `Complete "${prev.title}" to unlock` : "Complete the previous lesson to unlock";
}
