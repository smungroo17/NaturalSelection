NUM_BALLS = 100;
var ballRadius = 10;
balls = [];
var id = 0;
var sexualMaturity = 18;
var death = 80;

document.addEventListener("DOMContentLoaded", setup);  

function random(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Ball {
    constructor(x,y,ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.r = ballRadius; // radius
        this.id = id;
        id++;
        this.life = 0;
        this.genes = [];
        this.reproduce = 0;
    }
    
    draw() {
        if(this.genes[6] == 0){
            this.ctx.fillStyle = 'rgb(139,69,19)';
        }
        else{
            this.ctx.fillStyle = 'rgb('+this.genes[0]+','+this.genes[1]+','+this.genes[2]+')';
        }
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false); 
        this.ctx.fill();
    }
    update() {
        var randomX = random(-1 * this.genes[3], this.genes[3]);
        var randomY = random(-1 * this.genes[4], this.genes[4]);
        if(this.x + randomX > canvas.width-ballRadius || this.x + randomX < ballRadius) {
            randomX = -randomX;
        }
        if(this.y + randomY > canvas.height-ballRadius || this.y + randomY < ballRadius) {
            randomY = -randomY;
        }
        this.x += randomX;
        this.y += randomY;
        this.life++;
    }
    setGenes() {
        for(let i = 0; i < 3; i++){
            this.genes[i] = getRandomInt(0, 255); // color
        }
        for(let i = 3; i < 5; i++){
            this.genes[i] = random(1, 10); //displacement
        }
        this.genes[5] = getRandomInt(0, 10); //strength
        this.genes[6] = getRandomInt(0, 1); // 0->female, 1->male
    }
}
function setup() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    
    for (let i = 0; i < NUM_BALLS; i++) {
        var b = new Ball(400, 400, ctx);
        b.setGenes();
        balls.push(b);
    }
    animateLoop();
} 

function animateLoop() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    
    requestAnimationFrame(animateLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < NUM_BALLS; i++) {
        var b = balls[i];
        b.update();
        b.draw();
    }
}
