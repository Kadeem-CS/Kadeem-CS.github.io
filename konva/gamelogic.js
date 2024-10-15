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

for (let i = 0; i < numEnemies; i++) {
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
}

// Player movement
const speed = 5;
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            player.y(player.y() - speed);
            break;
        case 'ArrowDown':
            player.y(player.y() + speed);
            break;
        case 'ArrowLeft':
            player.x(player.x() - speed);
            break;
        case 'ArrowRight':
            player.x(player.x() + speed);
            break;
    }
    layer.batchDraw();
});

// Shooting bullets
const bullets = [];
const bulletSpeed = 10;

document.addEventListener('click', (e) => {
    const pointerPosition = stage.getPointerPosition();
    const angle = Math.atan2(
        pointerPosition.y - player.y(),
        pointerPosition.x - player.x()
    );

    const bullet = new Konva.Line({
        points: [player.x(), player.y(), player.x() + Math.cos(angle) * 10, player.y() + Math.sin(angle) * 10],
        stroke: 'black',
        strokeWidth: 5
    });
    layer.add(bullet);
    bullets.push(bullet);
});

// Update bullets position
const updateBullets = () => {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        const points = bullet.points();
        points[0] += Math.cos(Math.atan2(
            points[3] - points[1],
            points[2] - points[0]
        )) * bulletSpeed;
        points[1] += Math.sin(Math.atan2(
            points[3] - points[1],
            points[2] - points[0]
        )) * bulletSpeed;
        points[2] += Math.cos(Math.atan2(
            points[3] - points[1],
            points[2] - points[0]
        )) * bulletSpeed;
        points[3] += Math.sin(Math.atan2(
            points[3] - points[1],
            points[2] - points[0]
        )) * bulletSpeed;
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

// Game loop
const gameLoop = () => {
    updateBullets();
    layer.batchDraw();
    requestAnimationFrame(gameLoop);
};

gameLoop();

