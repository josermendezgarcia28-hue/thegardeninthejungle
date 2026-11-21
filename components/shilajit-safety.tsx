import { Atom, BatteryCharging, Mountain, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { MountainRidgeCanvas } from '@/components/mountain-ridge-canvas'

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
    tag: 'Geological origin',
    title: 'Formed by the mountain, trusted for millennia',
    metric: '3,000+ yrs',
    metricLabel: 'of documented Ayurvedic use',
    body: 'Shilajit forms over centuries as organic plant matter is compressed under immense high-mountain pressure, slowly seeping from rock fissures as a mineral-rich resin. Ayurveda has prized it as a safe rasayana, or rejuvenator.',
    points: [
      'Born from compressed plant matter in high-altitude rock',
      'Classified in Ayurveda as a gentle, daily-use rasayana',
    ],
    icon: Mountain,
  },
  {
    tag: 'Fulvic acid',
    title: 'Cellular delivery through fulvic acid',
    metric: '84+',
    metricLabel: 'ionic trace minerals',
    body: 'Its trace minerals arrive bonded to natural fulvic acid, which acts as an organic electrolyte. That pairing helps carry nutrients across cell membranes so the body can actually put them to use.',
    points: [
      'Fulvic acid works as a natural mineral carrier',
      'Ionic form supports absorption at the cellular level',
    ],
    icon: Atom,
  },
  {
    tag: 'Mitochondrial energy',
    title: 'ATP without the burnout',
    metric: 'ATP',
    metricLabel: 'produced at the source, in the mitochondria',
    body: 'Clinical research suggests shilajit supports cellular respiration and helps recycle CoQ10, the coenzyme central to natural ATP production. The result is steady energy rather than a stimulant spike.',
    points: [
      'Supports CoQ10 recycling and cellular respiration',
      'No caffeine, no adrenal crash',
    ],
    icon: BatteryCharging,
  },
  {
    tag: 'Purity standards',
    title: 'Purified resin, never raw rock pitch',
    metric: '0',
    metricLabel: 'tolerance for unpurified crude resin',
    body: 'Raw shilajit can carry heavy metals, fungal toxins and debris. Only purified resin belongs in a daily ritual, so hold any product you choose to three standards.',
    points: [
      'Third-party heavy metal testing on every batch',
      'Low-temperature purification that preserves fulvic acid',
      'Never raw or unpurified crude rock pitch',
    ],
    icon: ShieldCheck,
  },
]

export function ShilajitSafety() {
  return (
    <section
      aria-labelledby="shilajit-safety-heading"
      className="relative isolate overflow-hidden border-t border-fungi-ink/10 bg-fungi-void text-fungi-ink"
    >
      <MountainRidgeCanvas className="-z-20 opacity-55 md:opacity-90" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--color-fungi-void)_10%,transparent_75%)] opacity-80"
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-20 md:py-24">
        <header className="flex max-w-2xl flex-col gap-4">
          <span className="w-fit rounded-full border border-resin-amber/60 px-3 py-1 font-label text-xs uppercase tracking-[0.22em] text-fungi-ink shadow-[0_0_18px_-4px_var(--color-resin-amber)]">
            Shilajit
          </span>
          <h2
            id="shilajit-safety-heading"
            className="font-serif text-3xl font-light uppercase leading-tight tracking-[0.12em] text-balance md:text-4xl"
          >
            The safety, potency, and biology of authentic shilajit
          </h2>
          <p className="leading-relaxed text-fungi-ink/85 text-pretty">
            A resin pressed out of the mountains over centuries. Here is where
            it comes from, how it works inside the cell, and how to separate a
            purified resin from risky raw rock pitch.
          </p>
        </header>

        <ul className="grid gap-5 md:grid-cols-2">
          {pillars.map((pillar) => (
            <li
              key={pillar.tag}
              className="flex flex-col gap-5 rounded-2xl border border-fungi-ink/15 bg-fungi-void/80 p-7 text-fungi-ink md:bg-fungi-void/55 md:p-8 md:backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full border border-resin-amber/40 bg-resin-deep px-3 py-1 font-label text-xs uppercase tracking-[0.18em] text-fungi-ink">
                  {pillar.tag}
                </span>
                <span className="flex size-10 items-center justify-center rounded-full bg-resin-deep ring-1 ring-resin-amber/30">
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
                      className="mt-[0.55em] size-1.5 shrink-0 rotate-45 bg-resin-amber shadow-[0_0_8px_var(--color-resin-amber)]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="text-sm leading-relaxed text-fungi-ink/70">
          Educational information only, not medical advice. Speak with a
          qualified practitioner before starting shilajit, especially if you
          are pregnant, nursing, managing a health condition or taking
          medication.
        </p>
      </div>
    </section>
  )
}
