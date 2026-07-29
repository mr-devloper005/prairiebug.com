'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { isUiHiddenTask } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const visibleTasks = SITE_CONFIG.tasks.filter((task) => task.enabled && !isUiHiddenTask(task.key))

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.3fr_0.8fr] lg:px-[60px]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-10 w-10 object-contain" />
            </span>
            <span className="editable-display text-lg font-bold tracking-[-0.01em]">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">{globalContent.footer?.description || SITE_CONFIG.description}</p>
        </div>

        
      

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">Site</h3>
          <div className="mt-4 grid gap-2.5">
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ...(session ? [['Submit', '/create']] : [['Login', '/login'], ['Sign up', '/signup']]),
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-medium text-white/70 transition hover:text-white">{label}</Link>
            ))}
            {session ? <button type="button" onClick={logout} className="text-left text-sm font-medium text-white/70 transition hover:text-white">Logout</button> : null}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">Search</h3>
          <div className="mt-4 grid gap-2.5">
            <Link href="/search" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white">
              Search resources <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs font-medium tracking-[0.06em] text-white/40">
        © {year} {SITE_CONFIG.name}. All rights reserved.
      </div>
    </footer>
  )
}
