$(document).ready ->

  # Settings
  CANVAS_WIDTH  = 480
  CANVAS_HEIGHT = 320

  canvasObject = $('canvas')
  canvasObject.attr({height: CANVAS_HEIGHT, width: CANVAS_WIDTH})

  canvasElement = canvasObject.get(0)

  context = canvasElement.getContext('2d')

  FPS = 60


  # Animation
  mainLoop = ->
    update()
    draw()
    return

  animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    null

  if animate != null
    recursiveAnimate = ->
      mainLoop()
      animate(recursiveAnimate, canvasElement)
      return

    animate(recursiveAnimate, canvasElement)
  else
    setInterval(mainLoop, 1000/FPS)


  # Utility functions
  Number::clamp = (min, max) ->
    Math.min(Math.max(this, min), max)

  Array::last = ->
    @[@length - 1]

  Array::filterOutValue = (v) ->
    x for x in @ when x!=v


  # Key handling
  keysPressed = []

  $(document).bind('keydown', 'up', ->
    keysPressed.push('up'); return)
  $(document).bind('keydown', 'down', ->
    keysPressed.push('down'); return)
  $(document).bind('keydown', 'left', ->
    keysPressed.push('left'); return)
  $(document).bind('keydown', 'right', ->
    keysPressed.push('right'); return)
  $(document).bind('keyup', 'up', ->
    keysPressed = keysPressed.filterOutValue('up'); return)
  $(document).bind('keyup', 'down', ->
    keysPressed = keysPressed.filterOutValue('down'); return)
  $(document).bind('keyup', 'left', ->
    keysPressed = keysPressed.filterOutValue('left'); return)
  $(document).bind('keyup', 'right', ->
    keysPressed = keysPressed.filterOutValue('right'); return)


  # Class definitions
  class Player
    constructor: ->
      @width = 32
      @height = 32
      @x = 32*7
      @y = 32*5
      @image = new Image
      @image.src = 'images/player.png'
      @direction = 'down'
      @locked = false
      @movementFactor = 2

    update: ->
      if @y%32 != 0 or @x%32 != 0
        @locked = true
      else
        @locked = false

      @keyPress = keysPressed.last() unless @locked

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

      @x = @x.clamp(0, CANVAS_WIDTH - @width)
      @y = @y.clamp(0, CANVAS_HEIGHT - @height)
      return

    draw: ->
      switch @direction
        when 'up'
          if 17 <= @y%32 <= 31
            if 0 <= @y%64 <= 31
              @imageX = 128
            else
              @imageX = 160
          else
            @imageX = 0
        when 'down'
          if 1 <= @y%32 <= 16
            if 32 <= @y%64 <= 63
              @imageX = 192
            else
              @imageX = 224
          else
            @imageX = 32
        when 'left'
          if 17 <= @x%32 <= 31
            @imageX = 256
          else
            @imageX = 64
        when 'right'
          if 1 <= @x%32 <= 16
            @imageX = 288
          else
            @imageX = 96

      context.drawImage(@image, @imageX, 0, 32, 32, @x, @y, 32, 32)
      return

  player = new Player


  # Logic
  update = ->
    player.update()
    return

  draw = ->
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    player.draw()
    return

  return
