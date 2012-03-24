(function() {

  $(function() {
    module('Character');
    return test('getImageXFromPosition', 4, function() {
      var testChar;
      testChar = new Coke.Character;
      equal(testChar.getImageXFromPosition('up', 0, 0), 0);
      equal(testChar.getImageXFromPosition('down', 0, 0), 32);
      equal(testChar.getImageXFromPosition('left', 0, 0), 32 * 2);
      return equal(testChar.getImageXFromPosition('right', 0, 0), 32 * 3);
    });
  });

}).call(this);
