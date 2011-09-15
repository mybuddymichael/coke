(function() {
  $(document).ready(function() {
    var CANVAS_HEIGHT, CANVAS_WIDTH, FPS, Player, animate, canvasElement, canvasObject, context, controls, draw, keysPressed, mainLoop, player, recursiveAnimate, update;
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
    Array.prototype.last = function() {
      return this[this.length - 1];
    };
    Array.prototype.filterOutValue = function(v) {
      var x, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = this.length; _i < _len; _i++) {
        x = this[_i];
        if (x !== v) {
          _results.push(x);
        }
      }
      return _results;
    };
    controls = ['up', 'down', 'left', 'right'];
    keysPressed = [];
    $(document).bind('keydown', 'up', function() {
      keysPressed.push('up');
    });
    $(document).bind('keydown', 'down', function() {
      keysPressed.push('down');
    });
    $(document).bind('keydown', 'left', function() {
      keysPressed.push('left');
    });
    $(document).bind('keydown', 'right', function() {
      keysPressed.push('right');
    });
    $(document).bind('keyup', 'up', function() {
      keysPressed = keysPressed.filterOutValue('up');
    });
    $(document).bind('keyup', 'down', function() {
      keysPressed = keysPressed.filterOutValue('down');
    });
    $(document).bind('keyup', 'left', function() {
      keysPressed = keysPressed.filterOutValue('left');
    });
    $(document).bind('keyup', 'right', function() {
      keysPressed = keysPressed.filterOutValue('right');
    });
    Player = (function() {
      function Player() {
        this.width = 32;
        this.height = 32;
        this.x = CANVAS_WIDTH / 2 - this.width / 2;
        this.y = CANVAS_HEIGHT / 2 - this.height / 2;
        this.image = new Image;
        this.image.src = 'images/player.png';
        this.direction = 'down';
      }
      Player.prototype.update = function() {
        switch (keysPressed.last()) {
          case 'up':
            this.y -= 2;
            this.direction = 'up';
            break;
          case 'down':
            this.y += 2;
            this.direction = 'down';
            break;
          case 'left':
            this.x -= 2;
            this.direction = 'left';
            break;
          case 'right':
            this.x += 2;
            this.direction = 'right';
        }
        this.x = this.x.clamp(0, CANVAS_WIDTH - this.width);
        this.y = this.y.clamp(0, CANVAS_HEIGHT - this.height);
      };
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
        context.drawImage(this.image, this.imageX, 0, 32, 32, this.x, this.y, 32, 32);
      };
      return Player;
    })();
    player = new Player;
    update = function() {
      player.update();
    };
    draw = function() {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      player.draw();
    };
  });
}).call(this);
