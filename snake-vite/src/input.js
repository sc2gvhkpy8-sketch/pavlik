import { DIR } from './game.js'

const KEY_MAP = {
  ArrowUp: DIR.UP, ArrowDown: DIR.DOWN, ArrowLeft: DIR.LEFT, ArrowRight: DIR.RIGHT,
  w: DIR.UP, s: DIR.DOWN, a: DIR.LEFT, d: DIR.RIGHT,
  W: DIR.UP, S: DIR.DOWN, A: DIR.LEFT, D: DIR.RIGHT,
}

/**
 * Translates keyboard + touch gestures into high-level intents and hands them
 * to the provided callbacks. The host owns game state; input stays stateless.
 */
export function createInputHandler({ onDirection, onPause, onRestart, onMute }) {
  function handleKey(e) {
    if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); onPause(); return }
    if (e.key === 'Enter') { e.preventDefault(); onRestart(); return }
    if (e.key === 'm' || e.key === 'M') { onMute(); return }
    const dir = KEY_MAP[e.key]
    if (dir) { e.preventDefault(); onDirection(dir) }
  }
  document.addEventListener('keydown', handleKey)

  // ── Touch: swipe to steer ──────────────────────────────────────────
  function bindTouch(el) {
    let sx = 0, sy = 0
    el.addEventListener('touchstart', e => {
      const t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY
    }, { passive: true })
    el.addEventListener('touchend', e => {
      const t = e.changedTouches[0]
      const dx = t.clientX - sx, dy = t.clientY - sy
      if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return
      if (Math.abs(dx) > Math.abs(dy)) onDirection(dx > 0 ? DIR.RIGHT : DIR.LEFT)
      else onDirection(dy > 0 ? DIR.DOWN : DIR.UP)
    }, { passive: true })
  }

  return { bindTouch }
}
