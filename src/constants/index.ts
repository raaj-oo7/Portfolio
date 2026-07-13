export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId =
  | (typeof NAV_LINKS)[number]['id']
  | 'achievements'
  | 'services'

export const SECTION_IDS: SectionId[] = [
  'home',
  'about',
  'skills',
  'experience',
  'projects',
  'achievements',
  'services',
  'contact',
]
