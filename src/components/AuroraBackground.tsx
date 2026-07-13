import { memo } from 'react'
import { useAppStore } from '@/store/useAppStore'

/**
 * Fixed aurora gradient backdrop: slow-moving blurred color fields
 * behind everything, with a subtle grid + vignette for depth.
 * On low-power devices the blobs are smaller and static — giant
 * animated blur layers are brutal on integrated GPUs.
 */
export const AuroraBackground = memo(function AuroraBackground() {
  const quality = useAppStore((s) => s.quality)
  const anim = quality === 'high' ? 'animate-aurora' : ''
  const blur = quality === 'high' ? 'blur-[120px]' : 'blur-[70px]'
  const size = quality === 'high' ? 'h-[70vmax] w-[70vmax]' : 'h-[46vmax] w-[46vmax]'

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-(--bg) transition-colors duration-500" />

      {/* Aurora blobs */}
      <div className={`${anim} ${blur} ${size} absolute -top-1/4 -left-1/4 rounded-full bg-primary-600/25 dark:bg-primary-600/20`} />
      <div
        className={`${anim} ${blur} absolute top-1/3 -right-1/4 h-[50vmax] w-[50vmax] rounded-full bg-accent-purple/20 dark:bg-accent-purple/15`}
        style={{ animationDelay: '-6s', animationDuration: '22s' }}
      />
      <div
        className={`${anim} ${blur} absolute -bottom-1/4 left-1/4 h-[45vmax] w-[45vmax] rounded-full bg-accent-cyan/14 dark:bg-accent-cyan/10`}
        style={{ animationDelay: '-12s', animationDuration: '26s' }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 30%, transparent 100%)',
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--bg)_130%)]" />
    </div>
  )
})
