'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Depth = 0 | 1
type Pod = {
  x: number
  y: number
  angle: number
  size: number
  depth: Depth
  phase: number
  speed: number
  driftPhase: number
}
type Link = { from: number; to: number; bend: number }

const MAX_DPR = 1.5
const POD_COUNT = 16
const EMERALD = '0,255,136'
const GOLD = '255,215,0'
const AMBER = '255,170,0'
const LAYER_ALPHA: Record<Depth, number> = { 0: 0.3, 1: 0.8 }
const LAYER_WIDTH: Record<Depth, number> = { 0: 1.5, 1: 2 }

function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function seedConstellation() {
  const random = createRandom(7741)
  const cols = 4
  const rows = Math.ceil(POD_COUNT / cols)
  const pods: Pod[] = Array.from({ length: POD_COUNT }, (_, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    return {
      x: (col + 0.2 + random() * 0.6) / cols,
      y: (row + 0.2 + random() * 0.6) / rows,
      angle: (random() - 0.5) * 1.4,
      size: 0.8 + random() * 0.5,
      depth: random() < 0.55 ? 1 : 0,
      phase: random() * Math.PI * 2,
      speed: 0.0006 + random() * 0.0006,
      driftPhase: random() * Math.PI * 2,
    }
  })

  const links: Link[] = []
  const seen = new Set<string>()
  pods.forEach((pod, i) => {
    const nearest = pods
      .map((other, j) => ({ j, d: Math.hypot(other.x - pod.x, other.y - pod.y) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key)) continue
      seen.add(key)
      links.push({ from: i, to: j, bend: (random() - 0.5) * 0.5 })
    }
  })

  return { pods, links }
}

function createGlowSprite() {
  const size = 96
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const ctx = sprite.getContext('2d')
  if (!ctx) return sprite
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, `rgba(${GOLD},0.9)`)
  gradient.addColorStop(0.3, `rgba(${AMBER},0.35)`)
  gradient.addColorStop(0.65, `rgba(${AMBER},0.08)`)
  gradient.addColorStop(1, `rgba(${AMBER},0)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return sprite
}

export function CacaoCanopyCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const { pods, links } = seedConstellation()
    const glow = createGlowSprite()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let unit = 1
    let frame = 0
    let visible = true

    const position = (pod: Pod, time: number) => {
      const t = reducedMotion ? 0 : time * 0.00018
      return {
        x: pod.x * width + Math.sin(t + pod.driftPhase) * 10 * unit,
        y: pod.y * height + Math.cos(t * 0.8 + pod.driftPhase) * 8 * unit,
      }
    }

    const glowStroke = (rgb: string, alpha: number, lineWidth: number) => {
      ctx.strokeStyle = `rgba(${rgb},${alpha * 0.16})`
      ctx.lineWidth = lineWidth * 3.5
      ctx.stroke()
      ctx.strokeStyle = `rgba(${rgb},${alpha})`
      ctx.lineWidth = lineWidth
      ctx.stroke()
    }

    const drawLinks = (depth: Depth, time: number) => {
      const alpha = LAYER_ALPHA[depth] * 0.55
      for (const link of links) {
        const a = pods[link.from]
        const b = pods[link.to]
        if (Math.max(a.depth, b.depth) !== depth) continue
        const pa = position(a, time)
        const pb = position(b, time)
        const mx = (pa.x + pb.x) / 2 - (pb.y - pa.y) * link.bend
        const my = (pa.y + pb.y) / 2 + (pb.x - pa.x) * link.bend
        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.quadraticCurveTo(mx, my, pb.x, pb.y)
        glowStroke(EMERALD, alpha, LAYER_WIDTH[depth] * 0.75)
      }
    }

    const drawPod = (pod: Pod, time: number) => {
      const { x, y } = position(pod, time)
      const breath = reducedMotion ? 0.5 : (Math.sin(time * pod.speed + pod.phase) + 1) / 2
      const alpha = LAYER_ALPHA[pod.depth]
      const line = LAYER_WIDTH[pod.depth]
      const length = (pod.depth === 1 ? 34 : 24) * pod.size * unit * (1 + breath * 0.06)
      const girth = length * 0.42

      const halo = length * (1.4 + breath * 0.9)
      ctx.globalAlpha = alpha * (0.35 + breath * 0.45)
      ctx.drawImage(glow, x - halo, y - halo, halo * 2, halo * 2)
      ctx.globalAlpha = 1

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(pod.angle)

      ctx.beginPath()
      ctx.moveTo(0, -length)
      ctx.bezierCurveTo(girth * 1.3, -length * 0.55, girth * 1.3, length * 0.55, 0, length)
      ctx.bezierCurveTo(-girth * 1.3, length * 0.55, -girth * 1.3, -length * 0.55, 0, -length)
      ctx.closePath()
      ctx.fillStyle = 'rgba(0,0,0,0.85)'
      ctx.fill()
      glowStroke(GOLD, alpha * (0.7 + breath * 0.3), line)

      for (const offset of [-0.45, 0, 0.45]) {
        ctx.beginPath()
        ctx.moveTo(0, -length * 0.82)
        ctx.quadraticCurveTo(girth * offset * 1.6, 0, 0, length * 0.82)
        ctx.strokeStyle = `rgba(${EMERALD},${alpha * 0.55})`
        ctx.lineWidth = line * 0.5
        ctx.stroke()
      }

      ctx.restore()

      const core = (2.2 + breath * 1.6) * unit * (pod.depth === 1 ? 1 : 0.7)
      ctx.beginPath()
      ctx.arc(x, y, core, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,240,180,${alpha * (0.7 + breath * 0.3)})`
      ctx.fill()
    }

    const draw = (time: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (const depth of [0, 1] as const) {
        drawLinks(depth, time)
        for (const pod of pods) if (pod.depth === depth) drawPod(pod, time)
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = rect.width
      height = rect.height
      unit = Math.max(0.7, Math.min(1.2, width / 1000))
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
    }

    const loop = (time: number) => {
      draw(time)
      if (visible) frame = requestAnimationFrame(loop)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      if (reducedMotion) draw(0)
      else frame = requestAnimationFrame(loop)
    }

    resize()
    start()

    const resizeObserver = new ResizeObserver(() => {
      resize()
      if (reducedMotion || !visible) draw(0)
    })
    resizeObserver.observe(canvas)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else cancelAnimationFrame(frame)
    })
    intersectionObserver.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 size-full', className)}
    />
  )
}
