import type { ComponentType, CSSProperties } from 'react'
import {
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
} from 'react-icons/si'
import { FaAws } from 'react-icons/fa6'
import { BrainCircuit } from 'lucide-react'

/**
 * Brand logo for each Skills Galaxy planet, keyed by the skill's `name`
 * in src/data/portfolio.ts. Skills without an entry render without a logo.
 */
export const SKILL_ICONS: Record<
  string,
  ComponentType<{ size?: number | string; color?: string; className?: string; style?: CSSProperties }>
> = {
  React: SiReact,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  HTML: SiHtml5,
  'Next.js': SiNextdotjs,
  'Node.js': SiNodedotjs,
  'Tailwind CSS': SiTailwindcss,
  'Three.js': SiThreedotjs,
  AWS: FaAws,
  'AI / LLMs': BrainCircuit,
}
