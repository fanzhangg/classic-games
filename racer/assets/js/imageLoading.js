var carPic = document.createElement("img");
var trackPicRoad = document.createElement("img");
var trackPicWall = document.createElement("img");

var picsToLoad = 3;

function countLoadedImageAndLaunchIfReady() {
    picsToLoad -= 1;
    if (picsToLoad == 0){
        startGame();
    }
}

function loadImages(){
    var imageList = [
        {varName:carPic, fileName:"player1.png"},
        {varName:trackPicRoad, fileName:"track_road.png"},
        {varName:trackPicWall, fileName:"track_wall.png"}
    ];

    picsToLoad = imageList.length;

    for (var i=0; i < imageList.length; i++) {
        image = imageList[i];

        image.varName.onload = countLoadedImageAndLaunchIfReady;
        image.varName.src = `assets/img/${image.fileName}`;
    }
}