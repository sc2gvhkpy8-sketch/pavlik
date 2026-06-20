import { GRID_SIZE, CELL_SIZE } from './constants.js'

// Builds the monitor chrome around the canvas and exposes typed setters so the
// host never touches the DOM directly.

export function createUI(root) {
  const px = GRID_SIZE * CELL_SIZE

  root.innerHTML = `
    <main class="monitor" role="application" aria-label="Differential Snake monitor">
      <header class="monitor__bar">
        <div class="brand">
          <span class="brand__rx">℞</span>
          <div>
            <h1 class="brand__title">DIFFERENTIAL</h1>
            <p class="brand__sub">Patient Monitor · Bed 04</p>
          </div>
        </div>
        <button id="muteBtn" class="icon-btn" title="Mute (M)" aria-label="Toggle sound">♪</button>
      </header>

      <div class="vitals">
        <div class="vital">
          <span class="vital__label">DIAGNOSES</span>
          <span class="vital__value" id="score">0</span>
        </div>
        <div class="vital">
          <span class="vital__label">HEART RATE</span>
          <span class="vital__value vital__value--hr" id="bpm">60<small>bpm</small></span>
        </div>
        <div class="vital">
          <span class="vital__label">RECORD</span>
          <span class="vital__value vital__value--hi" id="hi">0</span>
        </div>
        <div class="vital">
          <span class="vital__label">CHART LENGTH</span>
          <span class="vital__value" id="len">3</span>
        </div>
      </div>

      <div class="screen">
        <canvas id="game" width="${px}" height="${px}"
                aria-label="Game field"></canvas>
        <div class="screen__status" id="effect"></div>
      </div>

      <p class="quote" id="quote">Symptoms first. Sarcasm second.</p>

      <footer class="monitor__foot">
        <button id="restartBtn" class="btn btn--primary">NEW PATIENT</button>
        <span class="legend">
          <b>← ↑ → ↓ / WASD</b> steer &nbsp;·&nbsp;
          <b>Space</b> stabilize &nbsp;·&nbsp;
          <b>Enter</b> new patient
        </span>
      </footer>
    </main>
  `

  const $ = sel => root.querySelector(sel)
  const els = {
    canvas:    $('#game'),
    restartBtn:$('#restartBtn'),
    muteBtn:   $('#muteBtn'),
    score:     $('#score'),
    bpm:       $('#bpm'),
    hi:        $('#hi'),
    len:       $('#len'),
    effect:    $('#effect'),
    quote:     $('#quote'),
  }

  function flash(el) {
    el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse')
  }

  return {
    canvas: els.canvas,
    restartBtn: els.restartBtn,
    muteBtn: els.muteBtn,
    setScore(n) { els.score.textContent = n; flash(els.score) },
    setBpm(n)   { els.bpm.innerHTML = `${n}<small>bpm</small>` },
    setHigh(n)  { els.hi.textContent = n },
    setLength(n){ els.len.textContent = n },
    setQuote(q) { els.quote.textContent = q; flash(els.quote) },
    setMuted(m) { els.muteBtn.textContent = m ? '♪̶' : '♪'; els.muteBtn.classList.toggle('muted', m) },
    setEffect(label, color) {
      if (!label) { els.effect.textContent = ''; els.effect.style.opacity = 0; return }
      els.effect.textContent = label
      els.effect.style.color = color
      els.effect.style.opacity = 1
    },
  }
}
