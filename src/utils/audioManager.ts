/**
 * AudioManager — synthesised sound stubs using Web Audio API.
 * All sounds are generated procedurally so the game ships with no audio assets.
 * Real sound files can be swapped in by pointing SOUND_FILES to hosted URLs.
 */

let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.3
): void {
  if (AudioManager.muted) return
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gainNode = ac.createGain()
    osc.connect(gainNode)
    gainNode.connect(ac.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ac.currentTime)
    gainNode.gain.setValueAtTime(gain, ac.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + duration)
  } catch {
    // AudioContext unavailable (e.g. test environment) — silently skip
  }
}

function playNoise(duration: number, gain = 0.15): void {
  if (AudioManager.muted) return
  try {
    const ac = getCtx()
    const bufferSize = ac.sampleRate * duration
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const source = ac.createBufferSource()
    source.buffer = buffer
    const gainNode = ac.createGain()
    gainNode.gain.setValueAtTime(gain, ac.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
    source.connect(gainNode)
    gainNode.connect(ac.destination)
    source.start()
  } catch {
    // silently skip
  }
}

export const AudioManager = {
  muted: false,

  toggle(): void {
    AudioManager.muted = !AudioManager.muted
  },

  /** Paper shuffle — played when a new CV card appears */
  paperShuffle(): void {
    playNoise(0.12, 0.1)
    playTone(220, 0.08, 'triangle', 0.05)
  },

  /** Hire stamp — positive "thunk" */
  hireStamp(): void {
    playTone(440, 0.05, 'square', 0.2)
    playTone(660, 0.15, 'sine', 0.15)
  },

  /** Reject stamp — lower negative thud */
  rejectStamp(): void {
    playTone(180, 0.05, 'square', 0.2)
    playTone(120, 0.2, 'sine', 0.15)
  },

  /** Error / wrong decision buzz */
  wrongDecision(): void {
    playTone(150, 0.3, 'sawtooth', 0.15)
  },

  /** Level-up fanfare */
  levelUp(): void {
    const ac = getCtx()
    if (AudioManager.muted) return
    try {
      const notes = [523, 659, 784, 1047]
      notes.forEach((freq, i) => {
        const osc = ac.createOscillator()
        const g = ac.createGain()
        osc.connect(g)
        g.connect(ac.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        const t = ac.currentTime + i * 0.12
        g.gain.setValueAtTime(0.25, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
        osc.start(t)
        osc.stop(t + 0.15)
      })
    } catch {
      // silently skip
    }
  },

  /** Red flag spotlight click */
  redFlagSpotted(): void {
    playTone(880, 0.1, 'triangle', 0.2)
    playTone(1100, 0.1, 'triangle', 0.15)
  },

  /** Timer warning — ticking becomes urgent below 10s */
  timerWarning(): void {
    playTone(880, 0.05, 'square', 0.1)
  },

  /** Bias refused — triumphant ding */
  biasRefused(): void {
    playTone(784, 0.1, 'sine', 0.2)
    playTone(1047, 0.2, 'sine', 0.2)
  },

  /** Game over */
  gameOver(): void {
    const ac = getCtx()
    if (AudioManager.muted) return
    try {
      const notes = [523, 415, 370, 311]
      notes.forEach((freq, i) => {
        const osc = ac.createOscillator()
        const g = ac.createGain()
        osc.connect(g)
        g.connect(ac.destination)
        osc.frequency.value = freq
        osc.type = 'sine'
        const t = ac.currentTime + i * 0.2
        g.gain.setValueAtTime(0.2, t)
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25)
        osc.start(t)
        osc.stop(t + 0.25)
      })
    } catch {
      // silently skip
    }
  },
}
