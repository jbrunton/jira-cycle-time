var $ = require('jquery');

var ChartMenu = require('./ui/chart_menu');
var Chart = require('./ui/chart');
var EpicReport = require('./reports/epic_report');
var JiraClient = require('./jira/jira_client');


$(function() {
  var jiraClient = new JiraClient({
    domain: 'https://jbrunton.atlassien.net'
  });
  var chart = new Chart({
    menuItemId: 'test-chart',
    report: new EpicReport(jiraClient)
  });
  var chartMenu = new ChartMenu({
    charts: [chart]
  })
  chartMenu.bind($("body"));
});
