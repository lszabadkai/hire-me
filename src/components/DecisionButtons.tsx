import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface DecisionButtonsProps {
  onHire: () => void
  onReject: () => void
  disabled: boolean
}

export const DecisionButtons: FC<DecisionButtonsProps> = ({
  onHire,
  onReject,
  disabled,
}) => {
  const { t } = useTranslation()

  return (
    <div className="sticky bottom-2 z-20 flex w-full max-w-md gap-3 justify-center mt-4 rounded-lg border border-stone-300/70 bg-[#faf6ee]/95 px-3 py-2 backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0">
      <motion.button
        onClick={onReject}
        disabled={disabled}
        aria-label={t('decision.reject')}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.92 }}
        className="
          flex-1 max-w-[180px] py-3 px-6 rounded-md font-bold text-lg
          bg-red-100 text-red-700 border-2 border-red-300
          hover:bg-red-200
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors shadow-md
        "
      >
        ❌ {t('decision.reject').replace(' ❌', '')}
      </motion.button>
      <motion.button
        onClick={onHire}
        disabled={disabled}
        aria-label={t('decision.hire')}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.92 }}
        className="
          flex-1 max-w-[180px] py-3 px-6 rounded-md font-bold text-lg
          bg-green-100 text-green-700 border-2 border-green-300
          hover:bg-green-200
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors shadow-md
        "
      >
        ✅ {t('decision.hire').replace(' ✅', '')}
      </motion.button>
    </div>
  )
}
