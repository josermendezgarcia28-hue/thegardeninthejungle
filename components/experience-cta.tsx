'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ExperienceCta() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="mx-auto max-w-6xl px-5 py-24">
      <div
        ref={ref}
        className={cn(
          'cta-reveal relative mx-auto max-w-5xl rounded-3xl border-2 border-purple-700/40 bg-[#241711] p-8 text-center shadow-[0_0_50px_-10px_rgba(147,51,234,0.35)] transition-transform duration-500 sm:p-14 md:hover:-translate-y-1',
          visible && 'is-visible',
        )}
      >
        {/* Breathing ambient aura behind the card */}
        <div
          aria-hidden="true"
          className="cta-aura pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-purple-600/30 via-blue-600/20 to-orange-600/20 blur-2xl"
        />
        <span className="mb-6 inline-block rounded-full border border-blue-500/50 bg-blue-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-blue-400">
          The Garden Philosophy
        </span>
        <h2 className="cta-gradient-title mx-auto mb-6 max-w-4xl text-4xl font-black uppercase leading-none tracking-tight text-balance sm:text-6xl md:text-7xl">
          Experience is the best teacher
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-base font-medium text-stone-300 text-pretty sm:text-lg">
          What are you willing to learn? Wander the full collection and feel the
          true sensations that Nature has to offer.
        </p>
        <Link
          href="/products"
          className="group inline-flex items-center justify-center gap-3 rounded-xl border border-orange-400 bg-orange-500 px-8 py-4 font-black uppercase tracking-wide text-stone-950 shadow-lg shadow-orange-950/60 transition-all hover:scale-105 hover:bg-orange-400 hover:shadow-orange-500/30 active:scale-95"
        >
          Explore the collection
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  )
}
