const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
 
// Bird settings
const bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
};
 
// Pipe settings
let pipes = [];
const pipeWidth = 30;
const pipeGap = 100;
const pipeFrequency = 90; // How often pipes appear (in frames)
let frameCount = 0;
 
// Game state
let score = 0;
let isGameOver = false;
 
// Load bird image
const birdImg = new Image();
birdImg.src = 'https://i.imgur.com/srULmcH.png';
 
// Listen for key presses
document.addEventListener('keydown', () => {
    bird.velocity = bird.lift;
});
 
// Create pipes
function createPipe() {
    const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 40)) + 20;
    pipes.push({
        x: canvas.width,
        topHeight: pipeHeight,
        bottomHeight: canvas.height - pipeHeight - pipeGap,
    });
}
 
// Draw bird
function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}
 
// Draw pipes
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = '#333';
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
    });
}
 
// Update bird
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
 
    // Prevent bird from falling out of canvas
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
        isGameOver = true;
    } else if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}
 
// Update pipes
function updatePipes() {
    pipes.forEach((pipe, index) => {
        pipe.x -= 2;
 
        // If the pipe is off the screen, remove it and increase score
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }
 
        // Check collision with pipes
        if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)) {
            isGameOver = true;
        }
    });
}
 
// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    if (isGameOver) {
        ctx.fillStyle = '#000';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over!', 80, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Score: ' + score, 120, canvas.height / 2 + 40);
        return;
    }
 
    updateBird();
    updatePipes();
    drawBird();
    drawPipes();
 
    // Add new pipes
    frameCount++;
    if (frameCount % pipeFrequency === 0) {
        createPipe();
    }
 
    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
 
    requestAnimationFrame(gameLoop);
}
 
// Start game
gameLoop();

