(function() {

  $(function() {
    return test('utility methods', 2, function() {
      equal(1..clamp(3, 5), 3, 'clamp sets a lower number to min');
      return equal(7..clamp(3, 5), 5, 'clamp sets a higher number to max');
    });
    return test('Array.last', 1, function() {
      return equal([1, 2, 3].last(), 3, 'Array.last retrieves the last element');
    });
  });

}).call(this);
