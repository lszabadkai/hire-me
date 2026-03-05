import { describe, it, expect } from 'vitest'
import { shouldShowBiasDilemma, getCVsForLevel, getJobForLevel } from '@/utils/levelProgression'
import type { Candidate, JobDescription } from '@/types/game'

describe('shouldShowBiasDilemma', () => {
  it('fires when entering level 5 and not yet shown', () => {
    expect(shouldShowBiasDilemma(5, false)).toBe(true)
  })
  it('does not fire if already shown', () => {
    expect(shouldShowBiasDilemma(5, true)).toBe(false)
  })
  it('does not fire on levels 1-4', () => {
    for (let l = 1; l <= 4; l++) {
      expect(shouldShowBiasDilemma(l, false)).toBe(false)
    }
  })
})

describe('getCVsForLevel', () => {
  const cvs: Candidate[] = [
    { id: 'a', name: 'A', avatar: 'x', education: '', skills: ['JS'], experienceYears: 1, experienceDescription: '', languages: ['English'], funFact: '', levels: [1, 2] },
    { id: 'b', name: 'B', avatar: 'x', education: '', skills: ['JS'], experienceYears: 1, experienceDescription: '', languages: ['English'], funFact: '', levels: [2, 3] },
    { id: 'c', name: 'C', avatar: 'x', education: '', skills: ['JS'], experienceYears: 1, experienceDescription: '', languages: ['English'], funFact: '', levels: [1] },
  ]

  it('returns only CVs tagged for the requested level', () => {
    const result = getCVsForLevel(cvs, 1, false)
    expect(result.map(c => c.id)).toContain('a')
    expect(result.map(c => c.id)).toContain('c')
    expect(result.map(c => c.id)).not.toContain('b')
  })

  it('returns CVs tagged for level 2', () => {
    const result = getCVsForLevel(cvs, 2, false)
    expect(result.map(c => c.id)).toContain('a')
    expect(result.map(c => c.id)).toContain('b')
  })

  it('returns empty array if no CVs for level', () => {
    expect(getCVsForLevel(cvs, 999, false)).toHaveLength(0)
  })
})

describe('getJobForLevel', () => {
  const jobs: JobDescription[] = [
    { level: 1, title: 'Junior FE', titleHu: 'Junior FE', requiredSkills: ['JS'], minExperienceYears: 1, requiredLanguages: ['English'] },
    { level: 2, title: 'Mid FE', titleHu: 'Mid FE', requiredSkills: ['JS', 'React'], minExperienceYears: 2, requiredLanguages: ['English'] },
  ]

  it('returns correct job for level 1', () => {
    expect(getJobForLevel(jobs, 1).title).toBe('Junior FE')
  })

  it('returns correct job for level 2', () => {
    expect(getJobForLevel(jobs, 2).title).toBe('Mid FE')
  })

  it('throws for non-existent level', () => {
    expect(() => getJobForLevel(jobs, 99)).toThrow()
  })
})
