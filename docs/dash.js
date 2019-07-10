function() {
  var url = "https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd";
  var player = dashjs.MediaPlayer().create();
  player.initialize(document.querySelector("#videoPlayer"), url, true);
}
