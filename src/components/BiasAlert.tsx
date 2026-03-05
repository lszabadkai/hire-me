import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface BiasAlertProps {
  language: 'hu' | 'en'
  onDecision: (follow: boolean) => void
}

export const BiasAlert: FC<BiasAlertProps> = ({ onDecision }) => {
  const { t } = useTranslation()

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
      >
        <h2 className="text-lg font-bold text-gray-900 mb-3">{t('bias.title')}</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-5 text-gray-800 text-sm leading-relaxed">
          {t('bias.ceo_message')}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onDecision(true)}
            aria-label={t('bias.follow')}
            className="flex-1 py-3 px-4 rounded-xl bg-red-100 text-red-700 border-2 border-red-200 font-semibold text-sm hover:bg-red-200 transition-all"
          >
            {t('bias.follow')}
          </button>
          <button
            onClick={() => onDecision(false)}
            aria-label={t('bias.refuse')}
            className="flex-1 py-3 px-4 rounded-xl bg-green-100 text-green-700 border-2 border-green-200 font-bold text-sm hover:bg-green-200 transition-all"
          >
            {t('bias.refuse')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
