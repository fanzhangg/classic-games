var img = new Image();

var ctx;

img.src = "./assets/img/hamster.svg";
window.onload = function () {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    }
}