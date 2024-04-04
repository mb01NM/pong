
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
    aiPaddle.y += ((ball.y - (aiPaddle.y + aiPaddle.height / 2))) * 0.09;

    // Collision detection on paddles
    let player = (ball.x < canvas.width / 2) ? userPaddle : aiPaddle;

    if (collision(ball, player)) {
        // Calculate angle in RADIANS
        let angle = 0;
        if (ball.y < (player.y + player.height / 2)) {
            // If ball hit the top of paddle
            angle = -Math.PI / 4;
        } else if (ball.y > (player.y + player.height / 2)) {
            // If ball hit the bottom of paddle
            angle = Math.PI / 4;
        }

        // Change velocity of ball
        ball.velocityX = (player === userPaddle ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        // Increase speed after each hit
        ball.speed += 0.1;
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
    ball.speed = 7;
}


// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

// Listen for keyboard events
window.addEventListener('keydown', function(event) {
    switch (event.key) {
        case "ArrowUp": // Up arrow key
        case "w": // 'W' key
            // Move the user paddle up
            if (userPaddle.y > 0) {
                userPaddle.y -= 20;
            }
            break;
        case "ArrowDown": // Down arrow key
        case "s": // 'S' key
            // Move the user paddle down
            if (userPaddle.y < canvas.height - userPaddle.height) {
                userPaddle.y += 20;
            }
            break;
    }
});

// Start the game
gameLoop();
