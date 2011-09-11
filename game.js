(function() {
  $(document).ready(function() {
    var CANVAS_HEIGHT, CANVAS_WIDTH, FPS, Player, animate, canvasElement, canvasObject, context, draw, keyName, mainLoop, player, recursiveAnimate, update;
    CANVAS_WIDTH = 480;
    CANVAS_HEIGHT = 320;
    canvasObject = $('canvas');
    canvasObject.attr({
      height: CANVAS_HEIGHT,
      width: CANVAS_WIDTH
    });
    canvasElement = canvasObject.get(0);
    context = canvasElement.getContext('2d');
    FPS = 60;
    mainLoop = function() {
      update();
      draw();
    };
    animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
    if (animate !== null) {
      recursiveAnimate = function() {
        mainLoop();
        animate(recursiveAnimate, canvasElement);
      };
      animate(recursiveAnimate, canvasElement);
    } else {
      setInterval(mainLoop, 1000 / FPS);
    }
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
        this.width = 32;
        this.height = 32;
        this.x = CANVAS_WIDTH / 2 - this.width / 2;
        this.y = CANVAS_HEIGHT / 2 - this.height / 2;
        this.image = new Image;
        this.image.src = 'player.png';
      }
      Player.prototype.draw = function() {
        switch (this.direction) {
          case 'up':
            this.imageX = 0;
            break;
          case 'down':
            this.imageX = 32;
            break;
          case 'left':
            this.imageX = 64;
            break;
          case 'right':
            this.imageX = 96;
        }
        context.drawImage(this.image, this.x, this.y);
      };
      return Player;
    })();
    player = new Player;
    update = function() {
      if (keydown.left) {
        player.x -= 3;
        player.direction = 'left';
      }
      if (keydown.right) {
        player.x += 3;
        player.direction = 'right';
      }
      if (keydown.up) {
        player.y -= 3;
        player.direction = 'up';
      }
      if (keydown.down) {
        player.y += 3;
        player.direction = 'down';
      }
      player.x = player.x.clamp(0, CANVAS_WIDTH - player.width);
      player.y = player.y.clamp(0, CANVAS_HEIGHT - player.height);
    };
    draw = function() {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      player.draw();
    };
  });
}).call(this);
