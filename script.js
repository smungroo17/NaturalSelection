NUM_BALLS = 50;
var ballRadius = 10;
balls = [];
var id = 0;
var day = 0;
food = []
amountFood = 100;
diversity = [];
colorPresent = [];

document.addEventListener("DOMContentLoaded", setup);  
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
class Gene {
    constructor(){
        this.rgb1 = 52;
        this.rgb2 = 235;
        this.rgb3 = 143;
        this.xDisplacement = 10;
        this.yDisplacement = 10;
        this.sight = 10;
    }
    setColor(c1, c2, c3){
        this.rgb1 = c1;
        this.rgb2 = c2;
        this.rgb3 = c3;
    }
    setDisplacement(x, y){
        this.xDisplacement = x;
        this.yDisplacement = y;
    }
    setSight(s){
        this.sight = s;
    }
    getColor(){
        return ('rgb(' + this.rgb1 + ', ' + this.rgb2 + ', ' + this.rgb3 + ')');
    }
    getColorTuple(){
        return [this.rgb1, this.rgb2, this.rgb3];
    }
    getDisplacement(){
        return this.xDisplacement;
    }
    getSight(){
        return this.sight;
    }
}

class Ball {
    constructor(x,y,ctx) {
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.r = ballRadius; // radius
        this.id = id;
        id++;
        this.genes = new Gene();
        this.day = 0;
        this.eaten = 0;
    }
    getGene(){
        return this.genes;
    }
    draw() {
        this.ctx.fillStyle = this.getGene().getColor();
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false); 
        this.ctx.fill();
    }
    update() {
        var randomX = random(-1 * this.getGene().getDisplacement(), this.getGene().getDisplacement());
        var randomY = random(-1 * this.getGene().getDisplacement(), this.getGene().getDisplacement());
        if(this.x + randomX > canvas.width-ballRadius || this.x + randomX < ballRadius) {
            randomX = -randomX;
        }
        if(this.y + randomY > canvas.height-ballRadius || this.y + randomY < ballRadius) {
            randomY = -randomY;
        }
        this.x += randomX;
        this.y += randomY;
        var len = food.length;
        for(var m = 0; m < len; m++){
            var euclideanDist = Math.sqrt(Math.pow((this.x-food[m].x), 2) + Math.pow((this.y-food[m].y), 2));
            if(euclideanDist < this.getGene().getSight()){
                this.eaten++;
                //this.r += 2;
                this.x = food[m].x;
                this.y = food[m].y;
                food.splice(m, 1);
                break;
            }
        }
        this.day++;
    }
    setGenes(parent) {
        if(parent != null){
            //color->rgb
            var [rgb1, rgb2, rgb3] = parent.getGene().getColorTuple();
            this.getGene().setColor(rgb1, rgb2, rgb3);
            
            this.getGene().setDisplacement(parent.getGene().getDisplacement(), parent.getGene().getDisplacement());
            this.getGene().setSight(parent.getGene().getSight());
        }
        else{
            this.getGene().setColor(51, 235, 143);
            this.getGene().setDisplacement(10);
            this.getGene().setSight(10);
        }
    }
    mutate(){
        var chance = getRandomInt(1, 25);
        //random number chosen
        //4% chance of mutation
        if(chance == 5){
            var fav = getRandomInt(0,3);
            // 1% disadvantageous mutation touching sight
            if(fav == 0){
                this.getGene().setColor(41, 131, 163);
                this.getGene().setDisplacement(10);
                this.getGene().setSight(5);
            }
            // 1% advantageous mutation touching sight
            else if(fav == 1) {
                this.getGene().setColor(168, 30, 30);
                this.getGene().setDisplacement(10);
                this.getGene().setSight(20);
            }
            // 1% advantageous mutation touching displacement
            else if(fav == 2){
                this.getGene().setColor(153, 149, 28);
                this.getGene().setDisplacement(12);
                this.getGene().setSight(10);
            }
            // 1% disadadvantageous mutation touching displacement
            else{
                this.getGene().setColor(61, 39, 161);
                this.getGene().setDisplacement(8);
                this.getGene().setSight(10);
            }
        }
    }
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
    colorPresent.push(balls[0].getGene().getColor());
    annex();
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
    annex();
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

function annex(){
    checkColorPresent();
    var display = document.getElementById("mutated");
    var gr = 0;
    var red = 0;
    var purp = 0;
    var yell = 0;
    var blue = 0;
    for(let j = 0; j < balls.length; j++){
        if(balls[j].getGene().getColor() == 'rgb(51, 235, 143)'){
            gr += 1;
        }
        else if(balls[j].getGene().getColor() == 'rgb(41, 131, 163)'){
            blue += 1;
        }
        else if(balls[j].getGene().getColor() == 'rgb(168, 30, 30)'){
            red += 1;
        }
        else if(balls[j].getGene().getColor() == 'rgb(153, 149, 28)'){
            yell += 1;
        }
        else if(balls[j].getGene().getColor() == 'rgb(61, 39, 161)'){
            purp += 1;
        }
    }
    display.innerHTML = '';
    for(let i = 0; i < colorPresent.length; i++){
        if(!diversity.includes(colorPresent[i])){
            var toAdd = document.createElement("div");
            toAdd.classList.add("container");
            
            var bounce = document.createElement("div");
            bounce.classList.add("ball");
            bounce.style.backgroundColor = colorPresent[i];
            toAdd.appendChild(bounce);
            toAdd.id = colorPresent[i];

            if(colorPresent[i] == 'rgb(51, 235, 143)'){
                toAdd.innerHTML += "<br>" + "Displacement : " + 10 + "<br>" +
                "Sight : " + 10 + "<br>" +
                "Number : " + gr;
            }
            else if(colorPresent[i] == 'rgb(41, 131, 163)'){
                toAdd.innerHTML += "<br>" + "Displacement : " + 10 + "<br>" +
                "Sight : " + 5 + "<br>" +
                "Number : " + blue;;
            }
            else if(colorPresent[i] == 'rgb(168, 30, 30)'){
                toAdd.innerHTML += "<br>" + "Displacement : " + 10 + "<br>" +
                "Sight : " + 15 + "<br>" +
                "Number : " + red;
            }
            else if(colorPresent[i] == 'rgb(153, 149, 28)'){
                toAdd.innerHTML += "<br>" + "Displacement : " + 12 + "<br>" +
                "Sight : " + 10 + "<br>" +
                "Number : " + yell;
            }
            else if(colorPresent[i] == 'rgb(61, 39, 161)'){
                toAdd.innerHTML += "<br>" + "Displacement : " + 8 + "<br>" +
                "Sight : " + 10 + "<br>" +
                "Number : " + purp;
            }
            display.appendChild(toAdd);
            diversity.push(colorPresent[i]);
        }
    }
}

function checkColorPresent(){
    colorPresent = [];
    diversity = [];
    for(let i = 0; i < balls.length; i++){
        if(!colorPresent.includes(balls[i].getGene().getColor())){
            colorPresent.push(balls[i].getGene().getColor());
        }
    }
}
