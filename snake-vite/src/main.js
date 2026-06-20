import {
  BASE_TICK_MS, MIN_TICK_MS, SPEED_STEP_MS, SPEED_STEP_EVERY, SPECIMENS, THEME,
} from './constants.js'
import { createGame } from './game.js'
import { createRenderer } from './renderer.js'
import { createInputHandler } from './input.js'
import { createUI } from './ui.js'
import { createAudio } from './audio.js'
import { loadHighScore, saveHighScore } from './storage.js'
import { quote } from './quotes.js'
import './style.css'

const root = document.getElementById('root')
const ui = createUI(root)
const renderer = createRenderer(ui.canvas)
const audio = createAudio()
const game = createGame()

let high = loadHighScore()
let paused = false
let lastTick = 0
let deathAt = 0          // timestamp of death, for the flatline animation
let banner = null

ui.setHigh(high)
ui.setQuote(quote('idle'))

// ── Heart-rate-driven tick interval ──────────────────────────────────
function tickInterval() {
  const stepped = Math.floor(game.state.pills / SPEED_STEP_EVERY) * SPEED_STEP_MS
  const base = Math.max(MIN_TICK_MS, BASE_TICK_MS - stepped)
  return base * game.state.speedFactor
}

// ── React to the semantic events emitted by game.step() ──────────────
function handleEvents(events, time) {
  for (const ev of events) {
    switch (ev.type) {
      case 'eat': {
        const a = ev.archetype
        renderer.burst(ev.at, a.color)
        ui.setScore(game.state.score)
        ui.setBpm(game.state.bpm)
        ui.setLength(game.state.snake.length)
        if (a.id === 'pill') { audio.eat(); maybeQuote('eat', 0.25) }
        else if (a.id === 'vial') { audio.bonus(); ui.setQuote(quote('bonus')) }
        else if (a.id === 'adrenaline') { audio.adrenaline(); ui.setQuote(quote('adrenaline')) }
        else if (a.id === 'sedative') { audio.sedative(); ui.setQuote(quote('sedative')) }
        break
      }
      case 'effectStart': {
        const isFast = ev.effect.factor < 1
        const sp = isFast ? SPECIMENS.adrenaline : SPECIMENS.sedative
        ui.setEffect(isFast ? '⚡ TACHYCARDIA' : '☾ BRADYCARDIA', sp.color)
        break
      }
      case 'effectEnd':
        ui.setEffect(null)
        break
      case 'death':
        die(time, ev.reason)
        break
      case 'win':
        win()
        break
    }
  }
}

function maybeQuote(moment, chance) {
  if (Math.random() < chance) ui.setQuote(quote(moment))
}

function commitHigh() {
  if (game.state.score > high) {
    high = game.state.score
    saveHighScore(high)
    ui.setHigh(high)
  }
}

function die(time, reason) {
  deathAt = time
  audio.flatline()
  ui.setEffect(null)
  ui.setQuote(quote('death'))
  commitHigh()
  banner = {
    title: 'TIME OF DEATH',
    subtitle: reason === 'wall'
      ? 'Cause: blunt wall trauma · Enter to revive'
      : 'Cause: autophagia · Enter to revive',
    color: THEME.flatline,
  }
}

function win() {
  audio.win()
  ui.setQuote(quote('win'))
  commitHigh()
  banner = {
    title: 'PATIENT CURED',
    subtitle: 'Every cell mapped · Enter for a new case',
    color: THEME.pulseHead,
  }
}

function restart() {
  game.reset()
  paused = false
  banner = null
  lastTick = 0
  ui.setScore(0)
  ui.setBpm(60)
  ui.setLength(3)
  ui.setEffect(null)
  ui.setQuote(quote('idle'))
}

function togglePause() {
  if (!game.state.alive) return
  paused = !paused
}

// ── Input wiring ─────────────────────────────────────────────────────
const input = createInputHandler({
  onDirection: dir => { if (game.state.alive && !paused) game.setDirection(dir) },
  onPause: togglePause,
  onRestart: restart,
  onMute: () => ui.setMuted(audio.toggleMute()),
})
input.bindTouch(ui.canvas)
ui.restartBtn.addEventListener('click', restart)
ui.muteBtn.addEventListener('click', () => ui.setMuted(audio.toggleMute()))

// ── Main loop ────────────────────────────────────────────────────────
function loop(time) {
  if (game.state.alive && !paused && time - lastTick >= tickInterval()) {
    lastTick = time
    const events = game.step()
    handleEvents(events, time)
    if (game.state.alive) audio.blip()
  }

  const deathProgress = game.state.alive ? 0 : (time - deathAt) / 900
  renderer.render(game.state, { time, paused, deathProgress, banner })
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)
