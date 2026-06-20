import { GRID_SIZE } from './constants.js'

export const DIR = {
  UP:    { x:  0, y: -1 },
  DOWN:  { x:  0, y:  1 },
  LEFT:  { x: -1, y:  0 },
  RIGHT: { x:  1, y:  0 },
}

export function randomCell() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }
}

export function isOpposite(a, b) {
  return a.x + b.x === 0 && a.y + b.y === 0
}

export function createInitialSnake() {
  const cx = Math.floor(GRID_SIZE / 2)
  const cy = Math.floor(GRID_SIZE / 2)
  return [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ]
}

export function spawnFood(snake) {
  const occupied = new Set(snake.map(c => `${c.x},${c.y}`))
  if (occupied.size >= GRID_SIZE * GRID_SIZE) return null
  let cell
  do { cell = randomCell() } while (occupied.has(`${cell.x},${cell.y}`))
  return cell
}

export function tick(snake, direction, food) {
  const head = snake[0]
  const newHead = {
    x: head.x + direction.x,
    y: head.y + direction.y,
  }

  if (newHead.x < 0 || newHead.x >= GRID_SIZE ||
      newHead.y < 0 || newHead.y >= GRID_SIZE) {
    return { snake, food, scoreDelta: 0, dead: true, reason: 'wall' }
  }

  if (snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
    return { snake, food, scoreDelta: 0, dead: true, reason: 'self' }
  }

  const newSnake = [newHead, ...snake]
  let ate = false

  if (food && newHead.x === food.x && newHead.y === food.y) {
    ate = true
  } else {
    newSnake.pop()
  }

  const newFood = ate ? spawnFood(newSnake) : food

  if (ate && !newFood) {
    return { snake: newSnake, food: null, scoreDelta: 1, dead: true, reason: 'win' }
  }

  return { snake: newSnake, food: newFood, scoreDelta: ate ? 1 : 0, dead: false }
}
