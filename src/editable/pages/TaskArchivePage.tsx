import { Fragment } from 'react'
import Link from 'next/link'
import {
  ArrowUpRight,
  BriefcaseBusiness,
  ChevronDown,
  Download,
  FileText,
  Globe,
  MapPin,
  Phone,
  Search,
  UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { dedupeUrls } from '@/editable/cards/PostCards'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

/* ------------------------------------------------------------------ */
/*  Revalidation                                                       */
/* ------------------------------------------------------------------ */

export const revalidate = 3

/* ------------------------------------------------------------------ */
/*  Metadata helper                                                    */
/* ------------------------------------------------------------------ */

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object'
    ? (post.content as Record<string, unknown>)
    : {}

const asText = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

const isUrl = (value: string) =>
  value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media
        .map((item) => item?.url)
        .filter(
          (url): url is string => typeof url === 'string' && isUrl(url),
        )
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter(
        (url): url is string => typeof url === 'string' && isUrl(url),
      )
    : []
  const image =
    asText(content.image) ||
    asText(content.featuredImage) ||
    asText(content.thumbnail)
  const logo = asText(content.logo)
  return dedupeUrls([
    ...media,
    ...images,
    ...(isUrl(image) ? [image] : []),
    ...(isUrl(logo) ? [logo] : []),
  ]).slice(0, 8)
}

const placeholder =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWRlY2Y4Ii8+PC9zdmc+'

const getImage = (post: SitePost) => getImages(post)[0] || placeholder

const getCategory = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback

const stripHtml = (value: string) =>
  value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getSummary = (post: SitePost, limit = 150) => {
  const raw = stripHtml(
    post.summary ||
      asText(getContent(post).description) ||
      asText(getContent(post).excerpt) ||
      asText(getContent(post).body) ||
      '',
  )
  return raw.length > limit ? raw.slice(0, limit).trimEnd() + '...' : raw
}

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const cleanDomain = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return value.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}

function pageHref(
  basePath: string,
  category: string,
  page: number,
) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

/* ------------------------------------------------------------------ */
/*  Grid + card config                                                 */
/* ------------------------------------------------------------------ */

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
  listing: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
  classified: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
  image: 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4',
  sbm: 'grid gap-4',
  pdf: 'grid gap-4',
  profile: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase =
  'group block rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(21,15,65,0.14)]'

/* ------------------------------------------------------------------ */
/*  Ad helpers                                                         */
/* ------------------------------------------------------------------ */

const pickRandom = (sizes: string[]) =>
  sizes[Math.floor(Math.random() * sizes.length)]

/* ------------------------------------------------------------------ */
/*  Archive cards                                                      */
/* ------------------------------------------------------------------ */

function ArticleArchiveCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <EditableReveal index={index}>
      <Link href={href} className={`${cardBase} flex flex-col overflow-hidden`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute left-3 top-3 rounded-full bg-[var(--tk-accent)] px-3 py-0.5 text-xs font-semibold text-white">
            {category}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
          <h3 className="text-base font-semibold leading-snug text-[var(--tk-text)] line-clamp-2 group-hover:text-[var(--tk-accent)] transition-colors">
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--tk-muted)] line-clamp-3">
            {getSummary(post)}
          </p>
          {post.authorName && (
            <p className="mt-auto pt-2 text-xs text-[var(--tk-muted)]">
              By {post.authorName}
            </p>
          )}
        </div>
      </Link>
    </EditableReveal>
  )
}

function ListingArchiveCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const category = getCategory(post, 'Business')
  return (
    <EditableReveal index={index}>
      <Link href={href} className={`${cardBase} flex flex-col overflow-hidden`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          {logo ? (
            <img
              src={logo}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BriefcaseBusiness size={40} className="text-[var(--tk-muted)] opacity-40" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent)]">
            {category}
          </span>
          <h3 className="text-base font-semibold leading-snug text-[var(--tk-text)] line-clamp-2 group-hover:text-[var(--tk-accent)] transition-colors">
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--tk-muted)] line-clamp-2">
            {getSummary(post, 120)}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2 text-xs text-[var(--tk-muted)]">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-[var(--tk-accent)]" /> {location}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-1">
                <Phone size={13} className="text-[var(--tk-accent)]" /> {phone}
              </span>
            )}
            {website && (
              <span className="flex items-center gap-1">
                <Globe size={13} className="text-[var(--tk-accent)]" /> Website
              </span>
            )}
          </div>
        </div>
      </Link>
    </EditableReveal>
  )
}

function ClassifiedArchiveCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  const category = getCategory(post, 'Classified')
  return (
    <EditableReveal index={index}>
      <Link href={href} className={`${cardBase} flex flex-col gap-3 p-5`}>
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-[var(--tk-accentSoft)] px-3 py-0.5 text-xs font-semibold text-[var(--tk-accent)]">
            {category}
          </span>
          {price && (
            <span className="text-sm font-bold text-[var(--tk-accent)]">
              {price}
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold leading-snug text-[var(--tk-text)] line-clamp-2 group-hover:text-[var(--tk-accent)] transition-colors">
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--tk-muted)] line-clamp-3">
          {getSummary(post)}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-[var(--tk-line)] pt-3 text-xs text-[var(--tk-muted)]">
          <span className="inline-flex items-center gap-1.5">
            {location ? (
              <>
                <MapPin size={13} /> {location}
              </>
            ) : condition ? (
              condition
            ) : (
              'Details inside'
            )}
          </span>
          <ArrowUpRight
            size={14}
            className="text-[var(--tk-accent)] transition group-hover:translate-x-0.5"
          />
        </div>
      </Link>
    </EditableReveal>
  )
}

function ImageArchiveCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  const image = getImage(post)
  return (
    <EditableReveal index={index}>
      <Link href={href} className={`${cardBase} overflow-hidden`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-sm font-semibold leading-snug text-white line-clamp-2">
              {post.title}
            </h3>
          </div>
        </div>
      </Link>
    </EditableReveal>
  )
}

function BookmarkArchiveCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = website ? cleanDomain(website) : ''
  const category = getCategory(post, 'Resource')
  return (
    <EditableReveal index={index}>
      <Link href={href} className={`${cardBase} flex items-start gap-4 p-5`}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--tk-accentSoft)]">
          <Globe size={20} className="text-[var(--tk-accent)]" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--tk-muted)] tabular-nums">
              #{index + 1}
            </span>
            <span className="rounded-full bg-[var(--tk-accentSoft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--tk-accent)]">
              {category}
            </span>
          </div>
          <h3 className="text-base font-semibold leading-snug text-[var(--tk-text)] line-clamp-2 group-hover:text-[var(--tk-accent)] transition-colors">
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--tk-muted)] line-clamp-2">
            {getSummary(post, 120)}
          </p>
          {domain && (
            <span className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--tk-accent)]">
              <Globe size={11} /> {domain}
            </span>
          )}
        </div>
        <ArrowUpRight
          size={16}
          className="mt-1 shrink-0 text-[var(--tk-muted)] opacity-0 transition group-hover:opacity-100"
        />
      </Link>
    </EditableReveal>
  )
}

function PdfArchiveCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  const category = getCategory(post, 'Document')
  return (
    <EditableReveal index={index}>
      <Link href={href} className={`${cardBase} flex items-start gap-4 p-5`}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--tk-accentSoft)]">
          <FileText size={20} className="text-[var(--tk-accent)]" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 min-w-0">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent)]">
            {category}
          </span>
          <h3 className="text-base font-semibold leading-snug text-[var(--tk-text)] line-clamp-2 group-hover:text-[var(--tk-accent)] transition-colors">
            {post.title}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--tk-muted)] line-clamp-2">
            {getSummary(post, 120)}
          </p>
        </div>
        <Download
          size={16}
          className="mt-1 shrink-0 text-[var(--tk-muted)] opacity-0 transition group-hover:opacity-100"
        />
      </Link>
    </EditableReveal>
  )
}

function ProfileArchiveCard({
  post,
  href,
  index,
}: {
  post: SitePost
  href: string
  index: number
}) {
  const avatar = getImages(post)[0]
  const role = getField(post, [
    'role',
    'designation',
    'company',
    'location',
  ])
  return (
    <EditableReveal index={index}>
      <Link
        href={href}
        className={`${cardBase} flex flex-col items-center gap-3 p-6 text-center`}
      >
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--tk-accentSoft)] bg-[var(--tk-raised)]">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <UserRound size={28} className="text-[var(--tk-muted)]" />
          )}
        </div>
        <h3 className="text-base font-semibold leading-snug text-[var(--tk-text)] group-hover:text-[var(--tk-accent)] transition-colors line-clamp-1">
          {post.title}
        </h3>
        {role && (
          <span className="text-sm font-medium text-[var(--tk-accent)]">
            {role}
          </span>
        )}
        <p className="text-sm leading-relaxed text-[var(--tk-muted)] line-clamp-3">
          {getSummary(post, 100)}
        </p>
      </Link>
    </EditableReveal>
  )
}

/* ------------------------------------------------------------------ */
/*  Card picker                                                        */
/* ------------------------------------------------------------------ */

const taskCard: Record<
  TaskKey,
  (props: { post: SitePost; href: string; index: number }) => React.JSX.Element
> = {
  article: ArticleArchiveCard,
  listing: ListingArchiveCard,
  classified: ClassifiedArchiveCard,
  image: ImageArchiveCard,
  sbm: BookmarkArchiveCard,
  profile: ProfileArchiveCard,
  pdf: PdfArchiveCard,
}

/* ------------------------------------------------------------------ */
/*  Archive route (async server component)                             */
/* ------------------------------------------------------------------ */

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category
    ? normalizeCategory(resolved.category)
    : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, {
    page,
    limit: 24,
    category,
  })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

/* ------------------------------------------------------------------ */
/*  Archive view                                                       */
/* ------------------------------------------------------------------ */

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel =
    category === 'all'
      ? 'All categories'
      : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name ||
        category

  const Card = taskCard[task] ?? ArticleArchiveCard
  const grid = taskGrid[task] ?? taskGrid.article

  const isSbm = task === 'sbm'
  const inFeedIndex = isSbm
    ? Math.min(4, Math.floor(posts.length / 2))
    : -1

  return (
    <EditableSiteShell>
      <main
        style={taskThemeStyle(task)}
        className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]"
      >
        {/* ---- Hero ---- */}
        <header className="relative overflow-hidden border-b border-[var(--tk-line)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,var(--tk-glow),transparent_70%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-[60px]">
            <div className="mx-auto max-w-2xl py-20 text-center sm:py-28">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent)]">
                {voice?.eyebrow || theme.kicker}
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight text-[var(--tk-text)] sm:text-4xl lg:text-[2.75rem]">
                {voice?.headline || `Browse ${label}`}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[var(--tk-muted)] sm:text-lg">
                {voice?.description || theme.note}
              </p>
              {voice?.chips?.length ? (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  {voice.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1 text-xs font-medium text-[var(--tk-muted)]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {/* ---- Category filter bar ---- */}
        <section className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-[60px]">
            <form
              action={basePath}
              className="flex flex-wrap items-center gap-3 py-4"
            >
              <label
                htmlFor="cat-filter"
                className="text-sm font-medium text-[var(--tk-text)]"
              >
                {voice?.filterLabel || 'Filter'}
              </label>
              <div className="relative">
                <select
                  id="cat-filter"
                  name="category"
                  defaultValue={category}
                  className="appearance-none rounded-xl border border-[var(--tk-line)] bg-[var(--tk-surface)] py-2 pl-3.5 pr-9 text-sm text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)] focus:ring-2 focus:ring-[var(--tk-accent)]/20"
                  aria-label={voice?.filterLabel || 'Filter category'}
                >
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--tk-muted)]"
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-[var(--tk-accent)] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#4259d9]"
              >
                Apply
              </button>
              <span className="ml-auto text-sm text-[var(--tk-muted)]">
                <span className="font-semibold text-[var(--tk-text)]">
                  {posts.length}
                </span>{' '}
                {posts.length === 1 ? 'result' : 'results'} &middot;{' '}
                {categoryLabel}
              </span>
            </form>
          </div>
        </section>

        {/* ---- Card grid ---- */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-[60px]">
            {posts.length ? (
              <EditableReveal>
                <div className={`grid ${grid}`}>
                  {posts.map((post, i) => {
                    const href =
                      `${basePath}/${post.slug}` ||
                      buildPostUrl(task, post.slug)
                    return (
                      <Fragment key={post.id || post.slug}>
                        {isSbm && i === inFeedIndex && (
                          <div className="flex items-center justify-center rounded-2xl border border-dashed border-[var(--tk-line)] bg-[var(--tk-raised)] p-4">
                            <Ads
                              slot="in-feed"
                              size={pickRandom(getSlotSizes('in-feed'))}
                              showLabel
                            />
                          </div>
                        )}
                        <Card post={post} href={href} index={i} />
                      </Fragment>
                    )
                  })}
                </div>
              </EditableReveal>
            ) : (
              <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-2xl border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-20 text-center">
                <Search
                  size={40}
                  className="text-[var(--tk-muted)] opacity-40"
                />
                <p className="text-lg font-medium text-[var(--tk-text)]">
                  Nothing here yet
                </p>
                <p className="text-sm text-[var(--tk-muted)]">
                  Try another category, or check back after new resources are published.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ---- Pagination ---- */}
        {pagination.totalPages > 1 && (
          <section className="border-t border-[var(--tk-line)] bg-[var(--tk-surface)]">
            <div className="mx-auto flex max-w-[var(--editable-container)] items-center justify-between px-5 py-5 sm:px-8 lg:px-[60px]">
              <p className="text-sm text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                {pagination.hasPrevPage && (
                  <Link
                    href={pageHref(basePath, category, page - 1)}
                    className="rounded-xl border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-2 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-accent)] hover:text-[var(--tk-accent)]"
                  >
                    Previous
                  </Link>
                )}
                {pagination.hasNextPage && (
                  <Link
                    href={pageHref(basePath, category, page + 1)}
                    className="rounded-xl bg-[var(--tk-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#4259d9]"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ---- Secondary note ---- */}
        {voice?.secondaryNote && (
          <section className="pb-16">
            <div className="mx-auto max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-[60px]">
              <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-[var(--tk-muted)]">
                {voice.secondaryNote}
              </p>
            </div>
          </section>
        )}
      </main>
    </EditableSiteShell>
  )
}
