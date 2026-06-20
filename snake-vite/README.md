<div align="center">

# ℞ Differential — Snake on a Heart Monitor

**Everybody lies. The pills don't.**

A medical-drama take on the classic Snake game. You're the trace on an ECG
monitor; dose up on Vicodin pills, chase lab samples and adrenaline shots, and
keep the patient off the **flatline**. Glowing phosphor, CRT scanlines,
synthesised monitor beeps, and a House-flavoured one-liner for every diagnosis.

[![Vite](https://img.shields.io/badge/built%20with-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-28e07a.svg)](./LICENSE)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-no%20framework-f7df1e?logo=javascript&logoColor=000)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff9e3d.svg)](./CONTRIBUTING.md)

</div>

---

## Features

- 🫀 **ECG-monitor aesthetic** — phosphor-green grid, glow, vignette and CRT
  scanlines rendered entirely on `<canvas>`.
- 💊 **Specimens & power-ups** — every pickup is a piece of the differential:
  | Specimen | Effect |
  |----------|--------|
  | **Vicodin** (pill) | +10, grows the chart, raises the heart rate. Always on the board. |
  | **Lab Sample** (vial) | +50 bonus, no growth, expires fast. |
  | **Adrenaline** | ⚡ Tachycardia — temporary speed-up. |
  | **Sedative** | ☾ Bradycardia — temporary slow-down. |
- 📈 **Live vitals panel** — diagnoses (score), heart rate (BPM that climbs with
  length), personal record, and chart length.
- 🔊 **Synthesised audio** — Web Audio monitor blips, pickup chimes and a proper
  rising-alarm **flatline**. No asset files; mute with `M`.
- 💀 **Flatline death animation** + cause-of-death report ("blunt wall trauma" /
  "autophagia").
- 🩺 **House quotes** — contextual one-liners on every eat, power-up, death and cure.
- 📱 **Touch & keyboard** — Arrow keys, WASD, or swipe gestures.
- 💾 **Persistent record** via `localStorage` (with a safe in-memory fallback).

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production bundle → dist/
npm run preview  # serve the built bundle
```

> Requires Node 18+. No framework, no runtime dependencies — just Vite for dev/build.

## Controls

| Key | Action |
|-----|--------|
| `← ↑ → ↓` / `W A S D` | Steer the patient |
| `Space` | Stabilize (pause / resume) |
| `Enter` | New patient (restart) |
| `M` | Mute / unmute |
| swipe | Steer on touch devices |

## Architecture

The codebase is deliberately small and modular — pure logic is isolated from
rendering, audio and DOM so each part is testable and swappable.

```
snake-vite/
├── public/
│   └── favicon.svg          # ECG-trace mark
├── src/
│   ├── main.js              # Orchestrator: game loop, event → effects wiring
│   ├── constants.js         # Tunables: grid, speed curve, theme, specimens
│   ├── game.js              # createGame(): stateful core, emits semantic events
│   ├── renderer.js          # Canvas monitor: grid, glow, particles, flatline
│   ├── audio.js             # Web Audio monitor SFX (synthesised, no assets)
│   ├── input.js             # Keyboard + touch → intents
│   ├── ui.js                # DOM monitor chrome + typed setters
│   ├── storage.js           # High-score persistence (fail-safe)
│   ├── quotes.js            # House one-liners, grouped by moment
│   └── style.css            # Monitor theme
├── index.html
└── vite.config.js
```

**Event flow.** `game.step()` mutates the core state and returns a list of
semantic events (`eat`, `effectStart`, `death`, `win`, …). `main.js` is the only
place that maps those events onto side effects — particles, audio, quotes, vitals
— so adding a new reaction never touches game logic.

### Tuning the game

Almost everything lives in [`src/constants.js`](./src/constants.js): grid size,
base/min tick, the speed curve, the theme palette, and the full specimen table
(scores, growth, lifetimes, spawn weights, power-up effects). Add a new power-up
by dropping an entry in `SPECIMENS` with a `weight > 0` and an `effect` — the
spawner, renderer and audio routing pick it up from there.

## Contributing

Issues and PRs are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). Good first
issues: new specimen types, alternate themes, a leaderboard, or unit tests around
`game.js`.

## License

[MIT](./LICENSE) © contributors.

<div align="center"><sub>It's never lupus.</sub></div>
