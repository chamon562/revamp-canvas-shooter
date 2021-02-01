// console.log("app.js conected") app is connected to the html
// first grab the canvas and set it to a variable
// some power up for players 
// defensive reflection shield that last for 5 seconds reflecting enemy projectile to bounce back


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
        ctx.fill();
    }
    // adding in update function to update classes property so can seperate what my class
    // looks like compared to where im manipulating its properties on the screen 
    // what to add velocity 
    update() {
        // to draw that projectile combine draw function
        this.draw();
        // for each frame for animation loop set x coordiante for each projectile
        // this.x is equal to the current x coordinate this.x + this.velocity (the coordiantes veloctiy )
        // this is where creating the velocity for x and y only issue is not yet pass through velocity to our projectile
        // find new Projectile where made click event and change null to javascript objet x and y
        this.x = this.x + this.velocity.y;
        this.y = this.y + this.velocity.x;
    }
}

// **** ENEMY CLASS ****
class Enemy {
    constructor(x, y, radius, color, velocity) {
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
        ctx.fill();
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.y;
        this.y = this.y + this.velocity.x;
    }
}
// new function to spawn Enemies
// need to create something that groups multiple enemies together then
// draw them all out at the same time.
function spawnEnemies() {
    setInterval(() => {
        // whenever spawning new enemies take enemies array and push a new instance of enemy called new Enemy class
        // Enemy class takes in x y color and velocity
        // const x = Math.random() * canvas.width; //cause enemies to spawn randomly close to player so unfair want to spawn off screen
        // const y = Math.random() * canvas.height;
        // for enemies off the screen to left needs to be at 0 minus its radius
        // moved radius above x so it can be counted before x making it turn negative which will be off screen from the left
        // to get a random number of radius from 0 to 30 Math.random() * 30
        // the issue with is some circles radius are very small so went to set a minimum  of 5 by taking the radius - 5 warapping it around parenthesis then add the 5
        const radius = Math.random() * (50 - 10) + 10;
        let x;
        let y;
        if (Math.random() < .5) {
            x = Math.random() < .5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < .5 ? 0 - radius : canvas.height + radius;
        }
        // using turnerary to get one of 2 values randomly 
        // if the value of Math.random() is less than .5 since it produces 0 to 1 assign it to x or canvas.width + radius so its on the right
        // const x = Math.random() < .5 ? 0 - radius : canvas.width + radius;
        // const y = Math.random() < .5 ? 0 - radius : canvas.height + radius;
        const color = "purple"
        // canvas.width /2 and canvas.height /2 is where player is
        // whenever getting the distance from 2 points always want to subtract from destination(canvas.height /2 & canvas.width /2)
        const angle = Math.atan2(canvas.width / 2 - x, canvas.height / 2 - y);
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(x, y, radius, color, velocity))
        console.log(enemies, "enemy spawn")
    }, 2000);
}
// creating enemies array 
const enemies = [];
// spawn player mid screen by make sure the x coordiante for my player will be set senter so taking canvas and divide it by 2 to get half
let x = canvas.width / 2;
let y = canvas.height / 2;
// ********* Movement WITH WASD KEY **********
// made function movement and passed in event but shows logs nothing intil I give it an event to listen for which is keydown
// logging event to gret keycode W = 87 A = 65 S = 83 D = 68
const player = new Player(x, y, 30, "#00FFFF");
function movement(event) {
    console.log(event);
    // once got keycode make if logic for event.keycCode and give it x or y += how ever many px I want it to move
    if (event.keyCode == 87) {
        y -= 10;
    }
    if (event.keyCode == 65) {
        x -= 10;
    }
    if (event.keyCode == 83) {
        y += 10;
    }
    if (event.keyCode == 68) {
        x += 10;
    }
    // now that I have my player class I can create a new instance of the player called new and specify Player 
    // and the constrcutor method give it some properties
    const player = new Player(x, y, 30, "blue");
    // console.log(player);
    // this lets me see the circle on screen by calling player.draw();
    // the blue inside new Player shoots up to the class player color argument and is inside this.color = color;
    player.draw();
}
document.addEventListener("keydown", movement);

// moved outside from eventListener to gain access and put inside animate function 
// const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', { x: 1, y: 1 });
// to get rendered on screen and move different directions need to create an array. a grouping of projectiles then
// then draw them all out at the same time.
// const projectilesArr = [projectile];
const projectilesArr = [];



// **** TO ACTIVATE CODE WHEN CLICKING SCREEN ****
// no animation yet intill there is an anmiation loop
//this will be called over and over again to give the illusion of a moving object
function animate() {
    requestAnimationFrame(animate);
    // must clear canvas constantly so no streaks are left behind call ctx.clearRect();
    // clear the x = 0 clear the y = 0 clear the whole canvas by canvas.width, canvas.height
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // to make sure player is there need to call player.draw() within aniation loop 
    // because ctx.clearRect is constantly being called without a player being drawn 
    // making player being drawn once whenever file loads and its being cleard over because calling ctx.clearRect() over and over
    player.draw();
    // movement();
    // forEach projectiles in this array call the projectiles update function
    projectilesArr.forEach((projectile) => {
        projectile.update();
    })
    // within animate function call enemies.forEach enemy within this enemies array call enemy.update function
    // which calls draw which then updates the individual enemies properties
    enemies.forEach((enemy) => {
        enemy.update()
    })

    // **** Hit Detection **** 
    // needs to be in animate loop because for each frame need to check if projectile is touching enemy

    // console.log("calling animte function")
    // to move projectile from center x velocity to x coordinate and same for y
    // each frame I loop through will be adding on velocity
    
    // projectile.draw();
    // projectile.update();
}

// want to add an event listener on mousedown or click
// little strick found that you can get rid of window and just leave it as addEventListener because the window will already know to clean up code. 
// want projectile to fire wherever my mouse is so I must get the x and y coordiante of it wherever i click to move that way. 
// get through an event object. 
addEventListener("click", (event) => {
    // creating the angle with Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2) gives distance from center to our mouse
    const angle = Math.atan2(event.clientX - canvas.width / 2, event.clientY - canvas.height / 2);
    console.log(angle);
    // creating velocity to get x's is Math.cos is for x adjacent axis and put in angle calculate, returning any negative 1 to 1
    // cos and sin together will produce 2 different results that will have a ratio to start pushing projectile to wherever clicked
    // take this velocity and replace it with the static velocity inside projetile class
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    console.log(velocity.x)
    console.log(velocity.y)
    // create a new projectile, draw it on the screen wherever clicked, and 
    // then add velocity so projectile moves from center wherever click 
    // the first argument for this function is an event object so pass that in
    // this console.log(event) shows the mouse event when i click and gives all the x and y coordiantes
    // also gives me the properties related to where my mouse was wherever I click on screen. clientX clientY
    // so now I know my event.clientX and event.clientY as my arguments for my projectile.
    console.log(event);
    console.log("clientX:", event.clientX, "clientY:", event.clientY);
    // this shows projectile on click wherever on the screen
    // const projectile = new Projectile(event.clientX, event.clientY, 5, 'red', null); 
    // this starts the projectile from the center of the screen need to connect to player later 
    // since projectile is set to const its considered scope and only accessible within this addEventListener call back
    // const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', {x: 1, y: 1});
    // console.log("your are clicking");
    // to draw the projectile on click get the projectile variable that stores its properies then .draw() function
    // now projectile shows by just making a static dot when i click the sreen, next how can get it to move.
    // determine x and y velocity that pushes up to the point of click
    // gotta get the angle, then put in atan2 function and is what produces the angle get x and y put in atan2
    // atan(x, y) = angle, atain()** , once got angle in radians will get x and y velocity
    // put angle in sin(angle) cos(angle) functions sin and cos are functions that produce a ratio
    //     projectile.draw();
    //     projectile.update();
    // now get angle for x and y to create velocity
    projectilesArr.push(new Projectile(x, y, 5, "red", velocity))
})


animate();
spawnEnemies();