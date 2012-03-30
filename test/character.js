(function() {

  $(function() {
    module('Character');
    test('x is readable', 1, function() {
      var testChar;
      testChar = new Coke.Character(10);
      return equal(testChar.x, 10);
    });
    test('y is readable', 1, function() {
      var testChar;
      testChar = new Coke.Character(0, 11);
      return equal(testChar.y, 11);
    });
    test('movement factor set/get', 1, function() {
      var testChar;
      testChar = new Coke.Character(0, 0, 2);
      return equal(testChar.movementFactor, 2);
    });
    test('getImageXFromPosition square coordinates', 4, function() {
      var testChar;
      testChar = new Coke.Character;
      equal(testChar.getImageXFromPosition('up', 0, 0), 0, 'up');
      equal(testChar.getImageXFromPosition('down', 0, 0), 32, 'down');
      equal(testChar.getImageXFromPosition('left', 0, 0), 32 * 2, 'left');
      return equal(testChar.getImageXFromPosition('right', 0, 0), 32 * 3, 'right');
    });
    test('getImageXFromPosition up off-grid', 2, function() {
      var testChar;
      testChar = new Coke.Character;
      equal(testChar.getImageXFromPosition('up', 0, 31), 128);
      return equal(testChar.getImageXFromPosition('up', 0, 63), 160);
    });
    test('getImageXFromPosition down off-grid', 2, function() {
      var testChar;
      testChar = new Coke.Character;
      equal(testChar.getImageXFromPosition('down', 0, 33), 192);
      return equal(testChar.getImageXFromPosition('down', 0, 1), 224);
    });
    test('getImageXFromPosition left off-grid', 2, function() {
      var testChar;
      testChar = new Coke.Character;
      equal(testChar.getImageXFromPosition('left', 31, 0), 256);
      return equal(testChar.getImageXFromPosition('left', 1, 0), 64);
    });
    return test('getImageXFromPosition right off-grid', 2, function() {
      var testChar;
      testChar = new Coke.Character;
      equal(testChar.getImageXFromPosition('right', 1, 0), 288);
      return equal(testChar.getImageXFromPosition('right', 31, 0), 96);
    });
  });

}).call(this);
