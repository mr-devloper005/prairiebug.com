'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export function EditableReveal({
  children,
  index = 0,
  className = '',
}: {
  children: ReactNode
  index?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const el = ref.current
    if (!el) return
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [mounted])

  const delay = Math.min(index * 80, 400)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: !mounted ? 1 : visible ? 1 : 0,
        transform: !mounted ? 'none' : visible ? 'none' : 'translate3d(0, 32px, 0)',
        transition: `opacity 0.7s var(--ease-premium) ${delay}ms, transform 0.7s var(--ease-premium) ${delay}ms`,
        willChange: visible ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}
