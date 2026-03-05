import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface LevelEndScreenProps {
  level: number
  totalLevels: number
  correctCount: number
  wrongCount: number
  score: number
  onNext: () => void
}

export const LevelEndScreen: FC<LevelEndScreenProps> = ({
  level, totalLevels, correctCount, wrongCount, score, onNext,
}) => {
  const { t } = useTranslation()
  const isLastLevel = level >= totalLevels

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-brand-50 flex items-center justify-center p-6">
      <motion.div
        className="bg-white rounded-3xl shadow-paper-hover max-w-sm w-full p-8 text-center"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="text-5xl mb-3">🎉</div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">{t('level_end.title')}</h2>
        <p className="text-gray-500 text-sm mb-5">
          {t('hud.level')} {level}/{totalLevels}
        </p>
        <div className="flex gap-4 justify-center mb-6">
          <div className="bg-green-50 rounded-xl px-6 py-3">
            <p className="text-3xl font-bold text-green-600">{correctCount}</p>
            <p className="text-xs text-gray-500 mt-1">{t('level_end.correct')}</p>
          </div>
          <div className="bg-red-50 rounded-xl px-6 py-3">
            <p className="text-3xl font-bold text-red-500">{wrongCount}</p>
            <p className="text-xs text-gray-500 mt-1">{t('level_end.wrong')}</p>
          </div>
        </div>
        <p className="text-lg font-semibold text-brand-600 mb-6">
          {t('hud.score')}: {score}
        </p>
        <button
          onClick={onNext}
          className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-base shadow transition-all"
        >
          {isLastLevel ? t('level_end.finish') : t('level_end.next_level')}
        </button>
      </motion.div>
    </div>
  )
}
