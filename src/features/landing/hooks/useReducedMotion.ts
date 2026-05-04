import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'
const STORAGE_KEY = 'nodestra:reduced-motion'

/**
 * Tracks prefers-reduced-motion, with a user-settable override persisted in localStorage.
 * Returns the effective flag plus a setter that writes the override.
 */
export function useReducedMotion(): {
  reducedMotion: boolean
  override: 'on' | 'off' | null
  setOverride: (value: 'on' | 'off' | null) => void
} {
  const [systemPref, setSystemPref] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(QUERY).matches
  })
  const [override, setOverrideState] = useState<'on' | 'off' | null>(() => {
    if (typeof window === 'undefined') return null
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw === 'on' || raw === 'off' ? raw : null
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia(QUERY)
    const onChange = () => setSystemPref(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const setOverride = (value: 'on' | 'off' | null) => {
    setOverrideState(value)
    if (typeof window === 'undefined') return
    if (value === null) window.localStorage.removeItem(STORAGE_KEY)
    else window.localStorage.setItem(STORAGE_KEY, value)
  }

  const reducedMotion = override === 'on' ? true : override === 'off' ? false : systemPref

  return { reducedMotion, override, setOverride }
}
