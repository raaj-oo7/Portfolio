import { create } from 'zustand'
import type { SectionId } from '@/constants'

export type Theme = 'dark' | 'light'
export type Quality = 'high' | 'low'

interface AppState {
  /** Cinematic intro / loading screen */
  loadingProgress: number
  introDone: boolean
  setLoadingProgress: (p: number) => void
  finishIntro: () => void

  /** Theme */
  theme: Theme
  toggleTheme: () => void

  /** 3D quality tier (reduced automatically on mobile / weak GPUs) */
  quality: Quality
  setQuality: (q: Quality) => void

  /** Section tracking for nav highlight */
  activeSection: SectionId
  setActiveSection: (s: SectionId) => void

  /** AI assistant */
  chatOpen: boolean
  setChatOpen: (open: boolean) => void
}

function initialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

export const useAppStore = create<AppState>((set) => ({
  loadingProgress: 0,
  introDone: false,
  setLoadingProgress: (p) => set({ loadingProgress: p }),
  finishIntro: () => set({ introDone: true }),

  theme: initialTheme(),
  toggleTheme: () =>
    set((s) => {
      const theme: Theme = s.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', theme)
      document.documentElement.classList.toggle('dark', theme === 'dark')
      return { theme }
    }),

  quality: 'high',
  setQuality: (quality) => set({ quality }),

  activeSection: 'home',
  setActiveSection: (activeSection) => set({ activeSection }),

  chatOpen: false,
  setChatOpen: (chatOpen) => set({ chatOpen }),
}))
