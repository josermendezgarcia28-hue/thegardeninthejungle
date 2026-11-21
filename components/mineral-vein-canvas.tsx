'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Point = { x: number; y: number; phase: number }
type Vein = { points: Point[]; width: number; alpha: number; dash: number; speed: number }
type Node = { x: number; y: number; phase: number; speed: number; size: number }

const MAX_DPR = 1.5
const DRIFT_PX = 5
const AMBER = '232,172,84'

function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function formFissures() {
  const random = createRandom(4219)
  const veins: Vein[] = []
  const nodes: Node[] = []

  const trace = (x: number, y: number, angle: number, length: number, depth: number) => {
    const steps = 14 + Math.floor(random() * 10)
    const stepSize = length / steps
    const points: Point[] = [{ x, y, phase: random() * Math.PI * 2 }]
    let cx = x
    let cy = y
    let heading = angle
    let curve = (random() - 0.5) * 0.08

    for (let i = 0; i < steps; i++) {
      curve += (random() - 0.5) * 0.06
      curve *= 0.9
      heading += curve
      cx += Math.cos(heading) * stepSize
      cy += Math.sin(heading) * stepSize
      points.push({ x: cx, y: cy, phase: random() * Math.PI * 2 })

      if (depth < 2 && random() < 0.08) {
        const fork = heading + (random() < 0.5 ? -1 : 1) * (0.35 + random() * 0.5)
        trace(cx, cy, fork, length * (0.3 + random() * 0.25), depth + 1)
      }
      if (random() < 0.05) {
        nodes.push({
          x: cx,
          y: cy,
          phase: random() * Math.PI * 2,
          speed: 0.0005 + random() * 0.0008,
          size: 0.7 + random() * 0.9 - depth * 0.2,
        })
      }
    }

    veins.push({
      points,
      width: Math.max(0.6, 2.2 - depth * 0.7),
      alpha: Math.max(0.12, 0.42 - depth * 0.12),
      dash: 40 + random() * 80,
      speed: 0.008 + random() * 0.012,
    })
  }

  const seeds = 7
  for (let i = 0; i < seeds; i++) {
    const fromLeft = i % 2 === 0
    const y = (i + 0.5) / seeds + (random() - 0.5) * 0.12
    trace(
      fromLeft ? -0.05 : 1.05,
      y,
      (fromLeft ? 0 : Math.PI) + (random() - 0.5) * 0.6,
      1.1 + random() * 0.3,
      0,
    )
  }

  return { veins, nodes }
}

function createGlowSprite() {
  const size = 64
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const ctx = sprite.getContext('2d')
  if (!ctx) return sprite
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,236,190,1)')
  gradient.addColorStop(0.14, `rgba(${AMBER},0.85)`)
  gradient.addColorStop(0.4, `rgba(${AMBER},0.22)`)
  gradient.addColorStop(1, `rgba(${AMBER},0)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return sprite
}

export function MineralVeinCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const { veins, nodes } = formFissures()
    const glow = createGlowSprite()
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

    const tracePath = (vein: Vein, drift: number) => {
      ctx.beginPath()
      vein.points.forEach((p, i) => {
        const x = p.x * width + Math.sin(drift + p.phase) * DRIFT_PX
        const y = p.y * height + Math.cos(drift * 0.7 + p.phase) * DRIFT_PX
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      const drift = time * 0.0003

      for (const vein of veins) {
        tracePath(vein, drift)
        ctx.setLineDash([])
        ctx.strokeStyle = `rgba(${AMBER},${vein.alpha * 0.25})`
        ctx.lineWidth = vein.width * 5
        ctx.stroke()
        ctx.strokeStyle = `rgba(${AMBER},${vein.alpha})`
        ctx.lineWidth = vein.width
        ctx.stroke()

        ctx.setLineDash([vein.dash, vein.dash * 2.5])
        ctx.lineDashOffset = -time * vein.speed
        ctx.strokeStyle = `rgba(255,226,170,${Math.min(1, vein.alpha * 1.6)})`
        ctx.lineWidth = vein.width * 1.2
        ctx.stroke()
      }
      ctx.setLineDash([])

      for (const node of nodes) {
        const pulse = (Math.sin(time * node.speed + node.phase) + 1) / 2
        const radius = (9 + pulse * 16) * Math.max(0.4, node.size)
        const x = node.x * width + Math.sin(drift + node.phase) * DRIFT_PX
        const y = node.y * height + Math.cos(drift * 0.7 + node.phase) * DRIFT_PX
        ctx.globalAlpha = 0.3 + pulse * 0.6
        ctx.drawImage(glow, x - radius, y - radius, radius * 2, radius * 2)
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
