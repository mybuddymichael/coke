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
      @width = 32
      @height = 32
      @x = CANVAS_WIDTH/2 - @width/2
      @y = CANVAS_HEIGHT/2 - @height/2
      @image = new Image
      @image.src = 'player.png'

    draw: ->
      context.drawImage(@image, @x, @y)
      return

  player = new Player


  # Logic
  update = ->
    if keydown.left
      player.x -= 3
      player.direction = 'left'
    if keydown.right
      player.x += 3
      player.direction = 'right'
    if keydown.up
      player.y -= 3
      player.direction = 'up'
    if keydown.down
      player.y += 3
      player.direction = 'down'

    player.x = player.x.clamp(0, CANVAS_WIDTH - player.width)
    player.y = player.y.clamp(0, CANVAS_HEIGHT - player.height)
    return

  draw = ->
    context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    player.draw()
    return

  return
