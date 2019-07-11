const map_sketch = function(p) {
  let debug_info = true;
  var targetX, targetY, x, y;
  let ratio = 1;
  let img,       //image 
      imgResized,//resized image of the image (visible)
      imageRatio;//ratio of the image h/w
  var positions = [];
  const dropoff_distance = 400; // in pixel (TODO in ratio to screen size?)

  var audio_beginning = new Date('2019-05-13T05:00:00');
  var now;
  //var audio_beginning = (5 * 60 * 60 + 0 * 60 + 0) * 1000 // in millis since 00:00:00

  p.preload = function () {
    img = p.loadImage("RP_Bremen-01.png", img => imgResized = img.get());
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    imgRatio = img.width/img.height;
    x = p.random(p.windowWidth);
    y = p.random(p.windowHeight);

    targetX = x;
    targetY = y;

    p.print(x, y);
    p.windowResized();

    p.background(0);
    p.image(imgResized,0,0);

    p.frameRate(0);
  }

  p.windowResized  = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.print("resizing to: " + p.windowWidth + " " + p.windowHeight);
    if (p.windowWidth < img.width){
        imgResized = img.get();
        imgResized.resize(p.windowWidth,0);
        ratio = p.windowWidth/img.width;
    }
    if (p.windowHeight > imgResized.height){
        imgResized = img.get();
        imgResized.resize(0,p.windowHeight);
        ratio = p.windowHeight/img.height;
    }
    console.debug("ratio:" + ratio)

    // positions in original image coordinates

     positions[1] = p.createVector(2309, 1816);
     positions[2] = p.createVector(2560, 2113);
     positions[3] = p.createVector(2523, 854);
     positions[4] = p.createVector(1335, 574);
     positions[5] = p.createVector(3123, 1862);
     positions[6] = p.createVector(2721, 1942);
     positions[7] = p.createVector(2099, 2041);
     positions[8] = p.createVector(2523, 2364);
     positions[9] = p.createVector(3559, 1731);
    positions[10] = p.createVector(4260, 2113);

    for (var i = 1; i < positions.length; i++) {
        if (!positions[i]) {continue;}
        positions[i].mult(ratio);
      }
  }

  p.draw = function () {

    p.background(0);
    p.image(imgResized,0,0);

    //update ui time
    now = moment(audio_beginning).add(p.millis(), 'milliseconds');
    window.document.querySelector("#time").innerHTML = now.format("MMMM Do YYYY HH:mm:ss");

    if(debug_info){
      diameter = 10;
      p.fill('red');
      p.strokeWeight(1);
        p.stroke('rgba(255,255,255,1)');
      for (var i = 1; i < positions.length; i++) {
        if (!positions[i]) {continue;}
        p.circle(positions[i].x, positions[i].y, diameter);
      }
    }

    //-------------------------- hardcoded vectors for mic positions
    let mouse = p.createVector(x, y);

    p.textAlign(p.RIGHT, p.BOTTOM);
    p.fill(255);
    if(debug_info)
      p.text(p.mouseX + "," + p.mouseY, p.width, p.height);

    // ------------------------- move token with mouse
    if (p.mouseIsPressed) {
      if (p.mouseX <= p.width && p.mouseX >=0 && p.mouseY >=0 && p.mouseY <= p.height){
        targetX = p.mouseX;
        targetY = p.mouseY;
    }
      // print(x, y);
      mouse.set(x, y);
    }
    // ------------------------- display magnitudes and volumes
    for (var i = 1; i < positions.length; i++) {
      if (!positions[i]) {continue;}

      let dist = positions[i].copy().sub(mouse);
      if(debug_info)
        p.text(dist.mag(), p.width, 10 + i * 10);


      // willkürliche Distanz für vol=0: 400px (TODO: sollte relativ von der Bildschrimgröße sein?!)
      vol = p.max(0, 1 - dist.mag() / dropoff_distance);
      if(debug_info)
        p.text("vol " + i + " = " + vol, p.width, 200 + 10 * i);

      // set volume on media player
      if(window.players){
        try {
          window.players[i].setVolume(vol)
        } catch (e) {
          console.warn("Could not set volume on player " + i + ": " + e);
          positions[i] = null;
          console.log("Player " + i + " disabled.")
        }
      }
    }

    //-------------------------- draw listener ellipse with easing:
    easing = 0.01;
    dx = targetX - x;
    x += dx * easing;
    dy = targetY - y;
    y += dy * easing;
    p.strokeWeight(15);
    p.stroke('rgba(255,255,255,0.5)');
    p.fill(0);
    p.circle(x, y, 20);
  }
};