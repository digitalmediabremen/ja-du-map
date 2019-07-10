let img;
var targetX, targetY, x, y;

function preload() {
  img = loadImage("demo.png");
}

function setup() {
  var canvas = createCanvas(img.width, img.height);
  canvas.parent('sketch-holder');
  x = random(img.width);
  y = random(img.height);
  targetX = x;
  targetY = y;
  print(x, y);
}

function draw() {
  var v1 = createVector(130, 206);
  var v2 = createVector(235, 308);
  var v3 = createVector(240, 164);
  var v4 = createVector(385, 180);
  var v5 = createVector(475, 333);
  background(255);
  image(img, 0, 0);
  //-------------------------- hardcoded vectors for mic positions
  let mouse = createVector(x, y);
  // let dist1 = createVector();
  // let dist2 = createVector();
  // let dist3 = createVector();
  // let dist4 = createVector();
  // let dist5 = createVector();
  textAlign(RIGHT, BOTTOM);
  fill(255);
  text(mouseX + "," + mouseY, width, height);

  // ------------------------- move token with mouse
  if (mouseIsPressed) {
    if (mouseX <= width && mouseX >=0 && mouseY >=0 && mouseY <= height){
      targetX = mouseX;
      targetY = mouseY;
  }
    // print(x, y);
    mouse.set(x, y);
  }
  // ------------------------- display magnitudes and volumes
  let dist1 = v1.sub(mouse);
  let dist2 = v2.sub(mouse);
  let dist3 = v3.sub(mouse);
  let dist4 = v4.sub(mouse);
  let dist5 = v5.sub(mouse);
  // text(mouse.mag(), width, 10);
  text(dist1.mag(), width, 20);
  text(dist2.mag(), width, 30);
  text(dist3.mag(), width, 40);
  text(dist4.mag(), width, 50);
  text(dist5.mag(), width, 60);
  //-------------------------- draw ellipse with easing:
  easing = 0.03;
  dx = targetX - x;
  x += dx * easing;
  dy = targetY - y;
  y += dy * easing;
  ellipse(x, y, 50, 50);

  //-------------------------- calculate Volume
  vol1 = max(0, 1 - dist1.mag() / 400); // willkürliche Distanz für vol=0: 400px
  vol2 = max(0, 1 - dist2.mag() / 400);
  vol3 = max(0, 1 - dist3.mag() / 400);
  vol4 = max(0, 1 - dist4.mag() / 400);
  vol5 = max(0, 1 - dist5.mag() / 400);
  // print("vol1 = " + vol1);
  text("vol1 = " + vol1, width, 90);
  text("vol2 = " + vol2, width, 100);
  text("vol3 = " + vol3, width, 110);
  text("vol4 = " + vol4, width, 120);
  text("vol5 = " + vol5, width, 130);
}
