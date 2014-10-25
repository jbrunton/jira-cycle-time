Greeter = require('../scripts/greeter');

describe('Greeter', function() {
  var greeter;
  
  beforeEach(function() {
    greeter = new Greeter();
  });
  
  it('should greet the given object', function() {
    expect(greeter.greet('World')).toBe('Hello, World!');
  });  
});
