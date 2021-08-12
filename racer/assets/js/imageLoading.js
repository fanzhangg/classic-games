var carPic = document.createElement("img");
var trackPicRoad = document.createElement("img");
var trackPicWall = document.createElement("img");

var picsToLoad = 0;

function countLoadedImageAndLaunchIfReady() {
    picsToLoad -= 1;
    if (picsToLoad == 0){
        startGame();
    }
}

function beginLoadingImage(imgVar, fileName) {
    imgVar.onload=countLoadedImageAndLaunchIfReady;
    imgVar.src=`assets/img/${fileName}`;
}

function loadImages(){
    var imageList = [
        {varName:carPic, fileName:"player1.png"},
        {varName:trackPicRoad, fileName:"track_road.png"},
        {varName:trackPicWall, fileName:"track_wall.png"}
    ];

    picsToLoad = imageList.length;

    for (var i=0; i < imageList.length; i++) {
        beginLoadingImage(imageList[i].varName, imageList[i].fileName);
    }
}