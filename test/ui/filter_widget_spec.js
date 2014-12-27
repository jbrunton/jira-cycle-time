var moment = require('moment');
var FilterWidget = require('../../scripts/ui/filter_widget');
var Validator = require('../../scripts/shared/validator');

describe ('FilterWidget', function() {
  var filter, blur, dom;
  
  beforeEach(function() {
    blur = jasmine.createSpy('blur');
    filter = new FilterWidget({
      blur: blur
    });
    dom = jasmine.getFixtures().set("<div>");
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
      filter.bind(dom);
      
      expect(dom).toContainElement('input#forecast-exclusion-filter');
      expect(dom).toContainElement('input#forecast-sample-start-date');
      expect(dom).toContainElement('input#forecast-sample-end-date');
    });
    
    it ("calls the blur function when the blur event fires on the filter input", function() {
      filter.bind(dom);
      dom.find('input#forecast-exclusion-filter').val('DEMO-101').blur();
      expect(blur).toHaveBeenCalled();
    });
    
    it ("calls the blur function when the blur event fires on the start date input", function() {
      filter.bind(dom);      
      dom.find('input#forecast-sample-start-date').val('1 Jul 2014').blur();
      expect(blur).toHaveBeenCalled();
    });
    
    it ("calls the blur function when the blur event fires on the end date input", function() {
      filter.bind(dom);      
      dom.find('input#forecast-sample-end-date').val('1 Sep 2014').blur();
      expect(blur).toHaveBeenCalled();
    });
  });
  
  describe ('#includeEpic', function() {
    it ("returns true if no value is set for the epic filter", function() {
      filter.bind(dom);      
      expect(filter.includeEpic({ key: 'DEMO-101' })).toBe(true);
    });
    
    it ("returns true if the epic is included by the filter", function() {
      filter.bind(dom);
      dom.find('input#forecast-exclusion-filter').val('DEMO-101').blur();
      expect(filter.includeEpic({ key: 'DEMO-102' })).toBe(true);
    });
    
    it ("returns false otherwise", function() {
      filter.bind(dom);
      dom.find('input#forecast-exclusion-filter').val('DEMO-101').blur();
      expect(filter.includeEpic({ key: 'DEMO-101' })).toBe(false);
    });
  });
  
  describe ('#includeDatedItem', function() {
    it ("returns true if no dates are excluded", function() {
      filter.bind(dom);
      expect(filter.includeDatedItem({ date: moment('1 Dec 2014') })).toBe(true);      
    });
    
    it ("returns false if the item's date is before the sample start date", function() {
      filter.bind(dom);
      dom.find('input#forecast-sample-start-date').val('1 Jul 2014').blur();
      expect(filter.includeDatedItem({ date: moment('1 Jun 2014') })).toBe(false);      
    });
    
    it ("returns true if the item's date is after the sample start date", function() {
      filter.bind(dom);
      dom.find('input#forecast-sample-start-date').val('1 Jul 2014').blur();
      expect(filter.includeDatedItem({ date: moment('1 Aug 2014') })).toBe(true);      
    });
    
    it ("returns true if the item's date is before the sample end date", function() {
      filter.bind(dom);
      dom.find('input#forecast-sample-end-date').val('1 Jul 2014').blur();
      expect(filter.includeDatedItem({ date: moment('1 Jun 2014') })).toBe(true);      
    });
    
    it ("returns false if the item's date is after the sample end date", function() {
      filter.bind(dom);
      dom.find('input#forecast-sample-end-date').val('1 Jul 2014').blur();
      expect(filter.includeDatedItem({ date: moment('1 Aug 2014') })).toBe(false);      
    });    
  });
});
