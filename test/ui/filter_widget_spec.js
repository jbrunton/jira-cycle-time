var FilterWidget = require('../../scripts/ui/filter_widget');
var Validator = require('../../scripts/shared/validator');

describe ('FilterWidget', function() {
  var filter, blur;
  
  beforeEach(function() {
    blur = jasmine.createSpy('blur');
    filter = new FilterWidget({
      blur: blur
    });
  });

  describe ('constructor', function() {
    it ("requires an opts param", function() {
      expect(function() {
        new FilterWidget();
      }).toThrow(Validator.messages.requires('opts'));
    });
    
    it ("requires a blur parameter", function() {
      expect(function() {
        new FilterWidget({});
      }).toThrow(Validator.messages.requires('opts.blur'));
    });
  });
  
  describe ('#bind', function() {
    it ("appends the template to the DOM", function() {
      var dom = jasmine.getFixtures().set("<div>");

      filter.bind(dom);

      expect(dom).toContainElement('input#forecast-exclusion-filter');
      expect(dom).toContainElement('input#forecast-sample-start-date');
      expect(dom).toContainElement('input#forecast-sample-end-date');
    });
    
    it ("calls the blur function when the blur event fires on the filter input", function() {
      var dom = jasmine.getFixtures().set("<div>");

      filter.bind(dom);
      
      dom.find('input#forecast-exclusion-filter').val('DEMO-101').blur();
      expect(blur).toHaveBeenCalled();
    });
    
    it ("calls the blur function when the blur event fires on the start date input", function() {
      var dom = jasmine.getFixtures().set("<div>");

      filter.bind(dom);
      
      dom.find('input#forecast-sample-start-date').val('1 Jul 2014').blur();
      expect(blur).toHaveBeenCalled();
    });
    
    it ("calls the blur function when the blur event fires on the end date input", function() {
      var dom = jasmine.getFixtures().set("<div>");

      filter.bind(dom);
      
      dom.find('input#forecast-sample-end-date').val('1 Sep 2014').blur();
      expect(blur).toHaveBeenCalled();
    });
  });
  
  describe ('#includeEpic', function() {
    it ("returns true if the epic is included by the filter", function() {
      var dom = jasmine.getFixtures().set("<div>");
      filter.bind(dom);      
      dom.find('input#forecast-exclusion-filter').val('DEMO-101').blur();
      
      expect(filter.includeEpic({ key: 'DEMO-102' })).toBe(true);
    });
    
    it ("returns false otherwise", function() {
      var dom = jasmine.getFixtures().set("<div>");
      filter.bind(dom);      
      dom.find('input#forecast-exclusion-filter').val('DEMO-101').blur();
      
      expect(filter.includeEpic({ key: 'DEMO-101' })).toBe(false);
    });
  });
});
