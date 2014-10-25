Math = require('../scripts/math');

describe('Math', function() {
  var math;
  
  beforeEach(function() {
    math = new Math();
  });
  
  describe('#fib', function() {
    it('should eval fib(0)', function() {
      expect(math.fib(0)).toBe(0);
    });

    it('should eval fib(1)', function() {
      expect(math.fib(1)).toBe(1);
    });

    it('should eval fib(2)', function() {
      expect(math.fib(2)).toBe(1);
    });

    it('should eval fib(5)', function() {
      expect(math.fib(5)).toBe(5);
    });

    it('should eval fib(8)', function() {
      expect(math.fib(8)).toBe(21);
    });
  });
});
