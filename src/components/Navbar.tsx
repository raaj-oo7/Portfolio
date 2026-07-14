import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X, Sparkles } from 'lucide-react'
import { NAV_LINKS } from '@/constants'
import { Mascot } from '@/components/Mascot'
import { useAppStore } from '@/store/useAppStore'
import { cn, scrollToSection } from '@/utils'

/** Glass navbar with active-section pill, theme toggle and mobile menu. */
export function Navbar() {
  const { theme, toggleTheme, activeSection, setChatOpen } = useAppStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const onBlog = pathname.startsWith('/blog')

  useEffect(() => {
    // hysteresis: turn on past 40px, off below 8px — never flickers while
    // smooth-scrolling hovers around a single boundary
    const onScroll = () => setScrolled((prev) => (prev ? window.scrollY > 8 : window.scrollY > 40))
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setMobileOpen(false)
    if (id === 'blog') {
      navigate('/blog')
      return
    }
    // section links work from any route: go home first, then scroll
    if (pathname !== '/') navigate(`/#${id}`)
    else scrollToSection(id)
  }

  const isActive = (id: string) => (id === 'blog' ? onBlog : !onBlog && activeSection === id)

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-all duration-300',
          scrolled ? 'py-2' : 'py-4',
        )}
      >
        <nav
          className={cn(
            'mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300',
            scrolled ? 'glass-strong shadow-lg shadow-black/10 mx-4 md:mx-auto' : 'mx-4 md:mx-auto',
          )}
          aria-label="Primary"
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => go('home')}
            className="group flex items-center gap-2"
            aria-label="Go to top"
          >
            <span className="glass glow-primary flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl p-0.5 transition-transform group-hover:scale-110 group-hover:-rotate-6">
              <Mascot className="h-full w-full" />
            </span>
            <span className="font-display hidden text-sm font-semibold sm:block">Raj Makadia</span>
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => go(link.id)}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive(link.id) ? 'text-white' : 'text-(--fg-muted) hover:text-(--fg)',
                  )}
                >
                  {isActive(link.id) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-600 to-accent-purple"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="glass hidden h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold text-accent-cyan transition-colors hover:border-accent-cyan/50 sm:flex"
              aria-label="Open AI assistant"
            >
              <Sparkles size={14} /> Ask AI
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="glass flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-110"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </motion.span>
              </AnimatePresence>
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="glass flex h-9 w-9 items-center justify-center rounded-full lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="glass-strong fixed inset-x-4 top-20 z-[99] rounded-3xl p-4 lg:hidden"
          >
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => go(link.id)}
                    className={cn(
                      'w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition-colors',
                      isActive(link.id)
                        ? 'bg-gradient-to-r from-primary-600 to-accent-purple text-white'
                        : 'text-(--fg-muted) hover:bg-white/5',
                    )}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile bottom nav */}
      <nav
        aria-label="Bottom navigation"
        className="glass-strong fixed inset-x-4 bottom-4 z-[98] flex items-center justify-around rounded-full px-2 py-2 lg:hidden"
      >
        {NAV_LINKS.slice(0, 5).map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => go(link.id)}
            className={cn(
              'rounded-full px-2 py-1.5 text-[10px] font-semibold whitespace-nowrap transition-colors sm:px-3 sm:text-[11px]',
              isActive(link.id)
                ? 'bg-gradient-to-r from-primary-600 to-accent-purple text-white'
                : 'text-(--fg-muted)',
            )}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </>
  )
}
