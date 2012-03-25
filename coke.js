(function() {
  var Coke, animate, canvasElement, canvasObject, context, control, direction, draw, keysPressed, mainLoop, player, recursiveAnimate, root, settings, update, _fn, _ref;

  root = this;

  Coke = root.Coke = {};

  settings = Coke.settings = {
    canvas_width: 960,
    canvas_height: 640,
    grid: 32,
    fps: 60,
    controls: {
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
      up: 'up',
      down: 'down',
      left: 'left',
      right: 'right'
    }
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
      height: settings.canvas_height,
      width: settings.canvas_width
    });
    canvasElement = canvasObject.get(0);
    return context = canvasElement.getContext('2d');
  });

  mainLoop = function() {
    update();
    return draw();
  };

  animate = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;

  if (animate != null) {
    recursiveAnimate = function() {
      mainLoop();
      return animate(recursiveAnimate, canvasElement);
    };
    animate(recursiveAnimate, canvasElement);
  } else {
    setInterval(mainLoop, 1000 / settings.fps);
  }

  keysPressed = [];

  _ref = settings.controls;
  _fn = function(control, direction) {
    $(document).bind('keydown', control, function() {
      return keysPressed.push(direction);
    });
    return $(document).bind('keyup', control, function() {
      return keysPressed = keysPressed.filter(function(x) {
        return x !== direction;
      });
    });
  };
  for (control in _ref) {
    direction = _ref[control];
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
      if (this.y % settings.grid === 0 && this.x % settings.grid === 0) {
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
      this.x = this.x.clamp(0, settings.canvas_width - settings.grid);
      return this.y = this.y.clamp(0, settings.canvas_height - settings.grid);
    };

    Character.prototype.draw = function() {
      this.imageX = this.getImageXFromPosition(this.direction, this.x, this.y);
      return context.drawImage(this.image, this.imageX, 0, 32, 32, this.x, this.y, 32, 32);
    };

    Character.prototype.getImageXFromPosition = function(direction, x, y) {
      var _ref2, _ref3, _ref4, _ref5;
      switch (direction) {
        case 'up':
          if (y % 32 >= 17) {
            if ((0 <= (_ref2 = y % 64) && _ref2 <= 31)) {
              return 128;
            } else {
              return 160;
            }
          } else {
            return 0;
          }
          break;
        case 'down':
          if ((1 <= (_ref3 = y % 32) && _ref3 <= 16)) {
            if ((32 <= (_ref4 = y % 64) && _ref4 <= 63)) {
              return 192;
            } else {
              return 224;
            }
          } else {
            return 32;
          }
          break;
        case 'left':
          if (x % 32 >= 17) {
            return 256;
          } else {
            return 64;
          }
          break;
        case 'right':
          if ((1 <= (_ref5 = x % 32) && _ref5 <= 16)) {
            return 288;
          } else {
            return 96;
          }
      }
    };

    return Character;

  })();

  player = new Coke.Character(settings.grid * 7, settings.grid * 5, 2, 'down', 'images/player.png');

  update = function() {
    return player.update();
  };

  draw = function() {
    context.clearRect(0, 0, settings.canvas_width, settings.canvas_height);
    return player.draw();
  };

}).call(this);
