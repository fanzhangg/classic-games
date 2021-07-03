// Ball variables
var ballX = 75,
  ballY = 75;
var ballSpeedX = 5,
  ballSpeedY = 5;

// Paddle vairiables
var paddle1Y = 250;
var paddle2Y = 250;
var showingWinScreen = false;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_MAX_SPEED = 10;
const WINNING_SCORE = 2;

// score
var paddle1Score = 0;
var paddle2Score = 0;

// Canvas variables
var canvas;
var canvasContext;

window.onload = function () {
  // window.onload gets run automatically when the page finishes loading
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    // paddle2Y = mousePos.y - (PADDLE_HEIGHT / 2);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });

  canvas.addEventListener("mousedown", handleMouseClick);

  canvasContext.textAlign = "center";

  // game logic
  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);
};

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect(),
    root = document.documentElement;

  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function handleMouseClick(evt) {
  if (showingWinScreen) {
    paddle1Score = 0;
    paddle2Score = 0;
    showingWinScreen = false;
  }
}

function _loadFont(fontname){
  var canvas = document.createElement("canvas");
  //Setting the height and width is not really required
  canvas.width = 16;
  canvas.height = 16;
  var ctx = canvas.getContext("2d");

  //There is no need to attach the canvas anywhere,
  //calling fillText is enough to make the browser load the active font

  //If you have more than one custom font, you can just draw all of them here
  ctx.font = "4px "+fontname;
  ctx.fillText("text", 0, 8);
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
  canvasContext.fill();
}

function colorCircle(topLeftX, topLeftY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(topLeftX, topLeftY, radius, 0, Math.PI * 2, true);
  canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor, fontSize) {
  canvasContext.font = `${fontSize}px FFFFORWA`;
  canvasContext.fillStyle = fillColor;
  canvasContext.fillText(showWords, textX, textY);
}

function ballReset() {
  if (paddle1Score >= WINNING_SCORE || paddle2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  // Reverse ball speed
  ballSpeedX = -ballSpeedX;
  // center ball on screen
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function moveComputerPaddle() {
  var ballPaddleDelta = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
  if (ballPaddleDelta > 35) {
    // The ball is below the center of paddle
    var moveDelta = PADDLE_MAX_SPEED;
    paddle2Y += moveDelta;
  } else if (ballPaddleDelta < -35) {
    // The ball is above the center of paddle
    var moveDelta = - PADDLE_MAX_SPEED;
    paddle2Y += moveDelta;
  }
}

function drawEverything() {
  // clear the game view by filling it with black
  colorRect(0, 0, canvas.width, canvas.height, "#264653");

  if (showingWinScreen) {
    if (paddle1Score >= WINNING_SCORE) {
      colorText(
      "LEFT PLAYER WINS!",
      canvas.width / 2,
      canvas.height / 2,
      "white",
      30
    );
    } else if (paddle2Score >= WINNING_SCORE) {
      colorText(
      "RIGHT PLAYER WINS!",
      canvas.width / 2,
      canvas.height / 2,
      "white",
      30
    );
    colorText("Cick to Restart", canvas.width / 2, canvas.height / 2 + 100, "white", 10);
    }
  } else {
    // Draw a dash line
    colorRect(canvas.width / 2 - 5, 0, 10, canvas.height, "#436370");

    // Draw a circle
    colorCircle(ballX, ballY, 10, "#ffb703");

    // Draw left paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "#8ecae6");

    // Draw right paddle
    colorRect(
      canvas.width - PADDLE_THICKNESS,
      paddle2Y,
      PADDLE_THICKNESS,
      PADDLE_HEIGHT,
      "#8ecae6"
    );
  }

  // display text on screen - will be used for score
  colorText(paddle1Score, 100, 100, "white", 30);
  colorText(paddle2Score, canvas.width - 100, 100, "white", 30);
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  moveComputerPaddle();

  if (ballX > canvas.width) {
    // If ball has moved beyond right edge
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX *= -1; // Bounce back

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.3;
    } else {
      paddle1Score++; // Paddle 1 wins
      ballReset();
    }
  }

  if (ballX < 0) {
    // If ball has moved beyond left edge
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX *= -1; // Bounce back

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.3;
    } else {
      paddle2Score++; // Paddle2 wins
      ballReset();
    }
  }
  if (ballY >= canvas.height || ballY <= 0) {
    // Up and bottom edge
    ballSpeedY *= -1;
  }
  ballX += ballSpeedX;
  ballY += ballSpeedY;
}