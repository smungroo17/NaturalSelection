NUM_BALLS = 50;
var ballRadius = 10;
balls = [];
var id = 0;
var day = 0;
food = []
amountFood = 100;
color = ['rgb(52, 235, 143)'];

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
        this.genes = [];
        this.day = 0;
        this.eaten = 0;
    }
    draw() {
        this.ctx.fillStyle = 'rgb(' + this.genes[0] + ", " + this.genes[1] + ", " + this.genes[2] + ')';
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
        for(var m = 0; m < food.length; m++){
            var euclideanDist = Math.sqrt(Math.pow((this.x-food[m].x), 2) + Math.pow((this.y-food[m].y), 2));
            if(euclideanDist < this.genes[6]){
                this.eaten++;
                //this.r += 2;
                this.x = food[m].x;
                this.y = food[m].y;
                removeFood(m);
                return;
            }
        }
        this.day++;
    }
    setGenes(parent) {
        if(parent != null){
            //color->rgb
            this.genes[0] = parent.genes[0];
            this.genes[1] = parent.genes[1];
            this.genes[2] = parent.genes[2];

            for(let i = 3; i < 5; i++){
                this.genes[i] = parent.genes[i]; //displacement
            }
            this.genes[5] = parent.genes[5]; //strength
            this.genes[6] = parent.genes[6];  //sight
        }
        else{
            this.genes[0] = 52;
            this.genes[1] = 235;
            this.genes[2] = 143;

            for(let i = 3; i < 5; i++){
                this.genes[i] = 10; //displacement
            }
            this.genes[5] = getRandomInt(0, 10); //strength
            this.genes[6] = 10;  //sight
        }
    }
    mutate(){
        var chance = getRandomInt(1, 25);
        //random number chosen
        //4% chance of mutation
        if(chance == 12){
            var fav = getRandomInt(0,3);
            // 2% disadvantageous mutation
            if(fav == 0){
                this.genes[0] = 41;
                this.genes[1] = 131;
                this.genes[2] = 163;
                this.genes[3] = 10;
                this.genes[4] = 10;
                this.genes[6] = 5;
            }
            // 2% advantageous mutation
            else if(fav == 1) {
                this.genes[0] = 168;
                this.genes[1] = 30;
                this.genes[2] = 30;
                this.genes[3] = 10;
                this.genes[4] = 10;
                this.genes[6] = 15;
            }
            else if(fav == 2){
                this.genes[0] = 153;
                this.genes[1] = 149;
                this.genes[2] = 28;
                this.genes[3] = 12;
                this.genes[4] = 12;
                this.genes[6] = 10;
            }
            else{
                this.genes[0] = 61;
                this.genes[1] = 39;
                this.genes[2] = 161;
                this.genes[3] = 8;
                this.genes[4] = 8;
                this.genes[6] = 10;
            }
            addNewIndividual(this);
        }
    }
}

function setup() {
    document.getElementById("day").innerHTML = "Day : " + 0;
    document.getElementById("indiv").innerHTML = "Population size : " + NUM_BALLS;
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    
    for (let i = 0; i < NUM_BALLS; i++) {
        var b = new Ball(400, 400, ctx);
        b.setGenes(null);
        balls.push(b);
    }
    addNewIndividual(balls[0]);
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
        b.draw();
        b.update();
    }
    if(balls[balls.length-1].day%1000 == 0){
        updateDay(ctx);
    }
}

function death(){
    var l = balls.length;
    for(let j = 0; j < l; j++){
        if(balls[j].eaten < 1){
            balls.splice(j, 1);
            l--;
        }
    }
}

function replicate(ctx){
    var len = balls.length;
    for(let k = 0; k < len; k++){
        if(balls[k].eaten >= 2){
            var newBall = new Ball(400, 400, ctx);
            newBall.setGenes(balls[k]);
            newBall.mutate();
            balls.push(newBall);
        }
    }
}
function updateDay(ctx){
    day++;
    death();
    replicate(ctx);

    for(let i = 0; i < balls.length; i++){
        balls[i].day = 0;
        balls[i].eaten = 0;
        balls[i].x = 400;
        balls[i].y = 400;
        balls[i].r = ballRadius;
    }
    document.getElementById("day").innerHTML = "Day : " + day;
    document.getElementById("indiv").innerHTML = "Population size : " + balls.length;
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
        while(x >= 300 && x <= 500 && y >= 300 && y <= 500){
            x = random(0, 800);
            y = random(0, 800);
        }
        var f = new Food(x, y, ctx);
        food.push(f);
    }
}
function removeFood(index){
    food.splice(index, 1);
}
function addNewIndividual(ball){
    var toAdd = document.createElement("div");
    toAdd.classList.add("container");

    var bounce = document.createElement("div");
    bounce.classList.add("ball");
    bounce.style.backgroundColor = 'rgb(' + ball.genes[0] + ', ' + ball.genes[1] + ', ' + ball.genes[2] + ')';
    toAdd.appendChild(bounce);

    toAdd.innerHTML += "<br>" + "Displacement : " + ball.genes[3] + "<br>" +
                        "Strength : " + ball.genes[5] + "<br>" + 
                        "Sight : " + ball.genes[6];
    var display = document.getElementById("mutated");
    display.appendChild(toAdd);
}