NUM_BALLS = 50;
var ballRadius = 10;
balls = [];
var id = 0;
var sexualMaturity = 18;
var death = 80;
var genChange = 100;
var generation = 0;
var day = 0;
food = []
amountFood = 100;

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
        this.day = 0;
        this.eaten = 0;
    }
    
    draw() {
        if(this.genes[6] == 0){
            this.ctx.fillStyle = 'rgb(52, 235, 143)';
        }
        else{
            this.ctx.fillStyle = 'rgb(235, 134, 52)';
        }
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false); 
        this.ctx.fill();
    }
    update() {
        /*
        if(this.day == 1000){
            this.x = 400;
            this.y = 400;
            this.day = 0;
            return;
        }
        */
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
        for(var m = 0; m < food.length; m++){
            var euclideanDist = Math.sqrt(Math.pow(this.x-food[m].x, 2) + Math.pow(this.y-food[m].y, 2));
            if(euclideanDist < 10){
                this.eaten++;
                this.r += 2;
                this.x = food[m].x;
                this.y = food[m].y;
                removeFood(m);
            }
        }
        this.day++;
        this.life++;
    }
    setGenes() {
        /*
        for(let i = 0; i < 3; i++){
            this.genes[i] = getRandomInt(0, 255); // color
        }
        */
        for(let i = 3; i < 5; i++){
            this.genes[i] = 10; //displacement
        }
        this.genes[5] = getRandomInt(0, 10); //strength
        this.genes[6] = getRandomInt(0, 1); // 0->female, 1->male
    }
}
function setup() {
    document.getElementById("day").innerHTML = "Day : " + 0;
    document.getElementById("indiv").innerHTML = "Population size : " + NUM_BALLS;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    
    for (let i = 0; i < NUM_BALLS; i++) {
        var b = new Ball(400, 400, ctx);
        b.setGenes();
        balls.push(b);
    }
    spawnFood(ctx);
    animateLoop();
} 

function animateLoop() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    requestAnimationFrame(animateLoop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let j = 0; j < food.length; j++){
        var f = food[j];
        f.draw();
    }
    for (let i = 0; i < balls.length; i++) {
        var b = balls[i];
        b.update();
        b.draw();
    }
    if(balls[balls.length-1].day%1000 == 0){
        updateDay(ctx);
    }
}

function updateDay(ctx){
    day++; 
    var l = balls.length;
    for(let j = 0; j < l; j++){
        if(balls[j].eaten < 1){
            balls.splice(j, 1);
            l--;
        }
    }
    for(let i = 0; i < balls.length; i++){
        balls[i].day = 0;
        balls[i].eaten = 0;
        balls[i].x = 400;
        balls[i].y = 400;
        balls[i].r = ballRadius;
    }
    document.getElementById("day").innerHTML = "Day : " + day;
    document.getElementById("indiv").innerHTML = "Population size : " + balls.length;
    var l = balls.length;
    spawnFood(ctx);
}
class Food {
    constructor(x, y, ctx){
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.r = 3;
    }
    draw() {
        this.ctx.fillStyle = "rgb(86, 3, 252)";
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false); 
        this.ctx.fill();
    }
}
function spawnFood(ctx){
    food = [];
    for(var i = 0; i < amountFood; i++){
        var x = random(0, 800);
        var y = random(0, 800);
        while(x >= 350 && x <= 450){
            x = random(0, 800);
        }
        while(y >= 350 && y <= 450){
            y = random(0, 800);
        }
        var f = new Food(x, y, ctx);
        food.push(f);
    }
}
function removeFood(index){
    food.splice(index, 1);
}