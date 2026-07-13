import { hiddenRepos, personal, projects as curatedProjects, type Project } from '@/data/portfolio'

/**
 * Live project loader.
 *
 * Fetches the public repo list for `personal.githubUsername` and merges it
 * with the curated cards in src/data/portfolio.ts:
 *  - curated repos keep their polished copy but pick up fresh GitHub links,
 *    homepage demos and last-pushed ordering
 *  - unknown (new) repos get an auto-generated card
 *  - forks, hidden repos and empty experiments are skipped
 * Falls back to the curated list when the API is unreachable.
 */

interface RepoInfo {
  name: string
  html_url: string
  homepage: string | null
  description: string | null
  language: string | null
  fork: boolean
  pushed_at: string
  topics?: string[]
}

const MAX_PROJECTS = 9
const AUTO_ACCENTS = ['#6366f1', '#22d3ee', '#a855f7', '#34d399', '#f472b6', '#fbbf24']
const AUTO_DEVICES: Project['device'][] = ['browser', 'laptop', 'mobile']

function prettifyName(name: string): string {
  return name
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

function autoTags(repo: RepoInfo): Project['tags'] {
  const hay = `${repo.name} ${repo.description ?? ''} ${(repo.topics ?? []).join(' ')}`.toLowerCase()
  const tags = new Set<Project['tags'][number]>()
  if (/react|next/.test(hay) || repo.language === 'TypeScript') tags.add('React')
  if (/\b(ai|bot|chat|gpt|llm|ml)\b/.test(hay)) tags.add('AI')
  if (/full.?stack|api|server|backend|clone/.test(hay)) tags.add('Full Stack')
  if (repo.language === 'JavaScript' || repo.language === 'HTML' || repo.language === 'CSS') tags.add('JavaScript')
  if (tags.size === 0) tags.add('UI/UX')
  return [...tags]
}

function autoCard(repo: RepoInfo, index: number): Project {
  return {
    repo: repo.name,
    title: prettifyName(repo.name),
    description: repo.description ?? `Built with ${repo.language ?? 'the web platform'} — explore the source on GitHub.`,
    longDescription: repo.description ?? '',
    tags: autoTags(repo),
    tech: repo.language ? [repo.language] : [],
    github: repo.html_url,
    demo: repo.homepage || repo.html_url,
    accent: AUTO_ACCENTS[index % AUTO_ACCENTS.length],
    device: AUTO_DEVICES[index % AUTO_DEVICES.length],
  }
}

export async function fetchProjects(): Promise<{ projects: Project[]; live: boolean }> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${personal.githubUsername}/repos?per_page=100&sort=pushed`,
      { headers: { Accept: 'application/vnd.github+json' } },
    )
    if (!res.ok) throw new Error(`GitHub API ${res.status}`)
    const repos = (await res.json()) as RepoInfo[]

    const visible = repos.filter((r) => !r.fork && !hiddenRepos.includes(r.name.toLowerCase()))
    const byName = new Map(visible.map((r) => [r.name.toLowerCase(), r]))

    // curated cards first (only those that still exist), refreshed from live data
    const curated: Project[] = []
    for (const card of curatedProjects) {
      const repo = card.repo ? byName.get(card.repo.toLowerCase()) : undefined
      if (!repo) continue
      byName.delete(card.repo!.toLowerCase())
      curated.push({
        ...card,
        github: repo.html_url,
        demo: repo.homepage || card.demo,
        description: card.description || repo.description || '',
      })
    }

    // brand-new repos the curated list doesn't know about yet
    const extras = [...byName.values()]
      .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
      .map((repo, i) => autoCard(repo, curated.length + i))

    const merged = [...curated, ...extras].slice(0, MAX_PROJECTS)
    return merged.length > 0 ? { projects: merged, live: true } : { projects: curatedProjects, live: false }
  } catch {
    return { projects: curatedProjects, live: false }
  }
}
