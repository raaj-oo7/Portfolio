import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Clock } from 'lucide-react'
import { blogPosts, getReadingTime } from '@/data/blog'
import { fadeUp, staggerContainer } from '@/animations/variants'
import { setPageMeta } from '@/utils/seo'
import { personal } from '@/data/portfolio'
import { cn } from '@/utils'

const CATEGORIES = ['All', ...new Set(blogPosts.map((p) => p.category))]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** Blog index: filterable grid of article cards. */
export default function Blog() {
  const [category, setCategory] = useState('All')

  useEffect(() => {
    setPageMeta({
      title: `Blog — ${personal.name} | React, Animation & AI Engineering`,
      description:
        'Articles on React, GSAP animation, modern JavaScript and AI developer tools — practical guides from a frontend engineer who ships.',
    })
    window.scrollTo(0, 0)
  }, [])

  const visible = useMemo(
    () => (category === 'All' ? blogPosts : blogPosts.filter((p) => p.category === category)),
    [category],
  )

  return (
    <div className="mx-auto min-h-svh max-w-6xl px-6 pt-32 pb-24">
      {/* header */}
      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mb-12 max-w-2xl">
        <motion.span
          variants={fadeUp}
          className="mb-3 inline-block rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1 font-mono text-xs tracking-widest text-primary-400 uppercase"
        >
          The Blog
        </motion.span>
        <motion.h1 variants={fadeUp} className="font-display text-4xl font-bold tracking-tight md:text-5xl">
          Notes from the <span className="text-gradient">workbench</span>
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-4 text-(--fg-muted) md:text-lg">
          Long-form, practical guides on React, animation, modern JavaScript and the AI tools reshaping how we build.
        </motion.p>
      </motion.div>

      {/* category filter */}
      <div className="mb-10 flex flex-wrap gap-2" role="tablist" aria-label="Filter articles">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              category === c
                ? 'bg-gradient-to-r from-primary-600 to-accent-purple text-white'
                : 'glass text-(--fg-muted) hover:text-(--fg)',
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* cards — animate on mount (whileInView on a tall grid never fires
          on mobile, hiding every card); re-keyed so filtering re-animates */}
      <motion.div
        key={category}
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {visible.map((post, i) => (
          <motion.article key={post.slug} variants={fadeUp} custom={i}>
            <Link
              to={`/blog/${post.slug}`}
              className="glass noise group relative flex h-full flex-col overflow-hidden rounded-3xl transition-colors duration-300 hover:border-primary-500/40"
            >
              {/* gradient banner */}
              <div
                className="relative flex h-36 items-end p-5"
                style={{
                  background: `linear-gradient(135deg, ${post.accent}30 0%, transparent 60%), radial-gradient(circle at 80% 20%, ${post.accent}22, transparent 65%)`,
                }}
              >
                <span
                  className="rounded-full px-3 py-1 font-mono text-[10px] font-semibold tracking-widest uppercase"
                  style={{ background: `${post.accent}22`, color: post.accent, border: `1px solid ${post.accent}44` }}
                >
                  {post.category}
                </span>
                <ArrowUpRight
                  size={18}
                  className="absolute top-5 right-5 text-(--fg-muted) transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--fg)"
                  aria-hidden
                />
              </div>

              <div className="flex flex-1 flex-col p-6 pt-1">
                <h2 className="font-display text-lg leading-snug font-bold text-balance group-hover:text-primary-300 transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-(--fg-muted)">{post.excerpt}</p>
                <div className="mt-5 flex items-center gap-3 font-mono text-[11px] text-(--fg-muted)">
                  <span>{formatDate(post.date)}</span>
                  <span aria-hidden>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {getReadingTime(post)} min read
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </div>
  )
}
