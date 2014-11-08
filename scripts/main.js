var $ = require('jquery');

var ChartMenu = require('./ui/chart_menu');
var ChartMenuItem = require('./ui/chart_menu_item');
var EpicReport = require('./reports/epic_report');
var JiraClient = require('./jira/jira_client');


$(function() {
  var jiraClient = new JiraClient({
    domain: 'https://jbrunton.atlassian.net'
  });
  var chartMenuItem = new ChartMenuItem({
    menuItemId: 'test-chart',
    report: new EpicReport(jiraClient)
  });
  var chartMenu = new ChartMenu({
    menuItems: [chartMenuItem]
  })
  chartMenu.bind($("body"));
});
