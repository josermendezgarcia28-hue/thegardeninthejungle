import { FlaskConical, Scale, ScrollText, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Pillar = {
  tag: string
  title: string
  body: string
  points: string[]
  icon: LucideIcon
  tone: 'forest' | 'soil'
}

const pillars: Pillar[] = [
  {
    tag: 'Historical safety',
    title: 'Millennia of documented use',
    body: 'Reishi, cordyceps, lion’s mane and their kin have been prepared continuously for thousands of years in Traditional Chinese Medicine and Indigenous wellness traditions, with a remarkably clean record of tolerance.',
    points: [
      'Recorded in classical herbal texts as superior, daily-use tonics',
      'Passed down through generations of healers and households',
    ],
    icon: ScrollText,
    tone: 'forest',
  },
  {
    tag: 'Modern efficacy',
    title: 'Clinical extraction standards',
    body: 'Today’s research measures what tradition observed. Verified beta-glucan potency is the benchmark, and hot-water extraction breaks down tough chitin cell walls to release bioavailable polysaccharides.',
    points: [
      'Beta-glucan content verified, not just total polysaccharides',
      'Hot-water extraction preserves the compounds the body can use',
    ],
    icon: FlaskConical,
    tone: 'soil',
  },
  {
    tag: 'Adaptogenic balance',
    title: 'Modulate, never overstimulate',
    body: 'Functional mushrooms act as adaptogens: they help the immune and nervous systems return to balance rather than pushing them in one direction, which is what makes gentle daily supplementation possible.',
    points: [
      'Supports a calm, responsive immune system',
      'Steady nervous system support without a stimulant crash',
    ],
    icon: Scale,
    tone: 'soil',
  },
  {
    tag: 'Quality standard',
    title: 'What to look for in an extract',
    body: 'Not every mushroom product is the real thing. Many are mostly myceliated grain. Hold any extract you choose to three non-negotiables.',
    points: [
      '100% whole fruiting bodies',
      'Zero grain, starch or mycelium-on-grain fillers',
      'Independent third-party lab testing',
    ],
    icon: ShieldCheck,
    tone: 'forest',
  },
]

export function MushroomSafety() {
  return (
    <section
      aria-labelledby="mushroom-safety-heading"
      className="bg-fungi-paper text-fungi-forest"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-20 md:py-24">
        <header className="flex max-w-2xl flex-col gap-4">
          <span className="w-fit rounded-full border border-fungi-ember px-3 py-1 font-label text-xs uppercase tracking-[0.22em] text-fungi-ember">
            Functional mushrooms
          </span>
          <h2
            id="mushroom-safety-heading"
            className="font-serif text-3xl font-light uppercase leading-tight tracking-[0.12em] text-balance md:text-4xl"
          >
            The safety and efficacy of functional mushrooms
          </h2>
          <p className="leading-relaxed text-fungi-soil text-pretty">
            Ancient tradition and modern lab science arrive at the same place.
            Here is why these fungi have earned their place in a daily ritual,
            and how to tell a genuine extract from a filler-heavy imitation.
          </p>
        </header>

        <ul className="grid gap-5 md:grid-cols-2">
          {pillars.map((pillar) => (
            <li
              key={pillar.tag}
              className={cn(
                'flex flex-col gap-5 rounded-2xl border-t-4 border-fungi-ember p-7 text-fungi-ink md:p-8',
                pillar.tone === 'forest' ? 'bg-fungi-forest' : 'bg-fungi-soil',
              )}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-fungi-ember px-3 py-1 font-label text-xs uppercase tracking-[0.18em] text-fungi-ink">
                  {pillar.tag}
                </span>
                <pillar.icon
                  className="size-6 text-fungi-ink/80"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-serif text-2xl leading-snug text-balance">
                {pillar.title}
              </h3>
              <p className="leading-relaxed text-fungi-ink/85 text-pretty">
                {pillar.body}
              </p>
              <ul className="mt-auto flex flex-col gap-2.5 border-t border-fungi-ink/15 pt-5">
                {pillar.points.map((point) => (
                  <li key={point} className="flex gap-3 leading-relaxed">
                    <span
                      className="mt-[0.55em] size-1.5 shrink-0 rotate-45 bg-fungi-ember ring-1 ring-fungi-ink/60"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <p className="text-sm leading-relaxed text-fungi-soil/80">
          Educational information only, not medical advice. Speak with a
          qualified practitioner before starting any supplement, especially if
          you are pregnant, nursing or taking medication.
        </p>
      </div>
    </section>
  )
}
