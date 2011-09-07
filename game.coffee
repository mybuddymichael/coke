$(document).ready ->

  # Settings
  CANVAS_WIDTH  = 480
  CANVAS_HEIGHT = 320

  canvasElement = $('canvas')
  canvasElement.attr({height: CANVAS_HEIGHT, width: CANVAS_WIDTH})

  canvas = canvasElement.get(0).getContext('2d')

  FPS = 60

  setInterval(( ->
    update()
    draw()
    return),
    1000/FPS)


  # Utility function
  Number::clamp = (min, max) ->
    Math.min(Math.max(this, min), max)


  # Key handling
  window.keydown = {}

  keyName = (event) ->
    return jQuery.hotkeys.specialKeys[event.which] ||
      String.fromCharCode(event.which).toLowerCase()

  $(document).bind("keydown", (event) ->
    keydown[keyName(event)] = true
    return)

  $(document).bind("keyup", (event) ->
    keydown[keyName(event)] = false
    return)


  # Player
  class Player
    constructor: ->
      @color = "#5b6449"
      @width = 32
      @height = 32
      @x = CANVAS_WIDTH/2 - @width/2
      @y = CANVAS_HEIGHT/2 - @height/2

    draw: ->
      canvas.fillStyle = @color
      canvas.fillRect(@x, @y, @width, @height)
      return

  player = new Player


  # Logic
  update = ->
    if keydown.space
      player.shoot()
    if keydown.left
      player.x -= 3
    if keydown.right
      player.x += 3
    if keydown.up
      player.y -= 3
    if keydown.down
      player.y += 3

    player.x = player.x.clamp(0, CANVAS_WIDTH - player.width)
    player.y = player.y.clamp(0, CANVAS_HEIGHT - player.height)
    return

  draw = ->
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    player.draw()
    return

  return
