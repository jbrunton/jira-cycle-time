var ChartMenu = require('../../scripts/ui/chart_menu');
var Chart = require('../../scripts/ui/chart');
var Validator = require('../../scripts/shared/validator');
var menuItemTemplate = require('../../scripts/ui/templates/menu_item.hbs');

describe ('ChartMenu', function() {
  var dom, chartMenu, chart, validOpts,
    JIRA_CHART_MENU_ITEM_ID = 'jira-chart',
    CUSTOM_CHART_MENU_ITEM_ID = 'custom-chart';
  
  
  beforeEach (function() {
    chart = new Chart({
      menuItemId: CUSTOM_CHART_MENU_ITEM_ID,
      report: {
        title: 'Some Chart',
        render: function(content) {
          $(content).html('<p>Custom Content</p>')
        }
      }
    });

    validOpts = {
      charts: [chart]
    };
    
    chartMenu = new ChartMenu(validOpts);

    dom = createEmptyReport();
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
      appendChartNav();
      chartMenu.bind(dom);
      expect(customChartMenuItem()).toExist();
      expect(customChartMenuItem()).toContainText('Some Chart');
    });
    
    it ("appends its menu items to the DOM if the DOM is updated", function() {
      chartMenu.bind(dom);
      appendChartNav();
      expect(customChartMenuItem()).toExist();
    });
	
    it ("appends its menu items to the DOM if the view mode is changed to Report", function() {
      // arrange
      appendChartNav();
      chartMenu.bind(dom);

      // switch to the 'Plan' view mode
      switchToViewMode('plan');
      expect(customChartMenuItem()).not.toExist();

      // act
      // switch back to the 'Report' view mode
      switchToViewMode('report');

      // assert
      // ensure we've added our custom charts back to the menu
      expect(customChartMenuItem()).toExist();
    });
    
    it ("appends its menu items to the DOM in the right order if the navigation menu is updated", function() {
      var chartNav = createJiraChartNav();
      dom.append(chartNav);
      chartMenu.bind(dom);
      
      chartNav.html(createJiraChartMenuItem());
      chartNav.append(createJiraChartMenuItem('other-id'));
      
      expect(customChartMenuItem()).toExist();
      expect(menuItems()).toEqual([JIRA_CHART_MENU_ITEM_ID, 'other-id', CUSTOM_CHART_MENU_ITEM_ID]);
    });
  });
  
  describe ("#click", function() {
    it ("highlights selected menu items", function() {
      appendChartNav();
      chartMenu.bind(dom);
      var customMenuItem = customChartMenuItem(),
        jiraMenuItem = jiraChartMenuItem();

      customMenuItem.click();
      
      expect(customMenuItem).toHaveClass(ChartMenu.SELECTED_CLASS);
      expect(jiraMenuItem).not.toHaveClass(ChartMenu.SELECTED_CLASS);
    });
    
    it ("prepares the report sections", function() {
      appendChartNav();
      chartMenu.bind(dom);
      
      customChartMenuItem().click();
      
      expect(dom.find('#ghx-chart-message')).toBeEmpty();
      expect(dom.find('#ghx-chart-intro')).toBeEmpty();
    });
    
    it ("renders the custom chart", function() {
      appendChartNav();
      chartMenu.bind(dom);
      
      customChartMenuItem().click();
      
      expect(dom.find('#ghx-chart-content')).toContainText('Custom Content');
    });
  });
  
  function findById(id) {
    return dom.find('#' + id);
  }
  
  function appendChartNav() {
    dom.find('#ghx-report').append(createJiraChartNav());
  }
  
  function createJiraChartNav() {
    return $("<ul id='ghx-chart-nav'></ul>");
  }
  
  function createJiraChartMenuItem(id) {
    id = id || JIRA_CHART_MENU_ITEM_ID;
    return $("<li id='" + id + "' class='aui-nav-selected'></li>");
  }
  
  function menuItems() {
    return _($(dom).find('#ghx-chart-nav li').toArray()).map(function(el) {
      return el.id;
    }).value();
  }
  
  function jiraChartMenuItem() {
    return findById(JIRA_CHART_MENU_ITEM_ID);
  }
  
  function customChartMenuItem() {
    return findById(CUSTOM_CHART_MENU_ITEM_ID);
  }
  
  function switchToViewMode(buttonId) {
    dom.find('#ghx-chart-nav').remove();
    if (buttonId === 'report') {
      dom.append(createJiraChartNav());
    }
    dom.find('#' + buttonId + '.aui-button').click();
  }
});
