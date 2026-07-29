import Link from 'next/link'
import {
  ArrowRight, Bookmark, ChevronRight, ExternalLink, Globe,
  Search, Sparkles, CheckCircle2, Zap,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'
import { isUiHiddenTask } from '@/editable/content/global.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-[60px]'

/* -------------------------------- Helpers -------------------------------- */

function latestPostImages(posts: SitePost[], max = 8) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function domainOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const url = (typeof content.url === 'string' && content.url) || (typeof content.link === 'string' && content.link) || ''
  try {
    return url ? new URL(url).hostname.replace(/^www\./, '') : ''
  } catch {
    return ''
  }
}

/* ----------------------------- Hero banner ------------------------------ */

export function EditableHomeHero({ primaryTask: _primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const heroImages = latestPostImages(pool)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Discover the best of ${SITE_CONFIG.name}`

  return (
    <EditableReveal index={0}>
      <section className="relative overflow-hidden">
        {/* Dark gradient backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#150f41,#2a1f6e_50%,#4760e6)]" />

        {/* Collage layer */}
        <div className="absolute inset-0 opacity-20">
          <EditableHeroCollage images={heroImages} />
        </div>

        <div className={`relative z-10 flex flex-col items-center py-20 text-center sm:py-28 lg:py-36 ${container}`}>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/80">
            {pagesContent.home.hero.badge || 'The Library'}
          </p>

          <h1 className="mt-5 max-w-4xl text-[40px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-[64px]">
            {heroTitle}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
            {pagesContent.home.hero.description || `Curated collections and resources from across the web, organized for easy discovery.`}
          </p>

          {/* Search bar */}
          <form
            action="/search"
            className="mt-10 flex w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          >
            <div className="flex flex-1 items-center gap-3 px-6">
              <Search className="h-5 w-5 shrink-0 text-[#150f41]/40" />
              <input
                name="q"
                placeholder={pagesContent.home.hero.searchPlaceholder || 'Search collections, resources, topics...'}
                className="w-full bg-transparent py-4 text-sm text-[#150f41] outline-none placeholder:text-[#150f41]/40 sm:text-base"
              />
            </div>
            <button className="shrink-0 bg-[#4760e6] px-7 text-sm font-bold text-white transition hover:brightness-110 sm:px-9">
              Search
            </button>
          </form>

          {/* CTA buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={primaryRoute}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#150f41] shadow-lg transition duration-500 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {pagesContent.home.hero.primaryCta?.label || 'Browse the library'} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={pagesContent.home.hero.secondaryCta?.href || '/about'}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition duration-500 hover:bg-white/10"
            >
              {pagesContent.home.hero.secondaryCta?.label || 'Learn more'}
            </Link>
          </div>
        </div>

        {/* Trust strip */}
        <div className="relative z-10 border-t border-white/10 bg-[#150f41]/60 backdrop-blur-md">
          <div className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-4 text-sm text-white/70 ${container}`}>
            <span className="inline-flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-white/90" /> Curated collections
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-white/90" /> Quality resources
            </span>
            <span className="hidden items-center gap-2 sm:inline-flex">
              <Zap className="h-4 w-4 text-white/90" /> Updated daily
            </span>
          </div>
        </div>
      </section>
    </EditableReveal>
  )
}

/* ----------------------- Browse collections rail ------------------------ */

const collectionIcons: Record<string, typeof Globe> = {
  article: Globe,
  listing: Globe,
  classified: Globe,
  image: Globe,
  sbm: Bookmark,
  pdf: Globe,
  profile: Globe,
}

export function EditableStoryRail({ primaryRoute }: HomeSectionProps) {
  const categories = SITE_CONFIG.tasks.filter((t) => t.enabled && !isUiHiddenTask(t.key))
  if (!categories.length) return null

  return (
    <EditableReveal index={1}>
      <section className="bg-[#edecf8]">
        <div className={`py-12 sm:py-16 lg:py-24 ${container}`}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4760e6]">Collections</p>
              <h2 className="mt-2 text-[32px] font-bold tracking-[-0.02em] sm:text-[40px]">Browse collections</h2>
              <p className="mt-2 max-w-xl text-[#150f41]/60">
                Jump into curated categories and discover resources organized by topic.
              </p>
            </div>
            <Link
              href={primaryRoute}
              className="hidden items-center gap-1 text-sm font-semibold text-[#4760e6] hover:underline sm:inline-flex"
            >
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((task) => {
              const Icon = collectionIcons[task.key] || Globe
              return (
                <Link
                  key={task.key}
                  href={`/sbm?category=${encodeURIComponent(task.label)}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-7 text-center transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(21,15,65,0.14)]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#4760e6]/10 text-[#4760e6] transition duration-500 group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-sm font-semibold text-[#150f41]">{task.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </EditableReveal>
  )
}

/* ----------------------- Featured resources grid ------------------------ */

function ResourceCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  const domain = domainOf(post)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(21,15,65,0.14)]">
      <Link href={href} className="relative block aspect-[3/2] overflow-hidden bg-[#edecf8]">
        <img
          src={image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {category ? (
          <span className="absolute left-3 top-3 rounded-xl bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#150f41] shadow-sm backdrop-blur-sm">
            {category}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link
          href={href}
          className="line-clamp-2 text-lg font-bold leading-snug tracking-[-0.01em] text-[#150f41] transition hover:text-[#4760e6]"
        >
          {post.title}
        </Link>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[#150f41]/60">{getExcerpt(post, 140)}</p>

        {domain ? (
          <div className="mt-3 flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5 text-[#4760e6]/60" />
            <span className="text-xs font-medium text-[#150f41]/50">{domain}</span>
          </div>
        ) : null}
      </div>
    </article>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const all = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).slice(0, 9)
  if (!all.length) return null

  return (
    <EditableReveal index={2}>
      <section className="bg-[#f9f7ff]">
        <div className={`py-12 sm:py-16 lg:py-24 ${container}`}>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4760e6]">Featured</p>
            <h2 className="mt-2 text-[32px] font-bold tracking-[-0.02em] sm:text-[40px]">Featured resources</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#150f41]/60">
              The latest additions to our curated library across {SITE_CONFIG.name}.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((post) => (
              <ResourceCard
                key={post.id || post.slug}
                post={post}
                href={postHref(primaryTask, post, primaryRoute)}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={primaryRoute}
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--editable-border)] bg-white px-7 py-3.5 text-sm font-bold text-[#150f41] transition duration-500 hover:-translate-y-0.5 hover:border-[#4760e6] hover:text-[#4760e6]"
            >
              Browse all resources <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </EditableReveal>
  )
}

/* -------------------- Time-window discovery sections -------------------- */

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'Newly added resources' },
  browse: { eyebrow: 'Popular picks', title: 'Trending this month' },
  index: { eyebrow: 'From the archive', title: 'Evergreen collections' },
}

function TimeCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  const domain = domainOf(post)

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(21,15,65,0.14)]"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-[#edecf8]">
        <img
          src={image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        {category ? (
          <span className="absolute left-3 top-3 rounded-xl bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#150f41] shadow-sm backdrop-blur-sm">
            {category}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-bold leading-snug tracking-[-0.01em] text-[#150f41] group-hover:text-[#4760e6]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[#150f41]/60">{getExcerpt(post, 110)}</p>
        {domain ? (
          <div className="mt-3 flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-[#4760e6]/50" />
            <span className="text-xs font-medium text-[#150f41]/50">{domain}</span>
          </div>
        ) : null}
      </div>
    </Link>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((s) => s.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        const bgClass = index % 2 === 0 ? 'bg-[#edecf8]' : 'bg-[#f9f7ff]'

        return (
          <EditableReveal key={section.key} index={3 + index}>
            <section className={bgClass}>
              <div className={`py-12 sm:py-16 lg:py-24 ${container}`}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#4760e6]">{copy.eyebrow}</p>
                    <h2 className="mt-2 text-[32px] font-bold tracking-[-0.02em] sm:text-[40px]">{copy.title}</h2>
                  </div>
                  <Link
                    href={section.href || primaryRoute}
                    className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-[#4760e6] hover:underline"
                  >
                    See all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {section.posts.slice(0, 8).map((post) => (
                    <TimeCard
                      key={post.id || post.slug}
                      post={post}
                      href={postHref(primaryTask, post, primaryRoute)}
                    />
                  ))}
                </div>
              </div>
            </section>
          </EditableReveal>
        )
      })}
    </>
  )
}

/* -------------------------------- CTA band ------------------------------ */

export function EditableHomeCta() {
  return (
    <EditableReveal index={7}>
      <section id="get-started" className="scroll-mt-24 bg-[linear-gradient(135deg,#150f41,#2a1f6e_50%,#4760e6)]">
        <div className={`flex flex-col items-center gap-6 py-16 text-center sm:py-20 lg:py-24 ${container}`}>
          <Sparkles className="h-8 w-8 text-white/70" />
          <h2 className="max-w-2xl text-[32px] font-bold tracking-[-0.02em] text-white sm:text-[40px]">
            {pagesContent.home.cta?.title || 'Start building your collection'}
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-white/85">
            {pagesContent.home.cta?.description || `Save, organize, and share the best resources you find across the web with the ${SITE_CONFIG.name} community.`}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link
              href={pagesContent.home.cta?.primaryCta?.href || '/sbm'}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#150f41] shadow-lg transition duration-500 hover:-translate-y-0.5 hover:shadow-xl"
            >
              {pagesContent.home.cta?.primaryCta?.label || 'Browse the library'} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={pagesContent.home.cta?.secondaryCta?.href || '/contact'}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition duration-500 hover:bg-white/10"
            >
              {pagesContent.home.cta?.secondaryCta?.label || 'Contact us'}
            </Link>
          </div>
        </div>
      </section>
    </EditableReveal>
  )
}
