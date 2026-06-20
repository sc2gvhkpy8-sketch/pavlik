import { DIR, isOpposite } from './game.js'

const KEY_MAP = {
  ArrowUp: DIR.UP,
  ArrowDown: DIR.DOWN,
  ArrowLeft: DIR.LEFT,
  ArrowRight: DIR.RIGHT,
}

export function createInputHandler() {
  let nextDirection = DIR.RIGHT
  let paused = false

  function handleKey(e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      paused = !paused
      return
    }

    const dir = KEY_MAP[e.key]
    if (!dir) return
    e.preventDefault()

    if (!isOpposite(dir, nextDirection)) {
      nextDirection = dir
    }
  }

  function consumeDirection(currentDir) {
    const dir = nextDirection
    if (!isOpposite(dir, currentDir)) {
      return dir
    }
    return currentDir
  }

  function reset() {
    nextDirection = DIR.RIGHT
    paused = false
  }

  document.addEventListener('keydown', handleKey)

  return { consumeDirection, reset, get paused() { return paused } }
}
