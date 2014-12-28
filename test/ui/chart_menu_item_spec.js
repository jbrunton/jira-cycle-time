var ChartMenuItem = require('../../scripts/ui/chart_menu_item');
var Validator = require('../../scripts/shared/validator');

describe('ChartMenuItem', function() {
  var validOpts;
  
  beforeEach (function() {
    validOpts = {
      report: {
        title: 'Some Title'
      },
      menuItemId: 'some-id',
      tooltip: 'Some tooltip'
    };
  });
  
  describe ('constructor', function() {
    it ("requires an opts param", function() {
      expect(function() {
        new ChartMenuItem();
      }).toThrow(Validator.messages.requires('opts'));
    });
    
    it ("requires a report", function() {
      expect(function() {
        var opts = _.omit(validOpts, 'report');
        new ChartMenuItem(opts);
      }).toThrow(Validator.messages.requires('opts.report'));
    });
    
    it ("requires a menu item id", function() {
      expect(function() {
        var opts = _.omit(validOpts, 'menuItemId');
        new ChartMenuItem(opts);
      }).toThrow(Validator.messages.requires('opts.menuItemId'));
    });
    
    it ("requires a tooltip", function() {
      expect(function() {
        var opts = _.omit(validOpts, 'tooltip');
        new ChartMenuItem(opts);
      }).toThrow(Validator.messages.requires('opts.tooltip'));
    });
    
    it ("initializes a chart", function() {
      var chart = new ChartMenuItem(validOpts);
      expect(chart.report).toBe(validOpts.report);
      expect(chart.menuItemId).toBe(validOpts.menuItemId);
    });
  });
});
