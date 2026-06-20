import { CELL_SIZE } from './constants.js'

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  function clear() {
    ctx.fillStyle = '#0f3460'
    ctx.fillRect(0, 0, w, h)
  }

  function drawSnake(snake) {
    for (let i = 0; i < snake.length; i++) {
      const s = snake[i]
      const t = snake.length > 1 ? i / (snake.length - 1) : 0
      const r = Math.round(30 + t * 60)
      const g = Math.round(200 - t * 80)
      const b = Math.round(130 - t * 60)
      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(
        s.x * CELL_SIZE + 1,
        s.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2,
      )
    }
  }

  function drawFood(food) {
    if (!food) return
    ctx.fillStyle = '#e94560'
    const fx = food.x * CELL_SIZE + CELL_SIZE / 2
    const fy = food.y * CELL_SIZE + CELL_SIZE / 2
    ctx.beginPath()
    ctx.arc(fx, fy, CELL_SIZE / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
  }

  function drawOverlay(text) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 32px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, w / 2, h / 2)
  }

  function render(snake, food, overlay) {
    clear()
    drawSnake(snake)
    drawFood(food)
    if (overlay) drawOverlay(overlay)
  }

  return { render }
}
