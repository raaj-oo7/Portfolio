import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoadingScreen } from '@/components/LoadingScreen'
import { MainLayout } from '@/layouts/MainLayout'
import { useLenis } from '@/hooks/useLenis'
import { useDeviceQuality } from '@/hooks/useDeviceQuality'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useAppStore } from '@/store/useAppStore'
import Home from '@/pages/Home'

const Blog = lazy(() => import('@/pages/Blog'))
const BlogArticle = lazy(() => import('@/pages/BlogArticle'))

export default function App() {
  const { introDone, theme } = useAppStore()

  // apply persisted theme on boot
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useDeviceQuality()
  useLenis(introDone)
  useActiveSection(introDone)

  return (
    <BrowserRouter>
      <LoadingScreen />
      <MainLayout>
        <Suspense fallback={<div className="grid min-h-svh place-items-center"><span className="animate-pulse font-mono text-xs text-(--fg-muted)">Loading…</span></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </BrowserRouter>
  )
}
