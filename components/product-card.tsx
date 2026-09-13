'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ExternalLink, Sprout } from 'lucide-react'
import type { Product } from '@/lib/products'
import { Button, buttonVariants } from '@/components/ui/button'
import { CacaoCarousel } from '@/components/cacao-carousel'
import { cn } from '@/lib/utils'

export function ProductCard({ product }: { product: Product }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-primary/20 bg-secondary/35 shadow-2xl backdrop-blur-md transition-colors hover:border-primary/40">
      <div className="relative aspect-square overflow-hidden">
        {product.gallery && product.gallery.length > 0 ? (
          <CacaoCarousel slides={product.gallery} />
        ) : (
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="eyebrow absolute left-3 top-3 z-20 rounded-full bg-background/80 px-3 py-1 text-primary backdrop-blur-sm">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="botanical-name text-sm">{product.tagline}</p>
        <h3 className="mt-1.5 font-serif text-2xl font-medium leading-snug tracking-[0.01em] text-card-foreground">
          {product.name}
        </h3>
        <p className="mt-3 leading-relaxed text-muted-foreground/85">
          {product.description}
        </p>

        <ul className="mt-5 space-y-2.5">
          {product.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3">
              <span className="lux-marker" aria-hidden="true" />
              <span className="leading-relaxed text-foreground/90">
                {benefit}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex-1" />

        {revealed ? (
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={cn(
              buttonVariants({ variant: 'secondary' }),
              'w-full gap-2 rounded-full',
            )}
          >
            Visit {product.name.split(' ')[0]}
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        ) : (
          <Button
            type="button"
            onClick={() => setRevealed(true)}
            className="w-full gap-2 rounded-full"
          >
            <Sprout className="size-4" aria-hidden="true" />
            Reveal the link
          </Button>
        )}
      </div>
    </article>
  )
}
