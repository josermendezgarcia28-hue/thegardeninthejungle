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
const BARK = '74,46,28'
const BARK_EDGE = '128,84,50'
const LEAF_DEEP = [12, 36, 22]
const LEAF_LIGHT = [30, 74, 44]
const AMBER = '232,172,84'
const VOID = '4,4,4'

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
  for (let i = 0; i < 26; i++) addCluster(random(), random() * 0.14, 9, 0.12)
  for (const trunk of trunks) {
    for (const branch of trunk.branches) {
      const tipX = trunkX(trunk, branch.y) + branch.side * branch.reach
      addCluster(tipX, branch.y - branch.lift, 10, 0.1)
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
        speed: 0.0005 + random() * 0.0005,
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
  gradient.addColorStop(0, `rgba(${AMBER},0.9)`)
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

    const paintForest = () => {
      forest.width = canvas.width
      forest.height = canvas.height
      const f = forestCtx
      f.setTransform(dpr, 0, 0, dpr, 0, 0)
      f.lineCap = 'round'
      f.lineJoin = 'round'
      f.fillStyle = `rgb(${VOID})`
      f.fillRect(0, 0, width, height)

      const moon = f.createRadialGradient(width * 0.7, height * 0.1, 0, width * 0.7, height * 0.1, Math.max(width, height) * 0.6)
      moon.addColorStop(0, 'rgba(40,70,52,0.35)')
      moon.addColorStop(1, 'rgba(40,70,52,0)')
      f.fillStyle = moon
      f.fillRect(0, 0, width, height)

      for (const depth of [0, 1]) {
        for (const trunk of trunks) {
          if (trunk.depth !== depth) continue
          const alpha = depth === 1 ? 1 : 0.55

          for (const branch of trunk.branches) {
            const sx = trunkX(trunk, branch.y) * width
            const sy = branch.y * height
            const ex = sx + branch.side * branch.reach * width
            const ey = (branch.y - branch.lift) * height
            f.beginPath()
            f.moveTo(sx, sy)
            f.quadraticCurveTo((sx + ex) / 2, sy, ex, ey)
            f.strokeStyle = `rgba(${BARK},${alpha})`
            f.lineWidth = trunkWidth(trunk, branch.y) * 0.32
            f.stroke()
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
          f.fillStyle = `rgba(${BARK},${alpha})`
          f.fill()
          f.strokeStyle = `rgba(${BARK_EDGE},${alpha * 0.55})`
          f.lineWidth = 1.5
          f.stroke()
        }
      }

      for (const leaf of leaves) {
        const mix = (i: number) => Math.round(LEAF_DEEP[i] + (LEAF_LIGHT[i] - LEAF_DEEP[i]) * leaf.shade)
        const length = leaf.length * scale
        f.save()
        f.translate(leaf.x * width, leaf.y * height)
        f.rotate(leaf.angle)
        f.beginPath()
        f.ellipse(0, 0, length / 2, length / 5, 0, 0, Math.PI * 2)
        f.fillStyle = `rgba(${mix(0)},${mix(1)},${mix(2)},0.95)`
        f.fill()
        f.beginPath()
        f.moveTo(-length / 2, 0)
        f.lineTo(length / 2, 0)
        f.strokeStyle = 'rgba(4,10,6,0.55)'
        f.lineWidth = 1
        f.stroke()
        f.restore()
      }

      const floor = f.createLinearGradient(0, height * 0.7, 0, height)
      floor.addColorStop(0, `rgba(${VOID},0)`)
      floor.addColorStop(1, `rgba(${VOID},0.85)`)
      f.fillStyle = floor
      f.fillRect(0, 0, width, height)
    }

    const drawPod = (pod: Pod, time: number) => {
      const trunk = trunks[pod.trunk]
      const breath = reducedMotion ? 0.5 : (Math.sin(time * pod.speed + pod.phase) + 1) / 2
      const swing = reducedMotion ? 0 : Math.sin(time * pod.speed * 1.6 + pod.phase) * 0.07
      const ax = trunkX(trunk, pod.y) * width + pod.side * trunkWidth(trunk, pod.y) * 0.45
      const ay = pod.y * height
      const s = pod.size * scale * (1 + breath * 0.07)
      const rx = 8 * s
      const ry = 18 * s
      const stem = 6 * s

      const halo = ry * (3.2 + breath * 2)
      ctx.globalAlpha = (trunk.depth === 1 ? 0.6 : 0.4) + breath * 0.4
      ctx.drawImage(glow, ax - halo, ay + stem + ry - halo, halo * 2, halo * 2)
      ctx.globalAlpha = 1

      ctx.save()
      ctx.translate(ax, ay)
      ctx.rotate(swing + pod.side * 0.12)

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(0, stem)
      ctx.strokeStyle = `rgba(${BARK_EDGE},0.9)`
      ctx.lineWidth = Math.max(1.5, 2.2 * s)
      ctx.stroke()

      ctx.translate(0, stem + ry)
      ctx.beginPath()
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)
      const fill = ctx.createRadialGradient(-rx * 0.35, -ry * 0.3, 0, 0, 0, ry * 1.1)
      fill.addColorStop(0, `rgba(255,218,140,${0.8 + breath * 0.2})`)
      fill.addColorStop(0.5, `rgba(${AMBER},${0.65 + breath * 0.3})`)
      fill.addColorStop(1, 'rgba(92,48,16,0.95)')
      ctx.fillStyle = fill
      ctx.fill()

      ctx.strokeStyle = `rgba(120,64,20,${0.45 + breath * 0.2})`
      ctx.lineWidth = 1
      for (const ridge of [-0.5, 0, 0.5]) {
        ctx.beginPath()
        ctx.ellipse(0, 0, rx * Math.abs(ridge) || 0.5, ry * 0.92, 0, ridge < 0 ? Math.PI / 2 : -Math.PI / 2, ridge < 0 ? Math.PI * 1.5 : Math.PI / 2)
        ctx.stroke()
      }
      ctx.restore()
    }

    const draw = (time: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(forest, 0, 0)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const pod of pods) drawPod(pod, time)
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
