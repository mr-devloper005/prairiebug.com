import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { ArrowRight, BookOpen, CheckCircle2, Globe, Layers, Sparkles, Users } from 'lucide-react'

const valueIcons = [CheckCircle2, Globe, Sparkles]

const stats = [
  { value: '100+', label: 'Curated resources' },
  { value: '20+', label: 'Collections' },
  { value: '10+', label: 'Active curators' },
]

const principles = [
  { icon: BookOpen, title: 'Curated, not aggregated', description: 'Every resource is reviewed before it enters the library. No scrapers, no auto-imports — just human judgment.' },
  { icon: Layers, title: 'Collections over folders', description: 'Resources live in themed collections that overlap naturally, so discovery feels intuitive instead of rigid.' },
  { icon: Users, title: 'Community-driven growth', description: 'Curators maintain the sections they know best. The library grows through expertise, not volume.' },
]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#150f41,#2a1f6e_50%,#4760e6)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(71,96,230,0.3),transparent)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(30%_50%_at_80%_20%,rgba(71,96,230,0.2),transparent)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-5 py-24 sm:px-8 sm:py-32 lg:px-[60px]">
            <EditableReveal>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">{pagesContent.about.badge}</p>
              <h1 className="editable-display mt-5 max-w-3xl text-[40px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-[56px]">
                {pagesContent.about.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{pagesContent.about.description}</p>
            </EditableReveal>

            {/* Stats strip */}
            <EditableReveal index={1}>
              <div className="mt-12 flex flex-wrap gap-12">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[32px] font-bold tracking-[-0.02em] text-white">{stat.value}</p>
                    <p className="mt-1 text-sm text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* Mission / story */}
        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-8 sm:py-24 lg:px-[60px]">
          <div className="grid gap-16 lg:grid-cols-2">
            <EditableReveal>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent)]">Our story</p>
                <h2 className="editable-display mt-4 text-[28px] font-bold tracking-[-0.02em] sm:text-[36px]">
                  Why we built this library
                </h2>
                <div className="mt-6 space-y-5 text-base leading-8 text-[var(--slot4-muted-text)]">
                  {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/sbm"
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#4259d9]"
                  >
                    Browse the library <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--editable-border)] px-6 py-3 text-sm font-semibold transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]"
                  >
                    Get in touch
                  </Link>
                </div>
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="space-y-5">
                {pagesContent.about.values.map((value, i) => {
                  const Icon = valueIcons[i] || CheckCircle2
                  return (
                    <div key={value.title} className="group rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(21,15,65,0.1)]">
                      <div className="flex items-start gap-5">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] transition duration-500 group-hover:bg-[var(--slot4-accent-fill)] group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="editable-display text-lg font-bold tracking-[-0.01em]">{value.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* Principles */}
        <section className="bg-[var(--slot4-panel-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-8 sm:py-24 lg:px-[60px]">
            <EditableReveal>
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent)]">How it works</p>
                <h2 className="editable-display mx-auto mt-4 max-w-2xl text-[28px] font-bold tracking-[-0.02em] sm:text-[36px]">
                  Built on three simple principles
                </h2>
              </div>
            </EditableReveal>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {principles.map((item, i) => (
                <EditableReveal key={item.title} index={i}>
                  <div className="group flex h-full flex-col rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 transition duration-500 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(21,15,65,0.1)]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] transition duration-500 group-hover:bg-[var(--slot4-accent-fill)] group-hover:text-white">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <h3 className="editable-display mt-5 text-lg font-bold tracking-[-0.01em]">{item.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-[var(--slot4-muted-text)]">{item.description}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[linear-gradient(135deg,#150f41,#2a1f6e_50%,#4760e6)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-5 py-16 text-center sm:px-8 sm:py-24 lg:px-[60px]">
            <EditableReveal>
              <Sparkles className="mx-auto h-8 w-8 text-white/70" />
              <h2 className="editable-display mx-auto mt-5 max-w-2xl text-[32px] font-bold tracking-[-0.02em] text-white sm:text-[40px]">
                A library that grows with every great resource.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/75">
                {SITE_CONFIG.name} is maintained by curators who use the resources they recommend. The library grows slowly and intentionally.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href="/sbm"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#150f41] shadow-lg transition duration-500 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Browse the library <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition duration-500 hover:bg-white/10"
                >
                  Become a curator
                </Link>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
