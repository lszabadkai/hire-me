const STORAGE_KEY = 'hire-me-scores'
const MAX_ENTRIES = 10

export interface ScoreEntry {
  name: string
  score: number
  tier: string
  date: string
}

export function loadScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as ScoreEntry[]
  } catch {
    return []
  }
}

export function saveScore(entry: ScoreEntry): ScoreEntry[] {
  const existing = loadScores()
  const updated = [...existing, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable (private mode etc.) — ignore
  }
  return updated
}

export function isHighScore(score: number): boolean {
  const scores = loadScores()
  if (scores.length < MAX_ENTRIES) return true
  return score > (scores[scores.length - 1]?.score ?? 0)
}
