var Class = require('../../scripts/shared/class');

describe ('Class', function() {
  
  var Foo, Bar;
  
  beforeEach(function() {
    Foo = function() {}
    Foo.prototype.myNameIs = 'Slim Shady';
    
    Bar = function() {}
  })
  
  it ("inherits the prototype of the given class", function() {
    Class(Bar).extends(Foo);
    expect(new Bar().myNameIs).toBe('Slim Shady');
  });
});
