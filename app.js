// console.log("app.js conected") app is connected to the html
// first grab the canvas and set it to a variable
const canvas = document.querySelector("canvas");
// console.log(canvas);
// resizing canvas to make it fit to screen.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// grab the context so I can use its api to draw and do everything
const ctx = canvas.getContext("2d");

// to create a player consist of a circle in middle and once something hits it game over
// payer needs to interact with the rest of elements on screen. 
// look into creating a class for Player class Player capitol P to say its a class
class Player {
    // what properties does a player have? if its a circle Im gonna give it circle arguments. 
    // a starting position for now, a size, and a color x, y, radius, color
    // in order to create properties and specify to a specific class need to create a constrcutor
    // a constructor is called each time I instantiate a new version of player class
    // each time i create a new player will give player all these individual properties to differentiate it 
    // from other players I might create
    // whenever I create new players I add new proprerties on to that new instance of the player 
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        // ctx.fill() to draw the circle and tell player to call the draw function for it to draw on screne.
        ctx.fill();
    }
}

// ******** SHOOT PROJECTILES FROM MY PLAYER ********
// what properties does a projectile have?
// im thinking similar to a circle itll be a ball shooting out for now. 
// maybe an x, y, radius, color, and a velocity
// note from research whenever creating multiple instances like multiple projectiles shot form mid screen
// alays create a class because its going to be creating new instances of that blue print, new instances of that
// projectile each time clicking on the screen. 
// *** Class Projectile ***
class Projectile {
    //  properties constructor should have is x, y, radius, color, velocity for projectile since its going to be moving. 
    constructor(x, y, radius, color, velocity) {
        // now whenever created projectile need to assign arguments to one instances individual property.
        // this instance x should be equal to x
        // this is the blue print for my projectiles for what it should look like a little circle
        // can call draw function to this to draw this projectile.
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill()
    }
}

// want to make sure the x coordiante for my player will be set senter so taking canvas and divide it by 2 to get half
const x = canvas.width / 2;
const y = canvas.height / 2;
// now that I have my player class I can create a new instance of the player called new and specify Player 
// and the constrcutor method give it some properties
const player = new Player(x, y, 30, "blue");
// console.log(player);
// this lets me see the circle on screen by calling player.draw();
// the blue inside new Player shoots up to the class player color argument and is inside this.color = color;
player.draw();

// **** TO ACTIVATE CODE WHEN CLICKING SCREEN ****
// want to add an event listener on mousedown or click
window.addEventListener("click", () =>{
    console.log("your are clicking");
})
