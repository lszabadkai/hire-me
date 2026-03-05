import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { InterviewQuestion } from '@/types/game'
import { motion, AnimatePresence } from 'framer-motion'

interface InterviewPopupProps {
  question: InterviewQuestion
  language: 'hu' | 'en'
  onAnswer: (correct: boolean) => void
}

export const InterviewPopup: FC<InterviewPopupProps> = ({ question, language, onAnswer }) => {
  const { t } = useTranslation()
  const text = language === 'hu' ? question.questionHu : question.question

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          initial={{ scale: 0.8, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 40 }}
        >
          <h2 className="text-lg font-bold text-gray-900 mb-1">{t('interview.title')}</h2>
          <p className="text-sm text-gray-500 mb-4">{t('interview.subtitle')}</p>
          <blockquote className="bg-gray-50 border-l-4 border-brand-400 rounded-lg p-3 mb-4 text-gray-800 italic">
            "{text}"
          </blockquote>
          <div className="space-y-2">
            {question.answers.map((answer, idx) => {
              const answerText = language === 'hu' ? answer.textHu : answer.text
              return (
                <button
                  key={idx}
                  onClick={() => onAnswer(answer.isGoodAnswer)}
                  className="w-full text-left py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-brand-400 hover:bg-brand-50 transition-all text-sm text-gray-800"
                >
                  {String.fromCharCode(65 + idx)}. {answerText}
                </button>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
