'use client'

import { Bookmark, Mail, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const lanes = [
  { icon: Bookmark, title: 'Resource submissions', body: 'Suggest tools, references, and links that deserve a place in the library. We review every submission.' },
  { icon: Mail, title: 'Curator partnerships', body: 'Interested in contributing to collections or maintaining a section of the library? Let us know.' },
  { icon: Sparkles, title: 'General inquiries', body: 'Questions about the platform, feedback, or anything else — we read every message.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#150f41,#2a1f6e_50%,#4760e6)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(71,96,230,0.3),transparent)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-5 py-20 sm:px-8 sm:py-28 lg:px-[60px]">
            <EditableReveal>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">{pagesContent.contact.eyebrow}</p>
              <h1 className="editable-display mt-5 max-w-3xl text-[40px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">
                {pagesContent.contact.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/70">{pagesContent.contact.description}</p>
            </EditableReveal>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-5 py-16 sm:px-8 sm:py-24 lg:px-[60px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <EditableReveal>
              <div className="space-y-4">
                {lanes.map((lane) => (
                  <div key={lane.title} className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <lane.icon className="h-5 w-5" />
                    </div>
                    <h2 className="editable-display mt-4 text-lg font-bold tracking-[-0.01em]">{lane.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{lane.body}</p>
                  </div>
                ))}
              </div>
            </EditableReveal>

            <EditableReveal index={1}>
              <div className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 shadow-[0_8px_32px_rgba(21,15,65,0.06)]">
                <h2 className="editable-display text-xl font-bold tracking-[-0.01em]">{pagesContent.contact.formTitle}</h2>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
