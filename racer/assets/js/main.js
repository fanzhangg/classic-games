// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext;

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    
    loadImages();
}

function moveEverything() {
    carMove();
}

function drawEverything() {
    // clear the game view by filling it with black
    drawTracks();
    // draw the car
    carDraw();
}

function startGame() {
    // these next few lines set up our game logic and render to happen 30 times per second
    var framesPerSecond = 30;
    setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);

    carPic.onload = function () {
        carPicLoaded = true;
    }

    carInit();
    initInput();
}