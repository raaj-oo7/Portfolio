import { useRef, useState, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/utils'

interface Props {
  children: ReactNode
  className?: string
  /** Show a cursor-following glow inside the card */
  spotlight?: boolean
  onClick?: () => void
}

/** Frosted-glass card with optional cursor spotlight and noise texture. */
export function GlassCard({ children, className, spotlight = true, onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: -999, y: -999 })

  const handleMove = (e: MouseEvent) => {
    if (!spotlight) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setPos({ x: -999, y: -999 })}
      onClick={onClick}
      className={cn(
        'glass noise group relative overflow-hidden rounded-2xl transition-colors duration-300 hover:border-primary-500/40',
        className,
      )}
    >
      {spotlight && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, rgba(99,102,241,0.14), transparent 65%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
