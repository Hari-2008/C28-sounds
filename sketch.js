const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;
var canvas, angle, tower, ground, cannon, boat;
var balls = [];
var boats = [];
var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

var waterSplashAnimation = [];
var waterSplashSpritedata, waterSplashSpritesheet;

var isLaughing = false;
var isGameOver = false;

var score = 0;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");
  boatSpritedata = loadJSON("assets/boat/boat.json");
  boatSpritesheet = loadImage("assets/boat/boat.png")
  brokenBoatSpritedata = loadJSON("assets/boat/broken_boat.json");
  brokenBoatSpritesheet = loadImage("assets/boat/broken_boat.png")
  waterSplashSpritedata = loadJSON("assets/water_splash/water_splash.json");
  waterSplashSpritesheet = loadImage("assets/water_splash/water_splash.png");
  backgroundMusic = loadSound("assets/background_music.wav")
  waterSound = loadSound("assets/cannon_water.wav");
  pirateLaughSound = loadSound("assets/pirate_laugh.mp3")
  cannonExplosion = loadSound("assets/cannon_explosion.wav")
}

function setup() {
  canvas = createCanvas(1200,600);
  engine = Engine.create();
  world = engine.world;
  angle = -PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(150, 350, 160, 310);
  cannon = new Cannon(180, 110, 110, 50, angle);
  
  var boatFrames = boatSpritedata.frames;
  for(var i = 0; i < boatFrames.length; i++){
    var pos = boatFrames[i].position;
   
    var img = boatSpritesheet.get(pos.x,pos.y,pos.w,pos.h);
    boatAnimation.push(img);
    //console.log(boatAnimation);
  }

  var brokenBoatFrames = brokenBoatSpritedata.frames;
  for(var i = 0; i < brokenBoatFrames.length; i++){
    var pos = brokenBoatFrames[i].position;
    var img = brokenBoatSpritesheet.get(pos.x,pos.y,pos.w,pos.h);
    brokenBoatAnimation.push(img);
    //console.log(boatAnimation);
  }

  var waterSplashFrames = waterSplashSpritedata.frames;
  for(var i = 0; i < waterSplashFrames.length;i++){
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSpritesheet.get(pos.x, pos.y,pos.w,pos.h);
    waterSplashAnimation.push(img);
  }

}

function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  if(!backgroundMusic.isPlaying()){
    backgroundMusic.play();
    backgroundMusic.setVolume(0.1)
  }
  

  Engine.update(engine);
  ground.display();



  //code to check the collision between the ball and the boat
  for(var i = 0; i<balls.length; i++){
    showCannonBalls(balls[i],i);
    for(var j = 0; j<boats.length; j++){
      if(balls[i]!== undefined && boats[j]!== undefined){
        var collision = Matter.SAT.collides(balls[i].body,boats[j].body);
        if(collision.collided){
          score += 5;
          boats[j].remove(j);
          World.remove(world,balls[i].body);
          balls.splice(i,1);
          i--;
        }
      }
    }
  }

  cannon.display();
  tower.display();

  fill("#6d4c41");
  textSize(40);
  text(`Score:${score}`, width - 200, 50);
  textAlign(CENTER, CENTER);
  showBoats();
}




//creating the cannon ball on key press
function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    cannonBall.trajectory = [];
    Matter.Body.setAngle(cannonBall.body, cannon.angle);
    balls.push(cannonBall);
  }
}

// function to show the ball.
function showCannonBalls(ball, index) {
  ball.display();
  ball.animate();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
   if(!ball.isSink){
     waterSound.play();
     ball.remove(index)
   }
  }
}





//releasing the cannonball on key release
function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    cannonExplosion.play();
    balls[balls.length - 1].shoot();
  }
}


function showBoats(){

  //if there is more than one boat execute if condition.
  if(boats.length>0){
    
    if(boats.length < 4 && boats[boats.length-1].body.position.x<width-300){  
      console.log(boats[boats.length-1].body.position.x)
      var positions = [-100,-90,-80,-70];
      var position = random(positions)
      boat = new Boat(width, height - 100, 200, 200, position, boatAnimation);
      boats.push(boat);
    }

    for(var i=0;i<boats.length;i++){
      Matter.Body.setVelocity(boats[i].body, {
        x: -0.9,
        y: 0
      });
      boats[i].display()
      boats[i].animate();

      //check if each boat is touching the tower. inside for loop
      var collision = Matter.SAT.collides(tower.body,boats[i].body);
     if(collision.collided && !boats[i].isBroken){
       if(!isLaughing && !pirateLaughSound.isPlaying()){
         isLaughing = true;
         pirateLaughSound.play()
       }
       isGameOver = true;
       gameOver();
     }

    }
  }
  else{
    boat = new Boat(width, height - 100, 200, 200, -100, boatAnimation);
    boats.push(boat);
  }

  

}

function gameOver(){
  //swal => sweet alert
  swal(
    {
      title: "Game Over!!!",
      text: "Thanks for playing",
      imageUrl: "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Play Again"
    },
    function(isConfirm){
      if(isConfirm){
        location.reload();
      }
    }
  )
}