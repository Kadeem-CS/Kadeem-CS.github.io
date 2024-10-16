// Initialize Konva stage and layers
const stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight
});

const layer = new Konva.Layer();
stage.add(layer);

// Create the player (the shooter)
const player = new Konva.Circle({
    x: stage.width() / 2,
    y: stage.height() / 2,
    radius: 20,
    fill: 'blue',
    stroke: 'black',
    strokeWidth: 2
});
layer.add(player);

// Create enemies
const enemies = [];
const numEnemies = 10;

const createEnemy = () => {
    const enemy = new Konva.Circle({
        x: Math.random() * stage.width(),
        y: Math.random() * stage.height(),
        radius: 15,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 2
    });
    enemies.push(enemy);
    layer.add(enemy);
};

// Initially spawn enemies
for (let i = 0; i < numEnemies; i++) {
    createEnemy();
}

// Score and timer variables
let score = 0;
let timer = 60; // 1 minute timer
const scoreLabel = new Konva.Text({
    x: 10,
    y: 10,
    text: `Score: ${score}`,
    fontSize: 20,
    fontFamily: 'Arial',
    fill: 'black'
});
layer.add(scoreLabel);

const timerLabel = new Konva.Text({
    x: stage.width() - 100,
    y: 10,
    text: `Time: ${timer}`,
    fontSize: 20,
    fontFamily: 'Arial',
    fill: 'black'
});
layer.add(timerLabel);

// Pause and resume variables
let isPaused = false;
const pauseLabel = new Konva.Text({
    x: stage.width() / 2 - 50,
    y: stage.height() / 2 - 20,
    text: 'Paused',
    fontSize: 30,
    fontFamily: 'Arial',
    fill: 'black',
    visible: false // Initially hidden
});
layer.add(pauseLabel);

// Player movement
const speed = 5;
document.addEventListener('keydown', (e) => {
    if (e.key === 'p') { // Pause/resume game
        isPaused = !isPaused;
        pauseLabel.visible(isPaused);
        layer.batchDraw();
        return; // Skip other controls when paused
    }

    if (isPaused) return; // Prevent movement when paused

    switch (e.key) {
        case 'ArrowUp':
        case 'w':
            player.y(player.y() - speed);
            break;
        case 'ArrowDown':
        case 's':
            player.y(player.y() + speed);
            break;
        case 'ArrowLeft':
        case 'a':
            player.x(player.x() - speed);
            break;
        case 'ArrowRight':
        case 'd':
            player.x(player.x() + speed);
            break;
    }
    layer.batchDraw();
});

// Sound effects
const shootSound = new Audio('shootSound.mp3'); // Path to shooting sound
const collisionSound = new Audio('collisionSound.mp3'); // Path to collision sound

// Shooting bullets
const bullets = [];
const bulletSpeed = 10;

document.addEventListener('click', (e) => {
    if (isPaused) return; // Prevent shooting when paused

    // Play shoot sound
    shootSound.currentTime = 0; // Reset sound to the beginning
    shootSound.play();

    const pointerPosition = stage.getPointerPosition();
    const angle = Math.atan2(
        pointerPosition.y - player.y(),
        pointerPosition.x - player.x()
    );

    // Create bullet at player's position
    const bullet = new Konva.Line({
        points: [player.x(), player.y(), player.x() + Math.cos(angle) * 10, player.y() + Math.sin(angle) * 10],
        stroke: 'black',
        strokeWidth: 5
    });

    // Store bullet's direction
    bullet.direction = angle; // Store direction for movement
    layer.add(bullet);
    bullets.push(bullet);
});

// Update bullets position
const updateBullets = () => {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        const points = bullet.points();

        // Move bullet in the direction it was shot
        points[0] += Math.cos(bullet.direction) * bulletSpeed; // x1
        points[1] += Math.sin(bullet.direction) * bulletSpeed; // y1
        points[2] += Math.cos(bullet.direction) * bulletSpeed; // x2
        points[3] += Math.sin(bullet.direction) * bulletSpeed; // y2

        bullet.points(points);
        
        // Check for out-of-bounds
        if (points[0] < 0 || points[1] < 0 || points[2] > stage.width() || points[3] > stage.height()) {
            bullet.destroy();
            bullets.splice(i, 1);
            continue; // Skip to the next iteration
        }

        // Check for collisions with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const enemyPos = {
                x: enemy.x(),
                y: enemy.y(),
                radius: enemy.radius()
            };
            const bulletPos = {
                x: points[0],
                y: points[1],
                radius: 5 // Bullet radius (adjust if needed)
            };

            if (checkCollision(enemyPos, bulletPos)) {
                // Play collision sound
                collisionSound.currentTime = 0; // Reset sound to the beginning
                collisionSound.play();

                // Update score and display it
                score++;
                scoreLabel.text(`Score: ${score}`);
                layer.batchDraw();

                // Remove the enemy
                enemy.destroy();
                enemies.splice(j, 1);
                // Remove the bullet
                bullet.destroy();
                bullets.splice(i, 1);
                break; // Exit the enemy loop since the bullet is already removed
            }
        }
    }
};

// Collision detection function
const checkCollision = (enemy, bullet) => {
    const dx = enemy.x - bullet.x;
    const dy = enemy.y - bullet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < enemy.radius + bullet.radius;
};

// Respawn enemies after an interval
const respawnEnemies = () => {
    while (enemies.length < numEnemies) {
        createEnemy();
    }
};

// Set interval for respawning enemies every 5 seconds
setInterval(respawnEnemies, 5000);

// Timer countdown
const timerInterval = setInterval(() => {
    if (!isPaused) {
        timer--;
        timerLabel.text(`Time: ${timer}`);
        layer.batchDraw();

        if (timer <= 0) {
            clearInterval(timerInterval);
            alert('Game Over! Your score: ' + score);
            window.location.reload(); // Reload the game
        }
    }
}, 1000); // Update every second

// Game loop
const gameLoop = () => {
    if (!isPaused) {
        updateBullets();
        layer.batchDraw();
    }
    requestAnimationFrame(gameLoop);
};

gameLoop();
