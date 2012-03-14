# **[Coke](http://mybuddymichael.github.com/coke/)** is a game project written
# in CoffeeScript/JavaScript, and uses HTML5's `canvas` element for rendering.
# Check out the [full source on GitHub](https://github.com/mybuddymichael/coke).


# ### Settings

# Set width and height constants for the program.
CANVAS_WIDTH  = 960
CANVAS_HEIGHT = 640

# `GRID` is the default width and height measurement of a square unit in the
# game.
GRID = 32

# The frames-per-second (FPS) value is used by the animation loop.
FPS = 60

# Create a hash of the controls, used later by
# [jQuery.hotkeys](https://github.com/jeresig/jquery.hotkeys) to bind key
# presses to movement. Both arrow keys and WASD can be used.
CONTROLS =
  w:      'up'
  s:      'down'
  a:      'left'
  d:      'right'

  up:     'up'
  down:   'down'
  left:   'left'
  right:  'right'


# ### Utility functions

# `clamp()` automatically sets a number to within a range, if it is outside of
# that range. It's useful for making sure a character is staying within
# bounds.
Number::clamp = (min, max) ->
  Math.min(Math.max(this, min), max)

# `last()` retrieves the last element of an array.
Array::last = ->
  @[@length - 1]


# ### Canvas

# Create the canvas-relevant variables now, so they will be in the scope of the
# main program.
canvasObject = null
canvasElement = null
context = null

# Have jQuery wait for the document to be ready.
$ ->

  # Get the `canvas` element as a jQuery object.
  canvasObject = $('canvas')

  # Set the `canvas`'s attributes using the settings from above.
  canvasObject.attr({height: CANVAS_HEIGHT, width: CANVAS_WIDTH})

  # Retrieve the actual `canvas` element from the jQuery object.
  canvasElement = canvasObject.get(0)

  # Get the `canvas` context from the `canvas` element. The context is the
  # actual point of interaction for all drawing logic, as we'll see later.
  context = canvasElement.getContext('2d')


# ### The animation loop

# `mainLoop()` is the, well, main looping function that will be called at a
# regular interval by one of `canvas`'s animation functions, as we'll see
# below.
mainLoop = ->
  update()
  draw()

# Some of the more modern browsers have support for a smoother animation loop
# called `requestAnimationFrame`. If the browser does support it, assign it to
# `animate`, else assign `null`.
animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  null

# Like above, if `animate` is anything other than `null` (meaning the browser
# supports `requestAnimationFrame`), create a `recursiveAnimate()` function,
# which calls `mainLoop()`, then calls `animate()`, passing along itself, and,
# for Chrome, the `canvas` element.
if animate != null
  recursiveAnimate = ->
    mainLoop()
    animate(recursiveAnimate, canvasElement)

  # Call `animate` as in `recursiveAnimate()` to get the recursive ball
  # rolling on the animation cycle.
  animate(recursiveAnimate, canvasElement)

# And if the browser _does not_ support `requestAnimationFrame`, resort to
# `canvas`'s `setInterval`, which works but which stutters more.
else
  setInterval(mainLoop, 1000/FPS)


# ### Key handling

# Create an array for storing which keys have been pressed. This is polled
# later for the last element, so that the player can only move in one
# direction at a time.
keysPressed = []

# Iterate over the `CONTROLS`, using
# [jQuery.hotkeys](https://github.com/jeresig/jquery.hotkeys) to bind each
# `direction` to each `control`, or key.
for control, direction of CONTROLS
  do (control, direction) ->
    $(document).bind('keydown', control, ->
      keysPressed.push(direction))
    $(document).bind('keyup', control, ->
      keysPressed = keysPressed.filter((x) -> x is not direction))


# ### Game entities

class Player
  constructor: ->
    @x = GRID*7
    @y = GRID*5
    @image = new Image
    @image.src = 'images/player.png'
    @direction = 'down'
    @movementFactor = 2

  # `Player.update()` is called by the higher level `update()` function, as
  # we'll see below, which is turn called by `mainLoop()`.
  update: ->

    # If the player is dead square on a grid unit, fetch the last key pressed,
    # otherwise the player's direction and movement should be locked.  This
    # makes sure the player character never goes off the 32*32 grid.
    @keyPress = keysPressed.last() unless (@y%GRID != 0 or @x%GRID != 0)

    # Use the current key press to turn the player and begin moving in that
    # direction.
    switch @keyPress
      when 'up'
        @y -= @movementFactor
        @direction = 'up'
      when 'down'
        @y += @movementFactor
        @direction = 'down'
      when 'left'
        @x -= @movementFactor
        @direction = 'left'
      when 'right'
        @x += @movementFactor
        @direction = 'right'

    # Prevent the player from going off the screen by `clamp`ing him down.
    @x = @x.clamp(0, CANVAS_WIDTH - GRID)
    @y = @y.clamp(0, CANVAS_HEIGHT - GRID)

  # `Player.draw()` is called every `canvas` update cycle, just like
  # `Player.update()`. This is what draws and animates the player sprite.
  draw: ->

    # `getImageX()` is a function (defined below) that returns the x-coordinate
    # for the sprite section that needs to be drawn.
    @imageX = @getImageX()

    # Here we actually draw the image on the `canvas`. We pass along the sprite
    # sheet to use (`@image`), the x-coordinate to draw (`@imageX`).
    context.drawImage(@image, @imageX, 0, 32, 32, @x, @y, 32, 32)

  # #### Player helpers

  # `Player.getImageX()` used by `Player.draw()`.  It fetches the player's
  # direction, and then determines if the player is in movement by using moduli.
  # If the player _is_ in movement, it uses additional calculation to decide
  # which section of the player's image to draw.
  getImageX: ->
    switch @direction
      when 'up'
        if @y%32 >= 17
          if 0 <= @y%64 <= 31
            128
          else
            160
        else
           0
      when 'down'
        if 1 <= @y%32 <= 16
          if 32 <= @y%64 <= 63
            192
          else
            224
        else
           32
      when 'left'
        if @x%32 >= 17
          256
        else
          64
      when 'right'
        if 1 <= @x%32 <= 16
          288
        else
          96


# Create an instance of the `Player` class.
player = new Player


# ### High-level game methods

# `update()` and `draw()` are called by the `mainLoop()` and respectively
# update and draw each individual entity, thus bringing the game logic full
# circle.
update = ->
  player.update()

draw = ->
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
  player.draw()
