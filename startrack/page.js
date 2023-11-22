// Animation frame setup
window.requestAnimFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

// Handle resize event
window.onresize = function () {
    c.width = cw = c.offsetWidth;
    c.height = ch = c.offsetHeight;
    ctx.fillStyle = "rgba(21,21,21,1)";
    ctx.fillRect(0, 0, cw, ch);
};

var cf = document.createElement("canvas"),
    c = document.getElementById("startrack"),
    ctx = c.getContext("2d"),
    cftx = cf.getContext("2d");

c.width = cf.width = cw = c.offsetWidth;
c.height = cf.height = ch = c.offsetHeight;

var longside = Math.max(cw, ch),
    centerX = cw,
    centerY = 0,
    stars = [],
    drawTimes = 0;

cf.width = 2.6 * longside;
cf.height = 2.6 * longside;

function rand(min, max) {
    var range = max - min,
        rand = Math.random();
    return min + Math.round(rand * range);
}

function createStar() {
    stars.push({
        x: rand(-cf.width, cf.width),
        y: rand(-cf.height, cf.height),
        size: 1,
        color: randomColor()
    });
}

function randomColor() {
    return "rgba(" +
        rand(120, 255) + "," +
        rand(120, 255) + "," +
        rand(120, 255) + "," +
        (rand(30, 100) / 100) +
        ")";
}

function drawStar() {
    for (var i = stars.length; i--;) {
        var star = stars[i];
        cftx.beginPath();
        cftx.arc(star.x, star.y, star.size, 0, 2 * Math.PI, true);
        cftx.fillStyle = star.color;
        cftx.closePath();
        cftx.fill();
    }
}

function drawfromCache() {
    ctx.drawImage(cf, -cf.width / 2, -cf.height / 2);
}

function loop() {
    drawfromCache();
    if (++drawTimes > 150 && drawTimes % 8 == 0) {
        ctx.fillStyle = "rgba(0,0,0,.04)";
        ctx.fillRect(-3 * longside, -3 * longside, 6 * longside, 6 * longside);
    }
    rotateCanvas(0.025);
}

function rotateCanvas(angle) {
    ctx.rotate((angle * Math.PI) / 180);
}

ctx.fillStyle = "rgba(21,21,21,1)";
ctx.fillRect(0, 0, cw, ch);
ctx.lineCap = "round";

for (var count = 20000; count--;) {
    createStar();
}

drawStar();

var x = centerX,
    y = centerY;

function fireAnimate() {
    requestAnimFrame(fireAnimate);
    loop();
}

fireAnimate();