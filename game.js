(function() {
  $(document).ready(function() {
    var CANVAS_HEIGHT, CANVAS_WIDTH, FPS, Player, addToKeyPressArray, animate, canvasElement, canvasObject, context, control, controls, direction, draw, keysPressed, mainLoop, player, recursiveAnimate, removeFromKeyPressArray, update;
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
    Array.prototype.filter = function(v) {
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
    controls = {
      'w': 'up',
      's': 'down',
      'a': 'left',
      'd': 'right'
    };
    keysPressed = [];
    addToKeyPressArray = function(v) {
      return function() {
        keysPressed.push(v);
      };
    };
    removeFromKeyPressArray = function(v) {
      return function() {
        keysPressed = keysPressed.filter(v);
      };
    };
    for (control in controls) {
      direction = controls[control];
      $(document).bind('keydown', control, addToKeyPressArray(direction));
      $(document).bind('keyup', control, removeFromKeyPressArray(direction));
    }
    Player = (function() {
      function Player() {
        this.width = 32;
        this.height = 32;
        this.x = 32 * 7;
        this.y = 32 * 5;
        this.image = new Image;
        this.image.src = 'images/player.png';
        this.direction = 'down';
        this.locked = false;
        this.movementFactor = 2;
      }
      Player.prototype.update = function() {
        if (this.y % 32 !== 0 || this.x % 32 !== 0) {
          this.locked = true;
        } else {
          this.locked = false;
        }
        if (!this.locked) {
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
        this.x = this.x.clamp(0, CANVAS_WIDTH - this.width);
        this.y = this.y.clamp(0, CANVAS_HEIGHT - this.height);
      };
      Player.prototype.draw = function() {
        var _ref, _ref2, _ref3, _ref4, _ref5, _ref6;
        switch (this.direction) {
          case 'up':
            if ((17 <= (_ref = this.y % 32) && _ref <= 31)) {
              if ((0 <= (_ref2 = this.y % 64) && _ref2 <= 31)) {
                this.imageX = 128;
              } else {
                this.imageX = 160;
              }
            } else {
              this.imageX = 0;
            }
            break;
          case 'down':
            if ((1 <= (_ref3 = this.y % 32) && _ref3 <= 16)) {
              if ((32 <= (_ref4 = this.y % 64) && _ref4 <= 63)) {
                this.imageX = 192;
              } else {
                this.imageX = 224;
              }
            } else {
              this.imageX = 32;
            }
            break;
          case 'left':
            if ((17 <= (_ref5 = this.x % 32) && _ref5 <= 31)) {
              this.imageX = 256;
            } else {
              this.imageX = 64;
            }
            break;
          case 'right':
            if ((1 <= (_ref6 = this.x % 32) && _ref6 <= 16)) {
              this.imageX = 288;
            } else {
              this.imageX = 96;
            }
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
