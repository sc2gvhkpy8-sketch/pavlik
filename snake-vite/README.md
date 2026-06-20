# Snake Game 🐍

Классическая игра «Змейка» на JavaScript с использованием Vite.

## Архитектура

```
snake-vite/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.js          # Game loop, инициализация, связка модулей
│   ├── constants.js     # GRID_SIZE, CELL_SIZE, TICK_MS
│   ├── game.js          # Чистая логика: движение, коллизии, еда
│   ├── renderer.js      # Canvas-рендеринг (snake, food, overlay)
│   ├── input.js         # Клавиатура + очередь направлений
│   ├── ui.js            # DOM-интерфейс (счёт, кнопки)
│   └── style.css
├── index.html
├── package.json
├── vite.config.js
├── LICENSE
└── README.md
```

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

Готовые файлы в `dist/`.

## Особенности

- **Canvas API** — плавный рендеринг с градиентом змейки
- **requestAnimationFrame** — фиксированный тик 130ms
- **Чистая логика** — `tick()` — pure function без мутаций
- **Очередь направлений** — защита от разворота на 180°
- **Set для коллизий** — быстрая проверка при генерации еды
- Пробел — пауза, поддержка рестарта
- Победа при заполнении всего поля

## Управление

| Клавиша | Действие |
|---------|----------|
| ← ↑ → ↓ | Движение |
| Пробел  | Пауза   |

## Лицензия

MIT
