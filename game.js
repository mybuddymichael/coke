(function() {
  $(document).ready(function() {
    var CANVAS_HEIGHT, CANVAS_WIDTH, FPS, Player, canvas, canvasElement, draw, keyName, player, textX, textY, update;
    CANVAS_WIDTH = 480;
    CANVAS_HEIGHT = 320;
    canvasElement = $('canvas');
    canvasElement.attr({
      height: CANVAS_HEIGHT,
      width: CANVAS_WIDTH
    });
    canvas = canvasElement.get(0).getContext('2d');
    FPS = 60;
    setInterval((function() {
      update();
      draw();
    }), 1000 / FPS);
    Number.prototype.clamp = function(min, max) {
      return Math.min(Math.max(this, min), max);
    };
    window.keydown = {};
    keyName = function(event) {
      return jQuery.hotkeys.specialKeys[event.which] || String.fromCharCode(event.which).toLowerCase();
    };
    $(document).bind("keydown", function(event) {
      keydown[keyName(event)] = true;
    });
    $(document).bind("keyup", function(event) {
      keydown[keyName(event)] = false;
    });
    Player = (function() {
      function Player() {
        this.color = "#5b6449";
        this.width = 32;
        this.height = 32;
        this.x = CANVAS_WIDTH / 2 - this.width / 2;
        this.y = CANVAS_HEIGHT / 2 - this.height / 2;
      }
      Player.prototype.draw = function() {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
      };
      return Player;
    })();
    player = new Player;
    textX = 50;
    textY = 50;
    update = function() {
      if (keydown.space) {
        player.shoot();
      }
      if (keydown.left) {
        player.x -= 3;
      }
      if (keydown.right) {
        player.x += 3;
      }
      if (keydown.up) {
        player.y -= 3;
      }
      if (keydown.down) {
        player.y += 3;
      }
      player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);
      player.y = player.y.clamp(0, CANVAS_HEIGHT - player.height);
    };
    draw = function() {
      canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      player.draw();
    };
  });
}).call(this);
