$ ->

  module 'Character'

  test 'getImageXFromPosition', 4, ->
    testChar = new Coke.Character
    equal testChar.getImageXFromPosition('up', 0, 0), 0
    equal testChar.getImageXFromPosition('down', 0, 0), 32
    equal testChar.getImageXFromPosition('left', 0, 0), 32 * 2
    equal testChar.getImageXFromPosition('right', 0, 0), 32 * 3
