import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { JobDescription } from '@/types/game'

interface JobDescriptionPanelProps {
  job: JobDescription
  language: 'hu' | 'en'
}

const SKILL_ICONS: Record<string, string> = {
  javascript: '🟨', react: '⚛️', python: '🐍', go: '🐹',
  sql: '🗄️', typescript: '💠', communication: '💬', agile: '🔄',
  default: '🔧',
}

function skillIcon(skill: string): string {
  const first = skill.split('|')[0].trim()
  return SKILL_ICONS[first.toLowerCase()] ?? SKILL_ICONS.default
}

export const JobDescriptionPanel: FC<JobDescriptionPanelProps> = ({ job, language }) => {
  const { t } = useTranslation()
  const title = language === 'hu' ? job.titleHu : job.title
  const roleSummary = language === 'hu' ? (job.roleSummaryHu ?? job.roleSummary) : (job.roleSummary ?? job.roleSummaryHu)
  const responsibilities = language === 'hu'
    ? (job.responsibilitiesHu ?? job.responsibilities ?? [])
    : (job.responsibilities ?? job.responsibilitiesHu ?? [])

  return (
    <div className="paper-sheet h-full overflow-y-auto p-4 sm:p-5">
      <div className="paper-grain" aria-hidden="true" />

      <div className="mb-4 border-b border-stone-300/80 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
          {t('job.panel_title')}
        </p>
        <h2 className="paper-title mt-1 text-lg text-stone-900">{title}</h2>
      </div>

      {roleSummary && (
        <div className="mb-4">
          <h3 className="paper-section-title">{t('job.role_summary')}</h3>
          <p className="text-sm leading-6 text-stone-700">{roleSummary}</p>
        </div>
      )}

      {responsibilities.length > 0 && (
        <div className="mb-4">
          <h3 className="paper-section-title">{t('job.responsibilities')}</h3>
          <ul className="space-y-1.5 text-sm text-stone-700">
            {responsibilities.map(item => (
              <li key={item} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-stone-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4 border-y border-stone-200 py-2 text-[11px] text-stone-600">
        <span className="font-semibold">Level {job.level}</span>
        <span className="mx-2">|</span>
        <span>{job.minExperienceYears}+ {t('cv.years')}</span>
      </div>

      <div className="mb-4">
        <h3 className="paper-section-title">{t('job.required')}</h3>
        <ul className="space-y-1.5">
          {job.requiredSkills.map(skill => (
            <li key={skill} className="flex items-center gap-2 text-sm text-stone-800">
              <span>{skillIcon(skill)}</span>
              <span>{skill.replace(/\|/g, ' / ')}</span>
            </li>
          ))}
          <li className="flex items-center gap-2 text-sm text-stone-800">
            <span>💼</span>
            <span>
              {job.minExperienceYears}+ {t('cv.years')}
            </span>
          </li>
          {job.requiredLanguages.map(lang => (
            <li key={lang} className="flex items-center gap-2 text-sm text-stone-800">
              <span>🌍</span>
              <span>{lang}</span>
            </li>
          ))}
          {job.minTeamSize != null && (
            <li className="flex items-center gap-2 text-sm text-stone-800">
              <span>👥</span>
              <span>
                {t('cv.team_size')} {job.minTeamSize}+
              </span>
            </li>
          )}
        </ul>
      </div>

      {job.bonusCriteria && job.bonusCriteria.length > 0 && (
        <div className="mb-4">
          <h3 className="paper-section-title">{t('job.bonus')}</h3>
          <ul className="space-y-1">
            {job.bonusCriteria.map(c => (
              <li key={c} className="text-sm text-stone-700">
                {c === 'isOpenSource' ? `+ ${t('cv.open_source')}` : `+ ${t('cv.mentoring')}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {job.disqualifiers && job.disqualifiers.length > 0 && (
        <div>
          <h3 className="paper-section-title text-red-700">{t('job.disqualifiers')}</h3>
          <ul className="space-y-1">
            {job.disqualifiers.map(d => (
              <li key={d} className="text-sm text-red-700">
                ! {d.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
