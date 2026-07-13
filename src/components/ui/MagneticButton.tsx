import { useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils'

interface Props {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'outline'
  download?: boolean
  ariaLabel?: string
}

const variants = {
  primary:
    'bg-gradient-to-r from-primary-600 via-accent-violet to-accent-purple text-white glow-ring hover:brightness-110',
  ghost: 'glass text-(--fg) hover:border-primary-500/50',
  outline: 'border border-primary-500/40 text-(--fg) hover:bg-primary-500/10',
}

/** Button that magnetically follows the cursor on hover, with a ripple on click. */
export function MagneticButton({ children, className, href, onClick, variant = 'primary', download, ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null)

  const handleMove = (e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setOffset({
      x: (e.clientX - rect.left - rect.width / 2) * 0.3,
      y: (e.clientY - rect.top - rect.height / 2) * 0.3,
    })
  }

  const handleClick = (e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() })
    onClick?.()
  }

  const inner = (
    <motion.div
      ref={ref}
      data-cursor="pointer"
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      onClick={handleClick}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, mass: 0.4 }}
      className={cn(
        'relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold transition-[filter,border-color,background-color] select-none',
        variants[variant],
        className,
      )}
    >
      {children}
      {ripple && (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 5, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          onAnimationComplete={() => setRipple(null)}
          className="pointer-events-none absolute h-24 w-24 rounded-full bg-white/40"
          style={{ left: ripple.x - 48, top: ripple.y - 48 }}
        />
      )}
    </motion.div>
  )

  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        download={download}
        aria-label={ariaLabel}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer noopener' : undefined}
        className="inline-block"
      >
        {inner}
      </a>
    )
  }
  return (
    <button type="button" aria-label={ariaLabel} className="inline-block bg-transparent">
      {inner}
    </button>
  )
}
