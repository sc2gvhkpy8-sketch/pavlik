import { STORAGE_KEY } from './constants.js'

// Thin, fail-safe wrapper around localStorage for the personal best.
// Private-mode / disabled storage degrades to an in-memory value.

let memoryFallback = 0

export function loadHighScore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? Number(raw) || 0 : 0
  } catch {
    return memoryFallback
  }
}

export function saveHighScore(score) {
  memoryFallback = score
  try {
    localStorage.setItem(STORAGE_KEY, String(score))
  } catch {
    /* storage unavailable — keep the in-memory fallback */
  }
}
