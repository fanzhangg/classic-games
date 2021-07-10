// variables to keep track of ball position
var ballX = 75, ballY = 75;
var ballSpeedX, ballSpeedY = 4;

var ballBounceSound = new soundOverlapsClass("assets/resource/sounds/bloop");
var ballMissSound = new soundOverlapsClass("assets/resource/sounds/miss");

const BALL_SPEED_MIN = 10;
const BALL_SPEED_MED = 18;
const BALL_SPEED_MAX = 25;
const BALL_HITCOUNT_MED = 4;
const BALL_HITCOUNT_MAX = 12;
var ballHitCounterPerRound = 0;

function ballChangeXSpeedKeepDirection(toSpeed) {
    var direction;

    if (ballSpeedX < 0) {
        direction = -1;
    } else {
        direction = 1;
    }

    ballSpeedX = toSpeed * direction;
}

function ballResetHitsAndSpeed() {
    ballHitCounterPerRound = 0;
    ballChangeXSpeedKeepDirection(BALL_SPEED_MIN);
}

function ballHitCountAndSpeedChange() {
    ballHitCounterPerRound++;
    if (ballHitCounterPerRound == BALL_HITCOUNT_MED) {
        ballChangeXSpeedKeepDirection(BALL_SPEED_MED);
    }
    if (ballHitCounterPerRound == BALL_HITCOUNT_MAX) {
        ballChangeXSpeedKeepDirection(BALL_SPEED_MAX);
    }
}

function ballReset() {
    if (paddle1Score >= WINNING_SCORE || paddle2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }

    // reverse ball heading, so whoever scored a point "serves"
    ballSpeedX = -ballSpeedX;
    ballResetHitsAndSpeed();

    // give ball some slightly randomized diagonal, but not too steep
    ballSpeedY = 5.0 + Math.random() * 4.0;
    // and half the time reverse whether it goes up or down first
    if (Math.random() < 0.5) {
        ballSpeedY *= -1.0;
    }

    // center ball on screen
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function ballDraw() {
    colorCircle(ballX, ballY, 10, 'white');
}

function ballMove() {
    // if ball has moved whithin the left paddle
    if (ballSpeedX < 0.0 &&
        ballY > paddle1Y &&
        ballY < paddle1Y + PADDLE_HEIGHT &&
        ballX > PADDLE_DIST_FROM_EDGE &&
        ballX < PADDLE_DIST_FROM_EDGE + PADDLE_THICKNESS) {
        ballSpeedX *= -1; // reverse ball's horizontal direction

        ballHitCountAndSpeedChange();

        var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
        ballBounceSound.play();
    }

    if (ballX < 0) { // If ball has moved beyond the left edge
        paddle2Score++;
        ballMissSound.play();
        ballReset();
    }


    // if ball has moved whithin the right paddle
    if (ballSpeedX > 0.0 &&
        ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT &&
        ballX < canvas.width - PADDLE_DIST_FROM_EDGE &&
        ballX > canvas.width - (PADDLE_DIST_FROM_EDGE + PADDLE_THICKNESS)) {
        ballSpeedX *= -1; // reverse ball's horizontal direction

        ballHitCountAndSpeedChange();

        var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
        ballBounceSound.play();
    }

    // If the ball has moved beyond the right edge
    if (ballX > canvas.width) {
        paddle1Score++;
        ballMissSound.play();
        ballReset();
    }

    if (ballY < 0) { // if ball has moved beyond the top edge
        ballSpeedY *= -1; // reverse ball's vertical direction
        ballBounceSound.play();
    }

    if (ballY > canvas.height) { // if ball has moved beyond the bottom edge
        ballSpeedY *= -1; // reverse ball's vertical direction
        ballBounceSound.play();
    }

    ballX += ballSpeedX; // move the ball based on its current horizontal speed 
    ballY += ballSpeedY; // same as above, but for vertical
}