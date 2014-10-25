var Validator = require('../../scripts/shared/validator');

describe ('Validator', function() {
  var validator;
  
  beforeEach(function() {
    validator = new Validator();
  });
  
  describe ('#hasArguments', function() {
    function validateArguments() {
      return validator.hasArguments(arguments);
    }
    
    it ("raises an error if the given arguments object is empty", function() {
      expect(function() {
        validateArguments();
      }).toThrow("Expected at least one argument.");
    });
    
    it ("passes if the given arguments object is not empty, and returns the validator object", function() {
      expect(
        validateArguments('an argument')
      ).toBe(validator);
    });
  });
  
  describe ('#requires', function() {
    it ("raises an error if the given value not defined", function() {
      expect(function() {
        validator.requires(null, 'myValue');
      }).toThrow("Required myValue.");
    });
    
    it ("passes if the given value is defined, and returns the validator object", function() {
      expect(validator.requires('some value', 'myValue')).toBe(validator);
    });
  });
  
  describe ('.messages.requires', function() {
    it ("returns the error message for when a value is missing", function() {
      expect(Validator.messages.requires('foo')).toEqual("Required foo.");
    });
  });
});
