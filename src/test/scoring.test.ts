import { describe, it, expect } from 'vitest'
import {
  calculateDecisionScore,
  buildDecision,
  getRatingTier,
  CORRECT_DECISION_POINTS,
  WRONG_DECISION_POINTS,
  SPEED_BONUS_POINTS,
  RED_FLAG_SPOTTED_POINTS,
} from '@/utils/scoring'

describe('calculateDecisionScore', () => {
  it('awards CORRECT_DECISION_POINTS for correct hire', () => {
    const r = calculateDecisionScore('hire', 'hire', 20_000, false)
    expect(r.pointsAwarded).toBe(CORRECT_DECISION_POINTS)
    expect(r.wasCorrect).toBe(true)
    expect(r.speedBonus).toBe(false)
  })

  it('awards CORRECT_DECISION_POINTS for correct reject', () => {
    const r = calculateDecisionScore('reject', 'reject', 20_000, false)
    expect(r.pointsAwarded).toBe(CORRECT_DECISION_POINTS)
    expect(r.wasCorrect).toBe(true)
  })

  it('deducts WRONG_DECISION_POINTS for wrong hire', () => {
    const r = calculateDecisionScore('hire', 'reject', 20_000, false)
    expect(r.pointsAwarded).toBe(WRONG_DECISION_POINTS)
    expect(r.wasCorrect).toBe(false)
  })

  it('deducts WRONG_DECISION_POINTS for wrong reject', () => {
    const r = calculateDecisionScore('reject', 'hire', 20_000, false)
    expect(r.pointsAwarded).toBe(WRONG_DECISION_POINTS)
    expect(r.wasCorrect).toBe(false)
  })

  it('adds speed bonus for decision under 15 seconds', () => {
    const r = calculateDecisionScore('hire', 'hire', 10_000, false)
    expect(r.speedBonus).toBe(true)
    expect(r.pointsAwarded).toBe(CORRECT_DECISION_POINTS + SPEED_BONUS_POINTS)
  })

  it('does NOT add speed bonus at exactly 15 seconds', () => {
    const r = calculateDecisionScore('hire', 'hire', 15_000, false)
    expect(r.speedBonus).toBe(false)
    expect(r.pointsAwarded).toBe(CORRECT_DECISION_POINTS)
  })

  it('adds red flag bonus on correct decision with spotted flag', () => {
    const r = calculateDecisionScore('reject', 'reject', 20_000, true)
    expect(r.pointsAwarded).toBe(CORRECT_DECISION_POINTS + RED_FLAG_SPOTTED_POINTS)
  })

  it('does NOT add red flag bonus on wrong decision', () => {
    const r = calculateDecisionScore('hire', 'reject', 5_000, true)
    expect(r.pointsAwarded).toBe(WRONG_DECISION_POINTS)
  })

  it('adds both speed and red flag bonus on correct fast decision with flag', () => {
    const r = calculateDecisionScore('hire', 'hire', 5_000, true)
    expect(r.pointsAwarded).toBe(CORRECT_DECISION_POINTS + SPEED_BONUS_POINTS + RED_FLAG_SPOTTED_POINTS)
  })
})

describe('getRatingTier', () => {
  it('returns Intern for 0', () => expect(getRatingTier(0).stars).toBe(1))
  it('returns Recruiter for 51', () => expect(getRatingTier(51).stars).toBe(2))
  it('returns Hiring Manager for 101', () => expect(getRatingTier(101).stars).toBe(3))
  it('returns VP of Engineering for 151', () => expect(getRatingTier(151).stars).toBe(4))
  it('returns CPO for 200', () => expect(getRatingTier(200).stars).toBe(5))
  it('returns CPO for 250', () => expect(getRatingTier(250).stars).toBe(5))
  it('returns Intern for negative score', () => expect(getRatingTier(-20).stars).toBe(1))
})

describe('buildDecision', () => {
  it('builds a complete decision object', () => {
    const d = buildDecision('cv_001', 'hire', 'hire', 8_000, false)
    expect(d.candidateId).toBe('cv_001')
    expect(d.wasCorrect).toBe(true)
    expect(d.speedBonus).toBe(true)
    expect(d.pointsAwarded).toBe(CORRECT_DECISION_POINTS + SPEED_BONUS_POINTS)
  })
})
