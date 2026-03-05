import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence } from 'framer-motion'

import { useGameState } from '@/hooks/useGameState'
import { StartScreen } from '@/components/StartScreen'
import { CVCard } from '@/components/CVCard'
import { JobDescriptionPanel } from '@/components/JobDescriptionPanel'
import { DecisionButtons } from '@/components/DecisionButtons'
import { HUD } from '@/components/HUD'
import { InterviewPopup } from '@/components/InterviewPopup'
import { BiasAlert } from '@/components/BiasAlert'
import { LevelEndScreen } from '@/components/LevelEndScreen'
import { GameOverScreen } from '@/components/GameOverScreen'
import { TOTAL_LEVELS } from '@/utils/levelProgression'
import { AudioManager } from '@/utils/audioManager'
import { validateCV } from '@/utils/cvValidator'
import type { Candidate } from '@/types/game'

import '@/i18n'

export default function App() {
  const { i18n } = useTranslation()
  const { state, startGame, makeDecision, spotRedFlag, answerInterview,
    biasDecision, nextCV, nextLevel, toggleLanguage } = useGameState()

  // per-CV stopwatch
  const cvStartTimeRef = useRef<number>(Date.now())

  // feedback state (shown between decision and next CV)
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)

  // mute toggle UI state
  const [muted, setMuted] = useState(false)

  // sync i18n language with game state
  useEffect(() => {
    i18n.changeLanguage(state.language)
  }, [state.language, i18n])

  // reset stopwatch when CV changes
  useEffect(() => {
    if (state.phase === 'playing' && state.currentCV) {
      cvStartTimeRef.current = Date.now()
    }
  }, [state.currentCV?.id, state.phase]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleToggleLanguage = () => {
    toggleLanguage()
    i18n.changeLanguage(state.language === 'hu' ? 'en' : 'hu')
  }

  const handleDecision = (decision: 'hire' | 'reject') => {
    const elapsed = Date.now() - cvStartTimeRef.current
    makeDecision(decision, elapsed)

    // Play sound based on correctness
    if (state.currentCV && state.currentJob) {
      const { shouldHire } = validateCV(state.currentCV, state.currentJob)
      const isCorrect = (decision === 'hire') === shouldHire
      if (decision === 'hire') AudioManager.hireStamp()
      else AudioManager.rejectStamp()
      if (!isCorrect) setTimeout(() => AudioManager.wrongDecision(), 200)
    }

    // Show brief feedback then advance to next CV
    setFeedbackMsg(null)
    setTimeout(() => {
      nextCV()
      AudioManager.paperShuffle()
    }, 900)
  }

  const handleSpotRedFlag = (field: keyof Candidate) => {
    if (state.redFlagSpottedThisCV) return
    const isValidFlag = (state.currentCV?.redFlagFields ?? []).includes(field)
    if (isValidFlag) {
      spotRedFlag()
      AudioManager.redFlagSpotted()
    }
  }

  const levelDecisions = state.decisionsLog.filter(() => true) // all decisions
  const levelCorrect = levelDecisions.filter(d => d.wasCorrect).length
  const levelWrong = levelDecisions.filter(d => !d.wasCorrect).length

  // ── Start Screen ────────────────────────────────────────────────────────
  if (state.phase === 'start') {
    return (
      <StartScreen
        onStart={startGame}
        language={state.language}
        onToggleLanguage={handleToggleLanguage}
      />
    )
  }

  // ── Game Over ────────────────────────────────────────────────────────────
  if (state.phase === 'game_over') {
    return (
      <GameOverScreen
        score={state.score}
        language={state.language}
        decisionsLog={state.decisionsLog}
        biasFollowed={state.biasInstructionFollowed}
        onPlayAgain={() => startGame(state.language)}
      />
    )
  }

  // ── Level End ────────────────────────────────────────────────────────────
  if (state.phase === 'level_end') {
    return (
      <LevelEndScreen
        level={state.currentLevel}
        totalLevels={TOTAL_LEVELS}
        correctCount={levelCorrect}
        wrongCount={levelWrong}
        score={state.score}
        onNext={() => { AudioManager.levelUp(); nextLevel() }}
      />
    )
  }

  // ── Bias Dilemma ─────────────────────────────────────────────────────────
  if (state.phase === 'bias_dilemma') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-brand-50 flex items-center justify-center">
        <BiasAlert language={state.language} onDecision={(follow) => {
          if (!follow) AudioManager.biasRefused()
          biasDecision(follow)
        }} />
      </div>
    )
  }

  // ── Main Game Screen ─────────────────────────────────────────────────────
  const isDecisionLocked = state.animatingDecision !== null || state.phase === 'interview'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 flex flex-col p-4 gap-3">
      {/* HUD */}
      <HUD
        score={state.score}
        level={state.currentLevel}
        totalLevels={TOTAL_LEVELS}
        cvsRemaining={state.cvQueue.length + (state.currentCV ? 1 : 0)}
        timeRemaining={state.levelTimeRemaining}
        muted={muted}
        language={state.language}
        onToggleMute={() => { AudioManager.toggle(); setMuted(AudioManager.muted) }}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* Main layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 items-start justify-center max-w-4xl mx-auto w-full">
        {/* Job description panel */}
        <div className="w-full md:w-64 md:sticky md:top-4">
          <JobDescriptionPanel job={state.currentJob} language={state.language} />
        </div>

        {/* CV area */}
        <div className="flex-1 flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {state.currentCV ? (
              <CVCard
                key={state.currentCV.id}
                candidate={state.currentCV}
                language={state.language}
                spottedFlag={state.redFlagSpottedThisCV}
                onSpotRedFlag={handleSpotRedFlag}
                decision={state.animatingDecision}
              />
            ) : (
              <div className="text-gray-400 text-lg font-semibold mt-20">
                {state.language === 'hu' ? 'Nincs több önéletrajz ezen a szinten.' : 'No more CVs this level.'}
              </div>
            )}
          </AnimatePresence>

          {/* Feedback */}
          {feedbackMsg && (
            <div className="text-center text-sm font-medium text-gray-600 animate-pulse">
              {feedbackMsg}
            </div>
          )}

          {/* Decision buttons */}
          <DecisionButtons
            onHire={() => handleDecision('hire')}
            onReject={() => handleDecision('reject')}
            disabled={isDecisionLocked || !state.currentCV}
          />
        </div>
      </div>

      {/* Interview popup */}
      {state.phase === 'interview' && state.pendingInterviewQuestion && (
        <InterviewPopup
          question={state.pendingInterviewQuestion}
          language={state.language}
          onAnswer={(correct: boolean) => {
            answerInterview(correct)
            setTimeout(() => nextCV(), 600)
          }}
        />
      )}
    </div>
  )
}
