'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Point = { x: number; y: number; phase: number }
type Hypha = { points: Point[]; width: number; alpha: number }
type Node = { x: number; y: number; phase: number; speed: number; size: number }

const MAX_DPR = 1.5
const DRIFT_PX = 6

function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function growNetwork() {
  const random = createRandom(7331)
  const hyphae: Hypha[] = []
  const nodes: Node[] = []

  const grow = (
    x: number,
    y: number,
    angle: number,
    length: number,
    depth: number,
  ) => {
    const steps = 10 + Math.floor(random() * 10)
    const stepSize = length / steps
    const points: Point[] = [{ x, y, phase: random() * Math.PI * 2 }]
    let cx = x
    let cy = y
    let heading = angle

    for (let i = 0; i < steps; i++) {
      heading += (random() - 0.5) * 0.5
      cx += Math.cos(heading) * stepSize
      cy += Math.sin(heading) * stepSize
      points.push({ x: cx, y: cy, phase: random() * Math.PI * 2 })

      if (depth < 4 && random() < 0.11) {
        const fork = heading + (random() < 0.5 ? -1 : 1) * (0.5 + random() * 0.7)
        grow(cx, cy, fork, length * (0.45 + random() * 0.25), depth + 1)
        if (random() < 0.6) {
          nodes.push({
            x: cx,
            y: cy,
            phase: random() * Math.PI * 2,
            speed: 0.0006 + random() * 0.0009,
            size: 0.6 + random() * 0.8,
          })
        }
      }
    }

    hyphae.push({
      points,
      width: Math.max(0.5, 1.6 - depth * 0.3),
      alpha: Math.max(0.08, 0.32 - depth * 0.06),
    })
  }

  const seeds = 9
  for (let i = 0; i < seeds; i++) {
    const side = i % 4
    const t = random()
    const start =
      side === 0
        ? { x: t, y: -0.05, a: Math.PI / 2 }
        : side === 1
          ? { x: 1.05, y: t, a: Math.PI }
          : side === 2
            ? { x: t, y: 1.05, a: -Math.PI / 2 }
            : { x: -0.05, y: t, a: 0 }
    grow(start.x, start.y, start.a + (random() - 0.5) * 0.8, 0.7 + random() * 0.4, 0)
  }

  return { hyphae, nodes }
}

function createHaloSprite() {
  const size = 64
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const ctx = sprite.getContext('2d')
  if (!ctx) return sprite
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.12, 'rgba(255,255,255,0.85)')
  gradient.addColorStop(0.35, 'rgba(255,240,230,0.25)')
  gradient.addColorStop(1, 'rgba(255,240,230,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return sprite
}

export function MyceliumCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const { hyphae, nodes } = growNetwork()
    const halo = createHaloSprite()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let frame = 0
    let visible = true

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const drift = time * 0.00035

      for (const hypha of hyphae) {
        ctx.beginPath()
        hypha.points.forEach((p, i) => {
          const x = p.x * width + Math.sin(drift + p.phase) * DRIFT_PX
          const y = p.y * height + Math.cos(drift * 0.8 + p.phase) * DRIFT_PX
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.strokeStyle = `rgba(255,255,255,${hypha.alpha})`
        ctx.lineWidth = hypha.width
        ctx.stroke()
      }

      for (const node of nodes) {
        const pulse = (Math.sin(time * node.speed + node.phase) + 1) / 2
        const radius = (10 + pulse * 18) * node.size
        const x = node.x * width + Math.sin(drift + node.phase) * DRIFT_PX
        const y = node.y * height + Math.cos(drift * 0.8 + node.phase) * DRIFT_PX
        ctx.globalAlpha = 0.25 + pulse * 0.6
        ctx.drawImage(halo, x - radius, y - radius, radius * 2, radius * 2)
      }
      ctx.globalAlpha = 1
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
