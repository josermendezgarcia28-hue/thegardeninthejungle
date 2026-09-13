import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Leaf } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'About — The Garden in the Jungle',
  description:
    'The story behind The Garden in the Jungle — a personal, plant-loving approach to sharing nature-backed wellness.',
}

export default function AboutPage() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-4 py-1.5">
            <Leaf className="size-3.5" aria-hidden="true" />
            Our story
          </span>
          <h1 className="mt-6 font-serif text-4xl font-light leading-tight text-balance md:text-5xl">
            Why you should care about health
          </h1>
          <div className="mt-6 space-y-4 text-muted-foreground/85 leading-relaxed">
            <p>
              In the modern world we are bombarded every waking day with toxins
              and chemicals that damage our body, mind and spirit. As
              individuals, we can take matters into our own hands to diminish
              that damage — and one of the easiest, most convenient ways is to
              supplement.
            </p>
            <p>
              Natural substances help us become resilient to the environmental
              factors working against us. Herbs can help the body adapt to
              stress, uplift mood, regain focus, build immunity and even help us
              overcome certain conditions. They have played a vital part in
              human development since the very beginning — so why would we stop
              developing now?
            </p>
            <p className="font-serif text-foreground italic">
              It is difficult to smile with a stomach ache — happiness does come
              from the inside.
            </p>
          </div>
        </div>

        <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-border/60">
          <Image
            src="/images/about-botanical.png"
            alt="A flat lay of natural wellness ingredients, herbs and roots on dark stone"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-y border-primary/15 bg-secondary/20 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="section-heading">What this garden grows on</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Trusted affiliates',
                body: 'We partner with reputable brands that focus on sustainability, ethical sourcing, education and Mother Earth herself.',
              },
              {
                title: 'Nature as medicine',
                body: 'Herbs have been valued for their flavor, fragrance, medicinal qualities and healthful properties for many, many years.',
              },
              {
                title: 'Applicable knowledge',
                body: 'Each remedy comes with the real benefits behind it. Used inappropriately, herbs can have adverse effects — so we share honestly.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="section-heading text-lg md:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted-foreground/85">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-4xl font-light leading-tight text-balance md:text-5xl">
          Awaken your genetic superpowers
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground/85 text-pretty">
          Tap back into your roots. Explore the vast array of exotic and
          commonly known plant remedies waiting in the garden.
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
