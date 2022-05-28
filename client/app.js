// TODO: make homing missiles for player can use tracking formula in enemy class
// TODO: when getting a powerUp the screen should freeze for like 2 seconds slide in picture of crazy cat face and then start shooting
// TODO: make shield surrounding player could be a power up last for 5 seconds that spins aroudn him destroy enimes that come near it
// TODO: powerUP that could be a bomb or on cool down when grabbed destroyse everything on screen at that current frame
// TODO: Choose YOUR ALTER EGO announcer momma cat! mr grey! show different cats you can choose out of. meow meow meoW
// TODO: Button in the middle will be the super button and each cat would have its own super. have a meter based off projectiles impact filling up meter and then super pops in the middle of the screen.
// TODO: cat characters MR GREY, Momma cat crystal, baby yellow
// enemies are balls of yarn when they explode fire work or dust
// TODO: COMBO FARTS based off of seconds on kill if the player kills the next target within a 1 or 2 seconds the next sound should be a louder fart. more fart sounds. cat blaster,
// TODO: DLC different skins for your cat. head bands, hats, robo cat, conan cat, gangsta cat with a doo rag and a fat chain.
// TODO: IDeas for interactive background to fade on bass background music https://speckyboy.com/audio-visualization-code-snippets/

const canvas = document.querySelector("canvas");
// console.log(canvas);
// when browser changes its width make sure setting current canvas.width to new inner width and height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
// console.log(ctx);

const soundOnEl = document.querySelector("#soundOnEl");
const soundOffEl = document.querySelector("#soundOffEl");
const scoreElement = document.querySelector("#score-elem");
const startGameBtn = document.querySelector("#start-game-btn");
const modalElement = document.querySelector("#modal-element");
const bigScoreELement = document.querySelector("#big-score-element");
const boardForm = document.querySelector("#board-form");
// console.log(scoreElement);

// audio sound effects
const startGameAudio = new Audio("audio/powerUp1.wav");
const endGameAudio = new Audio("audio/sadKitty.wav");
const shootAudio = new Audio("audio/smallShot.wav");
const hitAudio = new Audio("audio/quickThud.wav");
const exlposionAUdio = new Audio("audio/quickFartNoReverb.mp3");
const powerUpAudio = new Audio("audio/meowPowerUp.wav");
const backgroundMusicAudio = new Audio("audio/marshMallowBackgroundMusic.mp3");
backgroundMusicAudio.loop = true;
backgroundMusicAudio.volume = 0.2;
startGameAudio.volume = 0.15;
// contain all properties needed to effect the game
const scene = {
  active: false,
};

// creating an image for the hero using the new Image Contructor object
const heroImageIdle = new Image();
// setting the img src attributee to the rockat_Idle.png
heroImageIdle.src = "assets/idleCatOne.png";
console.log(heroImageIdle.src);
// frameWidth, my sprite sheet is width:1100 x height:200 with 6 frames
// so the idea is to cut out and grab only that 1st frame by noticing the height is 200
// and since theres 6 frames to single them out take 1100 and divide by 6 to get me a number 183.3333
// so I rounded down
// rows and columns are started at 0 like how I understand the first index of an array.
// for idle cat
let column = 6;
let row = 1;
let frameWidth = 1080 / 6;
let frameHeight = 200;
console.log(frameWidth);
let totalFrames = 6; // because there are 6 sprites in totla. therefore the animation will take place over 6 frames
let currentFrame = 0; //the value of current frame will change, will increment
// console.log(column * frameWidth)
// variables to cut out and display a specific sprite from sprite sheet
// will increase these values by sprite widith or sprite height to show that each sprite is displayed
let srcX = 0;
let srcY = 0;
// create a variable to slow down the frames
let frameDrawn = 0;

const explosionImage = new Image();

explosionImage.src = "assets/exploding.png";

class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    // this will change the image size
    this.scale = scale;
    this.framesMax = framesMax;
    // making a variable for the max amount of frames with our image.
    // so it doesnt mess up each different image
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
    // make the smoke go faster when enemy or player health is less than 30 health pointsd
    // if (player.health < .30 || enemy.health < .30) {
    //   if (this.frameCurrent < this.framesMax - 1) {
    //     this.framesHold = 3;
    //     this.frameCurrent++;
    //   } else {
    //     this.frameCurrent = 0;
    //   }
    // }
  }
  update() {
    this.draw();
    this.animateFrames();
  }
}
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "assets/purpleNeb.png",
});

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.friction = 0.99;
    this.powerUp = "";
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    // drawing the Image
    // source image starting coordinates
    // point to coordinates (0, 0) on the sprite sheet
    // sx, sy size to 'copy' from the source image
    // select an frameWidth & frameHeight sized area, which is the size of one individual sprite.
    // sw, dy, destination coordinates
    // Then we point to  on the destination canvas and draw the image we selected, again with an (183,200) size
    //dw, dh destination size
    // ctx.drawImage(heroImageIdle, column *frameWidth, row * frameHeight, frameWidth,frameHeight, this.x -120 , this.y - 116, frameWidth, frameHeight )
    // image, srcX, srcY, srcWidth, srcHeight, destX, destY, desWidth, destheight
    // srcX, srcY, srfWIdth, srcHeight, allow us to crop out the source area from the source image
    // that was passed as the first argument.
    // ctx.drawImage(
    //   heroImageIdle,
    //   (column % 4) * frameWidth,
    //   row * frameHeight,
    //   frameWidth,
    //   frameHeight,
    //   this.x - 120,
    //   this.y - 116,
    //   frameWidth,
    //   frameHeight
    // );
    currentFrame = currentFrame % totalFrames;
    // console.log(currentFrame);
    srcX = currentFrame * frameWidth;
    ctx.drawImage(
      heroImageIdle,
      srcX,
      srcY,
      frameWidth,
      frameHeight,
      this.x - 95,
      this.y - 140,
      frameWidth,
      frameHeight
    );
    // column ++ causes the image to quickly jiggle back and forth on the same frame
    // row++ causes the image to intialy not display but slow pulse and blink in and out every second
    // row++
  }

  update() {
    this.draw();
    frameDrawn += 1.2;
    if (frameDrawn >= 9) {
      currentFrame += 1;
      frameDrawn = 0;
    }
    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

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
  shoot(mouse, color = "white") {
    const angle = Math.atan2(mouse.y - this.y, mouse.x - this.x);
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };
    // console.log(velocity);
    // console.log(angle);
    projectilesArray.push(
      // this is player.x+ 50 positions where the projectile comes out
      new Projectile(player.x + 55, player.y + 5, 5, color, velocity)
    );
    // use cloneNode() this is a function that is going to clone the audio obejct and play that new clone
    // to play audio objects on top of each other with having to wait till audio file is done playing itself

    shootAudio.cloneNode().play();
  }
}

class Projectile {
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
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

const powerUpImage = new Image();
powerUpImage.src = "assets/lightning.png";
console.log(powerUpImage.src);

class PowerUp {
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
    ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
    ctx.drawImage(powerUpImage, this.x, this.y, 14, 18);
    ctx.restore();
  }

  update() {
    this.radians += 0.05;
    this.draw();
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

// const explosionImage = new Image();

// explosionImage.src = "assets/rocketKitty/Explosion.png";
// console.log(explosionImage.src);

console.log(frameWidth);
class Explosion {
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
    srcX = currentFrame * frameWidth;
    ctx.drawImage(
      explosionImage,
      srcX,
      srcY,
      2400 / 8,
      300,
      this.x - 95,
      this.y - 140,
      2400 / 8,
      300
    );

    // using canvas translate and rotate events
    // rotating image rotating the whole canvas by whatever radian put in there
    ctx.rotate(this.radians);
    // translate it back to where it was by setting the ctx.translate to negative.
    ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
    ctx.drawImage(explosionImage, this.x, this.y, 14, 18);
    ctx.restore();
  }

  update() {
    this.draw();
    frameDrawn += 1.2;
    if (frameDrawn >= 9) {
      currentFrame += 1;
      frameDrawn = 0;
    }
    this.radians += 0.05;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
  }
}

let ballEnemy = new Image();
ballEnemy.src = "assets/ballYarn.png";
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.type = "linear";
    // this.type = "homing";
    // this.type = "spinning";
    this.center = {
      x,
      y,
    };
    this.radians = 0;

    // console.log(this.center);
    // this.type = "homingSpinning";

    // the chance of enemies to change into different kinds of enemies
    if (Math.random() < 0.25) {
      this.type = "homing";
      if (Math.random() < 0.25) {
        this.type = "spinning";
        if (Math.random() < 0.25 && score >= 2000) {
          this.type = "homingSpinning";
          console.log("homingSpinning spawned");
        }
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();

    ctx.drawImage(
      ballEnemy,
      this.x - 20,
      this.y - 20,
      this.radius,
      this.radius
    );
  }

  update() {
    this.draw();
    // different types of enemies
    if (this.type === "linear") {
      // linear travel enemy
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    } else if (this.type === "homing") {
      // homing enemy that follows the player position
      const angle = Math.atan2(player.y - this.y, player.x - this.x);

      this.velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };

      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    } else if (this.type === "spinning") {
      // spinning Enemies
      this.radians += 0.05;
      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;

      this.x = this.center.x + Math.cos(this.radians) * 100;
      this.y = this.center.y + Math.sin(this.radians) * 100;
    } else if (this.type === "homingSpinning") {
      const angle = Math.atan2(player.y - this.y, player.x - this.x);

      this.velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
      };

      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;

      this.radians += 0.05;
      this.center.x += this.velocity.x;
      this.center.y += this.velocity.y;

      this.x = this.center.x + Math.cos(this.radians) * 100;
      this.y = this.center.y + Math.sin(this.radians) * 100;
    }
  }
}

const friction = 0.97;
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.alpha -= 0.01;
  }
}

// want to use this as a shield later to be spinning around player power up
class BackgroundParticle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    // changing the opacity with this.alpha
    this.alpha = 0.05;
    this.initialAlpha = this.alpha;
  }

  draw() {
    ctx.save();
    // this is effected by this.alpha value
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.draw();
    // this.alpha -= 0.01;
  }
}

let player;
// let powerUp = new PowerUp(100, 100, { x: 1, y: 1 });
let powerUps = [];
let projectilesArray = [];
let enemies = [];
let particles = [];
let backgroundParticles = [];

function init() {
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  player = new Player(x, y, 40);
  // let powerUp = new PowerUp(100, 100, { x: 1, y: 1 });
  powerUps = [];
  projectilesArray = [];
  enemies = [];
  particles = [];

  // whenever init need to reset backgroundParticles to an empty array
  backgroundParticles = [];
  // create a grid of backgroundParticles use for loops to loop through all of the canvas width
  // changed i to x
  // this forloop is causing the game to lag because its constantly looping an push new backgroundParticles for each pixel each time resize

  for (let x = 0; x < canvas.width; x += 30) {
    for (let y = 0; y < canvas.height; y += 30) {
      backgroundParticles.push(new BackgroundParticle(x, y, 3, "white"));
    }
    // console.log(i);
  }
}

function spawnEnemies() {
  // setInterval(() => {
  const radius = Math.random() * (40 - 20) + 25;
  // const radius =  25;
  // console.log("enemy spawning");
  let x;
  let y;

  if (Math.random() < 0.5) {
    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
    y = Math.random() * canvas.height;
  } else {
    x = Math.random() * canvas.width;
    y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
  }

  const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
  const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  enemies.push(new Enemy(x, y, radius, color, velocity));
  // console.log(enemies);
  // }, 1000);
}

function spawnPowerUps() {
  let x;
  let y;

  if (Math.random() < 0.5) {
    x = Math.random() < 0.5 ? 0 - 7 : canvas.width + 7;
    y = Math.random() * canvas.height;
  } else {
    x = Math.random() * canvas.width;
    y = Math.random() < 0.5 ? 0 - 9 : canvas.height + 9;
  }

  const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  powerUps.push(new PowerUp(x, y, velocity));
  // console.log(enemies);
}

function createScoreLabel(projectile, score) {
  const scoreLabel = document.createElement("label");
  scoreLabel.innerHTML = score;
  scoreLabel.style.position = "absolute";
  scoreLabel.style.color = "white";
  scoreLabel.style.userSelect = "none";
  scoreLabel.style.left = projectile.x + "px";
  scoreLabel.style.top = projectile.y + "px";
  document.body.appendChild(scoreLabel);

  // gsap grabbing the HTMLLabelElement scoreLbael and object that creates the fading effecting the numbers opacity and the y: -100 makes it go up.
  gsap.to(scoreLabel, {
    opacity: 0,
    y: -100,
    duration: 0.9,
    // remove the scoreLbael from the screne
    onComplete: () => {
      scoreLabel.parentNode.removeChild(scoreLabel);
    },
  });
}
let randoNum = Math.floor(Math.random() * 1000) + 1000;
console.log({ randoNum });
let animationId;
let score = 0;
let frame = 0;
function animate() {
  animationId = requestAnimationFrame(animate);
  frame++;
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // spawn enemies after 1000 frames have passed
  background.update();
  if (frame % 100 === 0) spawnEnemies();
  if (frame % 300 === 0) spawnPowerUps();

  // backgroundParticles.forEach((backgroundParticle) => {
  // BACKGROUND GRID
  //   const distance = Math.hypot(
  //     player.x - backgroundParticle.x,
  //     player.y - backgroundParticle.y
  //   );

  // const hideRadius = 80;
  //   // the conditional to show grid fade out and back in when player moves around map
  //   if (distance < hideRadius) {
  //     if (distance < 70) {
  //       backgroundParticle.alpha = 0;
  //     } else {
  //       backgroundParticle.alpha = 0.5;
  //     }
  //   } else if (
  //     distance >= hideRadius &&
  //     backgroundParticle.alpha < backgroundParticle.initialAlpha
  //   ) {
  //     backgroundParticle.alpha += 0.01;
  //   } else if (
  //     distance >= hideRadius &&
  //     backgroundParticle.alpha > backgroundParticle.initialAlpha
  //   ) {
  //     backgroundParticle.alpha -= 0.01;
  //   }
  //   backgroundParticle.update();
  // });

  player.update();
  // creating explosions
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  if (player.powerUp === "automatic" && mouse.down) {
    // for every 4, 8 , 12 frames its going to shoot as long as its divisible by one
    if (frame % 4 === 0) {
      player.shoot(mouse, "#FFF500");
    }
  }
  // if (player.powerUp === "automatic" && mouse.down) {
  //   // looka like lazer without  having shot around each 4 frames
  //     player.shoot(mouse);
  //   }
  // }

  powerUps.forEach((powerUp, index) => {
    const distance = Math.hypot(player.x - powerUp.x, player.y - powerUp.y);
    // console.log(distance)
    // when touching powerUp gain the machine gun power up
    if (distance - player.radius - powerUp.width / 2 < 1) {
      // powerUpaudio sound when touching a power UP
      // use this code to pop a modal when grabbing the powerUp to create an animtion freeze like super with cat face fly by MEOW!
      // modalElement.style.display = "flex";
      // gsap.to("#white-modal-element", {
      //   opacity: 1,
      //   scale: 1,
      //   duration: 0.25,
      //   // whenever easing something back in use ease out
      //   ease: "expo",
      // });

      powerUpAudio.cloneNode().play();
      // player.color = "#FFF500";
      console.log("powerUp touched");
      player.powerUp = "automatic";
      powerUps.splice(index, 1);
      // making player only have power up for 5 seconds
      setTimeout(() => {
        player.powerUp = "";
        // player.color = "tan";
      }, 5000);
    } else {
      powerUp.update();
    }
  });

  projectilesArray.forEach((projectile, index) => {
    projectile.update();

    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectilesArray.splice(index, 1);
      }, 0);
    }
  });

  enemies.forEach((enemy, index) => {
    enemy.update();

    const distance = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    // end game
    if (distance - enemy.radius - player.radius < 1) {
      console.log("end the game");
      endGameAudio.play();
      // stops on the game screen
      cancelAnimationFrame(animationId);
      // this brings the modalElement out to display to flex
      modalElement.style.display = "flex";
      bigScoreELement.innerHTML = score.toLocaleString("en-US");
      scene.active = false;
      // postData(score)
      // USE THIS TO POP UP THE NAME INPUT FOR LEADER BOARD
      // when touching something the modal pops back up for end game. can reuse this code to make a powerUp fly by animater with cat face
      //  changing opacity to 1 to bring back modal
      gsap.to("#white-modal-element", {
        opacity: 1,
        scale: 1,
        duration: 0.25,
        // whenever easing something back in use ease out
        ease: "expo",
      });

      // select the form
      // change its class to hidden to block
      document.querySelector("#board-form").style.display = "block";
      // postData(score)
    }
    projectilesArray.forEach((projectile, projectileIndex) => {
      const distance = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      );
      // hit enemey
      // when projectiles touch enemy 2 close projectiles is causing this code to be run twice making other enemies dissapear when they arent getting hit
      // instead of less than 1 pixel try changing to .25
      // now the distance between enemy and projectile has to be less than .25 to remove or shrink enemy
      if (distance - enemy.radius - projectile.radius < 0.25) {
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2.5,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 8),
                y: (Math.random() - 0.5) * (Math.random() * 8),
              }
            )
          );
        }
        // on hit to shrink enemy
        if (enemy.radius - 10 > 10) {
          // sound effect of impact thud
          hitAudio.cloneNode().play();

          // increase score
          score += 55;
          scoreElement.innerHTML = score;
          createScoreLabel(projectile, 55);
          gsap.to(enemy, { radius: enemy.radius - 10 });
          setTimeout(() => {
            projectilesArray.splice(projectileIndex, 1);
          }, 0);
        } else {
          // enemy explosion audio on death
          exlposionAUdio.cloneNode().play();
          score += 100;
          createScoreLabel(projectile, 100);

          // remove from scene all together
          // currentFrame = currentFrame % totalFrames;
          // // console.log(currentFrame);
          // srcX = currentFrame * frameWidth;
          // ctx.drawImage(
          //   explosionImage,
          //   srcX,
          //   srcY,
          //   2100 / 6,
          //   300,
          //   this.x - 95,
          //   this.y - 140,
          //   2100 / 6,
          //   300
          // );
          scoreElement.innerHTML = score;
          // change bacgroundParticle colors
          backgroundParticles.forEach((backgroundParticle) => {
            backgroundParticle.color = enemy.color;
            gsap.to(backgroundParticle, {
              alpha: 0.5,
              // brighten up quicker change duration
              duration: 0.15,
              onComplete: () => {
                gsap.to(backgroundParticle, {
                  alpha: backgroundParticle.initialAlpha,
                  // fade out quicker
                  duration: 0.15,
                });
              },
            });
          });
          setTimeout(() => {
            // this stops the enemies from blinking when they get hit because theyre being redrawn

            const enemyFound = enemies.find((enemyValue) => {
              return enemyValue === enemy;
            });
            if (enemyFound) {
              enemies.splice(index, 1);
              projectilesArray.splice(projectileIndex, 1);
            }
            // console.log("remove from screen");
          }, 0);
        }
      }
      // console.log(distance)
    });
  });
}

const mouse = {
  down: false,
  x: undefined,
  y: undefined,
};

window.addEventListener("mousedown", ({ clientX, clientY }) => {
  mouse.x = clientX;
  mouse.y = clientY;

  mouse.down = true;
});
window.addEventListener("mousemove", ({ clientX, clientY }) => {
  mouse.x = clientX;
  mouse.y = clientY;
});
window.addEventListener("mouseup", () => {
  mouse.down = false;
});

// eventListeners for mobile use TouchEvent there is no clientX or clientY
// whenever use finger to touch screen going to call the content of touchstart function
window.addEventListener("touchstart", (event) => {
  console.log(event);
  // going inside touches list and grabbing first object event.touches[0]
  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;

  mouse.down = true;
  console.log("touch start");
});
window.addEventListener("touchmove", (event) => {
  mouse.x = event.touches[0].clientX;
  mouse.y = event.touches[0].clientY;
  console.log("touch move");
});
window.addEventListener("touchend", () => {
  console.log("touch end");
  mouse.down = false;
});

window.addEventListener("click", ({ clientX, clientY }) => {
  if (scene.active && player.powerUp !== "automatic") {
    mouse.x = clientX;
    mouse.y = clientY;
    player.shoot(mouse);
  }
});

// listening for screen resizing to make sure player is spawned mid screen no matter when user resizes window
// can use resize as an eventListener
// whenever resizing screen re init intialize the game
window.addEventListener("resize", () => {
  // placing inside resize and making sure player is always spawned to new inner width and height by adding it to resize event listener
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
  // console.log("resize")
});

startGameBtn.addEventListener("click", () => {
  init();
  animate();
  startGameAudio.play();
  // scene.active is used for true when the game starts to have the sound of shoot but when over scene.active will equal false to stop any sound being played from clicking outside the modal start
  scene.active = true;
  score = 0;
  scoreElement.innerHTML = score;
  bigScoreELement.innerHTML = score;
  // 125 seconds into the background song, can find an area in the song to start at
  // backgroundMusicAudio.currentTime = 125;
  backgroundMusicAudio.play();
  // animating the modal any time animating html elements good to use gsap
  // https://greensock.com/ease-visualizer/ to get different visual effects of the modal to fade bouncing and all kinds of ways
  gsap.to("#white-modal-element", {
    opacity: 0,
    scale: 0.75,
    duration: 0.25,
    ease: "expo.in",
    onComplete: () => {
      modalElement.style.display = "none";
    },
  });
});

addEventListener("keydown", ({ keyCode }) => {
  // w: 87 a:65  s: 83 d:68
  // arrow up:38 left:37 down:40 right:39
  if (keyCode === 87) {
    player.velocity.y -= 1;
  } else if (keyCode === 65) {
    player.velocity.x -= 1;
  } else if (keyCode === 83) {
    player.velocity.y += 1;
  } else if (keyCode === 68) {
    player.velocity.x += 1;
  }
  // console.log(keyCode);
  switch (keyCode) {
    case 38:
      player.velocity.y -= 1;

      // console.log("up");
      break;
    case 37:
      player.velocity.x -= 1;

      // console.log("left");
      break;
    case 40:
      player.velocity.y += 1;

      // console.log("down");
      break;
    case 39:
      player.velocity.x += 1;

      // console.log("right");
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  // console.log(keyCode);
  if (keyCode === 87) {
  } else if (keyCode === 65) {
  } else if (keyCode === 83) {
  } else if (keyCode === 68) {
  }
});

soundOnEl.addEventListener("click", () => {
  console.log(" off");
  backgroundMusicAudio.volume = 0;
  soundOnEl.style.display = "none";
  soundOffEl.style.display = "block";
});

soundOffEl.addEventListener("click", () => {
  console.log("on");
  backgroundMusicAudio.volume = 0.2;
  soundOnEl.style.display = "block";
  soundOffEl.style.display = "none";
});

// Name and score event listener making post request to custom server
// TODO UPDATE SCOREBOARD WHEN SUBMIT
boardForm.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch("http://localhost:8000/api/score/score-board", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      name:
        document.getElementById("board-name").value === ""
          ? "CAP"
          : document.getElementById("board-name").value,
      score: score,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
});
