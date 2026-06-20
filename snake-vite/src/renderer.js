import { CELL_SIZE, GRID_SIZE, THEME, SPECIMENS } from './constants.js'

// Canvas renderer for the "patient monitor". Owns a tiny particle system and
// the flatline death animation; the host just feeds it game state + context.

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width
  const H = canvas.height
  const particles = []

  function cellCenter(c) {
    return { x: c.x * CELL_SIZE + CELL_SIZE / 2, y: c.y * CELL_SIZE + CELL_SIZE / 2 }
  }

  // ── Particle system ────────────────────────────────────────────────
  function burst(cell, color, count = 14) {
    const { x, y } = cellCenter(cell)
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2
      const sp = 0.6 + Math.random() * 2.4
      particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 1,
        decay: 0.02 + Math.random() * 0.03,
        color,
        r: 1 + Math.random() * 2.5,
      })
    }
  }

  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.vx *= 0.94
      p.vy *= 0.94
      p.life -= p.decay
      if (p.life <= 0) particles.splice(i, 1)
    }
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life)
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  // ── Background ─────────────────────────────────────────────────────
  function drawBackground() {
    ctx.fillStyle = THEME.bg
    ctx.fillRect(0, 0, W, H)

    ctx.lineWidth = 1
    for (let i = 0; i <= GRID_SIZE; i++) {
      const major = i % 4 === 0
      ctx.strokeStyle = major ? THEME.gridMajor : THEME.gridMinor
      const p = i * CELL_SIZE + 0.5
      ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, H); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(W, p); ctx.stroke()
    }
  }

  // ── Specimens ──────────────────────────────────────────────────────
  function drawSpecimen(sp, time) {
    const a = SPECIMENS[sp.type]
    const { x, y } = cellCenter(sp)
    const pulse = 0.5 + 0.5 * Math.sin(time / 180 + x)
    const blink = sp.ttl != null && sp.ttl < 14 ? (Math.sin(time / 60) > 0 ? 0.25 : 1) : 1
    const r = CELL_SIZE / 2 - 4

    ctx.save()
    ctx.globalAlpha = blink
    ctx.shadowColor = a.glow
    ctx.shadowBlur = 12 + pulse * 8
    ctx.fillStyle = a.color
    ctx.strokeStyle = a.color

    if (sp.type === 'pill') {
      // Two-tone capsule.
      ctx.translate(x, y)
      ctx.rotate(Math.PI / 4)
      roundRect(-r, -r * 0.55, r * 2, r * 1.1, r * 0.55)
      ctx.fill()
      ctx.fillStyle = '#fff7ec'
      ctx.fillRect(-r, -r * 0.55, r, r * 1.1)
    } else if (sp.type === 'vial') {
      // Flask: neck + body.
      ctx.beginPath()
      ctx.moveTo(x - 3, y - r)
      ctx.lineTo(x + 3, y - r)
      ctx.lineTo(x + 3, y - 2)
      ctx.lineTo(x + r * 0.8, y + r)
      ctx.lineTo(x - r * 0.8, y + r)
      ctx.lineTo(x - 3, y - 2)
      ctx.closePath()
      ctx.fill()
    } else if (sp.type === 'adrenaline') {
      // Syringe-ish diamond with a plunger.
      ctx.beginPath()
      ctx.moveTo(x, y - r)
      ctx.lineTo(x + r, y)
      ctx.lineTo(x, y + r)
      ctx.lineTo(x - r, y)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#fff'
      ctx.fillRect(x - 1, y - r * 0.6, 2, r * 1.2)
    } else {
      // Sedative: soft glowing dot.
      ctx.beginPath()
      ctx.arc(x, y, r * 0.85, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  // ── Snake (the live trace) ─────────────────────────────────────────
  function drawSnake(snake, dir, alive) {
    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = alive ? THEME.pulseGlow : 'rgba(255,45,75,0.8)'
    ctx.shadowBlur = 14
    ctx.strokeStyle = alive ? THEME.pulse : THEME.flatline
    ctx.lineWidth = CELL_SIZE - 8

    ctx.beginPath()
    snake.forEach((s, i) => {
      const { x, y } = cellCenter(s)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    if (snake.length === 1) {
      const { x, y } = cellCenter(snake[0])
      ctx.lineTo(x + 0.01, y)
    }
    ctx.stroke()

    // Bright leading edge + eyes.
    const head = cellCenter(snake[0])
    ctx.shadowBlur = 18
    ctx.fillStyle = alive ? THEME.pulseHead : THEME.flatline
    roundRectCentered(head.x, head.y, CELL_SIZE - 6, CELL_SIZE - 6, 6)
    ctx.fill()

    if (alive) {
      ctx.shadowBlur = 0
      ctx.fillStyle = '#04130d'
      const ex = dir.x, ey = dir.y
      const off = 4
      const eye = (sx, sy) => {
        ctx.beginPath()
        ctx.arc(head.x + ex * 3 + sx, head.y + ey * 3 + sy, 2, 0, Math.PI * 2)
        ctx.fill()
      }
      // Place two eyes perpendicular to heading.
      eye(-ey * off, ex * off)
      eye(ey * off, -ex * off)
    }
    ctx.restore()
  }

  // ── Flatline death animation ───────────────────────────────────────
  function drawFlatline(progress) {
    const y = H / 2
    const sweep = Math.min(1, progress) * W
    ctx.save()
    ctx.strokeStyle = THEME.flatline
    ctx.shadowColor = THEME.flatline
    ctx.shadowBlur = 16
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(sweep, y)
    ctx.stroke()
    if (progress < 1) {
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(sweep, y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
  }

  // ── Scanlines / vignette overlay ───────────────────────────────────
  function drawCRT() {
    ctx.save()
    ctx.globalAlpha = 0.05
    ctx.fillStyle = '#000'
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1)
    ctx.restore()

    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.75)
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(1, 'rgba(0,0,0,0.45)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  // ── Centre banner (pause / game over / win) ───────────────────────
  function drawBanner(title, subtitle, color) {
    ctx.save()
    ctx.fillStyle = 'rgba(2, 10, 7, 0.72)'
    ctx.fillRect(0, H / 2 - 70, W, 140)
    ctx.textAlign = 'center'
    ctx.shadowColor = color
    ctx.shadowBlur = 18
    ctx.fillStyle = color
    ctx.font = '700 38px "Courier New", monospace'
    ctx.fillText(title, W / 2, H / 2 - 8)
    ctx.shadowBlur = 0
    ctx.fillStyle = THEME.text
    ctx.font = '16px "Courier New", monospace'
    ctx.fillText(subtitle, W / 2, H / 2 + 28)
    ctx.restore()
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.arcTo(x + w, y, x + w, y + h, r)
    ctx.arcTo(x + w, y + h, x, y + h, r)
    ctx.arcTo(x, y + h, x, y, r)
    ctx.arcTo(x, y, x + w, y, r)
    ctx.closePath()
  }
  function roundRectCentered(cx, cy, w, h, r) {
    roundRect(cx - w / 2, cy - h / 2, w, h, r)
  }

  function render(state, view) {
    const { time, paused, deathProgress = 0, banner } = view
    updateParticles()

    drawBackground()
    for (const sp of state.specimens) drawSpecimen(sp, time)
    drawSnake(state.snake, state.dir, state.alive)
    drawParticles()

    if (!state.alive && !state.won) drawFlatline(deathProgress)
    drawCRT()

    if (paused) drawBanner('STABILIZED', 'Press Space to resume the procedure', THEME.text)
    if (banner) drawBanner(banner.title, banner.subtitle, banner.color)
  }

  return { render, burst }
}
