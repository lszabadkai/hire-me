import type { Decision, DecisionType } from '@/types/game'

// ── Score constants (matching PRD §3.4) ────────────────────────────────────
export const CORRECT_DECISION_POINTS = 10
export const WRONG_DECISION_POINTS = -5
export const SPEED_BONUS_POINTS = 3
export const SPEED_BONUS_THRESHOLD_MS = 15_000   // 15 seconds
export const RED_FLAG_SPOTTED_POINTS = 5
export const BIAS_FOLLOW_POINTS = -15
export const BIAS_REFUSE_POINTS = 20
export const INTERVIEW_CORRECT_POINTS = 5

// ── Rating tiers (matching PRD §3.4) ──────────────────────────────────────
export const RATING_TIERS = [
  { minScore: 200, label: 'Chief People Officer', labelHu: 'Chief People Officer', stars: 5 },
  { minScore: 151, label: 'VP of Engineering',    labelHu: 'Mérnöki igazgató',      stars: 4 },
  { minScore: 101, label: 'Hiring Manager',        labelHu: 'Felvételi vezető',       stars: 3 },
  { minScore: 51,  label: 'Recruiter',             labelHu: 'Toborzó',               stars: 2 },
  { minScore: 0,   label: 'Intern',                labelHu: 'Gyakorló',              stars: 1 },
] as const

export interface ScoreResult {
  pointsAwarded: number
  wasCorrect: boolean
  speedBonus: boolean
  redFlagBonus: boolean
}

export function calculateDecisionScore(
  playerDecision: DecisionType,
  correctDecision: DecisionType,
  cvTimeMs: number,
  redFlagSpotted: boolean
): ScoreResult {
  const wasCorrect = playerDecision === correctDecision
  const speedBonus = cvTimeMs < SPEED_BONUS_THRESHOLD_MS
  const redFlagBonus = redFlagSpotted

  let points = wasCorrect ? CORRECT_DECISION_POINTS : WRONG_DECISION_POINTS
  if (wasCorrect && speedBonus) points += SPEED_BONUS_POINTS
  if (wasCorrect && redFlagBonus) points += RED_FLAG_SPOTTED_POINTS

  return { pointsAwarded: points, wasCorrect, speedBonus, redFlagBonus }
}

export function buildDecision(
  candidateId: string,
  playerDecision: DecisionType,
  correctDecision: DecisionType,
  cvTimeMs: number,
  redFlagSpotted: boolean
): Decision {
  const result = calculateDecisionScore(
    playerDecision, correctDecision, cvTimeMs, redFlagSpotted
  )
  return {
    candidateId,
    decision: playerDecision,
    correctDecision,
    wasCorrect: result.wasCorrect,
    redFlagSpotted,
    speedBonus: result.speedBonus,
    cvTimeMs,
    pointsAwarded: result.pointsAwarded,
  }
}

export function getRatingTier(score: number) {
  return (
    RATING_TIERS.find(tier => score >= tier.minScore) ??
    RATING_TIERS[RATING_TIERS.length - 1]
  )
}

export function sumDecisions(log: Decision[]): number {
  return log.reduce((acc, d) => acc + d.pointsAwarded, 0)
}
