var scr;
var col = 25;
var speed = 10;
var tile;
var snake;
var apple, food;
var eat, beep, death, music;

var mode;

function start_game() {
  snake = new Snake();
  // snake.grow();
  spawnFruit();
  music = loadSound('/res/music.wav', 0.2, true);
  music.play();
}

bg = () => {
  var bg_color = "#1a1a1a";
  background(bg_color);
  stroke("#222");
  for (let _ = 0; _ < col; _++) {
    line(0, tile * _, scr.x, tile * _);
  } for (let _ = 0; _ < col; _++) {
    line(_ * tile, 0, _ * tile, scr.y);
  }
}

preload = () => {
  scr = createVector(round(window.innerHeight - 50), round(window.innerHeight - 50));
  tile = scr.x / col;
  
  // load images
  apple = loadImage('/res/apple.svg');
  
  // load sounds
  eat = loadSound('/res/eat.wav');
  beep = loadSound('/res/beep.wav', 0.3);
  death = loadSound('/res/die.wav');
  music = loadSound('/res/music.wav', 0.2, true);
}

setup = () => {
  mode = false;
  createCanvas(scr.x, scr.y).parent('game');
  frameRate(speed);
  noStroke();
  bg();
  start_game();
}

draw = () => {
  if (mode == 0) {
    return display_menu();
  }
  bg();
  snake.gameOver();
  snake.update();
  snake.show();

  if(snake.eat(food)) {
    spawnFruit();
  }

  // Draw fruit
  image(apple, food.x, food.y, tile, tile);
}

function display_menu() {
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
    // snake.grow();
    // eat.play()
  }
}

// load sound funtion for howler.js
function loadSound(src, volume=1, loop=false) {
  return new Howl({
    src: [src],
    volume: volume,
    loop: loop,

    onload: function() {
      console.log('loaded sound: ' + src);
    }
  });
}


function spawnFruit() {
  // Generate fruit on grid and avoid spawning on nake
  var x = floor(random(col))*tile;
  var y = floor(random(col))*tile;
  for (let _ = 0; _ < snake.tail.length; _++) {
    if (dist(x, y, snake.tail[_].x, snake.tail[_].y) <= tile) {
      return food = spawnFruit();
    } else {
      return food = createVector(x, y);
    }
  }

  return food = createVector(x, y);
}

class Snake {
  constructor() {
    this.y = floor(col/2)*tile;
    this.x = floor(col/2)*tile;
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 0;
    this.tail = [];
  }

  update() {
    if (this.total === this.tail.length) {
      for (let i = 0; i < this.tail.length - 1; i++) {
        this.tail[i] = this.tail[i + 1];
      }
    }
    this.tail[this.total - 1] = createVector(this.x, this.y);

    this.x += this.xspeed * tile;
    this.y += this.yspeed * tile;

    this.x = constrain(this.x, 0, scr.x - tile);
    this.y = constrain(this.y, 0, scr.y - tile);
  }

  show() {
    var color = "#445599";
    var l = this.tail.length
    for (let i = 0; i < l; i++) {
      var part = this.tail[i];
      var decrease_x = 0;
      var decrease_y = 0;
      var opacity = (floor((145 / this.tail.length) * i) + 110).toString(16);
      fill(color + opacity);
      if (this.tail[i - 1].x != this.tail[i].x) {
        decrease_x = 0;
      } else if (this.tail[i - 1].y != this.tail[i].y) {
        decrease_y = 0;
      }
      if (this.tail[i + 1] != this.tail[i-1] != undefined) {
        rect(part.x + decrease_x * (l - i) / 2, part.y + decrease_y * (l - i) / 2, tile - decrease_x * (l - i), tile - decrease_y * (l - i), 5);
      } else {
        if(this.tail[i+1].y > this.tail[i-1].y && this.tail[i+1].x > this.tail[i-1].x){
          // console.log("down right");
          rect(part.x, part.y, tile - decrease_x, tile - decrease_y, 0, 0, 10, 0);
        } else if(this.tail[i+1].y > this.tail[i-1].y && this.tail[i+1].x < this.tail[i-1].x){
          // console.log("down left");
          rect(part.x, part.y, tile - decrease_x, tile - decrease_y, 0, 0, 0, 10);
        } else if(this.tail[i+1].y < this.tail[i-1].y && this.tail[i+1].x > this.tail[i-1].x){
          // console.log("up right");
          rect(part.x, part.y, tile - decrease_x, tile - decrease_y, 0, 10, 0, 0);
        } else if(this.tail[i+1].y < this.tail[i-1].y && this.tail[i+1].x < this.tail[i-1].x){
          // console.log("up left");
          rect(part.x, part.y, tile - decrease_x, tile - decrease_y, 10, 0, 0, 0);
        } else {
          rect(part.x + decrease_x * (l - i) / 2, part.y + decrease_y * (l - i) / 2, tile - decrease_x * (l - i), tile - decrease_y * (l - i), 5);
        }
      }

    }
    fill(color);
    // strokeWeight(3);
    // stroke("#394");
    if (this.xspeed === 1) {
      rect(this.x, this.y, tile, tile, 0, 10, 10, 0);
    } else if (this.xspeed === -1) {
      rect(this.x, this.y, tile, tile, 10, 0, 0, 10);
    } else if (this.yspeed === 1) {
      rect(this.x, this.y, tile, tile, 0, 0, 10, 10);
    } else if (this.yspeed === -1) {
      rect(this.x, this.y, tile, tile, 10, 10, 0, 0);
    }

    // // Drawing the eyes for snake
    // noStroke();
    // fill("#ccc");
    // circle(this.x + tile / 6, this.y + tile / 2, tile / 2);
    // circle(this.x + (tile-tile/6), this.y + tile / 2, tile / 2);

    // // Make the eyeballs face the mouse
    // fill("#114411");
    // circle(this.x + (tile/6)/3, this.y + tile / 2, tile / 4);
    // circle(this.x + (tile-(tile/18)*5), this.y + tile / 2, tile / 4);

  }

  dir(x, y) {
    // Update and play sound if there is a change
    if (this.xspeed != x || this.yspeed != y) {
      this.xspeed = x;
      this.yspeed = y;
      beep.play();
    }
  }

  eat(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < 1) {
      this.total++;
      eat.play();
      return true;
    } else {
      return false;
    }
  }

  grow(amt=null) {
    if(amt){
      this.total += amt;
    } else {
      this.total++;
    }
  }

  gameOver() {
    for (let i = 0; i < this.tail.length; i++) {
      var pos = this.tail[i];
      var d = dist(this.x, this.y, pos.x, pos.y);
      if (d < 1) {
        console.log("starting over");
        this.total = 0;
        this.tail = [];
        // Play death sound and fade music
        death.play();
        music.fade(0.2, 0, 500);
        
        // Reset the game after 3 seconds
        setTimeout(function(){
          start_game();
        }, 1500);

      }
    }
  }
}