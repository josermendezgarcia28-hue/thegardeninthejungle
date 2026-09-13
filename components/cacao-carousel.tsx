'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CarouselSlide = {
  src: string
  caption?: string
  title?: string
  subtext?: string
  badge?: string
  href?: string
}

export function CacaoCarousel({
  slides,
  className,
  autoPlayMs = 5000,
  badgeLabel = 'Tree to Cup',
  ariaLabel = 'Product gallery',
  onActiveChange,
}: {
  slides: CarouselSlide[]
  className?: string
  autoPlayMs?: number
  badgeLabel?: string
  ariaLabel?: string
  onActiveChange?: (index: number) => void
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length
  const active = slides[index]

  const go = useCallback(
    (next: number) => setIndex((prev) => (next + count) % count),
    [count],
  )

  useEffect(() => {
    onActiveChange?.(index)
  }, [index, onActiveChange])

  const prefersReduced = useRef(false)
  useEffect(() => {
    prefersReduced.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
  }, [])

  useEffect(() => {
    if (paused || prefersReduced.current || count <= 1) return
    const id = window.setInterval(
      () => setIndex((prev) => (prev + 1) % count),
      autoPlayMs,
    )
    return () => window.clearInterval(id)
  }, [paused, count, autoPlayMs])

  return (
    <div
      className={cn('relative aspect-square overflow-hidden', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-out',
            i === index ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src || '/placeholder.svg'}
            alt={slide.caption}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Legibility gradient for the caption */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-background/95 via-background/55 to-transparent" />

      {active?.badge ? (
        /* Species pill (top-right) */
        <span className="eyebrow absolute right-3 top-3 z-20 max-w-[75%] rounded-full bg-background/75 px-3 py-1 text-right text-primary shadow-lg backdrop-blur-md">
          {`${badgeLabel} ${index + 1} of ${count}: ${active.badge}`}
        </span>
      ) : (
        /* Step badge (bottom-left) */
        <span className="eyebrow absolute left-3 bottom-3 z-10 rounded-full bg-background/55 px-3 py-1 text-primary shadow-lg backdrop-blur-md">
          {`${badgeLabel}: Step ${index + 1} of ${count}`}
        </span>
      )}

      {/* Caption / rich title block */}
      {active?.title ? (
        <div className="absolute inset-x-4 bottom-11 z-10">
          <p className="font-serif text-base font-medium leading-snug text-foreground drop-shadow">
            {active.title}
          </p>
          <p className="mt-1 text-pretty text-xs leading-snug text-foreground/80 drop-shadow">
            {active.subtext}
          </p>
        </div>
      ) : (
        <p className="absolute inset-x-4 bottom-12 z-10 text-pretty text-sm leading-snug text-foreground/95 drop-shadow">
          {active?.caption}
        </p>
      )}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-primary/25 bg-background/40 text-foreground/90 backdrop-blur-md transition-colors hover:bg-background/70 hover:text-primary"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-primary/25 bg-background/40 text-foreground/90 backdrop-blur-md transition-colors hover:bg-background/70 hover:text-primary"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>

          {/* Pagination dots */}
          <div className="absolute right-3 bottom-4 z-10 flex items-center justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  'size-1.5 rounded-full transition-all',
                  i === index
                    ? 'w-4 bg-primary'
                    : 'bg-foreground/40 hover:bg-foreground/70',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
