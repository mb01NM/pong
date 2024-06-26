// Constants for initial settings
const INITIAL_BALL_SPEED = 7;
const BALL_RADIUS = 7;
const PADDLE_WIDTH = 7;
const PADDLE_HEIGHT = 70;
const INITIAL_VELOCITY_X = 5;
const INITIAL_VELOCITY_Y = 5;
const AI_PADDLE_SPEED_FACTOR = 0.14;

// Access the canvas and context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Define game entities and initial settings
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: BALL_RADIUS,
    velocityX: INITIAL_VELOCITY_X,
    velocityY: INITIAL_VELOCITY_Y,
    speed: INITIAL_BALL_SPEED,
    color: "WHITE"
};

const userPaddle = {
    x: 0, // left side of canvas
    y: (canvas.height - PADDLE_HEIGHT) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    score: 0,
    color: "WHITE"
};

const aiPaddle = {
    x: canvas.width - PADDLE_WIDTH, // Adjust for the narrower paddle
    y: (canvas.height - PADDLE_HEIGHT) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
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
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
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

function update() {
    // Move the ball by its velocity
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Simple AI to control the aiPaddle (move towards the ball)
    aiPaddle.y += ((ball.y - (aiPaddle.y + aiPaddle.height / 2))) * 0.14;

    // Collision detection on paddles
    let player = (ball.x < canvas.width / 2) ? userPaddle : aiPaddle;

    if (collision(ball, player)) {
        // Calculate where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height / 2));
        // Normalize the collision point from -1 to 1 (-1 being the top of the paddle, 1 being the bottom)
        collidePoint = collidePoint / (player.height / 2);

        // Calculate the angle in Radians
        let angleRad = (Math.PI / 4) * collidePoint; // This will max out at 45 degrees

        // Change the X and Y velocity direction
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Speed up the ball every hit
        ball.speed += 0.5;
    }

    // Detect collision with top and bottom walls
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY; // Reverse the Y velocity
    }

    // Point scored
    if (ball.x - ball.radius < 0) {
        // AI scores
        aiPaddle.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        // User scores
        userPaddle.score++;
        resetBall();
    }
}

function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = INITIAL_BALL_SPEED; // Reset the ball's speed to its initial value
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

let isMouseDown = false;

// Mouse control event listeners
canvas.addEventListener('mousedown', function(event) {
    isMouseDown = true;
});

canvas.addEventListener('mousemove', function(event) {
    if (isMouseDown) {
        let rect = canvas.getBoundingClientRect();
        let mouseY = event.clientY - rect.top;
        userPaddle.y = mouseY - userPaddle.height / 2;
        if (userPaddle.y < 0) {
            userPaddle.y = 0;
        } else if (userPaddle.y > canvas.height - userPaddle.height) {
            userPaddle.y = canvas.height - userPaddle.height;
        }
    }
});

window.addEventListener('mouseup', function(event) {
    isMouseDown = false;
});

// Start the game
gameLoop();
