import { FC } from 'react'
import { useTranslation } from 'react-i18next'

interface HUDProps {
  score: number
  level: number
  totalLevels: number
  cvsRemaining: number
  muted: boolean
  language: string
  onToggleMute: () => void
  onToggleLanguage: () => void
}

export const HUD: FC<HUDProps> = ({ score, level, totalLevels, cvsRemaining, muted, language, onToggleMute, onToggleLanguage }) => {
  const { t } = useTranslation()

  return (
    <div className="flex items-center w-full px-2 py-1 bg-white/80 backdrop-blur rounded-xl shadow-sm text-sm font-semibold gap-3">
      <span className="text-brand-600">
        {t('hud.score')}: <span className="text-gray-900">{score}</span>
      </span>
      <span className="text-gray-600">
        {t('hud.level')}: <span className="text-gray-900">{level}/{totalLevels}</span>
      </span>
      <span className="text-gray-600">
        {t('hud.cvs_remaining')}: <span className="text-gray-900">{cvsRemaining}</span>
      </span>
      <span className="ml-auto flex gap-2">
        <button
          onClick={onToggleMute}
          className="text-xs font-semibold bg-white border border-gray-200 rounded-full px-2 py-0.5 shadow-sm hover:bg-gray-50"
          title={muted ? (language === 'hu' ? 'Hang bekapcsolása' : 'Unmute') : (language === 'hu' ? 'Némítás' : 'Mute')}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button
          onClick={onToggleLanguage}
          className="text-xs font-semibold bg-white border border-gray-200 rounded-full px-2 py-0.5 shadow-sm hover:bg-gray-50"
        >
          {language === 'hu' ? 'EN' : 'HU'}
        </button>
      </span>
    </div>
  )
}
