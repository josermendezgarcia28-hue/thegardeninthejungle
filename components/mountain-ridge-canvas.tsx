'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Ridge = { heights: number[]; alpha: number; width: number }
type Nodule = {
  x: number
  y: number
  size: number
  phase: number
  speed: number
  shape: number[]
}

const MAX_DPR = 1.5
const SAMPLES = 160
const BROWN = '150,98,58'
const AMBER = '232,172,84'
const VOID = '4,4,4'

function createRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function buildRidge(random: () => number, baseline: number, amplitude: number, roughness: number) {
  const size = 129
  const values = new Array<number>(size).fill(0)
  values[0] = random()
  values[size - 1] = random()
  let step = size - 1
  let scale = 1
  while (step > 1) {
    const half = step / 2
    for (let i = half; i < size; i += step) {
      values[i] = (values[i - half] + values[i + half]) / 2 + (random() - 0.5) * scale
    }
    step = half
    scale *= roughness
  }
  const min = Math.min(...values)
  const max = Math.max(...values)
  const heights: number[] = []
  for (let s = 0; s <= SAMPLES; s++) {
    const t = (s / SAMPLES) * (size - 1)
    const i = Math.min(size - 2, Math.floor(t))
    const v = values[i] + (values[i + 1] - values[i]) * (t - i)
    heights.push(baseline - ((v - min) / (max - min || 1)) * amplitude)
  }
  return heights
}

function heightAt(ridge: Ridge, x: number) {
  const t = Math.max(0, Math.min(1, x)) * SAMPLES
  const i = Math.min(SAMPLES - 1, Math.floor(t))
  return ridge.heights[i] + (ridge.heights[i + 1] - ridge.heights[i]) * (t - i)
}

function shapeRange() {
  const random = createRandom(7741)
  const layers = [
    { baseline: 0.42, amplitude: 0.3, roughness: 0.56, alpha: 0.22, width: 0.8 },
    { baseline: 0.58, amplitude: 0.3, roughness: 0.54, alpha: 0.34, width: 1 },
    { baseline: 0.74, amplitude: 0.28, roughness: 0.52, alpha: 0.5, width: 1.3 },
    { baseline: 0.9, amplitude: 0.26, roughness: 0.5, alpha: 0.72, width: 1.7 },
  ]
  const ridges: Ridge[] = layers.map((layer) => ({
    heights: buildRidge(random, layer.baseline, layer.amplitude, layer.roughness),
    alpha: layer.alpha,
    width: layer.width,
  }))

  const nodules: Nodule[] = []
  ridges.forEach((ridge, layerIndex) => {
    const count = 2 + layerIndex
    for (let n = 0; n < count; n++) {
      const x = 0.06 + ((n + random() * 0.8) / count) * 0.88
      const y = heightAt(ridge, x) + 0.004
      const hiddenByNearerRidge = ridges
        .slice(layerIndex + 1)
        .some((nearer) => heightAt(nearer, x) < y + 0.01)
      if (hiddenByNearerRidge) continue
      const vertices = 6 + Math.floor(random() * 3)
      nodules.push({
        x,
        y,
        size: 0.55 + layerIndex * 0.18 + random() * 0.2,
        phase: random() * Math.PI * 2,
        speed: 0.0006 + random() * 0.0006,
        shape: Array.from({ length: vertices }, () => 0.7 + random() * 0.35),
      })
    }
  })

  return { ridges, nodules }
}

function createGlowSprite() {
  const size = 96
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const ctx = sprite.getContext('2d')
  if (!ctx) return sprite
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, `rgba(${AMBER},0.75)`)
  gradient.addColorStop(0.35, `rgba(${AMBER},0.22)`)
  gradient.addColorStop(1, `rgba(${AMBER},0)`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return sprite
}

export function MountainRidgeCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const { ridges, nodules } = shapeRange()
    const glow = createGlowSprite()
    const range = document.createElement('canvas')
    const rangeCtx = range.getContext('2d')
    if (!rangeCtx) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let visible = true

    const traceRidge = (target: CanvasRenderingContext2D, ridge: Ridge, offset = 0) => {
      target.beginPath()
      for (let s = 0; s <= SAMPLES; s++) {
        const x = (s / SAMPLES) * width
        const y = (ridge.heights[s] + offset) * height
        if (s === 0) target.moveTo(x, y)
        else target.lineTo(x, y)
      }
    }

    const paintRange = () => {
      range.width = canvas.width
      range.height = canvas.height
      rangeCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
      rangeCtx.lineJoin = 'round'
      rangeCtx.lineCap = 'round'

      for (const ridge of ridges) {
        traceRidge(rangeCtx, ridge)
        rangeCtx.lineTo(width, height)
        rangeCtx.lineTo(0, height)
        rangeCtx.closePath()
        rangeCtx.fillStyle = `rgba(${VOID},0.94)`
        rangeCtx.fill()

        for (let strata = 1; strata <= 3; strata++) {
          traceRidge(rangeCtx, ridge, strata * 0.018)
          rangeCtx.strokeStyle = `rgba(${BROWN},${ridge.alpha * (0.32 - strata * 0.07)})`
          rangeCtx.lineWidth = ridge.width * 0.6
          rangeCtx.stroke()
        }

        traceRidge(rangeCtx, ridge)
        rangeCtx.strokeStyle = `rgba(${BROWN},${ridge.alpha * 0.3})`
        rangeCtx.lineWidth = ridge.width * 4
        rangeCtx.stroke()
        rangeCtx.strokeStyle = `rgba(${BROWN},${ridge.alpha})`
        rangeCtx.lineWidth = ridge.width
        rangeCtx.stroke()
      }
    }

    const drawNodule = (nodule: Nodule, time: number) => {
      const breath = reducedMotion ? 0.5 : (Math.sin(time * nodule.speed + nodule.phase) + 1) / 2
      const unit = Math.min(width, 900) / 900
      const radius = (6 + breath * 1.6) * nodule.size * Math.max(0.7, unit * 1.4)
      const x = nodule.x * width
      const y = nodule.y * height - radius * 0.4

      const halo = radius * (4 + breath * 3)
      ctx.globalAlpha = 0.35 + breath * 0.55
      ctx.drawImage(glow, x - halo, y - halo, halo * 2, halo * 2)
      ctx.globalAlpha = 1

      ctx.beginPath()
      nodule.shape.forEach((r, i) => {
        const angle = (i / nodule.shape.length) * Math.PI * 2 - Math.PI / 2
        const px = x + Math.cos(angle) * radius * r * 1.15
        const py = y + Math.sin(angle) * radius * r * 0.85
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.closePath()
      const fill = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.4, 0, x, y, radius * 1.2)
      fill.addColorStop(0, `rgba(${AMBER},${0.55 + breath * 0.35})`)
      fill.addColorStop(1, 'rgba(46,26,12,0.95)')
      ctx.fillStyle = fill
      ctx.fill()
      ctx.strokeStyle = `rgba(${AMBER},${0.4 + breath * 0.4})`
      ctx.lineWidth = 0.8
      ctx.stroke()
    }

    const draw = (time: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(range, 0, 0)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const nodule of nodules) drawNodule(nodule, time)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      paintRange()
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
