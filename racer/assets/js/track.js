// track constants and variables
const TRACK_W = 40;
const TRACK_H = 40;
const TRACK_COLS = 20;
const TRACK_ROWS = 15;
// 0 road, 1 wall, 2 car, 3 goal, 4 tree, 5 flag
var trackGrid = //// now with 3's (GOAL), 4's (TREE), 5's (FLAG)
    [ 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
      4, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
      1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
      1, 0, 0, 0, 1, 1, 1, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 1,
      1, 0, 0, 1, 1, 0, 0, 1, 4, 4, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 0, 0, 0, 1, 4, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
      1, 0, 2, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 1, 0, 0, 1,
      1, 3, 3, 1, 0, 0, 5, 0, 0, 0, 5, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 5, 0, 0, 1,
      1, 0, 0, 5, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
      1, 0, 0, 0, 0, 0, 1, 4, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
      1, 0, 0, 0, 0, 0, 1, 4, 4, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
      1, 1, 5, 1, 1, 1, 1, 4, 4, 4, 4, 4, 4, 1, 1, 1, 1, 1, 1, 1];
const TRACK_ROAD = 0;
const TRACK_WALL = 1;
const TRACK_PLAYER = 2;
const TRACK_GOAL = 3;
const TRACK_TREE = 4;
const TRACK_FLAG = 5;

function trackTileToIndex(tileCol, tileRow) {
    return (tileCol + TRACK_COLS * tileRow);
}

function checkForTrackAtPixelCoord(pixelX, pixelY) {
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

    return (trackGrid[trackIndex] == TRACK_ROAD);
}

function drawTracks() {
    var trackIndex = 0;
    var trackLeftEdgeX = 0;
    var trackTopEdgeY = 0;

    for (var eachRow = 0; eachRow < TRACK_ROWS; eachRow++) { // in each column...
        trackLeftEdgeX = 0;
        for (var eachCol = 0; eachCol < TRACK_COLS; eachCol++) { // in each row within that col
            var trackType = trackGrid[ trackIndex ]

            canvasContext.drawImage(trackPics[trackType], trackLeftEdgeX, trackTopEdgeY);

            trackLeftEdgeX += TRACK_W;
            trackIndex++;
        } // end of for eachRow
        trackTopEdgeY += TRACK_H;
    } // end of for eachCol
} // end of drawTracks()