import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Leaf, HeartPulse, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { AnimatedTitle } from '@/components/animated-title'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/products'
import { cn } from '@/lib/utils'

const pollen = [
  { left: '6%', size: '7px', duration: '17s', delay: '0s' },
  { left: '14%', size: '4px', duration: '22s', delay: '3s' },
  { left: '22%', size: '9px', duration: '19s', delay: '6s' },
  { left: '31%', size: '5px', duration: '24s', delay: '1s' },
  { left: '39%', size: '6px', duration: '20s', delay: '8s' },
  { left: '48%', size: '3px', duration: '26s', delay: '4s' },
  { left: '55%', size: '8px', duration: '18s', delay: '10s' },
  { left: '63%', size: '5px', duration: '23s', delay: '2s' },
  { left: '71%', size: '6px', duration: '21s', delay: '7s' },
  { left: '79%', size: '4px', duration: '25s', delay: '5s' },
  { left: '86%', size: '9px', duration: '19s', delay: '11s' },
  { left: '93%', size: '5px', duration: '22s', delay: '9s' },
]

export default function HomePage() {
  const featured = products.slice(0, 3)

  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        {/* Animated turbulence/displacement filter for the melting DMT morph */}
        <svg className="dmt-defs" aria-hidden="true">
          <filter id="dmt-warp">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.012"
              numOctaves={2}
              seed={7}
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="24s"
                values="0.008 0.012;0.017 0.021;0.008 0.012"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={22}
              xChannelSelector="R"
              yChannelSelector="G"
            >
              <animate
                attributeName="scale"
                dur="12s"
                values="14;40;14"
                repeatCount="indefinite"
              />
            </feDisplacementMap>
          </filter>
        </svg>

        <div className="dmt-warp" aria-hidden="true">
          <Image
            src="/images/hero-tribal-botanical.png"
            alt="Indigenous tribal botanical illustration of Mondia Whitei, passionflower and cacao blooms in a misty jungle"
            fill
            priority
            sizes="100vw"
            className="ken-burns object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/75 via-background/45 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/55 to-transparent" />

        {/* Blast-off portal: sacred-geometry filaments radiating from center */}
        <div className="dmt-portal" aria-hidden="true" />

        {/* Atmospheric drifting pollen / spores */}
        <div className="pollen-layer" aria-hidden="true">
          {pollen.map((p, i) => (
            <span
              key={i}
              className="pollen"
              style={{
                left: p.left,
                width: p.size,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-5 py-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-4 py-1.5 text-xs tracking-widest text-primary uppercase backdrop-blur-sm">
              <Leaf className="size-3.5" aria-hidden="true" />
              Experience nature, experience vitality
            </span>
            <AnimatedTitle
              text="The Garden in the Jungle"
              className="mt-6 font-display text-4xl leading-[1.15] sm:text-5xl md:text-6xl"
            />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/85 text-pretty">
              A place where plants and people come together. Explore the most
              exotic substances on the planet — brought to you by trusted
              affiliates — and awaken your genetic superpowers by tapping back
              into your roots.
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
              <h2 className="mt-5 font-serif text-xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="font-serif text-sm italic text-primary">
                Freshly picked
              </p>
              <h2 className="mt-1 font-serif text-3xl md:text-4xl">
                From the garden
              </h2>
              <p className="mt-3 text-muted-foreground">
                Foods so well made by nature they are more than a supplement.
                Reveal a link whenever you&apos;re ready to explore.
              </p>
            </div>
            <Link
              href="/products"
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'gap-2 text-primary',
              )}
            >
              See all
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-24 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-tight text-balance md:text-4xl">
          Experience is the best teacher
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground text-pretty">
          What are you willing to learn? Wander the full collection and feel the
          true sensations that Nature has to offer.
        </p>
        <Link
          href="/products"
          className={cn(
            buttonVariants({ size: 'lg' }),
            'mt-8 inline-flex gap-2 rounded-full',
          )}
        >
          Explore the collection
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </section>
    </main>
  )
}
