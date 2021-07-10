var paddle1Score = 0, paddle2Score = 0;
var paddle1Y = 250, paddle2Y = 250;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = BALL_SPEED_MAX + 2;

const PADDLE_DIST_FROM_EDGE = 120;

const PADDLE_COMPUTER_MOVE_SPEED = 9.0;

function paddlesDraw() {
   if (ballSpeedX < 0.0 &&
      ballY > paddle1Y &&
      ballY < paddle1Y + PADDLE_HEIGHT &&
      ballX > PADDLE_DIST_FROM_EDGE &&
      ballX < PADDLE_DIST_FROM_EDGE + PADDLE_THICKNESS) {
         colorRect(PADDLE_DIST_FROM_EDGE, paddle1Y, 10, PADDLE_HEIGHT, 'white');
      } else {
         colorRect(PADDLE_DIST_FROM_EDGE, paddle1Y, 10, PADDLE_HEIGHT, '#8ecae6');
      }
  // draw a white rectangle to use as the left player's paddle
  

  // draw a white rectangle to use as the right player's paddle 
  if (ballSpeedX > 0.0 &&
   ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT &&
   ballX < canvas.width - PADDLE_DIST_FROM_EDGE &&
   ballX > canvas.width - (PADDLE_DIST_FROM_EDGE + PADDLE_THICKNESS)) {
      colorRect(canvas.width-10-PADDLE_DIST_FROM_EDGE, paddle2Y,   
         10, PADDLE_HEIGHT, 'white');
   } else {
      colorRect(canvas.width-10-PADDLE_DIST_FROM_EDGE, paddle2Y,   
         10, PADDLE_HEIGHT, '#8ecae6');
   }
  
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