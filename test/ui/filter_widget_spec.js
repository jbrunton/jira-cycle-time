require('jquery.cookie');
var moment = require('moment');
var FilterWidget = require('../../scripts/ui/filter_widget');
var Validator = require('../../scripts/shared/validator');

describe ('FilterWidget', function() {
  var filter, blur, dom;
  
  beforeEach(function() {
    blur = jasmine.createSpy('blur');
    spyOn($, 'cookie');
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
      
      expect(dom).toContainElement('input#' + FilterWidget.EXCLUSION_FILTER_ID);
      expect(dom).toContainElement('input#' + FilterWidget.SAMPLE_START_DATE_ID);
      expect(dom).toContainElement('input#' + FilterWidget.SAMPLE_END_DATE_ID);
    });
    
    it ("reads the filter cookie", function() {
      $.cookie.and.returnValue({
        excludedKeys: 'DEMO-101',
        sampleStartDate: '1 Jul 2014',
        sampleEndDate: '1 Sep 2014'
      });
      
      filter.bind(dom);
      
      expect(exclusionFilterInput().val()).toBe('DEMO-101');
      expect(sampleStartDateInput().val()).toBe('1 Jul 2014');
      expect(sampleEndDateInput().val()).toBe('1 Sep 2014');
    });
    
    it ("initializes the filter according to the filter cookie", function() {
      $.cookie.and.returnValue({ excludedKeys: 'DEMO-101' });
      filter.bind(dom);
      expect(filter.includeEpic({ key: 'DEMO-101' })).toBe(false);
    });
    
    it ("calls the blur function and saves the filter when the blur event fires on the filter input", function() {
      filter.bind(dom);

      exclusionFilterInput().val('DEMO-101').blur();

      expect(blur).toHaveBeenCalled();
      var expectedCookie = { excludedKeys: 'DEMO-101', sampleStartDate: '', sampleEndDate: '' };
      expect($.cookie).toHaveBeenCalledWith('jira-cycle-time-filter', expectedCookie, { expires: 9999 });
    });
    
    it ("calls the blur function and saves the filter when the blur event fires on the start date input", function() {
      filter.bind(dom);      

      sampleStartDateInput().val('1 Jul 2014').blur();

      expect(blur).toHaveBeenCalled();
      var expectedCookie = { excludedKeys: '', sampleStartDate: '1 Jul 2014', sampleEndDate: '' };
      expect($.cookie).toHaveBeenCalledWith('jira-cycle-time-filter', expectedCookie, { expires: 9999 });
    });
    
    it ("calls the blur function and saves the filter when the blur event fires on the end date input", function() {
      filter.bind(dom);

      sampleEndDateInput().val('1 Sep 2014').blur();

      expect(blur).toHaveBeenCalled();
      var expectedCookie = { excludedKeys: '', sampleStartDate: '', sampleEndDate: '1 Sep 2014' };
      expect($.cookie).toHaveBeenCalledWith('jira-cycle-time-filter', expectedCookie, { expires: 9999 });
    });
  });
  
  describe ('#includeEpic', function() {
    it ("returns true if no value is set for the epic filter", function() {
      filter.bind(dom);      
      expect(filter.includeEpic({ key: 'DEMO-101' })).toBe(true);
    });
    
    it ("returns true if the epic is included by the filter", function() {
      filter.bind(dom);
      exclusionFilterInput().val('DEMO-101').blur();
      expect(filter.includeEpic({ key: 'DEMO-102' })).toBe(true);
    });
    
    it ("returns false otherwise", function() {
      filter.bind(dom);
      exclusionFilterInput().val('DEMO-101').blur();
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
      sampleStartDateInput().val('1 Jul 2014').blur();
      expect(filter.includeDatedItem({ date: moment('1 Jun 2014') })).toBe(false);      
    });
    
    it ("returns true if the item's date is after the sample start date", function() {
      filter.bind(dom);
      sampleStartDateInput().val('1 Jul 2014').blur();
      expect(filter.includeDatedItem({ date: moment('1 Aug 2014') })).toBe(true);      
    });
    
    it ("returns true if the item's date is before the sample end date", function() {
      filter.bind(dom);
      sampleEndDateInput().val('1 Jul 2014').blur();
      expect(filter.includeDatedItem({ date: moment('1 Jun 2014') })).toBe(true);      
    });
    
    it ("returns false if the item's date is after the sample end date", function() {
      filter.bind(dom);
      sampleEndDateInput().val('1 Jul 2014').blur();
      expect(filter.includeDatedItem({ date: moment('1 Aug 2014') })).toBe(false);      
    });    
  });
  
  function exclusionFilterInput() {
    return dom.find('input#' + FilterWidget.EXCLUSION_FILTER_ID);
  }
  
  function sampleStartDateInput() {
    return dom.find('input#' + FilterWidget.SAMPLE_START_DATE_ID);
  }
  
  function sampleEndDateInput() {
    return dom.find('input#' + FilterWidget.SAMPLE_END_DATE_ID);
  }
});
