import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import type { DecisionFeedback } from '@/types/game'

interface CVFeedbackScreenProps {
  feedback: DecisionFeedback
  onContinue: () => void
}

export const CVFeedbackScreen: FC<CVFeedbackScreenProps> = ({ feedback, onContinue }) => {
  const { t } = useTranslation()
  const { wasCorrect, playerDecision, correctDecision, reasons, candidateName, pointsAwarded } = feedback

  const playerLabel = playerDecision === 'hire' ? t('decision.hire') : t('decision.reject')
  const correctLabel = correctDecision === 'hire' ? t('decision.hire') : t('decision.reject')

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${
      wasCorrect
        ? 'bg-gradient-to-br from-green-50 to-brand-50'
        : 'bg-gradient-to-br from-red-50 to-orange-50'
    }`}>
      <motion.div
        className="bg-white rounded-3xl shadow-paper-hover max-w-md w-full p-8 text-center"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Result icon */}
        <div className="text-5xl mb-2">
          {wasCorrect ? '✅' : '❌'}
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-black mb-1 ${
          wasCorrect ? 'text-green-700' : 'text-red-700'
        }`}>
          {wasCorrect ? t('feedback.correct_title') : t('feedback.wrong_title')}
        </h2>

        {/* Candidate name */}
        <p className="text-gray-500 text-sm mb-4">{candidateName}</p>

        {/* Decision summary */}
        <div className="flex gap-3 justify-center mb-4">
          <div className={`rounded-xl px-4 py-2 text-sm ${
            wasCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className="text-xs text-gray-500 mb-0.5">{t('feedback.you_chose')}</p>
            <p className="font-bold text-gray-800">{playerLabel}</p>
          </div>
          {!wasCorrect && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm">
              <p className="text-xs text-gray-500 mb-0.5">{t('feedback.correct_was')}</p>
              <p className="font-bold text-green-700">{correctLabel}</p>
            </div>
          )}
        </div>

        {/* Points */}
        <div className={`inline-block rounded-full px-4 py-1 mb-4 text-sm font-bold ${
          pointsAwarded >= 0
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}>
          {t('feedback.points_awarded')}: {pointsAwarded > 0 ? '+' : ''}{pointsAwarded}
        </div>

        {/* Reasons */}
        {reasons.length > 0 && (
          <div className="text-left bg-stone-50 rounded-xl p-4 mb-6 border border-stone-200">
            <p className="text-xs uppercase tracking-wider text-stone-500 font-semibold mb-2">
              {t('feedback.evaluation')}
            </p>
            <ul className="space-y-1.5">
              {reasons.map((reason, i) => (
                <li key={`${reason.key}-${i}`} className="flex gap-2 text-sm text-stone-700">
                  <span className="mt-0.5 flex-shrink-0">
                    {reason.key === 'qualified' ? '✅' : '⚠️'}
                  </span>
                  <span>{t(`feedback.reason.${reason.key}`, reason.params ?? {})}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-base shadow transition-all"
        >
          {t('feedback.continue')}
        </button>
      </motion.div>
    </div>
  )
}
