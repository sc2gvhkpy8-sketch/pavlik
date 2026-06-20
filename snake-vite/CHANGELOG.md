# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/), and this project adheres to
[Semantic Versioning](https://semver.org/).

## [2.0.0] — Differential

A full medical-monitor reimagining of the original Snake.

### Added
- ECG heart-monitor theme: phosphor grid, glow, vignette and CRT scanlines on canvas.
- Specimen system with power-ups: Vicodin pills, lab-sample vials, adrenaline
  (tachycardia) and sedative (bradycardia), all data-driven from `constants.js`.
- Live vitals panel: diagnoses (score), heart rate, personal record and chart length.
- Synthesised Web Audio SFX — monitor blips, pickup chimes, and a rising-alarm flatline.
- Flatline death animation with cause-of-death reporting; "patient cured" win banner.
- Contextual House one-liners (`quotes.js`).
- Persistent high score with a fail-safe in-memory fallback (`storage.js`).
- Touch swipe controls plus WASD; mute toggle (`M`).
- Heart-rate-driven difficulty curve that speeds up as the chart grows.

### Changed
- `game.js` refactored into a stateful `createGame()` controller that emits
  semantic events, decoupling logic from all side effects.
- Renderer rewritten around a connected glowing trace, specimen shapes and a
  particle system.

## [1.0.0]
- Original classic Snake: canvas rendering, pure `tick()`, keyboard input, pause/restart.
