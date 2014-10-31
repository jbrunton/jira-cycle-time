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
        .append(createJiraChartNav());
      chartMenu.bind(dom);
      expect(menuItems(dom)).toEqual(['jira-chart', 'custom-chart']);
    });
    
    it ("appends its menu items to the DOM if the DOM is updated", function() {
      var dom = createDom();
      chartMenu.bind(dom);

      dom.append(createJiraChartNav());

      expect(menuItems(dom)).toEqual(['jira-chart', 'custom-chart']);
    });
	
    it ("appends its menu items to the DOM if the view mode is changed to Report", function() {
      // arrange
      var dom = createDom()
        .append(createJiraChartNav());
      chartMenu.bind(dom);

      // switch to the 'Plan' view mode
      switchToViewMode(dom, 'plan');
      expect(menuItems(dom)).toEqual([]);

      // act
      // switch back to the 'Report' view mode
      switchToViewMode(dom, 'report');

      // assert
      // ensure we've added our custom charts back to the menu
      expect(menuItems(dom)).toEqual(['jira-chart', 'custom-chart']);
    });
    
    it ("highlights selected menu items", function() {
      var dom = createDom()
        .append(createJiraChartNav);
      chartMenu.bind(dom);
      
      var chartMenuItem = dom.find('#custom-chart');
      chartMenuItem.click();
      
      expect(chartMenuItem).toHaveClass('aui-nav-selected');
    });
  });
  
  function menuItems(target) {
    return _($(target).find('#ghx-chart-nav li').toArray()).map(function(el) {
      return el.id;
    }).value();
  }
  
  function createDom() {
    return jasmine.getFixtures().set("<div><div id='ghx-view-modes'><a id='plan' class='aui-button'>Plan</a><a id='report' class='aui-button'>Report</a></div></div>");
  }
  
  function createJiraChartNav() {
    return $("<ul id='ghx-chart-nav'><li id='jira-chart'></li></ul>");
  }
  
  function switchToViewMode(dom, buttonId) {
    dom.find('#ghx-chart-nav').remove();
    if (buttonId === 'report') {
      dom.append(createJiraChartNav());
    }
    dom.find('#' + buttonId + '.aui-button').click();
  }
});
