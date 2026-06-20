import {
  GRID_SIZE,
  SPECIMENS,
  SPECIAL_SPAWN_EVERY,
  SPECIAL_SPAWN_CHANCE,
} from './constants.js'

export const DIR = {
  UP:    { x:  0, y: -1 },
  DOWN:  { x:  0, y:  1 },
  LEFT:  { x: -1, y:  0 },
  RIGHT: { x:  1, y:  0 },
}

export function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0
}

function randomCell() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }
}

function key(c) {
  return `${c.x},${c.y}`
}

/** Pick a free cell not occupied by the snake or existing specimens. */
function freeCell(occupied) {
  if (occupied.size >= GRID_SIZE * GRID_SIZE) return null
  let cell
  do { cell = randomCell() } while (occupied.has(key(cell)))
  return cell
}

function occupiedSet(snake, specimens) {
  const set = new Set(snake.map(key))
  for (const s of specimens) set.add(key(s))
  return set
}

/** Weighted pick among the "special" specimen archetypes. */
function rollSpecialType() {
  const pool = Object.values(SPECIMENS).filter(s => s.weight > 0)
  const total = pool.reduce((n, s) => n + s.weight, 0)
  let r = Math.random() * total
  for (const s of pool) {
    r -= s.weight
    if (r <= 0) return s
  }
  return pool[pool.length - 1]
}

function makeSpecimen(archetype, cell) {
  return { ...cell, type: archetype.id, ttl: archetype.ttl }
}

/**
 * The game is a small stateful controller. `step()` advances one tick and
 * returns a list of semantic events the host can react to (sounds, quotes,
 * screen shake) without reaching into internals.
 */
export function createGame() {
  const state = {
    snake: [],
    dir: DIR.RIGHT,
    dirQueue: [],          // buffered turns, ≤2, one committed per tick
    specimens: [],         // [{x, y, type, ttl}]
    score: 0,
    pills: 0,              // pills eaten — drives heart rate
    bpm: 60,
    effect: null,          // active power-up: { type, factor, ticks }
    speedFactor: 1,        // multiplier applied to tick interval
    alive: true,
    won: false,
    ticks: 0,
  }

  function reset() {
    const cx = Math.floor(GRID_SIZE / 2)
    const cy = Math.floor(GRID_SIZE / 2)
    state.snake = [
      { x: cx, y: cy },
      { x: cx - 1, y: cy },
      { x: cx - 2, y: cy },
    ]
    state.dir = DIR.RIGHT
    state.dirQueue = []
    state.score = 0
    state.pills = 0
    state.bpm = 60
    state.effect = null
    state.speedFactor = 1
    state.alive = true
    state.won = false
    state.ticks = 0
    state.specimens = [spawnPill()]
  }

  function spawnPill() {
    const cell = freeCell(occupiedSet(state.snake, state.specimens))
    return cell ? makeSpecimen(SPECIMENS.pill, cell) : null
  }

  function setDirection(dir) {
    // Validate against the last *queued* turn (or the committed heading if the
    // queue is empty) so rapid presses within a single tick can't reverse the
    // snake into itself. Cap the queue at two pending turns.
    const last = state.dirQueue.length ? state.dirQueue[state.dirQueue.length - 1] : state.dir
    if (isOpposite(dir, last) || (dir.x === last.x && dir.y === last.y)) return
    if (state.dirQueue.length < 2) state.dirQueue.push(dir)
  }

  function recomputeSpeed() {
    state.speedFactor = state.effect?.type === 'speed' ? state.effect.factor : 1
  }

  function step() {
    const events = []
    if (!state.alive) return events
    state.ticks++

    // Commit one buffered turn for this tick.
    if (state.dirQueue.length) state.dir = state.dirQueue.shift()

    // Age active power-up.
    if (state.effect) {
      state.effect.ticks--
      if (state.effect.ticks <= 0) {
        events.push({ type: 'effectEnd', effect: state.effect })
        state.effect = null
        recomputeSpeed()
      }
    }

    // Age specimens; expire the perishable ones.
    state.specimens = state.specimens.filter(sp => {
      if (sp.ttl == null) return true
      sp.ttl--
      if (sp.ttl <= 0) {
        events.push({ type: 'expire', specimen: sp })
        return false
      }
      return true
    })

    const head = state.snake[0]
    const next = { x: head.x + state.dir.x, y: head.y + state.dir.y }

    // Wall collision.
    if (next.x < 0 || next.x >= GRID_SIZE || next.y < 0 || next.y >= GRID_SIZE) {
      state.alive = false
      events.push({ type: 'death', reason: 'wall', at: next })
      return events
    }
    // Self collision.
    if (state.snake.some(s => s.x === next.x && s.y === next.y)) {
      state.alive = false
      events.push({ type: 'death', reason: 'self', at: next })
      return events
    }

    state.snake.unshift(next)

    const hitIdx = state.specimens.findIndex(s => s.x === next.x && s.y === next.y)
    if (hitIdx >= 0) {
      const sp = state.specimens.splice(hitIdx, 1)[0]
      const archetype = SPECIMENS[sp.type]
      state.score += archetype.score
      events.push({ type: 'eat', specimen: sp, archetype, at: next })

      if (archetype.grow <= 0) state.snake.pop() // bonus: score but no growth
      if (archetype.id === 'pill') {
        state.pills++
        state.bpm = 60 + state.pills * 2
        const pill = spawnPill()
        if (!pill) {
          state.alive = false
          state.won = true
          events.push({ type: 'win' })
          return events
        }
        state.specimens.push(pill)
      }
      if (archetype.effect) {
        state.effect = { ...archetype.effect }
        recomputeSpeed()
        events.push({ type: 'effectStart', effect: state.effect })
      }
    } else {
      state.snake.pop()
    }

    // Occasionally drop a special specimen onto the ward.
    if (
      state.ticks % SPECIAL_SPAWN_EVERY === 0 &&
      Math.random() < SPECIAL_SPAWN_CHANCE &&
      state.specimens.length < 4
    ) {
      const cell = freeCell(occupiedSet(state.snake, state.specimens))
      if (cell) {
        const sp = makeSpecimen(rollSpecialType(), cell)
        state.specimens.push(sp)
        events.push({ type: 'spawn', specimen: sp })
      }
    }

    return events
  }

  reset()
  return { state, reset, setDirection, step }
}
