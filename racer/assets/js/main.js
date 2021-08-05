// variables to keep track of car position
var carX = 75, carY = 75;
var carSpeed = 0;

// track constants and variables
const TRACK_W = 40;
const TRACK_H = 40;
const TRACK_GAP = 2;
const TRACK_COLS = 20;
const TRACK_ROWS = 15;
const KEY_UP_ARROW = 38;
const KEY_DOWN_ARROW = 40;
const KEY_LEFT_ARROW = 37;
const KEY_RIGHT_ARROW = 39;
const GROUNDSPEED_DECAY_MULT = 0.94;
const DRIVE_POWER = 0.5;
const REVERSE_POWER = 0.2;
const TURN_RATE = 0.03;
const MIN_TURN_SPEED = 0.5;

// keyboard hold state variables, to use keys more like buttons
var keyHeld_Gas = false;
var keyHeld_Reverse = false;
var keyHeld_TurnLeft = false;
var keyHeld_TurnRight = false;

var trackGrid =
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
        1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
        1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
        1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var carPic = document.createElement("img");
var carPicLoaded = false;
var carAngle = 0;

// save the canvas for dimensions, and its 2d context for drawing to it
var canvas, canvasContext;

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

function trackTileToIndex(tileCol, tileRow) {
    return (tileCol + TRACK_COLS * tileRow);
}

function isTrackAtTileCoord(trackTileCol, trackTileRow) {
    var trackIndex = trackTileToIndex(trackTileCol, trackTileRow);
    return (trackGrid[trackIndex] == 1);
}

function bounceOffTrackAtPixelCoord(pixelX, pixelY) {
    var tileCol = pixelX / TRACK_W;
    var tileRow = pixelY / TRACK_H;

    // we'll use Math.floor to round down to the nearest whole number
    tileCol = Math.floor(tileCol);
    tileRow = Math.floor(tileRow);

    // first check whether the car is within any part of the track wall
    if (tileCol < 0 || tileCol >= TRACK_COLS ||
        tileRow < 0 || tileRow >= TRACK_ROWS) {
        return false; // bail out of function to avoid illegal array position usage
    }

    var trackIndex = trackTileToIndex(tileCol, tileRow);

    if (trackGrid[trackIndex] == 1) {

        // ok, so we know we overlap a track now.
        // let's backtrack to see whether we changed rows or cols on way in
        var prevCarX = carX - carSpeedX;
        var prevCarY = carY - carSpeedY;
        var prevTileCol = Math.floor(prevCarX / TRACK_W);
        var prevTileRow = Math.floor(prevCarY / TRACK_H);

        var bothTestsFailed = true;

        if (prevTileCol != tileCol) { // must have come in horizontally
            var adjacentTrackIndex = trackTileToIndex(prevTileCol, tileRow);
            // make sure the side we want to reflect off isn't blocked!
            if (trackGrid[adjacentTrackIndex] != 1) {
                carSpeedX *= -1;
                bothTestsFailed = false;
            }
        }

        if (prevTileRow != tileRow) { // must have come in vertically
            var adjacentTrackIndex = trackTileToIndex(tileCol, prevTileRow);
            // make sure the side we want to reflect off isn't blocked!
            if (trackGrid[adjacentTrackIndex] != 1) {
                carSpeedY *= -1;
                bothTestsFailed = false;
            }
        }

        // we hit an "armpit" on the inside corner, this blocks going into it
        if (bothTestsFailed) {
            carSpeedX *= -1;
            carSpeedY *= -1;
        }
    }
}

function setKeyHoldState(thisKey, setTo) {
    if (thisKey == KEY_UP_ARROW) {
        keyHeld_Gas = setTo;
    }
    if (thisKey == KEY_DOWN_ARROW) {
        keyHeld_Reverse = setTo;
    }
    if (thisKey == KEY_LEFT_ARROW) {
        keyHeld_TurnLeft = setTo;
    }
    if (thisKey == KEY_RIGHT_ARROW) {
        keyHeld_TurnRight = setTo;
    }
}

function keyPressed(evt) {
    setKeyHoldState(evt.keyCode, true);
    evt.preventDefault();
}

function keyReleased(evt) {
    setKeyHoldState(evt.keyCode, false);
    evt.preventDefault();
}

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    // these next few lines set up our game logic and render to happen 30 times per second
    var framesPerSecond = 30;
    setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);

    carPic.onload = function () {
        carPicLoaded = true;
    }

    document.addEventListener("keydown", keyPressed);
    document.addEventListener("keyup", keyReleased);

    carPic.src = "./assets/img/player1.png";

    carReset();
}

function carReset() {
    // center car on screen
    carX = canvas.width / 2 + 50;
    carY = canvas.height / 2;
}

function moveEverything() {
    if (keyHeld_TurnLeft && Math.abs(carSpeed) >= MIN_TURN_SPEED) {
        carAngle += -TURN_RATE * Math.PI;
    }
    if (keyHeld_TurnRight && Math.abs(carSpeed) >= MIN_TURN_SPEED) {
        carAngle += TURN_RATE * Math.PI;
    }
    if (keyHeld_Gas) {
        carSpeed += DRIVE_POWER;
    }
    if (keyHeld_Reverse) {
        carSpeed -= REVERSE_POWER;
    }
    carX += Math.cos(carAngle) * carSpeed; // move the car based on its current horizontal speed 
    carY += Math.sin(carAngle) * carSpeed; // same as above, but for vertical
    carSpeed *= GROUNDSPEED_DECAY_MULT;
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function drawTracks() {
    for (var eachCol = 0; eachCol < TRACK_COLS; eachCol++) { // in each column...
        for (var eachRow = 0; eachRow < TRACK_ROWS; eachRow++) { // in each row within that col

            if (isTrackAtTileCoord(eachCol, eachRow)) {
                // compute the corner in pixel coordinates of the corresponding track
                // multiply the track's tile coordinate by TRACK_W or TRACK_H for pixel distance
                var trackLeftEdgeX = eachCol * TRACK_W;
                var trackTopEdgeY = eachRow * TRACK_H;
                // draw a blue rectangle at that position, leaving a small margin for TRACK_GAP
                colorRect(trackLeftEdgeX, trackTopEdgeY,
                    TRACK_W - TRACK_GAP, TRACK_H - TRACK_GAP, 'blue');
            }

        } // end of for eachRow
    } // end of for eachCol
} // end of drawTracks()

function drawBitmapCenterAtLocationWithRotation(graphic, atX, atY, withAngle) {
    canvasContext.save();
    canvasContext.translate(atX, atY);
    canvasContext.rotate(withAngle);
    canvasContext.drawImage(graphic, -graphic.width / 2, -graphic.height / 2);
    canvasContext.restore();
};

function drawCar() {
    if (carPicLoaded) {
        drawBitmapCenterAtLocationWithRotation(carPic, carX, carY, carAngle);
    }
}

function drawEverything() {
    // clear the game view by filling it with black
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    drawTracks();

    // draw the car
    drawCar();
}