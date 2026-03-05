import type { Candidate, JobDescription } from '@/types/game'

export const TOTAL_LEVELS = 5
export const LEVEL_TIMER_SECONDS = 90
export const CVS_PER_LEVEL = 4

/** Returns the ordered list of CVs for a given level, shuffled deterministically in production. */
export function getCVsForLevel(
  allCVs: Candidate[],
  level: number,
  shuffle = true
): Candidate[] {
  const pool = allCVs.filter(cv => cv.levels.includes(level))
  if (!shuffle) return pool
  // Fisher-Yates with Math.random
  const arr = [...pool]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, CVS_PER_LEVEL)
}

/** Returns the job description for a given level (1-indexed). */
export function getJobForLevel(
  allJobs: JobDescription[],
  level: number
): JobDescription {
  const job = allJobs.find(j => j.level === level)
  if (!job) throw new Error(`No job description found for level ${level}`)
  return job
}

/** Returns true if the bias dilemma should fire before this level. */
export function shouldShowBiasDilemma(level: number, alreadyShown: boolean): boolean {
  // Fires once, between Level 4 and Level 5
  return level === 5 && !alreadyShown
}

/** Returns true if the game is over (all levels complete or timer forced end). */
export function isGameOver(level: number, cvQueue: unknown[]): boolean {
  return level > TOTAL_LEVELS && cvQueue.length === 0
}
