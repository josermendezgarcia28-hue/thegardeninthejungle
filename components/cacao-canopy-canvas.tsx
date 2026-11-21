'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Depth = 0 | 1
type Trunk = {
  x: number
  lean: number
  wave: number
  base: number
  depth: Depth
  branches: { y: number; side: number; reach: number; lift: number; twig: number }[]
}
type Leaf = {
  x: number
  y: number
  length: number
  angle: number
  depth: Depth
}
type Pod = {
  trunk: number
  y: number
  side: number
  size: number
  phase: number
  speed: number
  shape: number[]
}

const MAX_DPR = 1.5
const EMERALD = '0,255,136'
const AMBER = '255,170,0'
const GOLD = '255,215,0'
const LAYER_ALPHA: Record<Depth, number> = { 0: 0.3, 1: 0.8 }
const LAYER_WIDTH: Record<Depth, number> = { 0: 1.5, 1: 2.25 }

function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function trunkX(trunk: Trunk, y: number) {
  return trunk.x + trunk.lean * (1 - y) + Math.sin(y * 4 + trunk.wave) * 0.012
}

function growForest() {
  const random = createRandom(31337)
  const layout: { x: number; depth: Depth }[] = [
    { x: 0.1, depth: 0 },
    { x: 0.33, depth: 0 },
    { x: 0.56, depth: 0 },
    { x: 0.86, depth: 0 },
    { x: 0.03, depth: 1 },
    { x: 0.24, depth: 1 },
    { x: 0.68, depth: 1 },
    { x: 0.95, depth: 1 },
  ]

  const trunks: Trunk[] = layout.map(({ x, depth }) => {
    const branchCount = 2 + Math.floor(random() * 2)
    return {
      x,
      depth,
      lean: (random() - 0.5) * 0.06,
      wave: random() * Math.PI * 2,
      base: depth === 1 ? 22 : 13,
      branches: Array.from({ length: branchCount }, (_, i) => ({
        y: 0.16 + (i / branchCount) * 0.32 + random() * 0.06,
        side: i % 2 === 0 ? -1 : 1,
        reach: 0.08 + random() * 0.07,
        lift: 0.06 + random() * 0.06,
        twig: 0.4 + random() * 0.3,
      })),
    }
  })

  const leaves: Leaf[] = []
  const addCluster = (cx: number, cy: number, count: number, spread: number, depth: Depth) => {
    for (let i = 0; i < count; i++) {
      leaves.push({
        x: cx + (random() - 0.5) * spread,
        y: cy + (random() - 0.5) * spread * 0.6,
        length: (depth === 1 ? 32 : 22) + random() * 34,
        angle: random() * Math.PI * 2,
        depth,
      })
    }
  }
  for (let i = 0; i < 16; i++) addCluster(random(), random() * 0.14, 6, 0.12, i % 3 === 0 ? 1 : 0)
  for (const trunk of trunks) {
    for (const branch of trunk.branches) {
      const tipX = trunkX(trunk, branch.y) + branch.side * branch.reach
      addCluster(tipX, branch.y - branch.lift, 7, 0.1, trunk.depth)
    }
  }

  const pods: Pod[] = []
  trunks.forEach((trunk, index) => {
    const count = trunk.depth === 1 ? 3 : 2
    for (let n = 0; n < count; n++) {
      const vertices = 6 + Math.floor(random() * 3)
      pods.push({
        trunk: index,
        y: 0.42 + ((n + random() * 0.7) / count) * 0.46,
        side: n % 2 === 0 ? 1 : -1,
        size: (trunk.depth === 1 ? 1 : 0.7) * (0.85 + random() * 0.3),
        phase: random() * Math.PI * 2,
        speed: 0.0006 + random() * 0.0006,
        shape: Array.from({ length: vertices }, () => 0.75 + random() * 0.3),
      })
    }
  })

  return { trunks, leaves, pods }
}

function createGlowSprite() {
  const size = 96
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const ctx = sprite.getContext('2d')
  if (!ctx) return sprite
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, `rgba(${AMBER},0.95)`)
  gradient.addColorStop(0.3, `rgba(${AMBER},0.4)`)
  gradient.addColorStop(0.6, `rgba(${AMBER},0.1)`)
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

    const { trunks, leaves, pods } = growForest()
    const glow = createGlowSprite()
    const forest = document.createElement('canvas')
    const forestCtx = forest.getContext('2d')
    if (!forestCtx) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let scale = 1
    let frame = 0
    let visible = true

    const trunkWidth = (trunk: Trunk, y: number) => trunk.base * scale * (0.55 + y * 0.45)

    const neonLine = (f: CanvasRenderingContext2D, rgb: string, alpha: number, lineWidth: number) => {
      f.strokeStyle = `rgba(${rgb},${alpha * 0.18})`
      f.lineWidth = lineWidth * 4
      f.stroke()
      f.strokeStyle = `rgba(${rgb},${alpha})`
      f.lineWidth = lineWidth
      f.stroke()
    }

    const traceTrunkEdge = (f: CanvasRenderingContext2D, trunk: Trunk, offset: number) => {
      const steps = 24
      f.beginPath()
      for (let s = 0; s <= steps; s++) {
        const y = -0.05 + (s / steps) * 1.1
        const x = trunkX(trunk, y) * width + trunkWidth(trunk, y) * offset
        if (s === 0) f.moveTo(x, y * height)
        else f.lineTo(x, y * height)
      }
    }

    const paintLayer = (f: CanvasRenderingContext2D, depth: Depth) => {
      const alpha = LAYER_ALPHA[depth]
      const line = LAYER_WIDTH[depth]

      for (const trunk of trunks) {
        if (trunk.depth !== depth) continue

        for (const branch of trunk.branches) {
          const sx = trunkX(trunk, branch.y) * width
          const sy = branch.y * height
          const ex = sx + branch.side * branch.reach * width
          const ey = (branch.y - branch.lift) * height
          const mx = (sx + ex) / 2
          f.beginPath()
          f.moveTo(sx, sy)
          f.quadraticCurveTo(mx, sy, ex, ey)
          const tx = sx + (ex - sx) * branch.twig
          const ty = sy + (ey - sy) * branch.twig * branch.twig
          f.moveTo(tx, ty)
          f.lineTo(tx + branch.side * branch.reach * width * 0.35, ty - branch.lift * height * 0.9)
          neonLine(f, EMERALD, alpha, line * 0.8)
        }

        traceTrunkEdge(f, trunk, -0.5)
        for (let s = 24; s >= 0; s--) {
          const y = -0.05 + (s / 24) * 1.1
          f.lineTo(trunkX(trunk, y) * width + trunkWidth(trunk, y) / 2, y * height)
        }
        f.closePath()
        f.fillStyle = 'rgb(0,0,0)'
        f.fill()

        traceTrunkEdge(f, trunk, -0.5)
        neonLine(f, AMBER, alpha, line)
        traceTrunkEdge(f, trunk, 0.5)
        neonLine(f, AMBER, alpha, line)
        traceTrunkEdge(f, trunk, -0.1)
        neonLine(f, GOLD, alpha * 0.35, line * 0.4)
      }

      for (const leaf of leaves) {
        if (leaf.depth !== depth) continue
        const length = leaf.length * scale
        f.save()
        f.translate(leaf.x * width, leaf.y * height)
        f.rotate(leaf.angle)
        f.beginPath()
        f.moveTo(-length / 2, 0)
        f.quadraticCurveTo(0, -length / 4, length / 2, 0)
        f.quadraticCurveTo(0, length / 4, -length / 2, 0)
        f.closePath()
        f.fillStyle = 'rgb(0,0,0)'
        f.fill()
        neonLine(f, EMERALD, alpha, line * 0.6)
        f.beginPath()
        f.moveTo(-length / 2, 0)
        f.lineTo(length * 0.42, 0)
        f.strokeStyle = `rgba(${EMERALD},${alpha * 0.6})`
        f.lineWidth = line * 0.35
        f.stroke()
        f.restore()
      }
    }

    const paintForest = () => {
      forest.width = canvas.width
      forest.height = canvas.height
      const f = forestCtx
      f.setTransform(dpr, 0, 0, dpr, 0, 0)
      f.lineCap = 'round'
      f.lineJoin = 'round'
      f.fillStyle = 'rgb(0,0,0)'
      f.fillRect(0, 0, width, height)

      const reach = Math.max(width, height)
      const backGlow = f.createRadialGradient(width * 0.7, height * 0.2, 0, width * 0.7, height * 0.2, reach * 0.55)
      backGlow.addColorStop(0, `rgba(${EMERALD},0.07)`)
      backGlow.addColorStop(1, `rgba(${EMERALD},0)`)
      f.fillStyle = backGlow
      f.fillRect(0, 0, width, height)

      paintLayer(f, 0)
      paintLayer(f, 1)
    }

    const drawPod = (pod: Pod, time: number) => {
      const trunk = trunks[pod.trunk]
      const breath = reducedMotion ? 0.5 : (Math.sin(time * pod.speed + pod.phase) + 1) / 2
      const depthAlpha = trunk.depth === 1 ? 1 : 0.45
      const unit = Math.min(width, 900) / 900
      const radius = (8 + breath * 2.4) * pod.size * Math.max(0.8, unit * 1.4)
      const ax = trunkX(trunk, pod.y) * width + pod.side * trunkWidth(trunk, pod.y) * 0.5
      const ay = pod.y * height
      const x = ax + pod.side * radius * 0.6
      const y = ay + radius * 1.6

      ctx.globalAlpha = depthAlpha
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(x, y - radius * 1.2)
      ctx.strokeStyle = `rgba(${AMBER},0.7)`
      ctx.lineWidth = 1.2
      ctx.stroke()

      const halo = radius * (5 + breath * 4)
      ctx.globalAlpha = depthAlpha * (0.45 + breath * 0.4)
      ctx.drawImage(glow, x - halo, y - halo, halo * 2, halo * 2)
      ctx.globalAlpha = depthAlpha

      ctx.beginPath()
      pod.shape.forEach((r, i) => {
        const angle = (i / pod.shape.length) * Math.PI * 2 - Math.PI / 2
        const px = x + Math.cos(angle) * radius * r * 0.75
        const py = y + Math.sin(angle) * radius * r * 1.25
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.closePath()
      const fill = ctx.createRadialGradient(x - radius * 0.25, y - radius * 0.4, 0, x, y, radius * 1.3)
      fill.addColorStop(0, `rgba(255,236,170,${0.75 + breath * 0.25})`)
      fill.addColorStop(0.5, `rgba(${AMBER},${0.6 + breath * 0.3})`)
      fill.addColorStop(1, 'rgba(46,26,0,0.95)')
      ctx.fillStyle = fill
      ctx.fill()
      ctx.strokeStyle = `rgba(${GOLD},${0.6 + breath * 0.4})`
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.globalAlpha = 1
    }

    const draw = (time: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(forest, 0, 0)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const pod of pods) if (trunks[pod.trunk].depth === 0) drawPod(pod, time)
      for (const pod of pods) if (trunks[pod.trunk].depth === 1) drawPod(pod, time)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = rect.width
      height = rect.height
      scale = Math.max(0.65, Math.min(1.25, width / 1000))
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      paintForest()
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
