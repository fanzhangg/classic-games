// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext;

var p1 = new carClass();
var p2 = new carClass();

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    
    loadImages();
}

function moveEverything() {
    p1.move();
    p2.move();
}

function drawEverything() {
    // clear the game view by filling it with black
    drawTracks();
    // draw the car
    p1.draw();
    p2.draw();

    if (p1.currentRecord) {
        document.getElementById("current-record").innerHTML = `${p1.currentRecord}`;
    }

    var records = ""
    for (var record of p1.records){
        records += `${record}<br>`
        index += 1;
    }
    document.getElementById("records").innerHTML = records;
}

function startGame() {
    // these next few lines set up our game logic and render to happen 30 times per second
    var framesPerSecond = 30;
    setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);

    p1.init(carPic, "red");
    p2.init(carPic2, "blue");
    initInput();
}