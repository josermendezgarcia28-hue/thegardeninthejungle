'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type Ridge = {
  heights: number[]
  alpha: number
  width: number
  fillTop: string
  fillBottom: string
}
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
    {
      baseline: 0.5,
      amplitude: 0.36,
      roughness: 0.56,
      alpha: 0.7,
      width: 2,
      fillTop: 'rgba(92,60,36,0.55)',
      fillBottom: 'rgba(22,18,16,0.96)',
    },
    {
      baseline: 0.7,
      amplitude: 0.32,
      roughness: 0.53,
      alpha: 0.8,
      width: 2.75,
      fillTop: 'rgba(74,46,26,0.8)',
      fillBottom: 'rgba(16,13,12,0.98)',
    },
    {
      baseline: 0.92,
      amplitude: 0.28,
      roughness: 0.5,
      alpha: 0.9,
      width: 3.5,
      fillTop: 'rgba(58,34,18,0.95)',
      fillBottom: 'rgba(8,7,7,1)',
    },
  ]
  const ridges: Ridge[] = layers.map((layer) => ({
    heights: buildRidge(random, layer.baseline, layer.amplitude, layer.roughness),
    alpha: layer.alpha,
    width: layer.width,
    fillTop: layer.fillTop,
    fillBottom: layer.fillBottom,
  }))

  const nodules: Nodule[] = []
  ridges.forEach((ridge, layerIndex) => {
    const count = 3 + layerIndex
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
        size: 0.8 + layerIndex * 0.25 + random() * 0.25,
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
  gradient.addColorStop(0, `rgba(${AMBER},0.95)`)
  gradient.addColorStop(0.3, `rgba(${AMBER},0.4)`)
  gradient.addColorStop(0.6, `rgba(${AMBER},0.1)`)
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

      rangeCtx.fillStyle = `rgb(${VOID})`
      rangeCtx.fillRect(0, 0, width, height)

      const farthest = ridges[0]
      const peakY = Math.min(...farthest.heights)
      const horizonTop = Math.max(0, (peakY - 0.12) * height)
      const horizon = rangeCtx.createLinearGradient(0, horizonTop, 0, height * 0.75)
      horizon.addColorStop(0, `rgba(${AMBER},0)`)
      horizon.addColorStop(0.55, `rgba(${AMBER},0.12)`)
      horizon.addColorStop(1, `rgba(${BROWN},0.2)`)
      rangeCtx.fillStyle = horizon
      rangeCtx.fillRect(0, horizonTop, width, height - horizonTop)

      const peakIndex = farthest.heights.indexOf(peakY)
      const peakX = (peakIndex / SAMPLES) * width
      const glowRadius = Math.max(width, height) * 0.45
      const backGlow = rangeCtx.createRadialGradient(peakX, peakY * height, 0, peakX, peakY * height, glowRadius)
      backGlow.addColorStop(0, `rgba(${AMBER},0.32)`)
      backGlow.addColorStop(0.35, `rgba(${AMBER},0.12)`)
      backGlow.addColorStop(1, `rgba(${AMBER},0)`)
      rangeCtx.fillStyle = backGlow
      rangeCtx.fillRect(0, 0, width, height)

      for (const ridge of ridges) {
        const top = Math.min(...ridge.heights) * height
        traceRidge(rangeCtx, ridge)
        rangeCtx.lineTo(width, height)
        rangeCtx.lineTo(0, height)
        rangeCtx.closePath()
        const mass = rangeCtx.createLinearGradient(0, top, 0, height)
        mass.addColorStop(0, ridge.fillTop)
        mass.addColorStop(0.55, ridge.fillBottom)
        mass.addColorStop(1, ridge.fillBottom)
        rangeCtx.fillStyle = `rgb(${VOID})`
        rangeCtx.fill()
        rangeCtx.fillStyle = mass
        rangeCtx.fill()

        for (let strata = 1; strata <= 3; strata++) {
          traceRidge(rangeCtx, ridge, strata * 0.022)
          rangeCtx.strokeStyle = `rgba(${BROWN},${ridge.alpha * (0.4 - strata * 0.09)})`
          rangeCtx.lineWidth = ridge.width * 0.45
          rangeCtx.stroke()
        }

        traceRidge(rangeCtx, ridge)
        rangeCtx.strokeStyle = `rgba(${AMBER},${ridge.alpha * 0.18})`
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
      const radius = (8 + breath * 2.4) * nodule.size * Math.max(0.8, unit * 1.4)
      const x = nodule.x * width
      const y = nodule.y * height - radius * 0.4

      const halo = radius * (5 + breath * 4)
      ctx.globalAlpha = 0.55 + breath * 0.45
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
      fill.addColorStop(0, `rgba(255,214,140,${0.75 + breath * 0.25})`)
      fill.addColorStop(0.5, `rgba(${AMBER},${0.6 + breath * 0.3})`)
      fill.addColorStop(1, 'rgba(46,26,12,0.95)')
      ctx.fillStyle = fill
      ctx.fill()
      ctx.strokeStyle = `rgba(${AMBER},${0.6 + breath * 0.4})`
      ctx.lineWidth = 1.2
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
