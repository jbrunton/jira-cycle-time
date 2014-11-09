var $ = require('jquery');

var ChartMenu = require('./ui/chart_menu');
var ChartMenuItem = require('./ui/chart_menu_item');
var EpicReport = require('./reports/epic_report');
var EventsReport = require('./reports/events_report');
var ForecastReport = require('./reports/forecast_report');
var JiraClient = require('./jira/jira_client');


$(function() {
  var jiraClient = new JiraClient({
    domain: window.location.origin
  });
  var chartMenu = new ChartMenu({
    menuItems: [
      new ChartMenuItem({
        menuItemId: 'epic-cycle-time',
        report: new EpicReport(jiraClient)
      }),
      new ChartMenuItem({
        menuItemId: 'events-report',
        report: new EventsReport(jiraClient)
      }),
      new ChartMenuItem({
        menuItemId: 'forecast-report',
        report: new ForecastReport(jiraClient)
      })
    ]
  })
  chartMenu.bind($("body"));
});
