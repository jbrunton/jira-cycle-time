var Chart = require('../../scripts/ui/chart');
var Validator = require('../../scripts/shared/validator');

describe('Chart', function() {
  var validOpts;
  
  beforeEach(function() {
    validOpts = {
      title: 'Some Title'
    };
  });
  
  describe('constructor', function() {
    it ("requires an opts param", function() {
      expect(function() {
        new Chart();
      }).toThrow(Validator.messages.requires('opts'));
    });
    
    it ("requires a title", function() {
      expect(function() {
        delete validOpts.title;
        new Chart(validOpts);
      }).toThrow(Validator.messages.requires('opts.title'));
    });
    
    it ("initializes a chart", function() {
      var chart = new Chart(validOpts);
      expect(chart.title).toBe(validOpts.title);
    });
  });
});
