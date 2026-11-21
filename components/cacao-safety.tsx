import Link from 'next/link'
import { ArrowRight, Brain, HeartPulse, ShieldCheck, Sprout } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { CacaoCanopyCanvas } from '@/components/cacao-canopy-canvas'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/products'

type Pillar = {
  tag: string
  title: string
  metric: string
  metricLabel: string
  body: string
  points: string[]
  icon: LucideIcon
}

const pillars: Pillar[] = [
  {
    tag: 'Sacred origins',
    title: 'Theobroma, the food of the gods',
    metric: 'Theobroma',
    metricLabel: 'its botanical name, from the Greek for "food of the gods"',
    body: 'Ceremonial cacao begins in the shaded agroforests of Guatemala, where indigenous Mayan families wild-harvest the pods and stone-grind the beans by hand, carrying forward a practice thousands of years old.',
    points: [
      'Wild-harvested beneath the jungle canopy',
      'Stone-ground by Mayan families in Guatemala',
    ],
    icon: Sprout,
  },
  {
    tag: 'Theobromine',
    title: 'Sustained vitality, no crash',
    metric: 'Jitter-free',
    metricLabel: 'a steady lift from theobromine, not caffeine',
    body: 'Theobromine gently widens blood vessels and supports healthy circulation, delivering a smooth, lasting energy that rises slowly and fades softly instead of spiking and crashing.',
    points: [
      'Supports cardiovascular expansion and blood flow',
      'Calm, focused energy without the caffeine crash',
    ],
    icon: HeartPulse,
  },
  {
    tag: 'Neurochemistry',
    title: 'Mood, bliss, and a calmer nervous system',
    metric: 'Anandamide',
    metricLabel: 'known as "the bliss molecule"',
    body: 'Cacao carries compounds tied to how we feel: anandamide, precursors the body uses to build serotonin, and one of the richest natural sources of highly bioavailable magnesium.',
    points: [
      'Natural serotonin precursors for mood support',
      'High-bioavailability magnesium for muscles and nerves',
    ],
    icon: Brain,
  },
  {
    tag: 'Ceremonial standard',
    title: 'Whole bean, never defatted',
    metric: '100%',
    metricLabel: 'whole bean, unrefined',
    body: 'Commercial cocoa powder has its fat pressed out and is often heavily processed. Ceremonial cacao keeps the entire bean intact, cacao butter and all, so nothing nature put in is lost.',
    points: [
      'Unrefined and minimally processed',
      'Never defatted into commercial cocoa powder',
    ],
    icon: ShieldCheck,
  },
]

export function CacaoSafety({ featured }: { featured: Product[] }) {
  return (
    <section
      aria-labelledby="cacao-safety-heading"
      className="relative isolate overflow-hidden border-t border-fungi-ink/10 bg-fungi-void text-fungi-ink"
    >
      <CacaoCanopyCanvas className="-z-20 opacity-90 md:opacity-100" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,var(--color-fungi-void)_5%,transparent_55%)] opacity-70"
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-20 md:py-24">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-2xl flex-col gap-4">
            <span className="w-fit rounded-full border border-resin-amber/60 px-3 py-1 font-label text-xs uppercase tracking-[0.22em] text-fungi-ink shadow-[0_0_18px_-4px_var(--color-resin-amber)]">
              From the garden &middot; Ceremonial cacao
            </span>
            <h2
              id="cacao-safety-heading"
              className="font-serif text-3xl font-light uppercase leading-tight tracking-[0.12em] text-balance md:text-4xl"
            >
              The origins, chemistry, and ceremony of true cacao
            </h2>
            <p className="leading-relaxed text-fungi-ink/85 text-pretty">
              Grown beneath the night canopy of the Guatemalan jungle. Here is
              where ceremonial cacao comes from, what it does in the body, and
              what separates it from ordinary cocoa.
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 rounded-full border border-fungi-ink/25 px-4 py-2 text-sm text-fungi-ink transition-colors hover:border-resin-amber/70 hover:text-resin-amber"
          >
            See all
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </header>

        <ul className="grid gap-5 md:grid-cols-2">
          {pillars.map((pillar) => (
            <li
              key={pillar.tag}
              className="flex flex-col gap-5 rounded-2xl border border-fungi-ink/15 bg-fungi-void/65 p-7 text-fungi-ink shadow-[0_20px_60px_-30px_var(--color-fungi-void)] backdrop-blur-md md:bg-fungi-void/50 md:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-fungi-ink/20 bg-fungi-forest px-3 py-1 font-label text-xs uppercase tracking-[0.18em] text-fungi-ink">
                  {pillar.tag}
                </span>
                <span className="flex size-10 items-center justify-center rounded-full bg-fungi-soil ring-1 ring-resin-amber/30">
                  <pillar.icon className="size-5 text-resin-amber" aria-hidden="true" />
                </span>
              </div>

              <h3 className="font-serif text-2xl leading-snug text-balance">
                {pillar.title}
              </h3>

              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-serif text-3xl text-resin-amber [text-shadow:0_0_22px_var(--color-resin-amber)]">
                  {pillar.metric}
                </span>
                <span className="text-sm leading-relaxed text-fungi-ink/75">
                  {pillar.metricLabel}
                </span>
              </p>

              <p className="leading-relaxed text-fungi-ink/85 text-pretty">
                {pillar.body}
              </p>

              <ul className="mt-auto flex flex-col gap-2.5 border-t border-fungi-ink/15 pt-5">
                {pillar.points.map((point) => (
                  <li key={point} className="flex gap-3 leading-relaxed">
                    <span
                      className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-resin-amber shadow-[0_0_8px_var(--color-resin-amber)]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        {featured.length > 0 && (
          <div className="grid max-w-2xl gap-6">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        <p className="text-sm leading-relaxed text-fungi-ink/70">
          Educational information only, not medical advice. Ceremonial cacao
          contains theobromine; speak with a qualified practitioner first if
          you are pregnant, nursing, have a heart condition or take
          antidepressants or other medication.
        </p>
      </div>
    </section>
  )
}
