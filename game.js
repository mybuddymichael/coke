(function() {
  var player;

  player = new Coke.Character(Coke.settings.grid * 7, Coke.settings.grid * 5, 2, 'down', 'images/player.png');

  Coke.updateables.push(player);

}).call(this);
