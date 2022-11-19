var scr;
var tiles = 25;
var tile;
var snake;

bg = () => {
  const bg_color = "#1a1a1a";
  background(bg_color);
  stroke("#222");
  for(let _ = 0; _ < tiles; _++) {
    line(0, tile*_, scr.x, tile*_);
  } for (let _ = 0; _ < tiles; _++) {
    line(_*tile, 0, _*tile, scr.y);
  }
}

setup = () => {
  
  noStroke();
  scr = createVector(window.innerHeight-50, window.innerHeight-50);
  createCanvas(scr.x, scr.y).parent('game');
  tile = scr.x / tiles;
  frameRate(10);
  
  bg();

  snake = new Snake();
}

draw = () => {
  bg();
  snake.update();
  snake.show();
  // snake.eat();
}

function keyPressed() {
  // WASD + arrow controls
  if (keyCode === UP_ARROW || keyCode === 87) {
    snake.dir(0, -1);
  } else if (keyCode === DOWN_ARROW || keyCode === 83) {
    snake.dir(0, 1);
  } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
    snake.dir(1, 0);
  } else if (keyCode === LEFT_ARROW || keyCode === 65) {
    snake.dir(-1, 0);
  } else if (keyCode === 32) {
    snake.grow();
  }
}


class Snake{
  constructor(){
      this.x = floor((Math.random() * tiles)*tile);
      this.y = floor((Math.random() * tiles)*tile);
      this.xspeed = 1;
      this.yspeed = 0;
      this.total = 0;
      this.tail = [];
  }

  update(){
      if(this.total === this.tail.length){
          for(let i = 0; i < this.tail.length-1; i++){
              this.tail[i] = this.tail[i+1];
          }
      }
      this.tail[this.total-1] = createVector(this.x, this.y);

      this.x += this.xspeed*tile;
      this.y += this.yspeed*tile;

      this.x = constrain(this.x, 0, scr.x-tile);
      this.y = constrain(this.y, 0, scr.y-tile);
  }

  show(){
      fill("#639f65");
      for(let i = 0; i < this.tail.length; i++){
          rect(this.tail[i].x, this.tail[i].y, tile, tile);
      }

      if (this.xspeed === 1) {
        rect(this.x, this.y, tile, tile, 0, 10, 10, 0);
      } else if (this.xspeed === -1) {
        rect(this.x, this.y, tile, tile, 10, 0, 0, 10);
      } else if (this.yspeed === 1) {
        rect(this.x, this.y, tile, tile, 0, 0, 10, 10);
      } else if (this.yspeed === -1) {
        rect(this.x, this.y, tile, tile, 10, 10, 0, 0);
      }
  }

  dir(x, y){
      this.xspeed = x;
      this.yspeed = y;
  }

  eat(pos){
      let d = dist(this.x, this.y, pos.x, pos.y);
      if(d < 1){
          this.total++;
          return true;
      } else {
          return false;
      }
  }

  grow(){
      this.total++;
  }

  death(){
      for(let i = 0; i < this.tail.length; i++){
          let pos = this.tail[i];
          let d = dist(this.x, this.y, pos.x, pos.y);
          if(d < 1){
              this.total = 0;
              this.tail = [];
          }
      }
  }
}