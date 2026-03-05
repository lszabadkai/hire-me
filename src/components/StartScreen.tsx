import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface StartScreenProps {
  onStart: (language: 'hu' | 'en') => void
  language: 'hu' | 'en'
  onToggleLanguage: () => void
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, language, onToggleLanguage }) => {
  const { t } = useTranslation()
  const [showInstructions, setShowInstructions] = useState(false)
  const instructions: string[] = t('start.instructions', { returnObjects: true }) as string[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-amber-50 flex flex-col items-center justify-center p-6">
      {/* Language toggle */}
      <button
        onClick={onToggleLanguage}
        className="absolute top-4 right-4 text-xs font-semibold bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm hover:bg-gray-50 transition-all"
      >
        {t('lang_toggle')}
      </button>

      <motion.div
        className="bg-white rounded-3xl shadow-paper-hover max-w-md w-full p-8 text-center"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      >
        {/* Title */}
        <div className="text-6xl mb-2">🎮</div>
        <h1 className="text-4xl font-black text-gray-900 mb-1">{t('app.title')}</h1>
        <p className="text-brand-600 font-semibold mb-2">{t('app.subtitle')}</p>
        <p className="text-gray-500 text-sm mb-6">{t('app.tagline')}</p>

        {/* GoTo badge */}
        <div className="inline-block bg-brand-100 text-brand-700 rounded-full px-4 py-1 text-xs font-semibold mb-6">
          🏢 GoTo Engineering — Lányok Napja 2026
        </div>

        {/* Instructions toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowInstructions(v => !v)}
            className="text-sm text-brand-600 hover:underline font-medium"
          >
            {showInstructions ? '▲' : '▼'} {t('start.how_to_play')}
          </button>
          {showInstructions && (
            <motion.ol
              className="mt-3 text-left space-y-1.5 text-sm text-gray-700 list-decimal list-inside bg-gray-50 rounded-xl p-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
            >
              {instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </motion.ol>
          )}
        </div>

        {/* Start button */}
        <button
          onClick={() => onStart(language)}
          className="w-full py-4 px-8 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-lg shadow-lg transition-all"
        >
          {t('start.button')}
        </button>
      </motion.div>
    </div>
  )
}
