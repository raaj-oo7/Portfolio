import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Hero } from '@/sections/Hero'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { scrollToSection } from '@/utils'

/* Below-the-fold sections are code-split so the hero paints fast. */
const About = lazy(() => import('@/sections/About').then((m) => ({ default: m.About })))
const Skills = lazy(() => import('@/sections/Skills').then((m) => ({ default: m.Skills })))
const Experience = lazy(() => import('@/sections/Experience').then((m) => ({ default: m.Experience })))
const Projects = lazy(() => import('@/sections/Projects').then((m) => ({ default: m.Projects })))
const Achievements = lazy(() => import('@/sections/Achievements').then((m) => ({ default: m.Achievements })))
const Services = lazy(() => import('@/sections/Services').then((m) => ({ default: m.Services })))
const Contact = lazy(() => import('@/sections/Contact').then((m) => ({ default: m.Contact })))
const Footer = lazy(() => import('@/sections/Footer').then((m) => ({ default: m.Footer })))

function SectionFallback() {
  return (
    <div className="grid h-64 place-items-center" aria-hidden>
      <span className="font-mono text-xs text-(--fg-muted) animate-pulse">Loading…</span>
    </div>
  )
}

export default function Home() {
  const { hash } = useLocation()

  // Support /#section links (e.g. arriving from the blog): retry until the
  // lazy-loaded target section exists, then scroll to it.
  useEffect(() => {
    const id = hash.replace('#', '')
    if (!id) return
    let tries = 0
    const timer = setInterval(() => {
      tries += 1
      if (document.getElementById(id)) {
        scrollToSection(id)
        clearInterval(timer)
      } else if (tries > 40) {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [hash])

  return (
    <>
      <Hero />
      <ErrorBoundary>
        <Suspense fallback={<SectionFallback />}>
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Achievements />
          <Services />
          <Contact />
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
