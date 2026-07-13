import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Clock, Tag } from 'lucide-react'
import { blogPosts, getPost, getReadingTime } from '@/data/blog'
import { BlogMarkdown } from '@/components/BlogMarkdown'
import { setPageMeta } from '@/utils/seo'
import { personal } from '@/data/portfolio'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** Single blog article with per-post SEO and prev/next navigation. */
export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const post = slug ? getPost(slug) : undefined

  useEffect(() => {
    if (!post) {
      navigate('/blog', { replace: true })
      return
    }
    window.scrollTo(0, 0)
    setPageMeta({
      title: post.seoTitle,
      description: post.metaDescription,
      keywords: post.keywords,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.date,
        author: { '@type': 'Person', name: personal.name, url: personal.website },
        keywords: post.keywords.join(', '),
      },
    })
  }, [post, navigate])

  if (!post) return null

  const index = blogPosts.findIndex((p) => p.slug === post.slug)
  const prev = blogPosts[index + 1]
  const next = blogPosts[index - 1]

  return (
    <article className="mx-auto min-h-svh max-w-3xl px-6 pt-32 pb-24">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-(--fg-muted) transition-colors hover:text-primary-300"
        >
          <ArrowLeft size={15} /> All articles
        </Link>

        {/* header */}
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[11px] text-(--fg-muted)">
            <span
              className="rounded-full px-3 py-1 font-semibold tracking-widest uppercase"
              style={{ background: `${post.accent}22`, color: post.accent, border: `1px solid ${post.accent}44` }}
            >
              {post.category}
            </span>
            <span>{formatDate(post.date)}</span>
            <span aria-hidden>·</span>
            <span className="flex items-center gap-1">
              <Clock size={11} /> {getReadingTime(post)} min read
            </span>
          </div>
          <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-balance md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-(--fg-muted)">{post.excerpt}</p>

          {/* author strip */}
          <div className="mt-6 flex items-center gap-3 border-y border-(--line) py-4">
            <span className="font-display flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-accent-purple text-xs font-bold text-white">
              RM
            </span>
            <div>
              <p className="text-sm font-semibold">{personal.name}</p>
              <p className="text-xs text-(--fg-muted)">{personal.roles[0]} · {personal.roles[2]}</p>
            </div>
          </div>
        </header>

        {/* hero banner (stand-in for the featured image) */}
        <div
          aria-hidden
          className="noise relative mb-12 h-44 overflow-hidden rounded-3xl border border-(--line) md:h-56"
          style={{
            background: `linear-gradient(130deg, ${post.accent}33 0%, transparent 55%), radial-gradient(circle at 85% 15%, ${post.accent}2e, transparent 60%), var(--bg-elevated)`,
          }}
        >
          <span
            className="font-display absolute bottom-5 left-6 text-5xl font-bold opacity-15 select-none md:text-7xl"
            style={{ color: post.accent }}
          >
            {post.category}
          </span>
        </div>

        {/* body */}
        <BlogMarkdown content={post.content} />

        {/* keywords */}
        <footer className="mt-12 border-t border-(--line) pt-6">
          <ul className="flex flex-wrap gap-2" aria-label="Article keywords">
            {post.keywords.map((k) => (
              <li
                key={k}
                className="glass flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] text-(--fg-muted)"
              >
                <Tag size={10} aria-hidden /> {k}
              </li>
            ))}
          </ul>

          {/* prev / next */}
          <nav className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="More articles">
            {prev ? (
              <Link
                to={`/blog/${prev.slug}`}
                className="glass group rounded-2xl p-5 transition-colors hover:border-primary-500/40"
              >
                <span className="flex items-center gap-1 font-mono text-[10px] tracking-widest text-(--fg-muted) uppercase">
                  <ArrowLeft size={11} /> Older
                </span>
                <p className="mt-1.5 text-sm font-semibold group-hover:text-primary-300">{prev.title}</p>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link
                to={`/blog/${next.slug}`}
                className="glass group rounded-2xl p-5 text-right transition-colors hover:border-primary-500/40"
              >
                <span className="flex items-center justify-end gap-1 font-mono text-[10px] tracking-widest text-(--fg-muted) uppercase">
                  Newer <ArrowRight size={11} />
                </span>
                <p className="mt-1.5 text-sm font-semibold group-hover:text-primary-300">{next.title}</p>
              </Link>
            )}
          </nav>
        </footer>
      </motion.div>
    </article>
  )
}
