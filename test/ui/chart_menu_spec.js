var ChartMenu = require('../../scripts/ui/chart_menu');
var Chart = require('../../scripts/ui/chart');
var Validator = require('../../scripts/shared/validator');

describe ('ChartMenu', function() {
  var chartMenu, chart, validOpts;
  
  
  beforeEach (function() {
    chart = new Chart({
      title: 'Some Chart',
      menuItemId: 'custom-chart'
    });
    // chartMenu = new ChartMenu();
    validOpts = {
      charts: [chart]
    };
    
    chartMenu = new ChartMenu(validOpts);
  });
  
  describe ("constructor", function() {
    it ("requires an opts param", function() {
      expect(function() {
        new ChartMenu();
      }).toThrow(Validator.messages.requires('opts'));
    });
    
    it ("requires a list of charts", function() {
      expect(function() {
        var opts = _.omit(validOpts, 'charts');
        new ChartMenu(opts);
      }).toThrow(Validator.messages.requires('opts.charts'));
    });
    
    it ("initializes the instance", function() {
      var chartMenu = new ChartMenu(validOpts);
      expect(chartMenu.charts).toBe(validOpts.charts);
    });
  });
  
  describe ("#bind", function() {
    it ("appends its menu items to the DOM", function() {
      var dom = createDom()
        .append(createJiraChart());
      chartMenu.bind(dom);
      expect(menuItems(dom)).toEqual(['jira-chart', 'custom-chart']);
    });
    
    it ("appends its menu items to the DOM if the DOM is updated", function() {
      var dom = createDom();
      chartMenu.bind(dom);

      dom.append(createJiraChart());

      expect(menuItems(dom)).toEqual(['jira-chart', 'custom-chart']);
    });
	
    it ("appends its menu items to the DOM if the view mode is changed to Report", function() {
      // arrange
      var viewModeButton = createJiraViewModeButton();
      var dom = createDom()
        .append(viewModeButton)
        .append(createJiraChart());
      
      chartMenu.bind(dom);
      // as though the user switched to Plan or Work mode
      dom.find('#ghx-chart-nav').remove();
      
      dom.append(createJiraChart());
      expect(menuItems(dom)).toEqual(['jira-chart']);

      // act
      // as though the user swtiched to Report mode again
      dom.find('.aui-button').click();

      // assert
      expect(menuItems(dom)).toEqual(['jira-chart', 'custom-chart']);
    });
  });
  
  function menuItems(target) {
    return _($(target).find('#ghx-chart-nav li').toArray()).map(function(el) {
      return el.id;
    }).value();
  }
  
  function createDom() {
    return jasmine.getFixtures().set("<div>");
  }
  
  function createJiraChart() {
    return $("<ul id='ghx-chart-nav'><li id='jira-chart'></li></ul>");
  }
  
  function createJiraViewModeButton() {
    return $("<div id='ghx-view-modes'><a class='aui-button'>Reporting</a></div>");
  }
  
});
