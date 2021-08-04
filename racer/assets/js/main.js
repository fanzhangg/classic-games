  // variables to keep track of car position
  var carX = 75, carY = 75;
  var carSpeedX = 6, carSpeedY = 8;
  
  // track constants and variables
  const TRACK_W = 40;
  const TRACK_H = 40;
  const TRACK_GAP = 2;
  const TRACK_COLS = 20;
  const TRACK_ROWS = 15;
  var trackGrid =
      [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
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

  //// paddle values removed for this step
  
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
    return (tileCol + TRACK_COLS*tileRow);
  }

  function isTrackAtTileCoord(trackTileCol, trackTileRow) {
    var trackIndex = trackTileToIndex(trackTileCol, trackTileRow);
    return (trackGrid[trackIndex] == 1);
  }
  
  function bounceOffTrackAtPixelCoord(pixelX,pixelY) {
    var tileCol = pixelX / TRACK_W;
    var tileRow = pixelY / TRACK_H;
    
    // we'll use Math.floor to round down to the nearest whole number
    tileCol = Math.floor( tileCol );
    tileRow = Math.floor( tileRow );

    // first check whether the car is within any part of the track wall
    if(tileCol < 0 || tileCol >= TRACK_COLS ||
       tileRow < 0 || tileRow >= TRACK_ROWS) {
       return false; // bail out of function to avoid illegal array position usage
    }
    
    var trackIndex = trackTileToIndex(tileCol, tileRow);

    if(trackGrid[trackIndex] == 1) {
      
      // ok, so we know we overlap a track now.
      // let's backtrack to see whether we changed rows or cols on way in
      var prevCarX = carX-carSpeedX;
      var prevCarY = carY-carSpeedY;
      var prevTileCol = Math.floor(prevCarX / TRACK_W);
      var prevTileRow = Math.floor(prevCarY / TRACK_H);

      var bothTestsFailed = true;

      if(prevTileCol != tileCol) { // must have come in horizontally
        var adjacentTrackIndex = trackTileToIndex(prevTileCol, tileRow);
        // make sure the side we want to reflect off isn't blocked!
        if(trackGrid[adjacentTrackIndex] != 1) {
          carSpeedX *= -1;
          bothTestsFailed = false;
        }
      }

      if(prevTileRow != tileRow) { // must have come in vertically
        var adjacentTrackIndex = trackTileToIndex(tileCol, prevTileRow);
        // make sure the side we want to reflect off isn't blocked!
        if(trackGrid[adjacentTrackIndex] != 1) {
          carSpeedY *= -1;
          bothTestsFailed = false;
        }
      }

      // we hit an "armpit" on the inside corner, this blocks going into it
      if(bothTestsFailed) {
        carSpeedX *= -1;
        carSpeedY *= -1;
      }
    }
  }
    
  window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    
    // these next few lines set up our game logic and render to happen 30 times per second
    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
      }, 1000/framesPerSecond);
      
    carPic.onload = function() {
      carPicLoaded = true;
    }
    
    carReset();
  }
  
  function carReset() {
    // center car on screen
    carX = canvas.width/2 + 50;
    carY = canvas.height/2;
  }
  
  function moveEverything() {
    if(carX < 0) { // if car has moved beyond the left edge
      carSpeedX *= -1; // reverse car's horizontal direction
    }
    
    if(carX > canvas.width) { // if car has moved beyond the right edge
      carSpeedX *= -1; // reverse car's horizontal direction
    }

    if(carY < 0) { // if car has moved beyond the top edge
      carSpeedY *= -1; // reverse car's vertical direction
    }
    
    //// paddle-car collision is no longer needed
    
    if(carY > canvas.height) { // if car has moved beyond the bottom edge
      carReset();
    }
    
    bounceOffTrackAtPixelCoord(carX, carY);
  
    carX += carSpeedX; // move the car based on its current horizontal speed 
    carY += carSpeedY; // same as above, but for vertical
  }
  
  function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
  }
  
  function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
  }
  
  function drawTracks() {
    for(var eachCol=0; eachCol<TRACK_COLS; eachCol++) { // in each column...
      for(var eachRow=0; eachRow<TRACK_ROWS; eachRow++) { // in each row within that col
      
        if( isTrackAtTileCoord(eachCol, eachRow) ) {
          // compute the corner in pixel coordinates of the corresponding track
          // multiply the track's tile coordinate by TRACK_W or TRACK_H for pixel distance
          var trackLeftEdgeX = eachCol * TRACK_W;
          var trackTopEdgeY = eachRow * TRACK_H;
          // draw a blue rectangle at that position, leaving a small margin for TRACK_GAP
          colorRect(trackLeftEdgeX, trackTopEdgeY,
                   TRACK_W - TRACK_GAP, TRACK_H - TRACK_GAP, 'blue' );
        }
        
      } // end of for eachRow
    } // end of for eachCol
  } // end of drawTracks()
  
  function drawEverything() {
    // clear the game view by filling it with black
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    //// removed line that drew the paddle
    
    drawTracks();
    
    // draw the car
    colorCircle(carX, carY, 10, 'white');
  }