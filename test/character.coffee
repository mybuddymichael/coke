$ ->

  module 'Character'

  test 'x is readable', 1, ->
    testChar = new Coke.Character(10)
    equal testChar.x, 10

  test 'y is readable', 1, ->
    testChar = new Coke.Character(0, 11)
    equal testChar.y, 11

  test 'movement factor set/get', 1, ->
    testChar = new Coke.Character(0, 0, 2)
    equal testChar.movementFactor, 2

  test 'getImageXFromPosition square coordinates', 4,  ->
    testChar = new Coke.Character
    equal testChar.getImageXFromPosition('up', 0, 0), 0
    equal testChar.getImageXFromPosition('down', 0, 0), 32
    equal testChar.getImageXFromPosition('left', 0, 0), 32 * 2
    equal testChar.getImageXFromPosition('right', 0, 0), 32 * 3

  test 'getImageXFromPosition up off-grid', 2, ->
    testChar = new Coke.Character
    equal testChar.getImageXFromPosition('up', 0, 31), 128
    equal testChar.getImageXFromPosition('up', 0, 63), 160

  test 'getImageXFromPosition down off-grid', 2, ->
    testChar = new Coke.Character
    equal testChar.getImageXFromPosition('down', 0, 33), 192
    equal testChar.getImageXFromPosition('down', 0, 1), 224

  test 'getImageXFromPosition left off-grid', 2, ->
    testChar = new Coke.Character
    equal testChar.getImageXFromPosition('left', 31, 0), 256
    equal testChar.getImageXFromPosition('left', 1, 0), 64

  test 'getImageXFromPosition right off-grid', 2, ->
    testChar = new Coke.Character
    equal testChar.getImageXFromPosition('right', 1, 0), 288
    equal testChar.getImageXFromPosition('right', 31, 0), 96
