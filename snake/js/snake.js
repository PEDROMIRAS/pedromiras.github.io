const game_container = document.getElementById('game-container');
const gridSize = 20;
let snake = [{ x: 200, y: 200 }]; // Array of segments
let food = { x: 0, y: 0 };
let dx = 0; // Horizontal velocity
let dy = 0; // Vertical velocity
let gameInterval;

function gameStart() {
    generateFruits();
    // Start the game loop (runs every 100ms)
    gameInterval = setInterval(gameLoop, 150);
}

function gameLoop() {
    if (gameLose()) {
        alert("Game Over!");
        clearInterval(gameInterval);
        location.reload(); // Restart the game
        return;
    }

    moveSnake();
    draw();
}

function moveSnake() {
    // Calculamos la nueva posición sumando la velocidad actual
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Añadimos la nueva cabeza al inicio
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        generateFruits();
    } else {
        snake.pop();
    }
}

function generateFruits() {
    food.x = Math.floor(Math.random() * (game_container.clientWidth / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (game_container.clientHeight / gridSize)) * gridSize;
}

function gameLose() {
    const head = snake[0];

    // Colisión con paredes (si la cabeza toca o supera los 400px o baja de 0)
    const hitWall = head.x < 0 || head.x >= 700 || head.y < 0 || head.y >= 700;

    // Colisión con el propio cuerpo
    const hitSelf = snake.slice(1).some(part => part.x === head.x && part.y === head.y);

    return hitWall || hitSelf;
}

function draw() {
    game_container.innerHTML = ''; // Clear board
    
    // Draw Snake
    snake.forEach(part => {
        const snakeEl = document.createElement('div');
        snakeEl.style.left = `${part.x}px`;
        snakeEl.style.top = `${part.y}px`;
        snakeEl.classList.add('snake-part');
        game_container.appendChild(snakeEl);
    });

    // Draw Fruit
    const fruitEl = document.createElement('div');
    fruitEl.style.left = `${food.x}px`;
    fruitEl.style.top = `${food.y}px`;
    fruitEl.classList.add('fruit');
    game_container.appendChild(fruitEl);
}

// Input Handling
window.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -gridSize; }
    if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = gridSize; }
    if (e.key === 'ArrowLeft' && dx === 0) { dx = -gridSize; dy = 0; }
    if (e.key === 'ArrowRight' && dx === 0) { dx = gridSize; dy = 0; }
});

gameStart();