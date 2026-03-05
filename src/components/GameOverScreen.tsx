import { FC, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { getRatingTier } from '@/utils/scoring'
import { saveScore, loadScores, type ScoreEntry } from '@/utils/highScores'
import type { Decision } from '@/types/game'

interface GameOverScreenProps {
  score: number
  language: 'hu' | 'en'
  decisionsLog: Decision[]
  biasFollowed: boolean | null
  onPlayAgain: () => void
}

export const GameOverScreen: FC<GameOverScreenProps> = ({
  score, language, decisionsLog, biasFollowed, onPlayAgain,
}) => {
  const { t } = useTranslation()
  const tier = getRatingTier(score)
  const stars = '⭐'.repeat(tier.stars) + '☆'.repeat(5 - tier.stars)
  const label = language === 'hu' ? tier.labelHu : tier.label

  const correct = decisionsLog.filter(d => d.wasCorrect).length
  const wrong = decisionsLog.filter(d => !d.wasCorrect).length

  const [playerName, setPlayerName] = useState('')
  const [saved, setSaved] = useState(false)
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>(loadScores)
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  // Auto-save anonymous entry if no name entered after 3s (optional UX polish)
  useEffect(() => {
    setLeaderboard(loadScores())
  }, [])

  const handleSave = () => {
    if (!playerName.trim()) return
    const entry: ScoreEntry = {
      name: playerName.trim().slice(0, 20),
      score,
      tier: language === 'hu' ? tier.labelHu : tier.label,
      date: new Date().toLocaleDateString(language === 'hu' ? 'hu-HU' : 'en-GB'),
    }
    const updated = saveScore(entry)
    setLeaderboard(updated)
    setSaved(true)
    setShowLeaderboard(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-brand-50 flex items-center justify-center p-6">
      <motion.div
        className="bg-white rounded-3xl shadow-paper-hover max-w-sm w-full p-8 text-center"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring' }}
      >
        <h1 className="text-3xl font-black text-gray-900 mb-1">{t('game_over.title')}</h1>

        <p className="text-5xl my-4">{stars}</p>
        <p className="text-2xl font-bold text-brand-600 mb-1">{label}</p>
        <p className="text-4xl font-black text-gray-900 mb-4">{score} pts</p>

        <div className="flex gap-4 justify-center mb-4">
          <div className="bg-green-50 rounded-xl px-5 py-2">
            <p className="text-2xl font-bold text-green-600">{correct}</p>
            <p className="text-xs text-gray-500">{t('level_end.correct')}</p>
          </div>
          <div className="bg-red-50 rounded-xl px-5 py-2">
            <p className="text-2xl font-bold text-red-500">{wrong}</p>
            <p className="text-xs text-gray-500">{t('level_end.wrong')}</p>
          </div>
        </div>

        {biasFollowed != null && (
          <p className={`text-sm font-medium mb-4 px-3 py-2 rounded-xl ${
            biasFollowed ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            {biasFollowed ? t('bias.follow_result') : t('bias.refuse_result')}
          </p>
        )}

        {/* Name entry */}
        {!saved && (
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              maxLength={20}
              placeholder={language === 'hu' ? 'Neved a toplistára' : 'Your name for leaderboard'}
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
            />
            <button
              onClick={handleSave}
              disabled={!playerName.trim()}
              className="px-3 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white font-bold text-sm transition-all"
            >
              💾
            </button>
          </div>
        )}

        {/* Leaderboard toggle */}
        {leaderboard.length > 0 && (
          <button
            onClick={() => setShowLeaderboard(v => !v)}
            className="w-full text-sm text-brand-600 font-semibold mb-3 hover:underline"
          >
            {showLeaderboard
              ? (language === 'hu' ? '▲ Toplista elrejtése' : '▲ Hide leaderboard')
              : (language === 'hu' ? '🏆 Toplista megtekintése' : '🏆 View leaderboard')}
          </button>
        )}

        {showLeaderboard && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-4 text-left overflow-hidden"
          >
            <div className="bg-amber-50 rounded-2xl p-3 space-y-1">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-base">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}</span>
                  <span className="flex-1 font-semibold text-gray-800 truncate">{entry.name}</span>
                  <span className="font-bold text-brand-600">{entry.score}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <button
          onClick={onPlayAgain}
          className="w-full py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-base shadow transition-all"
        >
          {t('game_over.play_again')}
        </button>
      </motion.div>
    </div>
  )
}
