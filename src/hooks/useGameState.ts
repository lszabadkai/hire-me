import { useReducer } from "react";
import type {
  GameState,
  DecisionType,
  Candidate,
  InterviewQuestion,
  DecisionFeedback,
} from "@/types/game";
import { validateCV } from "@/utils/cvValidator";
import {
  buildDecision,
  BIAS_FOLLOW_POINTS,
  BIAS_REFUSE_POINTS,
  INTERVIEW_CORRECT_POINTS,
} from "@/utils/scoring";
import {
  getCVsForLevel,
  getJobForLevel,
  shouldShowBiasDilemma,
} from "@/utils/levelProgression";
import {
  validateCandidates,
  validateJobs,
  validateInterviews,
} from "@/utils/schemas";
import cvData from "@/data/cvs.json";
import jobData from "@/data/jobs.json";
import interviewData from "@/data/interviews.json";

// ── Validate data at module load time ──────────────────────────────────────
const ALL_CVS = validateCandidates(cvData);
const ALL_JOBS = validateJobs(jobData);
const ALL_INTERVIEWS = validateInterviews(interviewData);

// ── Actions ────────────────────────────────────────────────────────────────
type GameAction =
  | { type: "START_GAME"; language: "hu" | "en" }
  | { type: "MAKE_DECISION"; decision: DecisionType; cvTimeMs: number }
  | { type: "SPOT_RED_FLAG" }
  | { type: "ANSWER_INTERVIEW"; answeredCorrectly: boolean }
  | { type: "BIAS_DECISION"; follow: boolean }
  | { type: "CONTINUE_FROM_FEEDBACK" }
  | { type: "NEXT_LEVEL" }
  | { type: "TOGGLE_LANGUAGE" };

function buildInitialState(language: "hu" | "en" = "hu"): GameState {
  const level = 1;
  const job = getJobForLevel(ALL_JOBS, level);
  const queue = getCVsForLevel(ALL_CVS, level);
  return {
    currentLevel: level,
    score: 0,
    cvQueue: queue.slice(1),
    currentCV: queue[0] ?? null,
    currentJob: job,
    decisionsLog: [],
    biasInstructionShown: false,
    biasInstructionFollowed: null,
    phase: "start",
    pendingInterviewQuestion: null,
    redFlagSpottedThisCV: false,
    animatingDecision: null,
    lastDecisionFeedback: null,
    language,
  };
}

function pickInterviewQuestion(candidate: Candidate): InterviewQuestion {
  const idx = Math.floor(Math.random() * ALL_INTERVIEWS.length);
  void candidate; // used to allow future per-candidate interview logic
  return ALL_INTERVIEWS[idx];
}

// ── Reducer ────────────────────────────────────────────────────────────────
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME": {
      return { ...buildInitialState(action.language), phase: "playing" };
    }

    case "TOGGLE_LANGUAGE": {
      return { ...state, language: state.language === "hu" ? "en" : "hu" };
    }

    case "SPOT_RED_FLAG": {
      if (state.redFlagSpottedThisCV || state.phase !== "playing") return state;
      return { ...state, redFlagSpottedThisCV: true };
    }

    case "MAKE_DECISION": {
      if (!state.currentCV || state.phase !== "playing") return state;
      const validation = validateCV(state.currentCV, state.currentJob);
      const correctDecision: DecisionType = validation.shouldHire
        ? "hire"
        : "reject";
      const decision = buildDecision(
        state.currentCV.id,
        action.decision,
        correctDecision,
        action.cvTimeMs,
        state.redFlagSpottedThisCV,
      );
      const newScore = state.score + decision.pointsAwarded;

      // Build feedback for the user
      const feedback: DecisionFeedback = {
        wasCorrect: decision.wasCorrect,
        playerDecision: action.decision,
        correctDecision,
        reasons: validation.reasons,
        candidateName: state.currentCV.name,
        pointsAwarded: decision.pointsAwarded,
      };

      return {
        ...state,
        score: newScore,
        decisionsLog: [...state.decisionsLog, decision],
        animatingDecision: null,
        phase: "cv_feedback",
        lastDecisionFeedback: feedback,
        pendingInterviewQuestion: null,
        redFlagSpottedThisCV: false,
      };
    }

    case "CONTINUE_FROM_FEEDBACK": {
      if (state.phase !== "cv_feedback") return state;

      // Check if interview should fire (level 5, player hired, CV requires interview)
      const lastDecision = state.decisionsLog[state.decisionsLog.length - 1];
      const shouldInterview =
        lastDecision?.decision === "hire" &&
        state.currentCV?.requiresInterview &&
        state.currentLevel === 5;

      if (shouldInterview && state.currentCV) {
        return {
          ...state,
          phase: "interview",
          pendingInterviewQuestion: pickInterviewQuestion(state.currentCV),
          lastDecisionFeedback: null,
        };
      }

      // Advance to next CV or level end
      const [next, ...rest] = state.cvQueue;
      if (!next) {
        return { ...state, phase: "level_end", lastDecisionFeedback: null };
      }
      return {
        ...state,
        currentCV: next,
        cvQueue: rest,
        lastDecisionFeedback: null,
        redFlagSpottedThisCV: false,
        phase: "playing",
      };
    }

    case "ANSWER_INTERVIEW": {
      const bonus = action.answeredCorrectly ? INTERVIEW_CORRECT_POINTS : 0;
      // After interview, advance to next CV or level end
      const [next, ...rest] = state.cvQueue;
      if (!next) {
        return {
          ...state,
          score: state.score + bonus,
          phase: "level_end",
          pendingInterviewQuestion: null,
        };
      }
      return {
        ...state,
        score: state.score + bonus,
        currentCV: next,
        cvQueue: rest,
        phase: "playing",
        pendingInterviewQuestion: null,
        redFlagSpottedThisCV: false,
      };
    }

    case "NEXT_LEVEL": {
      const nextLevel = state.currentLevel + 1;
      if (nextLevel > 5) {
        return { ...state, phase: "game_over" };
      }
      // Check if bias dilemma fires before level 5
      if (shouldShowBiasDilemma(nextLevel, state.biasInstructionShown)) {
        return {
          ...state,
          currentLevel: nextLevel,
          biasInstructionShown: true,
          phase: "bias_dilemma",
        };
      }
      const job = getJobForLevel(ALL_JOBS, nextLevel);
      const queue = getCVsForLevel(ALL_CVS, nextLevel);
      return {
        ...state,
        currentLevel: nextLevel,
        currentJob: job,
        cvQueue: queue.slice(1),
        currentCV: queue[0] ?? null,
        phase: "playing",
        animatingDecision: null,
        redFlagSpottedThisCV: false,
      };
    }

    case "BIAS_DECISION": {
      const points = action.follow ? BIAS_FOLLOW_POINTS : BIAS_REFUSE_POINTS;
      const job = getJobForLevel(ALL_JOBS, state.currentLevel);
      const queue = getCVsForLevel(ALL_CVS, state.currentLevel);
      return {
        ...state,
        score: state.score + points,
        biasInstructionFollowed: action.follow,
        currentJob: job,
        cvQueue: queue.slice(1),
        currentCV: queue[0] ?? null,
        phase: "playing",
      };
    }

    default:
      return state;
  }
}

// ── Public hook ────────────────────────────────────────────────────────────
export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, buildInitialState());

  return {
    state,
    startGame: (language: "hu" | "en") =>
      dispatch({ type: "START_GAME", language }),
    makeDecision: (decision: DecisionType, cvTimeMs: number) =>
      dispatch({ type: "MAKE_DECISION", decision, cvTimeMs }),
    spotRedFlag: () => dispatch({ type: "SPOT_RED_FLAG" }),
    answerInterview: (correct: boolean) =>
      dispatch({ type: "ANSWER_INTERVIEW", answeredCorrectly: correct }),
    biasDecision: (follow: boolean) =>
      dispatch({ type: "BIAS_DECISION", follow }),
    continueFromFeedback: () => dispatch({ type: "CONTINUE_FROM_FEEDBACK" }),
    nextLevel: () => dispatch({ type: "NEXT_LEVEL" }),
    toggleLanguage: () => dispatch({ type: "TOGGLE_LANGUAGE" }),
  };
}
