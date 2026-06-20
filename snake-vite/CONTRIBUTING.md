# Contributing to Differential

Thanks for stopping by the ward. This project is small, dependency-free and
intentionally easy to hack on — contributions of all sizes are welcome.

## Getting set up

```bash
git clone <your-fork-url>
cd snake-vite
npm install
npm run dev
```

That's the whole toolchain: [Vite](https://vitejs.dev/) for the dev server and
production build, vanilla JavaScript everywhere else.

## Project conventions

- **Keep logic pure.** Game rules live in `src/game.js` and must not touch the
  DOM, canvas or audio. Side effects are wired up in `src/main.js` by reacting to
  the events `game.step()` returns.
- **One concern per module.** Rendering → `renderer.js`, sound → `audio.js`,
  input → `input.js`, persistence → `storage.js`, chrome → `ui.js`.
- **Tunables go in `constants.js`.** If you're hard-coding a number in logic or
  rendering, it probably belongs there.
- **Style** matches the existing code: 2-space indent, no semicolons-required
  drama (the repo omits them), descriptive names, comments that explain *why*.

## Adding a new specimen / power-up

1. Add an entry to `SPECIMENS` in `constants.js` (`color`, `glow`, `score`,
   `grow`, `ttl`, `weight`, and an optional `effect`).
2. Give it a shape in `renderer.js → drawSpecimen()`.
3. Route its pickup sound/quote in `main.js → handleEvents()`.

No changes to the spawner or collision code are needed — they're data-driven.

## Pull requests

- Branch off `main`, keep PRs focused, and describe the change.
- Run `npm run build` before pushing — it must succeed.
- Manually play-test the affected behaviour (steering, death, the new pickup…).

## Ideas worth picking up

- Unit tests around `game.js` (collisions, growth, win condition).
- Alternate themes (radiology, surgery, neon).
- An online leaderboard or shareable run summaries.
- Accessibility passes (reduced-motion, colour-blind palettes).

By contributing you agree your work is released under the project's
[MIT License](./LICENSE).
