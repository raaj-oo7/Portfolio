import { useEffect, type ReactNode } from 'react'
import toast, { Toaster, useToasterStore } from 'react-hot-toast'
import { AuroraBackground } from '@/components/AuroraBackground'
import { ParticlesBackground } from '@/components/ParticlesBackground'
import { CustomCursor } from '@/components/CustomCursor'
import { Navbar } from '@/components/Navbar'
import { ScrollProgress } from '@/components/ScrollProgress'
import { BackToTop } from '@/components/BackToTop'
import { AIAssistant } from '@/components/chat/AIAssistant'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useAppStore } from '@/store/useAppStore'

const MAX_TOASTS = 3

/** Hard cap on simultaneously visible toasts — oldest are dismissed first. */
function ToastLimiter() {
  const { toasts } = useToasterStore()
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= MAX_TOASTS)
      .forEach((t) => toast.dismiss(t.id))
  }, [toasts])
  return null
}

/** Global chrome around every page: backgrounds, nav, cursor, assistant. */
export function MainLayout({ children }: { children: ReactNode }) {
  const introDone = useAppStore((s) => s.introDone)
  // Must live inside <BrowserRouter> (this component does) — it calls
  // useLocation() to re-arm the section observer on every route change.
  useActiveSection(introDone)

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
      <ToastLimiter />
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
