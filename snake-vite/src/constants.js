// ── Differential: Snake ──────────────────────────────────────────────
// Central configuration & medical-monitor theme. Everything tunable lives
// here so the rest of the codebase stays declarative.

export const GRID_SIZE = 24          // cells per axis (square ward)
export const CELL_SIZE = 26          // px per cell
export const BASE_TICK_MS = 130      // resting heart interval (lower = faster)
export const MIN_TICK_MS = 60        // tachycardia floor

// Heart rate climbs as the patient (snake) grows — flavour + difficulty curve.
export const SPEED_STEP_MS = 4       // ms shaved off the tick per pill eaten
export const SPEED_STEP_EVERY = 1    // …every N pills

// ── Phosphor monitor palette ─────────────────────────────────────────
export const THEME = {
  bg:        '#04130d',
  gridMinor: 'rgba(0, 255, 150, 0.045)',
  gridMajor: 'rgba(0, 255, 150, 0.10)',
  pulse:     '#28e07a',   // body of the trace
  pulseHead: '#9dffce',   // leading edge
  pulseGlow: 'rgba(40, 224, 122, 0.9)',
  flatline:  '#ff2d4b',
  text:      '#aef5cf',
}

// ── Specimens (food / power-ups) ─────────────────────────────────────
// weight = relative spawn chance for "special" specimens.
// ttl     = lifetime in ticks (null = never expires, used for the pill).
export const SPECIMENS = {
  pill: {
    id: 'pill',
    label: 'Vicodin',
    color: '#ff9e3d',
    glow: 'rgba(255, 158, 61, 0.9)',
    score: 10,
    grow: 1,
    ttl: null,
    weight: 0,            // always present, never random
    effect: null,
  },
  vial: {
    id: 'vial',
    label: 'Lab Sample',
    color: '#34e2ff',
    glow: 'rgba(52, 226, 255, 0.9)',
    score: 50,
    grow: 0,
    ttl: 60,
    weight: 5,
    effect: null,
  },
  adrenaline: {
    id: 'adrenaline',
    label: 'Adrenaline',
    color: '#ff3b6b',
    glow: 'rgba(255, 59, 107, 0.9)',
    score: 20,
    grow: 1,
    ttl: 50,
    weight: 3,
    effect: { type: 'speed', factor: 0.55, ticks: 45 }, // tachycardia
  },
  sedative: {
    id: 'sedative',
    label: 'Sedative',
    color: '#9d7bff',
    glow: 'rgba(157, 123, 255, 0.9)',
    score: 20,
    grow: 1,
    ttl: 50,
    weight: 3,
    effect: { type: 'speed', factor: 1.7, ticks: 45 },  // bradycardia
  },
}

// How often (in ticks) we roll to spawn a special specimen, and the odds.
export const SPECIAL_SPAWN_EVERY = 18
export const SPECIAL_SPAWN_CHANCE = 0.55

export const STORAGE_KEY = 'differential-snake:hi'
