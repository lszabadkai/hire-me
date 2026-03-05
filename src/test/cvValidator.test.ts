import { describe, it, expect } from 'vitest'
import { validateCV } from '@/utils/cvValidator'
import type { Candidate, JobDescription } from '@/types/game'

const baseJob: JobDescription = {
  level: 1,
  title: 'Junior Frontend Developer',
  titleHu: 'Junior Frontend Fejlesztő',
  requiredSkills: ['JavaScript'],
  minExperienceYears: 1,
  requiredLanguages: ['English'],
  disqualifiers: [],
}

const goodCandidate: Candidate = {
  id: 'c1',
  name: 'Test User',
  avatar: 'avatar_f_01',
  education: 'BSc CS',
  skills: ['JavaScript', 'React'],
  experienceYears: 2,
  experienceDescription: 'Built dashboards',
  languages: ['Hungarian', 'English'],
  funFact: 'Codes fast',
  levels: [1],
}

describe('validateCV — happy paths', () => {
  it('hires a qualified candidate', () => {
    const result = validateCV(goodCandidate, baseJob)
    expect(result.shouldHire).toBe(true)
    expect(result.reasons).toHaveLength(0)
  })

  it('matches skill case-insensitively', () => {
    const candidate = { ...goodCandidate, skills: ['javascript'] }
    expect(validateCV(candidate, baseJob).shouldHire).toBe(true)
  })
})

describe('validateCV — skill rules', () => {
  it('rejects candidate missing required skill', () => {
    const candidate = { ...goodCandidate, skills: ['Python', 'CSS'] }
    const result = validateCV(candidate, baseJob)
    expect(result.shouldHire).toBe(false)
    expect(result.reasons.some(r => r.includes('skill'))).toBe(true)
  })

  it('accepts candidate with ANY of the OR skills (Python|Go syntax)', () => {
    const level3Job: JobDescription = {
      ...baseJob,
      requiredSkills: ['Python|Go'],
      minExperienceYears: 3,
    }
    const candidate = { ...goodCandidate, skills: ['Go'], experienceYears: 4 }
    expect(validateCV(candidate, level3Job).shouldHire).toBe(true)
  })

  it('rejects candidate missing one of two AND-required skills', () => {
    const level2Job: JobDescription = {
      ...baseJob,
      requiredSkills: ['JavaScript', 'React'],
      minExperienceYears: 2,
    }
    // Has JavaScript but not React
    const candidate = { ...goodCandidate, skills: ['JavaScript', 'Vue'], experienceYears: 2 }
    const result = validateCV(candidate, level2Job)
    expect(result.shouldHire).toBe(false)
    expect(result.reasons.some(r => r.includes('skill'))).toBe(true)
  })
})

describe('validateCV — experience years', () => {
  it('rejects candidate with insufficient experience', () => {
    const candidate = { ...goodCandidate, experienceYears: 0.5 }
    const result = validateCV(candidate, baseJob)
    expect(result.shouldHire).toBe(false)
    expect(result.reasons.some(r => r.includes('experience'))).toBe(true)
  })

  it('accepts exactly minimum experience years', () => {
    const candidate = { ...goodCandidate, experienceYears: 1 }
    expect(validateCV(candidate, baseJob).shouldHire).toBe(true)
  })
})

describe('validateCV — language requirements', () => {
  it('rejects candidate missing required language', () => {
    const candidate = { ...goodCandidate, languages: ['Hungarian'] }
    const result = validateCV(candidate, baseJob)
    expect(result.shouldHire).toBe(false)
    expect(result.reasons.some(r => r.includes('language'))).toBe(true)
  })
})

describe('validateCV — team size', () => {
  it('rejects candidate with team size below minimum', () => {
    const jobWithTeam: JobDescription = { ...baseJob, minTeamSize: 5 }
    const candidate = { ...goodCandidate, teamSize: 2 }
    const result = validateCV(candidate, jobWithTeam)
    expect(result.shouldHire).toBe(false)
    expect(result.reasons.some(r => r.includes('team'))).toBe(true)
  })

  it('accepts candidate meeting team size requirement', () => {
    const jobWithTeam: JobDescription = { ...baseJob, minTeamSize: 5 }
    const candidate = { ...goodCandidate, teamSize: 7 }
    expect(validateCV(candidate, jobWithTeam).shouldHire).toBe(true)
  })
})

describe('validateCV — red flag disqualifiers', () => {
  it('rejects candidate with claims_all_languages disqualifier', () => {
    const jobWithDQ: JobDescription = {
      ...baseJob,
      disqualifiers: ['claims_all_languages'],
    }
    const candidate: Candidate = {
      ...goodCandidate,
      redFlags: ['claims_all_languages'],
    }
    const result = validateCV(candidate, jobWithDQ)
    expect(result.shouldHire).toBe(false)
    expect(result.reasons.some(r => r.includes('Disqualifier'))).toBe(true)
  })

  it('rejects candidate with impossible_dates disqualifier', () => {
    const jobWithDQ: JobDescription = {
      ...baseJob,
      disqualifiers: ['impossible_dates'],
    }
    const candidate: Candidate = {
      ...goodCandidate,
      redFlags: ['impossible_dates'],
    }
    expect(validateCV(candidate, jobWithDQ).shouldHire).toBe(false)
  })

  it('does NOT reject candidate whose red flags are not in job disqualifiers', () => {
    const jobNoDQ: JobDescription = { ...baseJob, disqualifiers: [] }
    const candidate: Candidate = {
      ...goodCandidate,
      redFlags: ['buzzword_overload'],
    }
    expect(validateCV(candidate, jobNoDQ).shouldHire).toBe(true)
  })
})

describe('validateCV — PRD edge cases', () => {
  it('rejects "The Legend" László (every red flag)', () => {
    const level3Job: JobDescription = {
      ...baseJob,
      requiredSkills: ['Python|Go'],
      minExperienceYears: 3,
      disqualifiers: ['claims_all_languages', 'impossible_dates', 'fake_credentials'],
    }
    const legend: Candidate = {
      id: 'cv_004',
      name: '"A Legenda" László',
      avatar: 'avatar_m_02',
      education: 'PhD Everything',
      skills: ['All Programming Languages Ever'],
      experienceYears: 47,
      experienceDescription: 'Invented the internet',
      languages: ['All 14 languages'],
      funFact: 'I have no flaws',
      levels: [3, 4, 5],
      redFlags: ['claims_all_languages', 'impossible_dates', 'fake_credentials'],
    }
    expect(validateCV(legend, level3Job).shouldHire).toBe(false)
  })
})
