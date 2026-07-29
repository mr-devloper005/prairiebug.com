import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main>
        <section className="relative overflow-hidden bg-[linear-gradient(135deg,#150f41,#2a1f6e_50%,#4760e6)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_100%,rgba(71,96,230,0.3),transparent)]" />
          <div className="relative mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1fr] lg:px-[60px]">
            <div className="rounded-2xl border border-white/10 bg-white p-7 shadow-[0_16px_48px_rgba(21,15,65,0.25)] sm:p-9">
              <h1 className="editable-display text-xl font-bold tracking-[-0.01em] text-[#150f41]">{pagesContent.auth.signup.formTitle}</h1>
              <EditableLocalSignupForm />
              <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">Already have an account? <Link href="/login" className="font-semibold text-[#4760e6] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">{pagesContent.auth.signup.badge}</p>
              <h2 className="editable-display mt-5 max-w-xl text-[40px] font-bold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl">{pagesContent.auth.signup.title}</h2>
              <p className="mt-5 max-w-lg text-base leading-8 text-white/70">{pagesContent.auth.signup.description}</p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
