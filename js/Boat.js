class Boat {
  constructor(x, y, width, height, boatPos, boatAnimation,brokenBoatAnimation) {
    var options = {
      restitution: 0.8,
      friction: 1.0,
      density: 1.0,
    };

    this.speed = 0.05;
    this.body = Bodies.rectangle(x, y, width, height, options);
    this.width = width;
    this.height = height;

    this.boatPosition = boatPos;
    this.animation = boatAnimation;
    World.add(world, this.body);
  }
  
  animate(){
    this.speed += 0.05 % 1.1; //
  }

  remove(index){
    this.animation = brokenBoatAnimation;
    this.speed = 0.05;
    this.width = 300;
    this.height = 300;
    this.isBroken = true;

    setTimeout(()=>{
      World.remove(world,boats[index].body);
      boats.splice(index,1)
    },2000)
  }


  display() {
    var angle = this.body.angle;
    var pos = this.body.position;

    //floor(12.5) = 12; floor(23.789) = 23; floor(53.789) = 53
    //1 % 4 = 0; 2 % 4 = 0, 3 % 4 = 0, 4 % 4 = 0, 5 % 4 = 1, 6 % 4 = 2, 7 % 4 = 3
    // 8 % 4 = 0, 9 % 4 = 1, 10 % 4 = 2, 11 % 4 = 3
    //12 % 4 = 0, 13 % 4 = 1, 14 % 4 = 2, 15 % 4 = 3
    //animation length is 4 always in this boat spritesheet
    var index = floor(this.speed % this.animation.length)
  
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.animation[index], 0, this.boatPosition, this.width, this.height);
    noTint();
    pop();
  }
}
