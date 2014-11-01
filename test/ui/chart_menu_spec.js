var ChartMenu = require('../../scripts/ui/chart_menu');
var Chart = require('../../scripts/ui/chart');
var Validator = require('../../scripts/shared/validator');

describe ('ChartMenu', function() {
  var dom, chartMenu, chart, validOpts,
    JIRA_CHART_MENU_ITEM_ID = 'jira-chart',
    CUSTOM_CHART_MENU_ITEM_ID = 'custom-chart';
  
  
  beforeEach (function() {
    chart = new Chart({
      title: 'Some Chart',
      menuItemId: CUSTOM_CHART_MENU_ITEM_ID
    });

    validOpts = {
      charts: [chart]
    };
    
    chartMenu = new ChartMenu(validOpts);

    dom = createDom();
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
      dom.append(createJiraChartNav());
      chartMenu.bind(dom);
      expect(menuItems()).toEqual([JIRA_CHART_MENU_ITEM_ID, CUSTOM_CHART_MENU_ITEM_ID]);
    });
    
    it ("appends its menu items to the DOM if the DOM is updated", function() {
      chartMenu.bind(dom);
      dom.append(createJiraChartNav());
      expect(menuItems()).toEqual([JIRA_CHART_MENU_ITEM_ID, CUSTOM_CHART_MENU_ITEM_ID]);
    });
	
    it ("appends its menu items to the DOM if the view mode is changed to Report", function() {
      // arrange
      dom.append(createJiraChartNav());
      chartMenu.bind(dom);

      // switch to the 'Plan' view mode
      switchToViewMode('plan');
      expect(menuItems()).toEqual([]);

      // act
      // switch back to the 'Report' view mode
      switchToViewMode('report');

      // assert
      // ensure we've added our custom charts back to the menu
      expect(menuItems()).toEqual([JIRA_CHART_MENU_ITEM_ID, CUSTOM_CHART_MENU_ITEM_ID]);
    });
    
    it ("highlights selected menu items", function() {
      dom.append(createJiraChartNav);
      chartMenu.bind(dom);
      
      var chartMenuItem = findById(CUSTOM_CHART_MENU_ITEM_ID),
        jiraMenuItem = findById(JIRA_CHART_MENU_ITEM_ID);
      chartMenuItem.click();
      
      expect(chartMenuItem).toHaveClass(ChartMenu.SELECTED_CLASS);
      expect(jiraMenuItem).not.toHaveClass(ChartMenu.SELECTED_CLASS);
    });
  });
  
  function menuItems() {
    return _($(dom).find('#ghx-chart-nav li').toArray()).map(function(el) {
      return el.id;
    }).value();
  }
  
  function findById(id) {
    return dom.find('#' + id);
  }
  
  function createDom() {
    return jasmine.getFixtures().set("<div><div id='ghx-view-modes'><a id='plan' class='aui-button'>Plan</a><a id='report' class='aui-button'>Report</a></div></div>");
  }
  
  function createJiraChartNav() {
    return $("<ul id='ghx-chart-nav'><li id='" + JIRA_CHART_MENU_ITEM_ID + "' class='aui-nav-selected'></li></ul>");
  }
  
  function switchToViewMode(buttonId) {
    dom.find('#ghx-chart-nav').remove();
    if (buttonId === 'report') {
      dom.append(createJiraChartNav());
    }
    dom.find('#' + buttonId + '.aui-button').click();
  }
});
