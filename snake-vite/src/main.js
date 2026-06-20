import { TICK_MS } from './constants.js'
import { createInitialSnake, spawnFood, tick, DIR } from './game.js'
import { createRenderer } from './renderer.js'
import { createInputHandler } from './input.js'
import { createUI } from './ui.js'
import './style.css'

const root = document.getElementById('root')
const { canvas, restartBtn, setScore, setStatus } = createUI(root)
const renderer = createRenderer(canvas)
const input = createInputHandler()

let snake = createInitialSnake()
let food = spawnFood(snake)
let direction = DIR.RIGHT
let score = 0
let dead = false
let lastTick = 0
let rafId = null

function reset() {
  snake = createInitialSnake()
  food = spawnFood(snake)
  direction = DIR.RIGHT
  score = 0
  dead = false
  lastTick = 0
  setScore(0)
  setStatus('')
  input.reset()
}

function loop(timestamp) {
  if (dead) {
    rafId = requestAnimationFrame(loop)
    return
  }

  if (timestamp - lastTick >= TICK_MS) {
    lastTick = timestamp

    if (!input.paused) {
      direction = input.consumeDirection(direction)

      const result = tick(snake, direction, food)
      snake = result.snake
      food = result.food
      score += result.scoreDelta
      setScore(score)

      if (result.dead) {
        dead = true
        if (result.reason === 'win') {
          setStatus('🎉 Вы выиграли!')
        } else {
          setStatus('💀 Game Over')
        }
      }
    }
  }

  const overlay = dead
    ? 'Game Over'
    : input.paused
      ? 'Пауза'
      : null

  renderer.render(snake, food, overlay)
  rafId = requestAnimationFrame(loop)
}

restartBtn.addEventListener('click', () => {
  reset()
  renderer.render(snake, food, null)
})

reset()
renderer.render(snake, food, null)
rafId = requestAnimationFrame(loop)
