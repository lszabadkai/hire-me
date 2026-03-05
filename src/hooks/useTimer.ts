import { useEffect, useRef, useCallback } from 'react'

export interface TimerOptions {
  initialSeconds: number
  onTick?: (remaining: number) => void
  onExpire?: () => void
  autoStart?: boolean
}

/**
 * Returns a ref-based countdown timer.
 * start() / pause() / reset() are stable callbacks.
 */
export function useCountdownTimer(options: TimerOptions) {
  const { initialSeconds, onTick, onExpire } = options
  const remainingRef = useRef(initialSeconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const tickCb = useRef(onTick)
  const expireCb = useRef(onExpire)

  // keep callbacks fresh without restarting effect
  useEffect(() => { tickCb.current = onTick }, [onTick])
  useEffect(() => { expireCb.current = onExpire }, [onExpire])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    stop()
    intervalRef.current = setInterval(() => {
      remainingRef.current -= 1
      tickCb.current?.(remainingRef.current)
      if (remainingRef.current <= 0) {
        stop()
        expireCb.current?.()
      }
    }, 1000)
  }, [stop])

  const reset = useCallback((seconds?: number) => {
    stop()
    remainingRef.current = seconds ?? initialSeconds
  }, [stop, initialSeconds])

  useEffect(() => () => stop(), [stop])

  return { start, stop, reset, remainingRef }
}

/**
 * A simple per-CV elapsed-time stopwatch in milliseconds.
 * start() resets and starts. stop() returns elapsed ms.
 */
export function useCVStopwatch() {
  const startTimeRef = useRef<number | null>(null)

  const start = useCallback(() => {
    startTimeRef.current = Date.now()
  }, [])

  const stop = useCallback((): number => {
    if (startTimeRef.current == null) return 0
    return Date.now() - startTimeRef.current
  }, [])

  return { start, stop }
}
