/*
 * @Description: 
 * @Author: xiuji
 * @Date: 2023-11-22 16:44:22
 * @LastEditTime: 2023-11-22 16:44:33
 * @LastEditors: Do not edit
 */
var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight,
    hue = 217,
    stars = [],
    count = 0,
    maxStars = 1400;

var canvas2 = document.createElement('canvas'),
    ctx2 = canvas2.getContext('2d');
canvas2.width = 100;
canvas2.height = 100;
var half = canvas2.width / 2,
    gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
gradient2.addColorStop(0.025, '#fff');
gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
gradient2.addColorStop(1, 'transparent');

ctx2.fillStyle = gradient2;
ctx2.beginPath();
ctx2.arc(half, half, half, 0, Math.PI * 2);//画一个圆（x,y,半径，起始弧度，结束弧度）
ctx2.fill();

function random(min, max) {
    if (arguments.length < 2) {
        max = min;
        min = 0;
    }//如果只传了一个min，则max取min，min取0

    if (min > max) {
        var hold = max;
        max = min;
        min = hold;
    }//min>max，互换

    return Math.floor(Math.random() * (max - min + 1)) + min;//在[min,max]随机取一个整数(包括min,max)
}

function maxOrbit(x, y) {
    var max = Math.max(x, y),
        // diameter = Math.round(Math.sqrt(max * max + max * max));//Math.round取整
        diameter = Math.round(Math.sqrt(x * x + y * y))
    return diameter / 2;//矩形对角线的一半
}

var Star = function () {

    this.orbitRadius = random(maxOrbit(w, h));
    this.radius = random(60, this.orbitRadius) / 12;
    this.orbitX = w / 2;
    this.orbitY = h / 2;
    this.timePassed = random(0, maxStars);
    this.speed = random(this.orbitRadius) / 50000;
    this.alpha = random(2, 10) / 10;//0.2-1之间的透明度

    count++;
    stars[count] = this;
}

Star.prototype.draw = function (i) {
    var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,//sin和cos可能只是想要个-1～1之间的随机数
        y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,//orbitRadius越大，越靠近边缘，w和h越有可能大，因此大的星星都在四周（也存在小的）
        twinkle = random(10);

    // 增加一些闪烁的效果
    if (twinkle === 1 && this.alpha > 0) {
        this.alpha -= 0.05;
    } else if (twinkle === 2 && this.alpha < 1) {
        this.alpha += 0.05;
    }

    ctx.globalAlpha = this.alpha;//设置图像的透明度
    ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);//在canvas绘制canvas2（img,x,y,w,h）
    this.timePassed += this.speed;//转起来
}

for (var i = 0; i < maxStars; i++) {
    new Star();
}

function animation() {
    ctx.globalCompositeOperation = 'source-over';//图像合成，源图形不透明地方显示源图形，其余显示目标图形
    ctx.globalAlpha = 0.8;//图像透明度
    ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 1)';
    ctx.fillRect(0, 0, w, h)

    ctx.globalCompositeOperation = 'lighter';//显示源图像+目标图像
    for (var i = 1, l = stars.length; i < l; i++) {
        stars[i].draw(i);
    };
    window.requestAnimationFrame(animation);
}

animation();