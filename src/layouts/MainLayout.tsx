import type { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuroraBackground } from '@/components/AuroraBackground'
import { ParticlesBackground } from '@/components/ParticlesBackground'
import { CustomCursor } from '@/components/CustomCursor'
import { Navbar } from '@/components/Navbar'
import { ScrollProgress } from '@/components/ScrollProgress'
import { BackToTop } from '@/components/BackToTop'
import { AIAssistant } from '@/components/chat/AIAssistant'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useAppStore } from '@/store/useAppStore'

/** Global chrome around every page: backgrounds, nav, cursor, assistant. */
export function MainLayout({ children }: { children: ReactNode }) {
  const introDone = useAppStore((s) => s.introDone)

  return (
    <>
      <AuroraBackground />
      {introDone && (
        <ErrorBoundary fallback={null}>
          <ParticlesBackground />
        </ErrorBoundary>
      )}
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main>{children}</main>
      <BackToTop />
      <ErrorBoundary fallback={null}>
        <AIAssistant />
      </ErrorBoundary>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: 'var(--glass-strong)',
            backdropFilter: 'blur(20px)',
            color: 'var(--fg)',
            border: '1px solid var(--line)',
            borderRadius: '999px',
            fontSize: '13px',
            maxWidth: '420px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#0a0b1e' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#0a0b1e' } },
        }}
      />
    </>
  )
}
