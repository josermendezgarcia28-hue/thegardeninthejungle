import Link from 'next/link'
import { ArrowRight, Leaf, HeartPulse, Sparkles } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { AnimatedTitle } from '@/components/animated-title'
import { ProductCard } from '@/components/product-card'
import { products } from '@/lib/products'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const featured = products.slice(0, 3)

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

      {/* Featured products */}
      <section className="border-y border-primary/15 bg-secondary/20 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="eyebrow">Freshly picked</p>
              <h2 className="section-heading mt-2">From the garden</h2>
              <p className="mt-3 text-muted-foreground/85">
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
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border-2 border-purple-700/40 bg-[#241711] p-8 text-center shadow-[0_0_50px_-10px_rgba(147,51,234,0.35)] sm:p-14">
          <span className="mb-6 inline-block rounded-full border border-blue-500/50 bg-blue-950/80 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-blue-400">
            The Garden Philosophy
          </span>
          <h2 className="mx-auto mb-6 max-w-4xl bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-4xl font-black uppercase leading-none tracking-tight text-balance text-transparent sm:text-6xl md:text-7xl">
            Experience is the best teacher
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base font-medium text-stone-300 text-pretty sm:text-lg">
            What are you willing to learn? Wander the full collection and feel
            the true sensations that Nature has to offer.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-400 bg-orange-500 px-8 py-4 font-black uppercase tracking-wide text-stone-950 shadow-lg shadow-orange-950/60 transition-all hover:bg-orange-400"
          >
            Explore the collection
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
