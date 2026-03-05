import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import type { Candidate, RedFlag } from '@/types/game'
import { ProceduralAvatar } from './ProceduralAvatar'

interface CVCardProps {
  candidate: Candidate
  language: 'hu' | 'en'
  spottedFlag: boolean
  onSpotRedFlag: (field: keyof Candidate) => void
  decision?: 'hire' | 'reject' | null
}

const RED_FLAG_LABEL: Record<RedFlag, { en: string; hu: string }> = {
  claims_all_languages:    { en: 'Claims all languages', hu: 'Minden nyelvet tud?' },
  impossible_dates:        { en: 'Impossible dates',     hu: 'Lehetetlen dátumok!' },
  plagiarized_bio:         { en: 'Plagiarised bio',      hu: 'Másolt életrajz?' },
  no_relevant_experience:  { en: 'No relevant exp.',     hu: 'Nincs releváns tapasztalat' },
  buzzword_overload:       { en: 'Buzzword overload',    hu: 'Csak zsargon?' },
  fake_credentials:        { en: 'Fake credentials',     hu: 'Hamis képesítések?' },
}

export const CVCard: FC<CVCardProps> = ({
  candidate,
  language,
  spottedFlag,
  onSpotRedFlag,
  decision,
}) => {
  const { t } = useTranslation()
  const headline = language === 'hu'
    ? (candidate.headlineHu ?? candidate.headline)
    : (candidate.headline ?? candidate.headlineHu)
  const detailHighlights = language === 'hu'
    ? (candidate.achievementsHu ?? candidate.achievements ?? [])
    : (candidate.achievements ?? candidate.achievementsHu ?? [])

  const generatedHighlights = [
    candidate.experienceDescription,
    candidate.teamSize != null
      ? `${t('cv.team_size')}: ${candidate.teamSize}`
      : `${candidate.languages.length} ${t('cv.languages').toLowerCase()}`,
    candidate.isOpenSource ? t('cv.open_source') : t('cv.mentoring'),
  ]

  const highlights = detailHighlights.length > 0 ? detailHighlights : generatedHighlights

  const isFlaggable = (field: keyof Candidate) =>
    (candidate.redFlagFields ?? []).includes(field)

  const fieldClass = (field: keyof Candidate) =>
    isFlaggable(field)
      ? 'cursor-pointer hover:bg-red-50 hover:ring-2 hover:ring-red-300 rounded px-1 transition-all'
      : ''

  return (
    <motion.div
      key={candidate.id}
      initial={{ x: '120%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-120%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="paper-sheet relative max-w-md w-full select-none p-5 sm:p-6"
    >
      <div className="paper-grain" aria-hidden="true" />

      {/* Stamp overlay */}
      {decision && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          initial={{ scale: 2.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          aria-hidden="true"
        >
          <span
            className={`text-5xl font-black border-4 px-4 py-1 rounded-sm rotate-[-10deg]
              ${decision === 'hire'
                ? 'text-green-600 border-green-600 bg-green-50/80'
                : 'text-red-600 border-red-600 bg-red-50/80'
              }`}
          >
            {decision === 'hire' ? '✅ HIRE' : '❌ REJECT'}
          </span>
        </motion.div>
      )}

      {/* Red flag banner */}
      {spottedFlag && (
        <div className="mb-3 bg-red-100 border border-red-300 rounded-sm px-3 py-1 text-sm text-red-700 font-semibold flex items-center gap-1">
          🚩 {t('decision.red_flag_found')}
        </div>
      )}

      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500 mb-2">
        {t('cv.file_label')}
      </p>

      <div className="flex items-center gap-4 mb-4 border-b border-stone-300/70 pb-3">
        <ProceduralAvatar assetId={candidate.avatar} size={72} className="flex-shrink-0" />
        <div>
          <h2 className="paper-title text-xl text-stone-900">{candidate.name}</h2>
          <p className="text-sm text-stone-600">
            {headline ? `${headline} ` : ''}
            {candidate.isOpenSource && '⭐ '}
            {candidate.hasMentoringExperience && '🎓 '}
            {(candidate.redFlags ?? []).length > 0 && !spottedFlag && (
              <span className="text-yellow-600">{language === 'hu' ? '⚠️ Gyanús?' : '⚠️ Suspicious?'}</span>
            )}
          </p>
        </div>
      </div>

      <div className="mb-3 border border-stone-200 bg-stone-50/60 px-3 py-2 text-sm text-stone-700">
        <p className="paper-section-title mb-1">{t('cv.profile')}</p>
        <p>{candidate.experienceYears} {t('cv.years')} | {candidate.skills.length} {t('cv.skills').toLowerCase()} | {candidate.languages.length} {t('cv.languages').toLowerCase()}</p>
      </div>

      <div className="space-y-2 text-sm text-stone-700">
        {/* Education */}
        <div
          className={`flex gap-2 ${fieldClass('education')}`}
          onClick={() => isFlaggable('education') && onSpotRedFlag('education')}
          title={isFlaggable('education') ? (language === 'hu' ? 'Gyanús! Kattints a piros zászlóért.' : 'Suspicious! Click for red flag bonus.') : undefined}
        >
          <span>🎓</span>
          <span className="leading-6">
            <strong>{t('cv.education')}:</strong> {candidate.education}
          </span>
        </div>

        {/* Experience */}
        <div
          className={`flex gap-2 ${fieldClass('experienceYears')} ${fieldClass('experienceDescription')}`}
          onClick={() => {
            if (isFlaggable('experienceYears')) onSpotRedFlag('experienceYears')
            else if (isFlaggable('experienceDescription')) onSpotRedFlag('experienceDescription')
          }}
          title={
            isFlaggable('experienceYears') || isFlaggable('experienceDescription')
              ? (language === 'hu' ? 'Gyanús! Kattints a piros zászlóért.' : 'Suspicious! Click for red flag bonus.')
              : undefined
          }
        >
          <span>💼</span>
          <span className="leading-6">
            <strong>{t('cv.experience')}:</strong>{' '}
            {candidate.experienceYears} {t('cv.years')} — {candidate.experienceDescription}
          </span>
        </div>

        {/* Skills */}
        <div
          className={`flex gap-2 ${fieldClass('skills')}`}
          onClick={() => isFlaggable('skills') && onSpotRedFlag('skills')}
          title={isFlaggable('skills') ? (language === 'hu' ? 'Gyanús! Kattints a piros zászlóért.' : 'Suspicious! Click for red flag bonus.') : undefined}
        >
          <span>🛠️</span>
          <span className="leading-6">
            <strong>{t('cv.skills')}:</strong>{' '}
            {candidate.skills.join(', ')}
          </span>
        </div>

        {/* Languages */}
        <div
          className={`flex gap-2 ${fieldClass('languages')}`}
          onClick={() => isFlaggable('languages') && onSpotRedFlag('languages')}
          title={isFlaggable('languages') ? (language === 'hu' ? 'Gyanús!' : 'Suspicious!') : undefined}
        >
          <span>🌍</span>
          <span className="leading-6">
            <strong>{t('cv.languages')}:</strong>{' '}
            {candidate.languages.join(', ')}
          </span>
        </div>

        {/* Team size */}
        {candidate.teamSize != null && (
          <div className="flex gap-2">
            <span>👥</span>
            <span className="leading-6">
              <strong>{t('cv.team_size')}:</strong> {candidate.teamSize}
            </span>
          </div>
        )}

        <div className="border-t border-stone-200 mt-3 pt-3">
          <p className="paper-section-title mb-1.5">{t('cv.highlights')}</p>
          <ul className="space-y-1.5">
            {highlights.slice(0, 3).map(item => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-stone-500" />
                <span className="leading-6">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2 bg-amber-50 border border-amber-200 px-2.5 py-2 mt-1">
          <span>⚡</span>
          <span className="leading-6">
            <strong>{t('cv.fun_fact')}:</strong> {candidate.funFact}
          </span>
        </div>
      </div>

      {/* Tap hint for red flags */}
      {(candidate.redFlagFields ?? []).length > 0 && !spottedFlag && (
        <p className="mt-3 text-xs text-gray-400 italic">
          {language === 'hu'
            ? '💡 Gyanús adatra kattintva bónuszpontot szerezhetsz!'
            : '💡 Click a suspicious field for bonus points!'}
        </p>
      )}

      {/* Red flag legend (after spotted) */}
      {spottedFlag && (candidate.redFlags ?? []).length > 0 && (
        <div className="mt-3 space-y-1">
          {(candidate.redFlags ?? []).map((flag: RedFlag) => (
            <span
              key={flag}
              className="inline-block bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full mr-1"
            >
              🚩 {RED_FLAG_LABEL[flag][language]}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
