'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Trunk = {
  x: number
  lean: number
  wave: number
  base: number
  depth: number
  branches: { y: number; side: number; reach: number; lift: number }[]
}
type Pod = {
  trunk: number
  y: number
  side: number
  size: number
  phase: number
  speed: number
}
type Leaf = {
  x: number
  y: number
  length: number
  angle: number
  shade: number
}

const MAX_DPR = 1.5
const VOID = '5,5,5'
const EMERALD = '0,255,136'
const CYBER = '16,185,129'
const AMBER = [255, 170, 0]
const GOLD = [255, 215, 0]
const FLARE = '255,119,0'
const ULTRAVIOLET = '112,40,210'

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
  const layout = [
    { x: 0.04, depth: 0 },
    { x: 0.22, depth: 1 },
    { x: 0.42, depth: 0 },
    { x: 0.63, depth: 1 },
    { x: 0.8, depth: 0 },
    { x: 0.96, depth: 1 },
  ]

  const trunks: Trunk[] = layout.map(({ x, depth }) => {
    const branchCount = 2 + Math.floor(random() * 2)
    return {
      x,
      depth,
      lean: (random() - 0.5) * 0.06,
      wave: random() * Math.PI * 2,
      base: depth === 1 ? 26 : 16,
      branches: Array.from({ length: branchCount }, (_, i) => ({
        y: 0.16 + (i / branchCount) * 0.32 + random() * 0.06,
        side: i % 2 === 0 ? -1 : 1,
        reach: 0.08 + random() * 0.07,
        lift: 0.06 + random() * 0.06,
      })),
    }
  })

  const leaves: Leaf[] = []
  const addCluster = (cx: number, cy: number, count: number, spread: number) => {
    for (let i = 0; i < count; i++) {
      leaves.push({
        x: cx + (random() - 0.5) * spread,
        y: cy + (random() - 0.5) * spread * 0.6,
        length: 26 + random() * 46,
        angle: random() * Math.PI * 2,
        shade: random(),
      })
    }
  }
  for (let i = 0; i < 22; i++) addCluster(random(), random() * 0.14, 8, 0.12)
  for (const trunk of trunks) {
    for (const branch of trunk.branches) {
      const tipX = trunkX(trunk, branch.y) + branch.side * branch.reach
      addCluster(tipX, branch.y - branch.lift, 9, 0.1)
    }
  }
  leaves.sort((a, b) => a.shade - b.shade)

  const pods: Pod[] = []
  trunks.forEach((trunk, index) => {
    const count = trunk.depth === 1 ? 3 : 2
    for (let n = 0; n < count; n++) {
      pods.push({
        trunk: index,
        y: 0.42 + ((n + random() * 0.7) / count) * 0.48,
        side: n % 2 === 0 ? 1 : -1,
        size: (trunk.depth === 1 ? 1 : 0.75) * (0.85 + random() * 0.3),
        phase: random() * Math.PI * 2,
        speed: 0.0006 + random() * 0.0005,
      })
    }
  })

  return { trunks, leaves, pods }
}

function createGlowSprite(rgb: string, stops: [number, number][]) {
  const size = 128
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const ctx = sprite.getContext('2d')
  if (!ctx) return sprite
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  for (const [offset, alpha] of stops) gradient.addColorStop(offset, `rgba(${rgb},${alpha})`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return sprite
}

function mixRgb(from: number[], to: number[], t: number) {
  return from.map((value, i) => Math.round(value + (to[i] - value) * t)).join(',')
}

export function CacaoCanopyCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const { trunks, leaves, pods } = growForest()
    const flareHalo = createGlowSprite(FLARE, [
      [0, 0.55],
      [0.35, 0.22],
      [0.7, 0.06],
      [1, 0],
    ])
    const amberHalo = createGlowSprite(AMBER.join(','), [
      [0, 0.95],
      [0.25, 0.5],
      [0.6, 0.12],
      [1, 0],
    ])
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

    const paintForest = () => {
      forest.width = canvas.width
      forest.height = canvas.height
      const f = forestCtx
      f.setTransform(dpr, 0, 0, dpr, 0, 0)
      f.lineCap = 'round'
      f.lineJoin = 'round'
      f.fillStyle = `rgb(${VOID})`
      f.fillRect(0, 0, width, height)

      const reach = Math.max(width, height)
      for (const [cx, cy, radius, alpha] of [
        [0.72, 0.18, 0.65, 0.32],
        [0.18, 0.4, 0.5, 0.2],
      ]) {
        const glow = f.createRadialGradient(width * cx, height * cy, 0, width * cx, height * cy, reach * radius)
        glow.addColorStop(0, `rgba(${ULTRAVIOLET},${alpha})`)
        glow.addColorStop(0.5, `rgba(${ULTRAVIOLET},${alpha * 0.35})`)
        glow.addColorStop(1, `rgba(${ULTRAVIOLET},0)`)
        f.fillStyle = glow
        f.fillRect(0, 0, width, height)
      }

      const neonStroke = (rgb: string, alpha: number, lineWidth: number, blur: number) => {
        f.strokeStyle = `rgba(${rgb},${alpha})`
        f.lineWidth = lineWidth
        f.shadowColor = `rgba(${rgb},${Math.min(1, alpha + 0.2)})`
        f.shadowBlur = blur * dpr
        f.stroke()
      }

      for (const depth of [0, 1]) {
        const alpha = depth === 1 ? 0.85 : 0.45
        for (const trunk of trunks) {
          if (trunk.depth !== depth) continue

          for (const branch of trunk.branches) {
            const sx = trunkX(trunk, branch.y) * width
            const sy = branch.y * height
            const ex = sx + branch.side * branch.reach * width
            const ey = (branch.y - branch.lift) * height
            f.beginPath()
            f.moveTo(sx, sy)
            f.quadraticCurveTo((sx + ex) / 2, sy, ex, ey)
            f.shadowBlur = 0
            f.strokeStyle = 'rgba(22,12,4,0.95)'
            f.lineWidth = trunkWidth(trunk, branch.y) * 0.32
            f.stroke()
            neonStroke(AMBER.join(','), alpha * 0.9, 1.4, 10)
          }

          const steps = 24
          f.beginPath()
          for (let s = 0; s <= steps; s++) {
            const y = -0.05 + (s / steps) * 1.1
            const x = trunkX(trunk, y) * width - trunkWidth(trunk, y) / 2
            if (s === 0) f.moveTo(x, y * height)
            else f.lineTo(x, y * height)
          }
          for (let s = steps; s >= 0; s--) {
            const y = -0.05 + (s / steps) * 1.1
            f.lineTo(trunkX(trunk, y) * width + trunkWidth(trunk, y) / 2, y * height)
          }
          f.closePath()
          f.shadowBlur = 0
          f.fillStyle = 'rgba(18,10,4,0.96)'
          f.fill()
          neonStroke('190,110,30', alpha, 1.8, 14)

          f.beginPath()
          for (let s = 0; s <= steps; s++) {
            const y = -0.05 + (s / steps) * 1.1
            const x = trunkX(trunk, y) * width - trunkWidth(trunk, y) * 0.2
            if (s === 0) f.moveTo(x, y * height)
            else f.lineTo(x, y * height)
          }
          neonStroke(GOLD.join(','), alpha * 0.35, 0.8, 6)
        }
      }

      for (const leaf of leaves) {
        const length = leaf.length * scale
        const rgb = leaf.shade > 0.5 ? EMERALD : CYBER
        const alpha = 0.45 + leaf.shade * 0.5
        f.save()
        f.translate(leaf.x * width, leaf.y * height)
        f.rotate(leaf.angle)

        f.beginPath()
        f.moveTo(-length / 2, 0)
        f.quadraticCurveTo(0, -length / 4, length / 2, 0)
        f.quadraticCurveTo(0, length / 4, -length / 2, 0)
        f.closePath()
        f.shadowBlur = 0
        f.fillStyle = 'rgba(2,18,11,0.88)'
        f.fill()
        neonStroke(rgb, alpha, 1.1, 8)

        f.beginPath()
        f.moveTo(-length / 2, 0)
        f.lineTo(length * 0.42, 0)
        for (const t of [-0.2, 0.05, 0.28]) {
          const vx = t * length
          f.moveTo(vx, 0)
          f.lineTo(vx + length * 0.1, -length * 0.1)
          f.moveTo(vx, 0)
          f.lineTo(vx + length * 0.1, length * 0.1)
        }
        neonStroke(rgb, alpha * 0.6, 0.6, 4)
        f.restore()
      }

      f.shadowBlur = 0
      const floor = f.createLinearGradient(0, height * 0.72, 0, height)
      floor.addColorStop(0, `rgba(${VOID},0)`)
      floor.addColorStop(1, `rgba(${VOID},0.85)`)
      f.fillStyle = floor
      f.fillRect(0, 0, width, height)
    }

    const drawPod = (pod: Pod, time: number) => {
      const trunk = trunks[pod.trunk]
      const breath = reducedMotion ? 0.5 : (Math.sin(time * pod.speed + pod.phase) + 1) / 2
      const swing = reducedMotion ? 0 : Math.sin(time * pod.speed * 1.6 + pod.phase) * 0.07
      const tone = mixRgb(AMBER, GOLD, breath)
      const ax = trunkX(trunk, pod.y) * width + pod.side * trunkWidth(trunk, pod.y) * 0.45
      const ay = pod.y * height
      const s = pod.size * scale * (1 + breath * 0.08)
      const rx = 8 * s
      const ry = 18 * s
      const stem = 6 * s
      const cy = ay + stem + ry
      const depthAlpha = trunk.depth === 1 ? 1 : 0.65

      const outer = ry * (4 + breath * 2)
      ctx.globalAlpha = depthAlpha * (0.45 + breath * 0.5)
      ctx.drawImage(flareHalo, ax - outer, cy - outer, outer * 2, outer * 2)
      const inner = ry * (1.9 + breath * 0.8)
      ctx.globalAlpha = depthAlpha * (0.55 + breath * 0.45)
      ctx.drawImage(amberHalo, ax - inner, cy - inner, inner * 2, inner * 2)
      ctx.globalAlpha = depthAlpha

      ctx.save()
      ctx.translate(ax, ay)
      ctx.rotate(swing + pod.side * 0.12)

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, stem)
      ctx.strokeStyle = `rgba(${tone},0.9)`
      ctx.lineWidth = Math.max(1.2, 1.8 * s)
      ctx.stroke()

      ctx.translate(0, stem + ry)
      ctx.beginPath()
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
      const fill = ctx.createRadialGradient(-rx * 0.3, -ry * 0.3, 0, 0, 0, ry * 1.1)
      fill.addColorStop(0, `rgba(255,248,214,${0.85 + breath * 0.15})`)
      fill.addColorStop(0.45, `rgba(${tone},${0.8 + breath * 0.2})`)
      fill.addColorStop(1, `rgba(${FLARE},0.85)`)
      ctx.fillStyle = fill
      ctx.fill()
      ctx.strokeStyle = `rgba(255,236,160,${0.6 + breath * 0.4})`
      ctx.lineWidth = 1.2
      ctx.stroke()

      ctx.strokeStyle = `rgba(${FLARE},${0.55 + breath * 0.3})`
      ctx.lineWidth = 0.9
      for (const ridge of [-0.5, 0.5]) {
        ctx.beginPath()
        ctx.ellipse(0, 0, rx * Math.abs(ridge), ry * 0.92, 0, ridge < 0 ? Math.PI / 2 : -Math.PI / 2, ridge < 0 ? Math.PI * 1.5 : Math.PI / 2)
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(0, -ry * 0.92)
      ctx.lineTo(0, ry * 0.92)
      ctx.stroke()
      ctx.restore()
      ctx.globalAlpha = 1
    }

    const draw = (time: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(forest, 0, 0)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = 'lighter'
      for (const pod of pods) drawPod(pod, time)
      ctx.globalCompositeOperation = 'source-over'
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
