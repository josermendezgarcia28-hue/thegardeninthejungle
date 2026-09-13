'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

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

export function SiteBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = parallaxRef.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        // Gentle depth drift, capped so no edges are ever revealed.
        const offset = Math.min(window.scrollY * 0.12, 60)
        el.style.transform = `translate3d(0, ${offset}px, 0)`
        raf = 0
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Full-page botanical background */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
        aria-hidden="true"
      >
        {/* Animated turbulence/displacement filter for the melting DMT morph */}
        <svg className="dmt-defs">
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

        <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
          <div className="dmt-warp">
            <Image
              src="/images/hero-tribal-botanical.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="ken-burns object-cover"
            />
          </div>
        </div>

        {/* Blast-off portal: sacred-geometry filaments radiating from center */}
        <div className="dmt-portal" />

        {/* Atmospheric drifting pollen / spores */}
        <div className="pollen-layer">
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
      </div>

      {/* Atmospheric readability vignette */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(to bottom, rgba(12,20,15,0.75) 0%, rgba(9,15,12,0.88) 50%, rgba(7,12,10,0.94) 100%)',
        }}
      />
    </>
  )
}
