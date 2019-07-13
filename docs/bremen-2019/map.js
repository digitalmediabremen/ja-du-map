const map_sketch = function(p) {
  let debug_info = true;
  let overwrite_volume = 0;
  var targetX, targetY, x, y;
  let ratio = 1;
  let img,       //image 
      imgResized,//resized image of the image (visible)
      imageRatio;//ratio of the image h/w
  var positions = {}; // dict
  let dropoff_distance = 400; // in pixel (in ratio to screen)

  var audio_beginning = new Date('2019-05-13T05:00:00');
  var duration = 10 * 60 * 60 // in seconds
  var start_seek = 0 // in seconds (from the beginning of the streams) MUST BE WITHIN DURATION!
  var now;
  //var audio_beginning = (5 * 60 * 60 + 0 * 60 + 0) * 1000 // in millis since 00:00:00

  p.preload = function () {
    img = p.loadImage("bremen-2019-05-13.png", img => imgResized = img.get());
  }

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);

    imgRatio = img.width/img.height;
    x = 0;
    y = p.random(p.windowHeight);

    p.windowResized();

    p.background(0);
    p.image(imgResized,0,0);

    // set the target within a range (city center / coordinates from original image source)
    targetX = p.random(2067, 2067 + 1677) * ratio;
    targetY = p.random(1103, 1103 + 1144) * ratio;

    p.frameRate(0);

    // calculate start
    var now = moment();
    var today_midnight = now.clone().startOf('day');
    var seconds_since_midnight = now.diff(today_midnight, 'seconds');

    // relative to current time of day
    start_seek = Math.round((seconds_since_midnight / (24 * 60 * 60)) * duration);
    console.log("Time of day (in percent): " + seconds_since_midnight / (24 * 60 * 60))
    console.log("Start seek (in seconds): " + start_seek)

    // set start on media players

    // make sure start_seek is within duration
    start_seek = Math.min(start_seek, duration)

    for(var id in positions) {
      if (!positions[id]) {continue;}
      if(window.players){
        try {
          window.players[id].seek(start_seek)
        } catch (e) {
          console.warn("Could not set time on player " + id + ": " + e);
          //positions[id] = null;
          //console.log("Player " + id + " disabled.")
        }
      }
    }
    audio_beginning = moment(audio_beginning).add(start_seek, 'seconds');
  }

  p.windowResized  = function () {
    //p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.print("resizing to: " + p.windowWidth + " " + p.windowHeight);
    if (p.windowWidth < img.width){
        imgResized = img.get();
        imgResized.resize(p.windowWidth,0);
        ratio = p.windowWidth/img.width;
        // make canvas larger to (overfill) screen
        p.resizeCanvas(p.windowWidth, imgResized.height);
    }
    if (p.windowHeight > imgResized.height){
        imgResized = img.get();
        imgResized.resize(0,p.windowHeight);
        ratio = p.windowHeight/img.height;
        // make canvas larger to (overfill) screen
        p.resizeCanvas(imgResized.width, p.windowHeight);
    }
    let dropoff_distance = 400 * ratio;
    console.debug("ratio:" + ratio)


    // positions in original image coordinates (transfered form photoshop)

    positions = {
      8022: p.createVector(2309, 699),  // 8022
      8010: p.createVector(2560, 2113), // 8010
      8024: p.createVector(2523, 854),  // 8024
      8026: p.createVector(1335, 574),  // 8026
      8015: p.createVector(2721, 1942), // 8015
      8018: p.createVector(2099, 2041), // 8018
      8019: p.createVector(3559, 1731), // 8019
      8014: p.createVector(4260, 2113), // 8014
    }

    for(var id in positions) {
        if (!positions[id]) {continue;}
        positions[id].mult(ratio);
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
      for(var id in positions) {
        if (!positions[id]) {continue;}
        // show dropoff distance
        p.stroke('red');
        p.strokeWeight(1);
        p.noFill()
        p.circle(positions[id].x, positions[id].y, dropoff_distance * 2); // radius = * 2
        // show dot
        p.fill('red')
        p.circle(positions[id].x, positions[id].y, diameter);
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
    var i = 0;
    for(var id in positions) {
      if (!positions[id]) {continue;}
      i++;

      let dist = positions[id].copy().sub(mouse);
      if(debug_info)
        p.text(dist.mag(), p.width, 10 + i * 10);


      vol = p.max(0, 1 - dist.mag() / dropoff_distance);
      vol = Math.pow(vol, 3);
      if(debug_info)
        p.text("vol " + id + " = " + Number(vol), p.width, 200 + 10 * i);

      // debug: disable volume setting
      //continue;

      // set volume on media player
      if(window.players){
        try {
          window.players[id].setVolume(overwrite_volume || vol)
        } catch (e) {
          console.warn("Could not set volume on player " + id + ": " + e);
          positions[id] = null;
          console.log("Player " + id + " disabled.")
        }
      }
    }

    //-------------------------- draw listener ellipse with easing:
    easing = 0.01;
    dx = targetX - x;
    x += dx * easing;
    dy = targetY - y;
    y += dy * easing;
    p.strokeWeight(dropoff_distance / 10);
    p.stroke('rgba(255,255,255,0.8)');
    p.fill('rgba(255,255,255,1)');
    p.circle(x, y, 10);
    // for (var i = 1; i < positions.length; i++) {
    //     if (!positions[i]) {continue;}
    //   p.line(positions[i].x, positions[i].y, x, y)
    // }
    }
};