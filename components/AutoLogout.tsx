import { useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'

function useAutoLogout() {
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const minutes = parseInt(process.env.NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES || '30', 10)
    const timeout = minutes * 60 * 1000

    const resetTimer = () => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        signOut({ callbackUrl: '/' })
      }, timeout)
    }

    const events: Array<keyof WindowEventMap> = [
      'mousemove',
      'mousedown',
      'keypress',
      'scroll',
      'touchstart',
    ]
    events.forEach((event) => window.addEventListener(event, resetTimer))
    resetTimer()

    return () => {
      if (timer.current) clearTimeout(timer.current)
      events.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [])
}

export default function AutoLogout() {
  useAutoLogout()
  return null
}
