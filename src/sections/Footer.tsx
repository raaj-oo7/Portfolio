import { useNavigate } from 'react-router-dom'
import { Heart, Mail } from 'lucide-react'
import { FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { NAV_LINKS } from '@/constants'
import { personal, socials } from '@/data/portfolio'
import { scrollToSection } from '@/utils'

const socialIcons = { github: FaGithub, linkedin: FaLinkedinIn, twitter: FaXTwitter, mail: Mail } as const

/** Minimal footer: nav, socials, copyright. */
export function Footer() {
  const navigate = useNavigate()
  const go = (id: string) => (id === 'blog' ? navigate('/blog') : scrollToSection(id))
  return (
    <footer className="relative border-t border-(--line) pb-28 md:pb-8" aria-label="Footer">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pt-10">
        <button type="button" onClick={() => scrollToSection('home')} className="font-display text-gradient text-xl font-bold" aria-label="Back to top">
          RM
        </button>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  type="button"
                  onClick={() => go(l.id)}
                  className="text-xs font-medium text-(--fg-muted) transition-colors hover:text-primary-300"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex items-center gap-3" aria-label="Social links">
          {socials.map((s) => {
            const Icon = socialIcons[s.icon as keyof typeof socialIcons]
            return (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="glass flex h-9 w-9 items-center justify-center rounded-full text-(--fg-muted) transition-all hover:scale-110 hover:text-primary-300"
                >
                  <Icon size={15} />
                </a>
              </li>
            )
          })}
        </ul>

        <p className="flex items-center gap-1.5 text-xs text-(--fg-muted)">
          © {new Date().getFullYear()} {personal.name}. Crafted with
          <Heart size={11} className="text-accent-purple" aria-label="love" />
          React, Three.js &amp; too much coffee.
        </p>
      </div>
    </footer>
  )
}
