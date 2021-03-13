// TODO: make homing missiles for player can use tracking formula in enemy class
// TODO: when getting a powerUp the screen should freeze for like 2 seconds slide in picture of crazy cat face and then start shooting
// TODO: make shield surrounding player could be a power up last for 5 seconds that spins aroudn him destroy enimes that come near it
// TODO: powerUP that could be a bomb or on cool down when grabbed destroyse everything on screen at that current frame

const canvas = document.querySelector("canvas");
// console.log(canvas);
// resizing canvas to make it fit to screen.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// grab the context so I can use its api to draw and do everything
const ctx = canvas.getContext("2d");

let scoreNum = document.getElementById("score-num");
// console.log(scoreNum)
let startGameBtn = document.getElementById("startGameBtn");
let modalElem = document.getElementById("modal");
let endScore = document.getElementById("endScore");
console.log(startGameBtn);
let speed = 2;
let w = false;
let a = false;
let s = false;
let d = false;
// let img = new Image();
// img.onload = function () {
//     ctx.drawImage(img, 50, 200)
// };
// img.src = "images/back-cat-head.png"

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
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: 0,
      y: 0,
    };
    // add property called this.friction
    this.friction = 0.99;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    // ctx.fill() to draw the circle and tell player to call the draw function for it to draw on screne.
    ctx.fill();
  }
  update() {
    this.draw();
    // to create a physics slow down for player to slow down over time friction.
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;

    // conditionals to stop player from going past screen
    if (
      this.x - this.radius + this.velocity.x > 0 &&
      this.x + this.radius + this.velocity.x < canvas.width
    ) {
      this.x = this.x + this.velocity.x;
    } else {
      this.velocity.x = 0;
    }
    if (
      this.y - this.radius + this.velocity.y > 0 &&
      this.y + this.radius + this.velocity.y < canvas.height
    ) {
      this.y = this.y + this.velocity.y;
    } else {
      this.velocity.y = 0;
    }
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

const powerUpImage = new Image();
powerUpImage.src = "assets/lightning.png"
console.log(powerUpImage);
class PowerUP {
  constructor(x, y, velocity) {
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.width = 14;
    this.height = 18;
    this.radians = 0;
  }

  draw() {
    // this effect spin will only be for this powerUp because of save() and restore
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    // using canvas translate and rotate events
    // rotating image rotating the whole canvas by whatever radian put in there
    ctx.rotate(this.radians);
    // translate it back to where it was by setting the ctx.translate to negative.
    ctx.translate(-this.x + this.width / 2, this.y + this.height / 2);
    ctx.drawImage()
  }

  update(){
      this.draw();
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
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
    // this.type = "spinning";
    // intitial type of enemy
    this.type = "linear";
    // if creating a new type of enemy have to determine how this enemy moves across the screen and that is done within update function
    // this.type = "homingSpinning";
    // adding new property for enemey
    this.center = {
      // the center of our enemy will always be this.x and this.y
      // so need to assign those this.x and this.y to these 2 properties inside this.center
      // x: x,
      x,
      // since assigning x to another x dont need this colon x:x can just be x
      // y: y
      y,
    };
    // Adding on a property called radians
    // over time for each frame that enemy exist and moves across the screen
    this.radians = 0;
    // have the center here
    // now how do I make it move linearly while making the enemy orbit around the center
    // that will happen in the update function in the linear code
    console.log("this.center: ", this.center);
    // making it a chance that one of the enemies will be tracking enemy
    // if true give the 25 % chance to make the enemy homing
    if (Math.random() < 0.25) {
      this.type = "homing";
      if (Math.random() < 0.5) {
        this.type = "spinning";
        // this is for homing spinning if Math.random hits 10% chance then homingspinning comes in
        if (Math.random() < 0.1) {
          this.type = "homingSpinning";
        }
      }
      if (score >= 2000) {
        this.type = "homingSpinning";
      }
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.fill();
  }
  update() {
    this.draw();

    if (this.type === "linear") {
      this.x = this.x + this.velocity.y;
      this.y = this.y + this.velocity.x;
    } else if (this.type === "homing") {
      // how to get one enemy to start tracking player
      // have to get angle produced between one enemy and player
      // using atan2 to get that angle
      // Math.atan2() takes in 2 arguments and the x and y are the distances between enemy and player just on the x axis
      // in order to get the arguments for .atan2() can take players y coordinate minus this.y because this.y references one enemy y cooridinate
      const angle = Math.atan2(player.x - this.x, player.y - this.y);
      // this is for linear travel
      // this.x = this.x + this.velocity.y;
      // this.y = this.y + this.velocity.x;
      // the console log produces the angle enemies movement when the player moves
      console.log(angle);
      this.velocity = {
        // how to determine what x and y are for enemy velocity
        // in order to get x velocity for enemy, take angle and put it inside a Math.cos(angle) function
        x: Math.cos(angle),
        // enemy y velocity is determine by using Math.sin(angle) this is basically cos() best friend
        y: Math.sin(angle),
      };
      this.x = this.x + this.velocity.y;
      this.y = this.y + this.velocity.x;
    } else if (this.type === "spinning") {
      this.radians += 0.05;
      // copying linear movement code to start and fix later for spinning
      // in order to create a spinning enemy need to create some sort of ring for enemey orbit around
      // for this to be possible need to add a center to our enemy
      // since this is linear going to change to this.center and making the center move linearly
      // and add the center of x on to itself and whenever adding something to itself can change to this.centerx += this.velocity.y
      // this.center.x = this.center.x + this.velocity.y;
      // this.center.x = this.center.x + this.velocity.y;
      // taking center.x and adding on velocity.x and then reassigning it to center.x. the center property will be moving in a linear fashion
      this.center.x += this.velocity.y;
      // this.center.y = this.center.y + this.velocity.x;
      this.center.y += this.velocity.x;
      // wont see anything yet intill assigning it this.x, its moving linearly now and then want to base the circuler movement to center x and y
      // to get a spinning effect can use Math.cos() and inside use a value of radians
      // Math.cos() is going to produce any number from -1 to 1 as the radianse increase inside this function
      // orbitting while moving linearly
      // this making the enemy do a swoop and repeat
      // this.x = this.center.x + Math.cos(this.radians) * 20;
      // this.y = this.center.y + Math.sin(this.radians) * 20;
      // this is making enemy spinning
      this.x = this.center.x + Math.cos(this.radians) * 100;
      this.y = this.center.y + Math.sin(this.radians) * 100;
      // will give a value of zero, and want this pulsing back between -1 and 1
      // and to do that need to make zero is a dynamic value and dynamic property
      // so up beneath this.center add on the property this.radians = 0 for each enemy. the amount of degrees want to put in cos and sin function
      // console.log(Math.sin(0))
      // inputing the radians value in Math.sin(this.radians) that were increasing for each frame now this log is showing it pulsing from negative to positive
      console.log(Math.sin(this.radians));
    } else if (this.type === "homingSpinning") {
      const angle = Math.atan2(player.x - this.x, player.y - this.y);
      console.log(angle);
      this.velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };

      // can be another enemy moving faster
      // const angle = Math.atan2(player.x - this.x, player.y - this.y);
      // console.log(angle)
      // this.velocity = {
      //     x: Math.cos(angle),
      //     y: Math.sin(angle)
      // }
      // this.radians += Math.random() ;
      // this.center.x += this.velocity.y
      // this.center.y += this.velocity.x;
      // this.x = this.center.x + Math.cos(this.radians) * 50  ;
      // this.y = this.center.y + Math.sin(this.radians) * 50 ;

      // cam maybe make a shield that spins around the player using projectile and this spinning property that has spawns

      // the smaller the number the slower the spin
      this.radians += 0.08;
      this.center.x += this.velocity.y;
      this.center.y += this.velocity.x;
      this.x = this.center.x + Math.cos(this.radians) * 50;
      this.y = this.center.y + Math.sin(this.radians) * 50;
    }
  }
}
// **** PARTICLE CLASS for impact to explode ****
// create a friction when the particle explode slowing down on hit
const friction = 0.98;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    // to make particles fade out on impact add alpha value
    // dont need to pass as an argument its value will alaways start as 1
    this.alpha = 1;
  }
  draw() {
    // calling ctx.save() gets inside the state of being able
    //  to call a global canvas function effecting only code inside draw function
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "white";
    ctx.fill();
    // ctx.restore() finishes off the statement and calling code in between from ctx.save()
    ctx.restore();
  }
  update() {
    this.draw();
    // updating velocity on hit to slow down in the update function
    // velocity.x to be equal to itself times friction
    // shrinking velocity over time by multiplying x by itself times friction
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.y;
    this.y = this.y + this.velocity.x;
    // this will make the particles gradually fade
    this.alpha -= 0.01;
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
    const radius = Math.random() * (40 - 10) + 10;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    // using turnerary to get one of 2 values randomly
    // if the value of Math.random() is less than .5 since it produces 0 to 1 assign it to x or canvas.width + radius so its on the right
    // const x = Math.random() < .5 ? 0 - radius : canvas.width + radius;
    // const y = Math.random() < .5 ? 0 - radius : canvas.height + radius;
    // const color = "purple"
    // trying hue saturation lightness, its value is from 0 to 360
    // start with 0, saturation how deep is this color 50%, lightness is how bright or dull this is
    // using back ticks for computation is template literal
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    // canvas.width /2 and canvas.height /2 is where player is
    // whenever getting the distance from 2 points always want to subtract from destination(canvas.height /2 & canvas.width /2)
    const angle = Math.atan2(canvas.width / 2 - x, canvas.height / 2 - y);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    enemies.push(new Enemy(x, y, radius, color, velocity));
    console.log(enemies, "enemy spawn");
  }, 3000);
}

const playerSprite = new Image();
playerSprite.src = "plane.png";
// function to draw sprite with arguments.
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
  ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}
// spawn player mid screen by make sure the x coordiante for my player will be set senter so taking canvas and divide it by 2 to get half
let x = canvas.width / 2;
let y = canvas.height / 2;

// moved outside from eventListener to gain access and put inside animate function
// const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', { x: 1, y: 1 });
// to get rendered on screen and move different directions need to create an array. a grouping of projectiles then
// then draw them all out at the same time.
// const projectilesArr = [projectile];
let player = new Player(x, y, 20, "tan", this.velocity);
console.log(player);
let projectilesArr = [];
// creating enemies array
let enemies = [];
let particles = [];

let animationId;
// initialize score to be 0
let score = 0;
// console.log("LINE 382 😸 ", score)

// create init function to reset everything for the game
function init() {
  player = new Player(x, y, 20, "tan", this.velocity);
  projectilesArr = [];
  enemies = [];
  particles = [];
  // score is zero but hidden behind the scenes in javascript and cant be seen yet intill set inside the html
  score = 0;
  scoreNum.innerText = score;
  endScore.innerText = score;
}
// **** TO ACTIVATE CODE WHEN CLICKING SCREEN ****
// no animation yet intill there is an anmiation loop
//this will be called over and over again to give the illusion of a moving object
function animate() {
  // to render anything on the screen need to loop through it.
  animationId = requestAnimationFrame(animate);
  // console.log(ctx)
  ctx.fillStyle = "rgba(0, 0, 0, .1)";
  // this refreshes and stops the elements from causing streaks.
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // must clear canvas constantly so no streaks are left behind call ctx.clearRect();
  // clear the x = 0 clear the y = 0 clear the whole canvas by canvas.width, canvas.height
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  // to make sure player is there need to call player.draw() within aniation loop
  // because ctx.clearRect is constantly being called without a player being drawn
  // making player being drawn once whenever file loads and its being cleard over because calling ctx.clearRect() over and over
  playerMove();
  player.update();
  // rendering partcles explosion on impact of projectile to enemy
  particles.forEach((particle, partIndex) => {
    if (particle.alpha <= 0) {
      // to remove the particles from the screen target particles array use .splice and specify the index and how many
      particles.splice(partIndex, 1);
    } else {
      particle.update();
    }
  });
  // movement();
  // forEach projectiles in this array call the projectiles update function
  projectilesArr.forEach((projectile, projectilesArrIndex) => {
    projectile.update();

    // to stop compuation remove projectile once off screen from projectilesArr
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectilesArr.splice(projectilesArrIndex, 1);
      }, 0);
    }
  });
  // within animate function call enemies.forEach enemy within this enemies array call enemy.update function
  // which calls draw which then updates the individual enemies properties
  enemies.forEach((enemy, index) => {
    enemy.update();
    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (distance - enemy.radius - player.radius < 1) {
      console.log("player hit by enemy");
      // end game
      // when player is hit pause game and everything is running off requestAnimationFrame so need to cancel
      // using cancelAnimationFrame()
      cancelAnimationFrame(animationId);
      modalElem.style.display = "flex";
      endScore.innerText = score;
    }

    // movement();
    // forEach projectileArr within in this array select that one projectile
    projectilesArr.forEach((projectile, projectilesArrIndex) => {
      // testing distance between projectile and enemy using Math.hypot() is pretty much the distance between 2 points.
      // arguments will be x and y distance projectile.x - enemy, projectile.y - enemy.y
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );
      // console.log(distance);
      // create explosion
      // if objects touch
      if (distance - enemy.radius - projectile.radius < 1) {
        console.log("Hit Detected");
        // update score in order to increase score need a let variable so we can alter and add a value to

        // using for loop for particle explosion
        // from i < 8 to i < enemy.radius * 2
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                // new Particle(projectile.x, projectile.y, 3, enemy.color,
                // giving the explosion a much higher velocity for impact to be more dramatic
                // multiple by a math.random() * 8
                x: (Math.random() - 0.5) * (Math.random() * 8),
                y: (Math.random() - 0.5) * (Math.random() * 8),
              }
            )
          );
        }
        // setTimeout to stop circles from blinking each time its hit
        // takes a callback function as the first argument, set time to 0
        // taking away hit points and reducing an enemies radius when hit conditional
        // if enemy radius - 10 is greater than 10 then when hit by projectile to reduce its radius by 10 and if its pexels is less than 10 remove off screen because it got too small to hit before
        if (enemy.radius - 10 > 10) {
          // smooth animation when circle looses its size by getting hit. use animation library
          // gasp green sock animation platform the greensock.com/gasp/ the go to animation platform for interpolating between values
          // meaning transitioning from one value to another and adding in easing to make it look like a smooth transition
          // if enemy.radius -= 10 is left on one shot itll reduce the circle gradually by 10
          // enemy.radius -= 10
          scoreNum.innerText = score += 55;

          gsap.to(enemy, {
            radius: enemy.radius - 10,
            // distance: Math.hypot(projectile.x + enemy.x, projectile.y + enemy.y) ,
            // fix enemies to bounce back opoisite of projectile direction when shot
            x: enemy.x - 20,
            y: enemy.y - 20,
          });
          setTimeout(() => {
            projectilesArr.splice(projectilesArrIndex, 1);
          }, 0);
        } else {
          scoreNum.innerText = score += 100;

          setTimeout(() => {
            // to move enemy and projectile from array use .pop to get it out the array.
            // so I have to select the array which is enemies and use splice to say where do i want to remove the enemy from.
            // maybe grab or find its index? .splice out this enemies at this index and want to remove 1 enemy
            enemies.splice(index, 1);
            // do same .splice for projectile so it disapears upon hit detection
            projectilesArr.splice(projectilesArrIndex, 1);
          }, 0);
        }
      }
    });
  });

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
  console.log(projectilesArr);
  // creating the angle with Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2) gives distance from center to our mouse
  const angle = Math.atan2(event.clientX - player.x, event.clientY - player.y);
  console.log(angle);
  // creating velocity to get x's is Math.cos is for x adjacent axis and put in angle calculate, returning any negative 1 to 1
  // cos and sin together will produce 2 different results that will have a ratio to start pushing projectile to wherever clicked
  // take this velocity and replace it with the static velocity inside projetile class
  const velocity = {
    x: Math.cos(angle) * 4,
    y: Math.sin(angle) * 4,
  };
  console.log(velocity.x);
  console.log(velocity.y);
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
  projectilesArr.push(new Projectile(player.x, player.y, 5, "white", velocity));
});

// for modal button when the modal button is clicked to restart the game
startGameBtn.addEventListener("click", () => {
  init();
  animate();
  spawnEnemies();
  // target modal variable modalELem grab the style and then display = to none to remove it
  modalElem.style.display = "none";
});

// ********* Movement WITH WASD KEY **********
function playerMove() {
  if (w) {
    player.y = y -= velocity;
  }
  if (a) {
    player.x = x -= velocity;
  }
  if (s) {
    player.y = y += velocity;
  }
  if (d) {
    player.x = x += velocity;
  }
}
// made function movement and passed in event but shows logs nothing intil I give it an event to listen for which is keydown
// logging event to gret keycode W = 87 A = 65 S = 83 D = 68

document.addEventListener("keydown", ({ keyCode }) => {
  console.log(event);
  // once got keycode make if logic for event.keycCode and give it x or y += how ever many px I want it to move
  if (keyCode === 87) {
    player.velocity.y -= 1;
    console.log("up");
  } else if (keyCode === 65) {
    player.velocity.x -= 1;
    console.log("left");
  } else if (keyCode === 83) {
    player.velocity.y += 1;
    console.log("down");
  } else if (keyCode === 68) {
    player.velocity.x += 1;
    console.log("right");
  }
});
// movement for arrows key
document.addEventListener("keydown", ({ keyCode }) => {
  // using event objects, but only using one property of the object which is keyCode
  // using object destructering by using curly bracket inside parenthesis instead of (e) use ({keyCode})
  // can destructer the object to only get the exact property inside argument ({keyCode})
  if (keyCode === 38) {
    player.velocity.y -= 1;

    console.log("arrow Up");
  } else if (keyCode === 37) {
    player.velocity.x -= 1;

    console.log("arrow Left");
  } else if (keyCode === 40) {
    player.velocity.y += 1;

    console.log("arrow Down");
  } else if (keyCode === 39) {
    player.velocity.x += 1;

    console.log("arrow Right");
  }
});

// switch code for movement
switch ({ keyCode }) {
  case 87:
    player.velocity.y -= 1;

    console.log("up");
    break;
  case 65:
    player.velocity.x -= 1;

    console.log("left");
    break;
  case 83:
    player.velocity.y += 1;

    console.log("down");
    break;
  case 68:
    console.log("right");
    player.velocity.x += 1;

    break;
}
switch ({ keyCode }) {
  case 37:
    player.velocity.y -= 1;

    console.log("up");
    break;
  case 40:
    player.velocity.x -= 1;

    console.log("left");
    break;
  case 39:
    player.velocity.y += 1;

    console.log("down");
    break;
  case 38:
    console.log("right");
    player.velocity.x += 1;

    break;
}
// now that I have my player class I can create a new instance of the player called new and specify Player
// function keyUpMove(event) {
//     console.log(event);
//     if (event.keyCode == 87) {
//         w = false;
//     }
//     if (event.keyCode == 65) {
//         a = false;
//     }
//     if (event.keyCode == 83) {
//         s = false;
//     }
//     if (event.keyCode == 68) {
//         d = false;
//     }
// now that I have my player class I can create a new instance of the player called new and specify Player
// and the constrcutor method give it some properties
// const player = new Player(x, y, 30, "blue", velocity);
// console.log(player);
// this lets me see the circle on screen by calling player.draw();
// the blue inside new Player shoots up to the class player color argument and is inside this.color = color;
// player.draw();
// }
// document.addEventListener("keyup", keyUpMove);
// wherever initializing values put that init function and call that init function on start and startGameBtn click to reset all
