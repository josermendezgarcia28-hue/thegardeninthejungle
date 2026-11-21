import Link from 'next/link'
import { ArrowRight, Leaf, HeartPulse, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { AnimatedTitle } from '@/components/animated-title'
import {
  ReishiMushroom,
  CordycepsSprout,
  LionsManeFungus,
} from '@/components/hero-fungi'
import { ExperienceCta } from '@/components/experience-cta'
import { ProductCard } from '@/components/product-card'
import { CacaoSafety } from '@/components/cacao-safety'
import { MushroomSafety } from '@/components/mushroom-safety'
import { ShilajitSafety } from '@/components/shilajit-safety'
import { products } from '@/lib/products'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const featured = products.filter((product) => product.slug === 'cacao')

  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[82vh] items-center">
        <div className="relative mx-auto w-full max-w-6xl px-5 py-24">
          <div className="max-w-2xl">
            <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-4 py-1.5 backdrop-blur-sm">
              <Leaf className="size-3.5" aria-hidden="true" />
              Experience nature, experience vitality
            </span>
            <AnimatedTitle
              text="The Garden in the Jungle"
              className="mt-6 font-display text-4xl leading-[1.15] sm:text-5xl md:text-6xl"
              decorations={{
                0: <ReishiMushroom />,
                2: <CordycepsSprout />,
                4: <LionsManeFungus />,
              }}
              wordOverrides={{ 2: 'ın' }}
            />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/85 text-pretty">
              A place where plants and people come together. Scavenge through
              natural substances suitable for human health and awaken your
              genetic superpowers by tapping back into your roots.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/products"
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'gap-2 rounded-full',
                )}
              >
                Explore the collection
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/about"
                className={cn(
                  buttonVariants({ size: 'lg', variant: 'outline' }),
                  'rounded-full border-border/70 bg-background/30 backdrop-blur-sm',
                )}
              >
                My story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro / value props */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              icon: Leaf,
              title: 'Natural sustenance',
              body: 'Fungi, algae and plants carry chemical compounds with real, measurable effects on the human body.',
            },
            {
              icon: HeartPulse,
              title: 'Resilience over toxins',
              body: 'Herbs help the body adapt to stress, uplift mood, sharpen focus and build immunity against a demanding world.',
            },
            {
              icon: Sparkles,
              title: 'Ethical affiliates',
              body: 'Partnered with reputable brands focused on sustainability, ethical sourcing and genuine education.',
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col">
              <span className="flex size-12 items-center justify-center rounded-full bg-secondary/25 text-primary">
                <item.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="section-heading mt-5 text-lg md:text-xl">
                {item.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground/85">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CacaoSafety featured={featured} />

<ShilajitSafety />

<MushroomSafety />

      {/* CTA */}
      <ExperienceCta />
    </main>
  )
}
