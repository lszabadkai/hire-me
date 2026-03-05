import { useReducer, useCallback, useEffect, useRef } from 'react'
import type { GameState, GamePhase, DecisionType, Candidate, InterviewQuestion } from '@/types/game'
import { validateCV } from '@/utils/cvValidator'
import { buildDecision, BIAS_FOLLOW_POINTS, BIAS_REFUSE_POINTS, INTERVIEW_CORRECT_POINTS } from '@/utils/scoring'
import { getCVsForLevel, getJobForLevel, shouldShowBiasDilemma, LEVEL_TIMER_SECONDS } from '@/utils/levelProgression'
import { validateCandidates, validateJobs, validateInterviews } from '@/utils/schemas'
import cvData from '@/data/cvs.json'
import jobData from '@/data/jobs.json'
import interviewData from '@/data/interviews.json'

// ── Validate data at module load time ──────────────────────────────────────
const ALL_CVS = validateCandidates(cvData)
const ALL_JOBS = validateJobs(jobData)
const ALL_INTERVIEWS = validateInterviews(interviewData)

// ── Actions ────────────────────────────────────────────────────────────────
type GameAction =
  | { type: 'START_GAME'; language: 'hu' | 'en' }
  | { type: 'MAKE_DECISION'; decision: DecisionType; cvTimeMs: number }
  | { type: 'SPOT_RED_FLAG' }
  | { type: 'ANSWER_INTERVIEW'; answeredCorrectly: boolean }
  | { type: 'BIAS_DECISION'; follow: boolean }
  | { type: 'NEXT_CV' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'TICK_LEVEL_TIMER' }
  | { type: 'LEVEL_TIMER_EXPIRED' }
  | { type: 'TOGGLE_LANGUAGE' }

function buildInitialState(language: 'hu' | 'en' = 'hu'): GameState {
  const level = 1
  const job = getJobForLevel(ALL_JOBS, level)
  const queue = getCVsForLevel(ALL_CVS, level)
  return {
    currentLevel: level,
    score: 0,
    cvQueue: queue.slice(1),
    currentCV: queue[0] ?? null,
    currentJob: job,
    decisionsLog: [],
    levelTimeRemaining: LEVEL_TIMER_SECONDS,
    cvTimeElapsed: 0,
    biasInstructionShown: false,
    biasInstructionFollowed: null,
    phase: 'start',
    pendingInterviewQuestion: null,
    redFlagSpottedThisCV: false,
    animatingDecision: null,
    language,
  }
}

function pickInterviewQuestion(candidate: Candidate): InterviewQuestion {
  const idx = Math.floor(Math.random() * ALL_INTERVIEWS.length)
  void candidate // used to allow future per-candidate interview logic
  return ALL_INTERVIEWS[idx]
}

// ── Reducer ────────────────────────────────────────────────────────────────
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'START_GAME': {
      return { ...buildInitialState(action.language), phase: 'playing' }
    }

    case 'TOGGLE_LANGUAGE': {
      return { ...state, language: state.language === 'hu' ? 'en' : 'hu' }
    }

    case 'SPOT_RED_FLAG': {
      if (state.redFlagSpottedThisCV || state.phase !== 'playing') return state
      return { ...state, redFlagSpottedThisCV: true }
    }

    case 'MAKE_DECISION': {
      if (!state.currentCV || state.phase !== 'playing') return state
      const { shouldHire } = validateCV(state.currentCV, state.currentJob)
      const correctDecision: DecisionType = shouldHire ? 'hire' : 'reject'
      const decision = buildDecision(
        state.currentCV.id,
        action.decision,
        correctDecision,
        action.cvTimeMs,
        state.redFlagSpottedThisCV
      )
      const newScore = state.score + decision.pointsAwarded

      // Level 5: fire interview if player hires a CV that requires it
      const shouldInterview =
        action.decision === 'hire' &&
        state.currentCV.requiresInterview &&
        state.currentLevel === 5

      const nextPhase: GamePhase = shouldInterview ? 'interview' : 'playing'
      const interviewQ = shouldInterview ? pickInterviewQuestion(state.currentCV) : null

      return {
        ...state,
        score: newScore,
        decisionsLog: [...state.decisionsLog, decision],
        animatingDecision: action.decision,
        phase: nextPhase,
        pendingInterviewQuestion: interviewQ,
        redFlagSpottedThisCV: false,
      }
    }

    case 'ANSWER_INTERVIEW': {
      const bonus = action.answeredCorrectly ? INTERVIEW_CORRECT_POINTS : 0
      return {
        ...state,
        score: state.score + bonus,
        phase: 'playing',
        pendingInterviewQuestion: null,
        animatingDecision: null,
      }
    }

    case 'NEXT_CV': {
      const [next, ...rest] = state.cvQueue
      if (!next) {
        // Level complete
        return { ...state, phase: 'level_end', animatingDecision: null }
      }
      return {
        ...state,
        currentCV: next,
        cvQueue: rest,
        animatingDecision: null,
        redFlagSpottedThisCV: false,
      }
    }

    case 'NEXT_LEVEL': {
      const nextLevel = state.currentLevel + 1
      if (nextLevel > 5) {
        return { ...state, phase: 'game_over' }
      }
      // Check if bias dilemma fires before level 5
      if (shouldShowBiasDilemma(nextLevel, state.biasInstructionShown)) {
        return {
          ...state,
          currentLevel: nextLevel,
          biasInstructionShown: true,
          phase: 'bias_dilemma',
        }
      }
      const job = getJobForLevel(ALL_JOBS, nextLevel)
      const queue = getCVsForLevel(ALL_CVS, nextLevel)
      return {
        ...state,
        currentLevel: nextLevel,
        currentJob: job,
        cvQueue: queue.slice(1),
        currentCV: queue[0] ?? null,
        levelTimeRemaining: LEVEL_TIMER_SECONDS,
        phase: 'playing',
        animatingDecision: null,
        redFlagSpottedThisCV: false,
      }
    }

    case 'BIAS_DECISION': {
      const points = action.follow ? BIAS_FOLLOW_POINTS : BIAS_REFUSE_POINTS
      const job = getJobForLevel(ALL_JOBS, state.currentLevel)
      const queue = getCVsForLevel(ALL_CVS, state.currentLevel)
      return {
        ...state,
        score: state.score + points,
        biasInstructionFollowed: action.follow,
        currentJob: job,
        cvQueue: queue.slice(1),
        currentCV: queue[0] ?? null,
        levelTimeRemaining: LEVEL_TIMER_SECONDS,
        phase: 'playing',
      }
    }

    case 'TICK_LEVEL_TIMER': {
      const remaining = state.levelTimeRemaining - 1
      if (remaining <= 0) {
        return { ...state, levelTimeRemaining: 0, phase: 'level_end' }
      }
      return { ...state, levelTimeRemaining: remaining }
    }

    case 'LEVEL_TIMER_EXPIRED': {
      return { ...state, levelTimeRemaining: 0, phase: 'level_end' }
    }

    default:
      return state
  }
}

// ── Public hook ────────────────────────────────────────────────────────────
export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, buildInitialState())

  // Level countdown timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => {
    if (state.phase === 'playing') {
      clearTimer()
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_LEVEL_TIMER' })
      }, 1000)
    } else {
      clearTimer()
    }
    return clearTimer
  }, [state.phase, state.currentLevel, clearTimer])

  return {
    state,
    startGame: (language: 'hu' | 'en') => dispatch({ type: 'START_GAME', language }),
    makeDecision: (decision: DecisionType, cvTimeMs: number) =>
      dispatch({ type: 'MAKE_DECISION', decision, cvTimeMs }),
    spotRedFlag: () => dispatch({ type: 'SPOT_RED_FLAG' }),
    answerInterview: (correct: boolean) => dispatch({ type: 'ANSWER_INTERVIEW', answeredCorrectly: correct }),
    biasDecision: (follow: boolean) => dispatch({ type: 'BIAS_DECISION', follow }),
    nextCV: () => dispatch({ type: 'NEXT_CV' }),
    nextLevel: () => dispatch({ type: 'NEXT_LEVEL' }),
    toggleLanguage: () => dispatch({ type: 'TOGGLE_LANGUAGE' }),
  }
}
