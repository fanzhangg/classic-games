var paddle1Score = 0, paddle2Score = 0;
var paddle1Y = 250, paddle2Y = 250;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = BALL_SPEED_MAX + 2;

const PADDLE_DIST_FROM_EDGE = 120;

const PADDLE_COMPUTER_MOVE_SPEED = 9.0;

function paddlesDraw() {
  // draw a white rectangle to use as the left player's paddle
  colorRect(PADDLE_DIST_FROM_EDGE, paddle1Y, 10, PADDLE_HEIGHT, 'white');

  // draw a white rectangle to use as the right player's paddle 
  colorRect(canvas.width-10-PADDLE_DIST_FROM_EDGE, paddle2Y,   
           10, PADDLE_HEIGHT, 'white');
}

function moveComputerPaddle() {
  var paddle2Center = paddle2Y + (PADDLE_HEIGHT/2);
  const AI_SIT_STILL_MARGIN = 35;
  var topChaseLine = paddle2Center - AI_SIT_STILL_MARGIN;
  var bottomChaseLine = paddle2Center + AI_SIT_STILL_MARGIN;
    
  if(ballY < topChaseLine) {
     paddle2Y -= PADDLE_COMPUTER_MOVE_SPEED;
  }
  else if(ballY > bottomChaseLine) {
     paddle2Y += PADDLE_COMPUTER_MOVE_SPEED;
  }
}

function reverseMovePaddle2() {
   paddle2Y = canvas.height - paddle1Y;
}