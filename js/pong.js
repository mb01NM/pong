
// Access the canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Define game entities and initial settings
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "WHITE"
};

const userPaddle = {
    x: 0, // left side of canvas
    y: (canvas.height - 100) / 2, // -100 the height of paddle
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
};

const aiPaddle = {
    x: canvas.width - 10, // - width of paddle
    y: (canvas.height - 100) / 2, // -100 the height of paddle
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
};

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// Render the game
function render() {
    // Clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, 'BLACK');
    // Draw the paddles and ball
    drawRect(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, userPaddle.color);
    drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, aiPaddle.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    // Draw the score
    drawText(userPaddle.score, canvas.width / 4, canvas.height / 5, "WHITE");
    drawText(aiPaddle.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");
}

// Update game state
function update() {
    // Here we would update the positions of paddles and ball
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Listen for keyboard events
window.addEventListener('keydown', function(event) {
    // Here we would handle paddle movement
});

// Start the game
gameLoop();
