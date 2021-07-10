var gameStatus = "start";

const WINNING_SCORE = 3;

var canvas, canvasContext;

window.onload = function () {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  // set up game logic and render to 30 times/s 
  var framesPerSecond = 30;
  setInterval(function () {
    moveEverything();
    drawEverything();
  }, 1000 / framesPerSecond);

  setupMouseEventHandlers();

  ballReset();

  // lets set all text in the program to be centered instead of left justified
  canvasContext.textAlign = 'center';
}

function moveEverything() {
  if (gameStatus !== "ai" && gameStatus !== "single") {
    return;
  }

  if (gameStatus == "ai") {
    moveComputerPaddle();
  } else if (gameStatus == "single") {
    reverseMovePaddle2();
  }
  ballMove();
}

function drawNet() {
  for (var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, '#436370');
  }
}

function drawEverything() {
  // clear the game view by filling it with black
  colorRect(0, 0, canvas.width, canvas.height, "#264653");

  if (gameStatus === "win") {
    if (paddle1Score >= WINNING_SCORE) {
      colorText("LEFT PLAYER WINS!", canvas.width / 2, canvas.height / 2, 'white', 30);
    } else if (paddle2Score >= WINNING_SCORE) {
      colorText("RIGHT PLAYER WINS!", canvas.width / 2, canvas.height / 2, 'white', 30);
    }
    colorText("1 - Play with Youself",
      canvas.width / 2, canvas.height - 100, 'white');
    colorText("2 - Play with an AI",
      canvas.width / 2, canvas.height - 60, 'white');
    // display text on screen - will be used for score
    colorText(paddle1Score, 100, 100, '#436370', 30);
    colorText(paddle2Score, canvas.width - 100, 100, '#436370', 30);
  }
  else if (gameStatus === "start") {
    colorText("PING PONG +", canvas.width / 2, canvas.height / 2, 'white', 30);
    colorText("1 - Play with Youself",
      canvas.width / 2, canvas.height - 100, 'white');
    colorText("2 - Play with an AI",
      canvas.width / 2, canvas.height - 60, 'white');
  }
  else if (gameStatus === "single") {
    // display text on screen - will be used for score
    colorText(`Round ${paddle1Score + paddle2Score}`, canvas.width / 2, 100, '#436370', 20);

    paddlesDraw();

    // draw net in the middle of the playfield
    drawNet();

    // draw the ball
    ballDraw();
  }
  else if (gameStatus === "ai") {
    // display text on screen - will be used for score
    colorText(paddle1Score, 100, 100, '#436370', 30);
    colorText(paddle2Score, canvas.width - 100, 100, '#436370', 30);

    paddlesDraw();

    // draw net in the middle of the playfield
    drawNet();

    // draw the ball
    ballDraw();
    
  }
}