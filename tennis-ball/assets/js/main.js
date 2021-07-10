var showingWinScreen = false;

const WINNING_SCORE = 11;

var canvas, canvasContext;

window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    // set up game logic and render to 30 times/s 
    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);

    setupMouseEventHandlers();

    ballReset();

    // lets set all text in the program to be centered instead of left justified
    canvasContext.textAlign = 'center';
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }

    moveComputerPaddle();
    
    ballMove();
}

function drawNet() {
    for(var i=0; i<canvas.height; i+=40) {
        colorRect(canvas.width/2-1,i,2,20,'white');
    }
}

function drawEverything() {
    // clear the game view by filling it with black
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  if(showingWinScreen) {
    if(paddle1Score >= WINNING_SCORE) {
      colorText("LEFT PLAYER WINS!",canvas.width/2,canvas.height/2,'white');
    } else if(paddle2Score >= WINNING_SCORE) {
      colorText("RIGHT PLAYER WINS!",canvas.width/2,canvas.height/2,'white');
    } 
    colorText("-- click anywhere to begin a new match --",
                canvas.width/2,canvas.height-20,'white');
  } else { 
    paddlesDraw(); 
    
    // draw net in the middle of the playfield
    drawNet();
    
    // draw the ball
    ballDraw();
  }
  // display text on screen - will be used for score
  colorText(paddle1Score,100,100,'white');
  colorText(paddle2Score,canvas.width-100,100,'white');
}