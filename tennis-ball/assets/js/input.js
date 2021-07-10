const KEY_TOPNUM_1 = 49;
const KEY_TOPNUM_2 = 50;
const KEY_KEYPAD_1 = 97;
const KEY_KEYPAD_2 = 98;

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect(), root = document.documentElement;
  
    // account for the margins, canvas position on page, scroll amount, etc.
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
      x: mouseX,
      y: mouseY
    };
  }

  function keyPressed(evt) {
    if (gameStatus === "start" || gameStatus === "win"){
      if (evt.keyCode == KEY_TOPNUM_1 || evt.keyCode == KEY_KEYPAD_1) {
        paddle1Score = 0;
        paddle2Score = 0;
        gameStatus = "single";
        return;
      }
  
      if (evt.keyCode == KEY_TOPNUM_2 || evt.keyCode == KEY_KEYPAD_2) {
        paddle1Score = 0;
        paddle2Score = 0;
        gameStatus = "ai"
        return;
      }
    }
  }
  
  function handleMousedown(evt) {
    if(gameStatus === "start") {
       paddle1Score = 0;
       paddle2Score = 0;
       showingWinScreen = "single";
    }
  }
  
  function handleMousemove(evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - (PADDLE_HEIGHT/2); // minus half paddle height to center
  }
  
  function setupMouseEventHandlers() {
    // canvas.addEventListener('mousedown', handleMousedown);
    canvas.addEventListener('mousemove', handleMousemove);
    document.addEventListener("keydown", keyPressed);
  }