// --- CONFIGURACIÓN E INICIALIZACIÓN ---

// Seleccionamos el contenedor del juego desde el HTML
const game_container = document.getElementById('game-container');

// Tamaño de cada celda de la cuadrícula (en píxeles)
const gridSize = 20; 

// La serpiente es un array de objetos. El primer objeto es la cabeza.
// Empezamos en la posición x:200, y:200
let snake = [{ x: 200, y: 200 }]; 

// Objeto para almacenar la posición actual de la fruta
let food = { x: 0, y: 0 };

// Velocidad actual: dx es horizontal, dy es vertical.
// Empezamos en 0 para que no se mueva hasta que el jugador presione una tecla.
let dx = 0; 
let dy = 0; 

// Variable para guardar el intervalo del juego y poder detenerlo después
let gameInterval;

/**
 * Función que arranca el juego
 */
function gameStart() {
    generateFruits(); // Coloca la primera fruta en el mapa
    // Ejecuta la función gameLoop cada 100 milisegundos (10 FPS)
    gameInterval = setInterval(gameLoop, 100);
}

/**
 * El "corazón" del juego: se ejecuta repetidamente
 */
function gameLoop() {
    // Verificar si el jugador perdió
    if (gameLose()) {
        alert("Game Over!");
        clearInterval(gameInterval); // Detiene el bucle
        location.reload();           // Reinicia la página para empezar de cero
        return;
    }

    // Si no ha perdido, mover la serpiente y dibujar los cambios
    moveSnake();
    draw();
}

/**
 * Gestiona el movimiento de la serpiente y la lógica de atravesar paredes
 */
function moveSnake() {
    // Calculamos dónde estaría la cabeza en el siguiente paso
    let nextX = snake[0].x + dx;
    let nextY = snake[0].y + dy;

    // LÓGICA DE "WRAPPING" (Atravesar paredes)
    // Si sale por la izquierda (< 0), aparece por la derecha (700)
    if (nextX < 0) {
        nextX = 700 - gridSize; 
    } else if (nextX >= 700) { // Si sale por la derecha, aparece por la izquierda
        nextX = 0; 
    }

    // Lo mismo para el eje vertical (arriba y abajo)
    if (nextY < 0) {
        nextY = 700 - gridSize; 
    } else if (nextY >= 700) {
        nextY = 0; 
    }

    // Creamos la nueva cabeza con las coordenadas calculadas
    const head = { x: nextX, y: nextY };
    
    // Agregamos la nueva cabeza al inicio del array de la serpiente
    snake.unshift(head);

    // Comprobamos si la cabeza está en la misma posición que la fruta
    if (head.x === food.x && head.y === food.y) {
        generateFruits(); // Si come, generamos una nueva fruta y NO quitamos la cola (crece)
    } else {
        // Si no come, eliminamos el último segmento (la cola) para mantener el tamaño
        snake.pop();
    }
}

/**
 * Genera una posición aleatoria para la fruta alineada a la cuadrícula
 */
function generateFruits() {
    // Calculamos una posición X e Y aleatoria dentro del ancho/alto del contenedor
    // Math.floor(...) * gridSize asegura que la fruta siempre caiga en un múltiplo de 20
    food.x = Math.floor(Math.random() * (game_container.clientWidth / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (game_container.clientHeight / gridSize)) * gridSize;
}

/**
 * Verifica las condiciones de derrota
 */
function gameLose() {
    const head = snake[0];
    
    // Verificamos si la cabeza choca con alguna otra parte del cuerpo
    // .slice(1) toma todo el cuerpo excepto la cabeza
    // .some() devuelve true si alguna parte coincide con la posición de la cabeza
    const hitSelf = snake.slice(1).some(part => part.x === head.x && part.y === head.y);
    
    return hitSelf;
}

/**
 * Renderiza (dibuja) la serpiente y la fruta en el HTML
 */
function draw() {
    // 1. Limpiamos el contenedor para redibujar todo desde cero
    game_container.innerHTML = ''; 
    
    // 2. Recorremos cada segmento de la serpiente
    snake.forEach((part, index) => {
        const snakeEl = document.createElement('div');
        snakeEl.style.left = `${part.x}px`;
        snakeEl.style.top = `${part.y}px`;
        
        if (index === 0) {
            // --- CABEZA ---
            // Usamos la rotación controlada por las flechas (0° es abajo)
            snakeEl.classList.add('snake-head');
            snakeEl.style.transform = `rotate(${rotation}deg)`;
            
        } else if (index === snake.length - 1 && snake.length > 1) {
            // --- COLA ---
            // La cola debe apuntar hacia afuera. Comparamos con el segmento de delante (prev).
            snakeEl.classList.add('snake-tail');
            
            const prev = snake[index - 1]; 
            let tailRotation = 0;

            let diffX = prev.x - part.x;
            let diffY = prev.y - part.y;

            // Corrección por si atraviesa paredes (wrapping)
            if (diffX > gridSize) diffX = -gridSize;
            else if (diffX < -gridSize) diffX = gridSize;
            if (diffY > gridSize) diffY = -gridSize;
            else if (diffY < -gridSize) diffY = gridSize;

            // LOGICA DE GIRO PARA TAIL.JPG (Que apunta a la derecha por defecto):
            // Si el cuerpo está a la derecha (diffX > 0), la punta de la cola debe mirar a la IZQUIERDA.
            if (diffX > 0) tailRotation = 180;      // Punta a la izquierda
            else if (diffX < 0) tailRotation = 0;   // Punta a la derecha
            else if (diffY > 0) tailRotation = 270; // Punta hacia arriba
            else if (diffY < 0) tailRotation = 90;  // Punta hacia abajo
            
            snakeEl.style.transform = `rotate(${tailRotation}deg)`;
            
        } else {
            // --- CUERPO ---
            // Segmentos de escamas intermedios
            snakeEl.classList.add('snake-body');
        }
        
        game_container.appendChild(snakeEl);
    });

    // 3. Dibujamos la fruta
    const fruitEl = document.createElement('div');
    fruitEl.style.left = `${food.x}px`;
    fruitEl.style.top = `${food.y}px`;
    fruitEl.classList.add('fruit');
    game_container.appendChild(fruitEl);
}

// --- CONTROLES DE USUARIO ---

let rotation = 0; // La imagen original mira hacia ABAJO (0 grados)

// Escuchamos las teclas presionadas
window.addEventListener('keydown', e => {
    // Cambiamos dx y dy según la flecha, pero evitamos que la serpiente
    // pueda darse la vuelta sobre sí misma (ej: si va arriba, no puede ir abajo)
    // Ajustamos los grados asumiendo que el "frente" de tu imagen es ABAJO
    if (e.key === 'ArrowUp' && dy === 0) { 
        dx = 0; dy = -gridSize; rotation = 180; // Girar totalmente hacia arriba
    }
    if (e.key === 'ArrowDown' && dy === 0) { 
        dx = 0; dy = gridSize; rotation = 0;    // Posición original (abajo)
    }
    if (e.key === 'ArrowLeft' && dx === 0) { 
        dx = -gridSize; dy = 0; rotation = 90;  // Girar a la izquierda
    }
    if (e.key === 'ArrowRight' && dx === 0) { 
        dx = gridSize; dy = 0; rotation = 270; // Girar a la derecha
    }
});

// Iniciamos el proceso
gameStart();