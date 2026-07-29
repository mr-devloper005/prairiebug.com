import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BookOpen, Filter, Layers, Search, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { isUiHiddenTask } from '@/editable/content/global.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
    compactRaw(content.description) ||
    compactRaw(content.excerpt) ||
    compactRaw(content.body) ||
    '',
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (isUiHiddenTask(derivedTask)) return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

const getCategoryOf = (post: SitePost) => {
  const content = getContent(post)
  const raw = compactRaw(content.category)
  return raw || (Array.isArray(post.tags) && post.tags[0]) || ''
}

function SearchResultCard({ post, index: _index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'sbm'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const category = getCategoryOf(post)

  return (
    <Link href={href} className="group block overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(21,15,65,0.14)]">
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
          <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
          {category ? <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--slot4-page-text)] shadow-sm">{category}</span> : null}
        </div>
      ) : null}
      <div className="p-5 sm:p-6">
        {!image && category ? <span className="inline-block rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--slot4-accent)]">{category}</span> : null}
        <h2 className="editable-display mt-3 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.01em]">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">View resource <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
      </div>
    </Link>
  )
}

const quickLinks = [
  { icon: BookOpen, label: 'Browse library', href: '/sbm' },
  { icon: Layers, label: 'Collections', href: '/sbm' },
  { icon: Sparkles, label: 'Submit a resource', href: '/create' },
]

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled && !isUiHiddenTask(item.key))
  const hasQuery = !!(normalized || category || task)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero with centered search */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#150f41,#2a1f6e_50%,#4760e6)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(71,96,230,0.3),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(30%_50%_at_80%_20%,rgba(71,96,230,0.2),transparent)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-8 sm:py-24 lg:px-[60px]">
            <div className="mx-auto max-w-3xl text-center">
              <EditableReveal>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">{pagesContent.search.hero.badge}</p>
                <h1 className="editable-display mt-4 text-[32px] font-bold tracking-[-0.02em] text-white sm:text-[44px] lg:text-[48px]">{pagesContent.search.hero.title}</h1>
                <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/70">{pagesContent.search.hero.description}</p>
              </EditableReveal>

              {/* Search form */}
              <EditableReveal index={1}>
                <form action="/search" className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-sm sm:p-6">
                  <input type="hidden" name="master" value="1" />
                  <label className="flex items-center gap-3 rounded-xl border border-white/15 bg-white px-4 py-3.5">
                    <Search className="h-5 w-5 text-[var(--slot4-muted-text)]" />
                    <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]" />
                  </label>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="flex items-center gap-2 rounded-xl border border-white/15 bg-white px-4 py-3">
                      <Filter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                      <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]" />
                    </label>
                    <select name="task" defaultValue={task} className="rounded-xl border border-white/15 bg-white px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] outline-none">
                      <option value="">All content types</option>
                      {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                    </select>
                  </div>
                  <button className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--slot4-accent-fill)] px-6 text-sm font-semibold text-white transition hover:bg-[#4259d9]" type="submit">
                    <Search className="h-4 w-4" /> Search the library
                  </button>
                </form>
              </EditableReveal>

              {/* Quick links */}
              {!hasQuery ? (
                <EditableReveal index={2}>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {quickLinks.map((link) => (
                      <Link key={link.label} href={link.href} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-white/40 hover:text-white">
                        <link.icon className="h-3.5 w-3.5" /> {link.label}
                      </Link>
                    ))}
                  </div>
                </EditableReveal>
              ) : null}
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-12 sm:px-8 sm:py-16 lg:px-[60px]">
          <EditableReveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent)]">{results.length} {results.length === 1 ? 'result' : 'results'}</p>
                <h2 className="editable-display mt-2 text-[24px] font-bold tracking-[-0.02em] sm:text-[32px]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
              </div>
              <Link href="/sbm" className="inline-flex items-center gap-2 rounded-xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">Browse library <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </EditableReveal>

          {results.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index % 6}>
                  <SearchResultCard post={post} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <EditableReveal>
              <div className="mt-8 rounded-2xl border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-12 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)]">
                  <Search className="h-7 w-7 text-[var(--slot4-accent)]" />
                </div>
                <p className="editable-display mt-5 text-xl font-bold tracking-[-0.01em]">No matching resources found.</p>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">
                  {hasQuery ? 'Try a different keyword, content type, or category.' : 'Start by entering a keyword above, or browse the library directly.'}
                </p>
                <Link href="/sbm" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4259d9]">
                  Browse the library <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </EditableReveal>
          )}

          <div className="mx-auto mt-12 max-w-3xl">
            <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
