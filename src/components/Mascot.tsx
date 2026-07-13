import { cn } from '@/utils'

/**
 * Animated developer-boy mascot: waves hello and blinks.
 * Same artwork as public/favicon.svg — keep the two in sync.
 */
export function Mascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('block', className)}
      role="img"
      aria-label="Raj waving hello"
    >
      <defs>
        <linearGradient id="mascot-hoodie" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      {/* body / hoodie */}
      <path
        d="M16 64 v-8 c0 -8 7 -13 16 -13 s16 5 16 13 v8 z"
        fill="url(#mascot-hoodie)"
      />
      {/* hoodie collar */}
      <path d="M26 45 q6 5 12 0 l-2 6 q-4 2 -8 0 z" fill="#312e81" opacity="0.6" />

      {/* head */}
      <circle cx="32" cy="27" r="14" fill="#f6c9a0" />
      {/* ears */}
      <circle cx="18.5" cy="28" r="2.4" fill="#f6c9a0" />
      <circle cx="45.5" cy="28" r="2.4" fill="#f6c9a0" />

      {/* hair */}
      <path
        d="M18 27 a14 14 0 0 1 28 0 c0 -2 -1.5 -3.5 -3 -3 c-2.5 1 -4 -0.5 -5 -2.5 c-3 3 -10 3.5 -13.5 1 c-0.5 2 -2 3.5 -3.5 3.5 c-1.5 0 -3 -0.5 -3 1 z"
        fill="#241d3f"
      />
      <path d="M18 27 q-1.5 2.5 0 5 q1 -2.5 2.2 -3.6 z" fill="#241d3f" />
      <path d="M46 27 q1.5 2.5 0 5 q-1 -2.5 -2.2 -3.6 z" fill="#241d3f" />

      {/* eyes (blink) */}
      <g className="mascot-blink" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <ellipse cx="26.5" cy="28.5" rx="1.9" ry="2.7" fill="#1c1830" />
        <ellipse cx="37.5" cy="28.5" rx="1.9" ry="2.7" fill="#1c1830" />
        <circle cx="27.2" cy="27.6" r="0.6" fill="#fff" />
        <circle cx="38.2" cy="27.6" r="0.6" fill="#fff" />
      </g>

      {/* blush */}
      <circle cx="23" cy="33" r="2" fill="#f472b6" opacity="0.35" />
      <circle cx="41" cy="33" r="2" fill="#f472b6" opacity="0.35" />

      {/* smile */}
      <path d="M27.5 34.5 q4.5 3.8 9 0" stroke="#1c1830" strokeWidth="1.6" strokeLinecap="round" fill="none" />

      {/* waving arm + hand */}
      <g className="mascot-wave" style={{ transformOrigin: '47px 52px', transformBox: 'view-box' }}>
        <path
          d="M47 52 q6 -4 8 -11"
          stroke="url(#mascot-hoodie)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="55.5" cy="39.5" r="4.2" fill="#f6c9a0" />
      </g>

      {/* greeting sparkle */}
      <path
        className="mascot-sparkle"
        d="M56 30 l1 2.4 2.4 1 -2.4 1 -1 2.4 -1 -2.4 -2.4 -1 2.4 -1 z"
        fill="#22d3ee"
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      />
    </svg>
  )
}
