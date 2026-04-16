'use client'
import { useEffect, useState } from 'react'

type ContrastMode = 'light' | 'dark'

/**
 * Detects whether the current background requires light or dark logo.
 * Used by the Logo component to auto-switch between logo variants.
 */
export function useThemeContrast(): ContrastMode {
  const [mode, setMode] = useState<ContrastMode>('light')

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    setMode(mq.matches ? 'dark' : 'light')
    const handler = (e: MediaQueryListEvent) => setMode(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return mode
}
