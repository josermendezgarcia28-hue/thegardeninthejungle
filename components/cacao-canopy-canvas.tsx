'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Depth = 0 | 1
type Kind = 'trunk' | 'branch' | 'root' | 'rootlet'
type Segment = {
  x1: number
  y1: number
  cx: number
  cy: number
  x2: number
  y2: number
  width: number
  kind: Kind
  depth: Depth
}
type Leaf = { x: number; y: number; angle: number; size: number; depth: Depth }
type Pod = {
  x: number
  y: number
  side: 1 | -1
  size: number
  depth: Depth
}
type Anchor = { x: number; y: number; depth: Depth; tree: number; onTrunk: boolean }
type Scene = { segments: Segment[]; leaves: Leaf[]; pods: Pod[]; groundY: number }

const MAX_DPR = 1.5
const EMERALD = '0,255,136'
const GOLD = '255,215,0'
const AMBER = '255,170,0'
const POD_TOP = '255,183,0'
const POD_BOTTOM = '255,136,0'
const POD_HALO_INNER = '255,170,0'
const POD_HALO_OUTER = '255,102,0'
const BREATH_PERIOD_MS = 3600
const LAYER_ALPHA: Record<Depth, number> = { 0: 0.3, 1: 0.8 }
const TREES: { x: number; depth: Depth; scale: number }[] = [
  { x: 0.16, depth: 1, scale: 1 },
  { x: 0.52, depth: 0, scale: 1.15 },
  { x: 0.86, depth: 1, scale: 0.92 },
]

function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function buildScene(width: number, height: number, unit: number): Scene {
  const random = createRandom(4219)
  const segments: Segment[] = []
  const leaves: Leaf[] = []
  const anchors: Anchor[] = []
  let treeIndex = 0
  const pointOn = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, t: number) => ({
    x: (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2,
    y: (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2,
  })
  const groundY = height * 0.62
  const treeScale = Math.max(60, Math.min(width * 0.18, height * 0.17))

  const pushSegment = (
    x: number,
    y: number,
    angle: number,
    length: number,
    lineWidth: number,
    kind: Kind,
    depth: Depth,
  ) => {
    const x2 = x + Math.cos(angle) * length
    const y2 = y + Math.sin(angle) * length
    const bend = (random() - 0.5) * length * 0.3
    const cx = (x + x2) / 2 - Math.sin(angle) * bend
    const cy = (y + y2) / 2 + Math.cos(angle) * bend
    segments.push({ x1: x, y1: y, cx, cy, x2, y2, width: lineWidth, kind, depth })
    return { x2, y2, cx, cy }
  }

  const growBranch = (x: number, y: number, angle: number, length: number, level: number, depth: Depth) => {
    const lineWidth = Math.max(1.5, 2 - level * 0.12)
    const { x2, y2, cx, cy } = pushSegment(x, y, angle, length, lineWidth, 'branch', depth)
    if (level === 1) {
      const joint = pointOn(x, y, cx, cy, x2, y2, 0.3)
      anchors.push({ ...joint, depth, tree: treeIndex, onTrunk: false })
    }
    if (level >= 4) {
      const leafCount = 2 + Math.floor(random() * 2)
      for (let i = 0; i < leafCount; i++) {
        leaves.push({
          x: x2,
          y: y2,
          angle: angle + (random() - 0.5) * 1.8,
          size: (9 + random() * 6) * unit,
          depth,
        })
      }
      return
    }
    const children = random() < 0.35 ? 3 : 2
    for (let i = 0; i < children; i++) {
      const spread = children === 3 ? (i - 1) * 0.55 : (i === 0 ? -0.45 : 0.45)
      growBranch(x2, y2, angle + spread + (random() - 0.5) * 0.3, length * (0.68 + random() * 0.1), level + 1, depth)
    }
  }

  const growRoot = (x: number, y: number, angle: number, length: number, level: number, depth: Depth) => {
    const kind: Kind = level >= 2 ? 'rootlet' : 'root'
    const lineWidth = Math.max(1.5, 2 - level * 0.15)
    const { x2, y2 } = pushSegment(x, y, angle, length, lineWidth, kind, depth)
    if (level >= 4 || y2 > height * 0.99) return
    const children = random() < 0.5 ? 3 : 2
    for (let i = 0; i < children; i++) {
      const outward = angle < Math.PI / 2 ? -0.15 : 0.15
      let next = angle + (i - (children - 1) / 2) * 0.6 + outward + (random() - 0.5) * 0.3
      next = Math.min(Math.PI - 0.12, Math.max(0.12, next))
      growRoot(x2, y2, next, length * (0.66 + random() * 0.12), level + 1, depth)
    }
  }

  for (const [index, tree] of TREES.entries()) {
    treeIndex = index
    const baseX = tree.x * width
    const trunkLength = treeScale * tree.scale
    const lean = (random() - 0.5) * 0.12
    const trunk = pushSegment(baseX, groundY, -Math.PI / 2 + lean, trunkLength, 2, 'trunk', tree.depth)
    for (const t of [0.22, 0.48, 0.72]) {
      const point = pointOn(baseX, groundY, trunk.cx, trunk.cy, trunk.x2, trunk.y2, t)
      anchors.push({ ...point, depth: tree.depth, tree: index, onTrunk: true })
    }
    growBranch(trunk.x2, trunk.y2, -Math.PI / 2 - 0.5 + lean, trunkLength * 0.72, 1, tree.depth)
    growBranch(trunk.x2, trunk.y2, -Math.PI / 2 + 0.5 + lean, trunkLength * 0.72, 1, tree.depth)
    growBranch(trunk.x2, trunk.y2, -Math.PI / 2 + lean, trunkLength * 0.6, 2, tree.depth)

    const rootLength = Math.min((height - groundY) * 0.32, trunkLength * 1.3)
    for (const angle of [0.25, 0.75, Math.PI / 2, Math.PI - 0.75, Math.PI - 0.25]) {
      growRoot(baseX, groundY, angle + (random() - 0.5) * 0.15, rootLength * (0.8 + random() * 0.3), 0, tree.depth)
    }
  }

  const pods: Pod[] = []
  for (const anchor of anchors) {
    if (!anchor.onTrunk && random() < 0.35) continue
    const trunkSide: 1 | -1 = random() < 0.5 ? -1 : 1
    pods.push({
      x: anchor.x,
      y: anchor.y,
      side: anchor.onTrunk ? trunkSide : anchor.x < width * TREES[anchor.tree].x ? -1 : 1,
      size: (anchor.onTrunk ? 0.95 : 0.8) + random() * 0.25,
      depth: anchor.depth,
    })
  }

  return { segments, leaves, pods, groundY }
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

function neonStroke(ctx: CanvasRenderingContext2D, rgb: string, alpha: number, lineWidth: number) {
  ctx.shadowColor = `rgba(${rgb},${alpha})`
  ctx.shadowBlur = 8
  ctx.strokeStyle = `rgba(${rgb},${alpha})`
  ctx.lineWidth = lineWidth
  ctx.stroke()
  ctx.shadowBlur = 0
}

function renderStaticLayer(scene: Scene, width: number, height: number, dpr: number) {
  const layer = document.createElement('canvas')
  layer.width = Math.round(width * dpr)
  layer.height = Math.round(height * dpr)
  const ctx = layer.getContext('2d')
  if (!ctx) return layer
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.beginPath()
  ctx.setLineDash([2, 10])
  ctx.moveTo(0, scene.groundY)
  ctx.lineTo(width, scene.groundY)
  neonStroke(ctx, EMERALD, 0.25, 1.5)
  ctx.setLineDash([])

  for (const depth of [0, 1] as const) {
    const alpha = LAYER_ALPHA[depth]
    for (const s of scene.segments) {
      if (s.depth !== depth) continue
      ctx.beginPath()
      ctx.moveTo(s.x1, s.y1)
      ctx.quadraticCurveTo(s.cx, s.cy, s.x2, s.y2)
      const isGold = s.kind === 'trunk' || s.kind === 'root'
      const strength = s.kind === 'rootlet' ? 0.75 : 1
      neonStroke(ctx, isGold ? GOLD : EMERALD, alpha * strength, s.width)
    }
    for (const leaf of scene.leaves) {
      if (leaf.depth !== depth) continue
      ctx.save()
      ctx.translate(leaf.x, leaf.y)
      ctx.rotate(leaf.angle)
      const l = leaf.size
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(l * 0.5, -l * 0.32, l, 0)
      ctx.quadraticCurveTo(l * 0.5, l * 0.32, 0, 0)
      neonStroke(ctx, EMERALD, alpha * 0.85, 1.5)
      ctx.restore()
    }
  }
  return layer
}

export function CacaoCanopyCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const glow = createGlowSprite()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let unit = 1
    let frame = 0
    let visible = true
    let scene: Scene = { segments: [], leaves: [], pods: [], groundY: 0 }
    let staticLayer: HTMLCanvasElement | null = null

    const tracePod = (length: number, girth: number) => {
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(girth * 1.35, length * 0.2, girth * 1.2, length * 0.85, 0, length * 2)
      ctx.bezierCurveTo(-girth * 1.2, length * 0.85, -girth * 1.35, length * 0.2, 0, 0)
      ctx.closePath()
    }

    const drawPod = (pod: Pod, breath: number) => {
      const alpha = LAYER_ALPHA[pod.depth]
      const scale = 1 + breath * 0.08
      const length = (pod.depth === 1 ? 11 : 9) * pod.size * unit
      const girth = length * 0.42
      const offset = girth * 0.9

      ctx.save()
      ctx.translate(pod.x + pod.side * offset, pod.y)
      ctx.rotate(-pod.side * 0.22)
      ctx.scale(scale, scale)

      const halo = length * (2.2 + breath * 0.6)
      ctx.globalAlpha = alpha * (0.25 + breath * 0.35)
      ctx.drawImage(glow, -halo, length - halo, halo * 2, halo * 2)
      ctx.globalAlpha = 1

      const gradient = ctx.createLinearGradient(0, 0, 0, length * 2)
      const intensity = alpha * (0.75 + breath * 0.25)
      gradient.addColorStop(0, `rgba(${POD_TOP},${intensity})`)
      gradient.addColorStop(1, `rgba(${POD_BOTTOM},${intensity})`)

      tracePod(length, girth)
      ctx.strokeStyle = gradient
      ctx.lineWidth = 1.75 / scale
      ctx.shadowColor = `rgba(${POD_HALO_OUTER},${alpha * (0.5 + breath * 0.5)})`
      ctx.shadowBlur = 16
      ctx.stroke()
      ctx.shadowColor = `rgba(${POD_HALO_INNER},${alpha * (0.6 + breath * 0.4)})`
      ctx.shadowBlur = 8
      ctx.stroke()
      ctx.shadowBlur = 0

      ctx.beginPath()
      for (const ridge of [-0.45, 0, 0.45]) {
        ctx.moveTo(girth * ridge * 0.6, length * 0.35)
        ctx.quadraticCurveTo(girth * ridge * 1.3, length, girth * ridge * 0.5, length * 1.7)
      }
      ctx.strokeStyle = `rgba(${POD_TOP},${alpha * (0.3 + breath * 0.25)})`
      ctx.lineWidth = 1 / scale
      ctx.stroke()
      ctx.restore()
    }

    const draw = (time: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (staticLayer) ctx.drawImage(staticLayer, 0, 0)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
      const breath = reducedMotion ? 0.5 : (Math.sin((time / BREATH_PERIOD_MS) * Math.PI * 2) + 1) / 2
      for (const depth of [0, 1] as const) {
        for (const pod of scene.pods) if (pod.depth === depth) drawPod(pod, breath)
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = rect.width
      height = rect.height
      unit = Math.max(0.75, Math.min(1.2, width / 1000))
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      scene = buildScene(width, height, unit)
      staticLayer = renderStaticLayer(scene, width, height, dpr)
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
