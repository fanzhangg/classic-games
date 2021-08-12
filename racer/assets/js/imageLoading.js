var carPic = document.createElement("img");
var trackPics = [];

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

function loadImagesForTrackCode(trackCode, fileName) {
    trackPics[trackCode] = document.createElement("img");
    beginLoadingImage(trackPics[trackCode], fileName);
}

function loadImages(){
    var imageList = [
        {varName:carPic, fileName:"player1.png"},
        {trackType:TRACK_ROAD, fileName:"track_road.png"},
        {trackType:TRACK_WALL, fileName:"track_wall.png"},
        {trackType:TRACK_GOAL, fileName:"track_goal.png"},
        {trackType:TRACK_TREE, fileName:"track_tree.png"},
        {trackType:TRACK_FLAG, fileName:"track_flag.png"}
    ];

    picsToLoad = imageList.length;

    for (var i=0; i < imageList.length; i++) {
        if (imageList[i].trackType != undefined) {
            loadImagesForTrackCode(imageList[i].trackType, imageList[i].fileName)
        } else {
            beginLoadingImage(imageList[i].varName, imageList[i].fileName);
        }
    }
}