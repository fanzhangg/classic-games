// car tuning constants
const GROUNDSPEED_DECAY_MULT = 0.94;
const DRIVE_POWER = 0.5;
const REVERSE_POWER = 0.2;
const TURN_RATE = 0.03;
const MIN_TURN_SPEED = 0.5;

function carClass() {
    // variables to handle the timming
    this.isOnGoal = false
    this.records = []
    this.startTime = null;
    this.currentRecord = null;

    // variables to keep track of car position
    this.carX = 75;
    this.carY = 75;
    this.carSpeed = 0;
    this.carAng = -0.5 * Math.PI;

    // keyboard hold state variables, to use keys more like buttons
    this.keyHeld_Gas = false;
    this.keyHeld_Reverse = false;
    this.keyHeld_TurnLeft = false;
    this.keyHeld_TurnRight = false;

    // key controls used for this car 
    this.setupControls = function (forwardKey, backKey, leftKey, rightKey) {
        this.controlKeyForGas = forwardKey;
        this.controlKeyForReverse = backKey;
        this.controlKeyForTurnLeft = leftKey;
        this.controlKeyForTurnRight = rightKey;
    }

    this.init = function (graphic, name) {
        this.myBitmap = graphic;
        this.myName = name;
        this.reset();
    }

    this.reset = function () {
        for (var i = 0; i < trackGrid.length; i++) {
            if (trackGrid[i] == TRACK_PLAYER) {
                var tileRow = Math.floor(i / TRACK_COLS);
                var tileCol = i % TRACK_COLS;
                this.carX = tileCol * TRACK_W + 0.5 * TRACK_W;
                this.carY = tileRow * TRACK_H + 0.5 * TRACK_H;
                trackGrid[i] = TRACK_ROAD;
                break; // found it, so no need to keep searching 
            }
        }
    }

    this.move = function () {
        // only allow the car to turn while it's rolling
        if (Math.abs(this.carSpeed) > MIN_TURN_SPEED) {
            if (this.keyHeld_TurnLeft) {
                this.carAng -= TURN_RATE * Math.PI;
            }

            if (this.keyHeld_TurnRight) {
                this.carAng += TURN_RATE * Math.PI;
            }
        }

        if (this.keyHeld_Gas) {
            this.carSpeed += DRIVE_POWER;
        }
        if (this.keyHeld_Reverse) {
            this.carSpeed -= REVERSE_POWER;
        }

        var nextX = this.carX + Math.cos(this.carAng) * this.carSpeed;
        var nextY = this.carY + Math.sin(this.carAng) * this.carSpeed;

        var nextTileType = getTrackAtPixelCoord(nextX, nextY);

        // Control the next position and speed
        if (nextTileType == TRACK_ROAD || nextTileType == TRACK_GOAL) {
            this.carX = nextX;
            this.carY = nextY;
        } else {
            this.carSpeed = - 0.5 * this.carSpeed;
        }

        this.carSpeed *= GROUNDSPEED_DECAY_MULT;


        // Take care of records
        // keep track of the time when the car drives from a raod tile to the goal time
        if (nextTileType == TRACK_GOAL && this.isOnGoal == false) {
            if (this.startTime) {    // Play a round before
                // Push the record to the times array
                var delta = Date.now() - this.startTime;
                console.log("Round finishes:");
                var delta = Date.now() - p1.startTime;

                duration = this.deltaToString(delta);
                this.records.unshift(duration);

                this.startTime = Date.now();    // Reset startTime for a new round
            } else {
                console.log("Start first round");
                this.startTime = Date.now();
            }

            this.isOnGoal = true;
        }

        // The car passes the goal tile
        if (nextTileType == TRACK_ROAD && this.isOnGoal == true) {
            this.isOnGoal = false;
        }

        // Take care of the current record
        if (this.startTime) {
            var delta = Date.now() - p1.startTime;
            this.currentRecord = this.deltaToString(delta);
        }
    }

    this.draw = function () {
        drawBitmapCenteredAtLocationWithRotation(this.myBitmap, this.carX, this.carY, this.carAng);
    }

    this.deltaToString = function (delta) {
        var sec = Math.floor(delta / 1000);
        var sec2 = Math.floor(delta % 1000 / 10);
        var sec3 = Math.floor(delta % 10);
        return `${sec}\'${sec2}\'\'${sec3}\'\'\'`;
    }
}
