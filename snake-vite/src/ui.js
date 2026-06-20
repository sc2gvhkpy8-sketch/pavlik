export function createUI(root) {
  root.innerHTML = `
    <div class="game-container">
      <div class="header">
        <span>Snake</span>
        <span class="score" id="score">0</span>
      </div>
      <canvas id="game" width="400" height="400"></canvas>
      <div id="status"></div>
      <div class="controls">
        <button id="restartBtn">Новая игра</button>
      </div>
      <div class="hint">← ↑ → ↓ — управление, Пробел — пауза</div>
    </div>
  `

  const canvas = root.querySelector('#game')
  const scoreEl = root.querySelector('#score')
  const statusEl = root.querySelector('#status')
  const restartBtn = root.querySelector('#restartBtn')

  function setScore(n) { scoreEl.textContent = n }
  function setStatus(text) { statusEl.textContent = text }

  return { canvas, restartBtn, setScore, setStatus }
}
