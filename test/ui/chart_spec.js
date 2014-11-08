var Chart = require('../../scripts/ui/chart');
var Validator = require('../../scripts/shared/validator');

describe('Chart', function() {
  var validOpts;
  
  beforeEach (function() {
    validOpts = {
      report: {
        title: 'Some Title'
      },
      menuItemId: 'some-id'
    };
  });
  
  describe ('constructor', function() {
    it ("requires an opts param", function() {
      expect(function() {
        new Chart();
      }).toThrow(Validator.messages.requires('opts'));
    });
    
    it ("requires a report", function() {
      expect(function() {
        var opts = _.omit(validOpts, 'report');
        new Chart(opts);
      }).toThrow(Validator.messages.requires('opts.report'));
    });
    
    it ("requires a menu item id", function() {
      expect(function() {
        var opts = _.omit(validOpts, 'menuItemId');
        new Chart(opts);
      }).toThrow(Validator.messages.requires('opts.menuItemId'));
    });
    
    it ("initializes a chart", function() {
      var chart = new Chart(validOpts);
      expect(chart.report).toBe(validOpts.report);
      expect(chart.menuItemId).toBe(validOpts.menuItemId);
    });
  });
});
