'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export type CarouselSlide = {
  src: string
  caption: string
}

export function CacaoCarousel({
  slides,
  className,
  autoPlayMs = 5000,
}: {
  slides: CarouselSlide[]
  className?: string
  autoPlayMs?: number
}) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const count = slides.length

  const go = useCallback(
    (next: number) => setIndex((prev) => (next + count) % count),
    [count],
  )

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
      aria-label="Ceremonial cacao, from tree to cup"
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
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background/95 via-background/50 to-transparent" />

      {/* Tree to Cup step badge */}
      <span className="eyebrow absolute left-3 bottom-3 z-10 rounded-full bg-background/55 px-3 py-1 text-primary shadow-lg backdrop-blur-md">
        {`Tree to Cup: Step ${index + 1} of ${count}`}
      </span>

      {/* Caption */}
      <p className="absolute inset-x-4 bottom-12 z-10 text-pretty text-sm leading-snug text-foreground/95 drop-shadow">
        {slides[index]?.caption}
      </p>

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
