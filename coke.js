(function() {
  var CANVAS_HEIGHT, CANVAS_WIDTH, CONTROLS, Coke, FPS, GRID, animate, canvasElement, canvasObject, context, control, direction, draw, keysPressed, mainLoop, player, recursiveAnimate, root, update, _fn;

  root = this;

  Coke = root.Coke = {};

  CANVAS_WIDTH = 960;

  CANVAS_HEIGHT = 640;

  GRID = 32;

  FPS = 60;

  CONTROLS = {
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right',
    up: 'up',
    down: 'down',
    left: 'left',
    right: 'right'
  };

  Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
  };

  Array.prototype.last = function() {
    return this[this.length - 1];
  };

  canvasObject = null;

  canvasElement = null;

  context = null;

  $(function() {
    canvasObject = $('canvas');
    canvasObject.attr({
      height: CANVAS_HEIGHT,
      width: CANVAS_WIDTH
    });
    canvasElement = canvasObject.get(0);
    return context = canvasElement.getContext('2d');
  });

  mainLoop = function() {
    update();
    return draw();
  };

  animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;

  if (animate !== null) {
    recursiveAnimate = function() {
      mainLoop();
      return animate(recursiveAnimate, canvasElement);
    };
    animate(recursiveAnimate, canvasElement);
  } else {
    setInterval(mainLoop, 1000 / FPS);
  }

  keysPressed = [];

  _fn = function(control, direction) {
    $(document).bind('keydown', control, function() {
      return keysPressed.push(direction);
    });
    return $(document).bind('keyup', control, function() {
      return keysPressed = keysPressed.filter(function(x) {
        return x === !direction;
      });
    });
  };
  for (control in CONTROLS) {
    direction = CONTROLS[control];
    _fn(control, direction);
  }

  Coke.Character = (function() {

    function Character(x, y, movementFactor, direction, imageSrc) {
      this.x = x;
      this.y = y;
      this.movementFactor = movementFactor;
      this.direction = direction;
      this.image = new Image;
      this.image.src = imageSrc;
    }

    Character.prototype.update = function() {
      if (!(this.y % GRID !== 0 || this.x % GRID !== 0)) {
        this.keyPress = keysPressed.last();
      }
      switch (this.keyPress) {
        case 'up':
          this.y -= this.movementFactor;
          this.direction = 'up';
          break;
        case 'down':
          this.y += this.movementFactor;
          this.direction = 'down';
          break;
        case 'left':
          this.x -= this.movementFactor;
          this.direction = 'left';
          break;
        case 'right':
          this.x += this.movementFactor;
          this.direction = 'right';
      }
      this.x = this.x.clamp(0, CANVAS_WIDTH - GRID);
      return this.y = this.y.clamp(0, CANVAS_HEIGHT - GRID);
    };

    Character.prototype.draw = function() {
      this.imageX = this.getImageX();
      return context.drawImage(this.image, this.imageX, 0, 32, 32, this.x, this.y, 32, 32);
    };

    Character.prototype.getImageX = function() {
      var _ref, _ref2, _ref3, _ref4;
      switch (this.direction) {
        case 'up':
          if (this.y % 32 >= 17) {
            if ((0 <= (_ref = this.y % 64) && _ref <= 31)) {
              return 128;
            } else {
              return 160;
            }
          } else {
            return 0;
          }
          break;
        case 'down':
          if ((1 <= (_ref2 = this.y % 32) && _ref2 <= 16)) {
            if ((32 <= (_ref3 = this.y % 64) && _ref3 <= 63)) {
              return 192;
            } else {
              return 224;
            }
          } else {
            return 32;
          }
          break;
        case 'left':
          if (this.x % 32 >= 17) {
            return 256;
          } else {
            return 64;
          }
          break;
        case 'right':
          if ((1 <= (_ref4 = this.x % 32) && _ref4 <= 16)) {
            return 288;
          } else {
            return 96;
          }
      }
    };

    return Character;

  })();

  player = new Coke.Character(GRID * 7, GRID * 5, 2, 'down', 'images/player.png');

  update = function() {
    return player.update();
  };

  draw = function() {
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    return player.draw();
  };

}).call(this);
