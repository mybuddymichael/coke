# **[Coke](http://mybuddymichael.github.com/coke/)** is a game project written
# in CoffeeScript/JavaScript, and uses HTML5's `canvas` element for rendering.
# Check out the [full source on GitHub](https://github.com/mybuddymichael/coke).


# ### Setup

# Save the root object, `window`.
root = this

# Set Coke as this program's global variable object.
Coke = root.Coke = {}

# Export the default settings.
settings = Coke.settings =

  # Set the default width and height constants for the program.
  canvas_width:  960
  canvas_height: 640

  # `grid` is the default width and height measurement of a square unit in the
  # game.
  grid: 32

  # The frames-per-second (fps) value is used by the animation loop.
  fps: 60

  # Create a hash of the controls, used later by
  # [jQuery.hotkeys](https://github.com/jeresig/jquery.hotkeys) to bind key
  # presses to movement. Both arrow keys and WASD can be used.
  controls:
    w:      'up'
    s:      'down'
    a:      'left'
    d:      'right'

    up:     'up'
    down:   'down'
    left:   'left'
    right:  'right'

# Create a root updateables Array, into which the user can push custom-
# defined entities to be updated and drawn.
updateables = Coke.updateables = []


# ### Utility functions

# `clamp()` automatically sets a number to within a range, if it is outside of
# that range. It's useful for making sure a character is staying within
# bounds.
if typeof Number::clamp isnt 'function'
  Number::clamp = (min, max) ->
    Math.min(Math.max(this, min), max)

# `last()` retrieves the last element of an array.
if typeof Array::last isnt 'function'
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
  canvasObject.attr
    height: settings.canvas_height
    width: settings.canvas_width

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
if animate?
  recursiveAnimate = ->
    mainLoop()
    animate(recursiveAnimate, canvasElement)

  # Call `animate` as in `recursiveAnimate()` to get the recursive ball
  # rolling on the animation cycle.
  animate(recursiveAnimate, canvasElement)

# And if the browser _does not_ support `requestAnimationFrame`, resort to
# `canvas`'s `setInterval`, which works but which stutters more.
else
  setInterval(mainLoop, 1000/settings.fps)


# ### High-level game methods

# `update()` and `draw()` are called by the `mainLoop()` and respectively
# update and draw each individual entity, thus bringing the game logic full
# circle.
update = ->
  for u in updateables
    return u.update()


draw = ->
  context.clearRect(0, 0, settings.canvas_width, settings.canvas_height)
  for u in updateables
    return u.draw()


# ### Key handling

# Create an array for storing which keys have been pressed. This is polled
# later for the last element, so that the player can only move in one
# direction at a time.
keysPressed = []

# Iterate over `settings.controls`, using
# [jQuery.hotkeys](https://github.com/jeresig/jquery.hotkeys) to bind each
# `direction` to each `control`, or key.
for control, direction of settings.controls
  do (control, direction) ->
    $(document).bind('keydown', control, ->
      keysPressed.push(direction))
    $(document).bind('keyup', control, ->
      keysPressed = keysPressed.filter((x) -> x isnt direction))


# ### Game entities

class Coke.Character
  constructor: (@x, @y, @movementFactor, @direction, imageSrc) ->
    @image = new Image
    @image.src = imageSrc

  # `Character.update()` is called by the higher level `update()` function, as
  # we'll see below, which is turn called by `mainLoop()`.
  update: ->

    # If the player is dead square on a grid unit, fetch the last key pressed,
    # otherwise the player's direction and movement should be locked.  This
    # makes sure the player character never goes off the 32*32 grid.
    if @y % settings.grid is 0 and @x % settings.grid is 0
      @keyPress = keysPressed.last()

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
    @x = @x.clamp(0, settings.canvas_width - settings.grid)
    @y = @y.clamp(0, settings.canvas_height - settings.grid)

  # `Character.draw()` is called every `canvas` update cycle, just like
  # `Character.update()`. This is what draws and animates the player sprite.
  draw: ->

    # `getImageX()` is a function (defined below) that returns the x-coordinate
    # for the sprite section that needs to be drawn.
    @imageX = @getImageXFromPosition(@direction, @x, @y)

    # Here we actually draw the image on the `canvas`. We pass along the sprite
    # sheet to use (`@image`), the x-coordinate to draw (`@imageX`).
    context.drawImage(@image, @imageX, 0, 32, 32, @x, @y, 32, 32)

  # #### Character helpers

  # `Character.getImageXFromPosition()` used by `Character.draw()`.  It
  # takes the player's direction, and then determines if the player is
  # in movement by using moduli. If the player _is_ in movement, it uses
  # additional calculation to decide which section of the player's image
  # to draw.
  getImageXFromPosition: (direction, x, y) ->
    switch direction
      when 'up'
        if y % 32 >= 17
          if 0 <= y % 64 <= 31
            128
          else
            160
        else
           0
      when 'down'
        if 1 <= y % 32 <= 16
          if 32 <= y % 64 <= 63
            192
          else
            224
        else
           32
      when 'left'
        if x % 32 >= 17
          256
        else
          64
      when 'right'
        if 1 <= x % 32 <= 16
          288
        else
          96


