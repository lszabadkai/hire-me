// ─── Candidate ─────────────────────────────────────────────────────────────

export type RedFlag =
  | 'claims_all_languages'
  | 'impossible_dates'
  | 'plagiarized_bio'
  | 'no_relevant_experience'
  | 'buzzword_overload'
  | 'fake_credentials'

export interface Candidate {
  id: string
  name: string
  avatar: string              // asset ID resolved by AssetRegistry
  headline?: string
  headlineHu?: string
  education: string
  skills: string[]
  experienceYears: number
  experienceDescription: string
  achievements?: string[]
  achievementsHu?: string[]
  languages: string[]
  teamSize?: number
  funFact: string
  isOpenSource?: boolean
  hasMentoringExperience?: boolean
  redFlags?: RedFlag[]
  redFlagFields?: string[]  // field names that contain suspicious content
  requiresInterview?: boolean          // fires interview popup after HIRE
  levels: number[]                     // which levels this CV belongs to
}

// ─── Job Description ────────────────────────────────────────────────────────

export interface JobDescription {
  level: number
  title: string
  titleHu: string
  roleSummary?: string
  roleSummaryHu?: string
  responsibilities?: string[]
  responsibilitiesHu?: string[]
  requiredSkills: string[]
  minExperienceYears: number
  requiredLanguages: string[]
  minTeamSize?: number
  bonusCriteria?: string[]
  disqualifiers?: RedFlag[]
}

// ─── Interview ──────────────────────────────────────────────────────────────

export interface InterviewAnswer {
  text: string
  textHu: string
  isGoodAnswer: boolean
}

export interface InterviewQuestion {
  id: string
  question: string
  questionHu: string
  answers: InterviewAnswer[]
}

// ─── Scoring ────────────────────────────────────────────────────────────────

export type DecisionType = 'hire' | 'reject'

export interface Decision {
  candidateId: string
  decision: DecisionType
  correctDecision: DecisionType
  wasCorrect: boolean
  redFlagSpotted: boolean
  speedBonus: boolean
  cvTimeMs: number
  pointsAwarded: number
}

// ─── Game State ─────────────────────────────────────────────────────────────

export type GamePhase =
  | 'start'
  | 'playing'
  | 'interview'
  | 'bias_dilemma'
  | 'level_end'
  | 'game_over'

export interface GameState {
  currentLevel: number
  score: number
  cvQueue: Candidate[]
  currentCV: Candidate | null
  currentJob: JobDescription
  decisionsLog: Decision[]
  levelTimeRemaining: number   // seconds — 90-sec level countdown
  cvTimeElapsed: number        // ms — per-CV stopwatch for speed bonus
  biasInstructionShown: boolean
  biasInstructionFollowed: boolean | null
  phase: GamePhase
  pendingInterviewQuestion: InterviewQuestion | null
  redFlagSpottedThisCV: boolean
  animatingDecision: DecisionType | null
  language: 'hu' | 'en'
}

// ─── Rating ─────────────────────────────────────────────────────────────────

export interface RatingTier {
  minScore: number
  label: string
  labelHu: string
  stars: number
}
