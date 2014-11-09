var $ = require('jquery');
var _ = require('lodash');
var Q = require('q');
var moment = require('moment');

var Class = require('../shared/class');
var BaseReport = require('./base_report');
var TimeChart = require('../ui/time_chart');
// var forecastReportTemplate = require('./templates/events_report.hbs');

module.exports = ForecastReport;

Class(ForecastReport).extends(BaseReport);

function ForecastReport(jiraClient) {
  BaseReport.call(this, {
    jiraClient: jiraClient,
    title: 'Forecast Report'
  });
}

ForecastReport.prototype.render = function(target) {
  var loadEpics = function(epics) {
    return Q.all(
        _(epics).map(function(epic) {
          return epic.load();
        }).value()
      );
  };
  
  var renderReport = function(epics) {
    var timeChart = new TimeChart();
    /*timeChart.addSeries({
      key: 'wip',
      color: 'blue',
      axisOrientation: 'right',
      data: [
        {date: moment(), value: 2},
        {date: moment().add(1, 'day'), value: 3},
        {date: moment().add(2, 'days'), value: 1}
      ]
    });*/
    var cycleTimeData = _(epics)
      .filter(function(epic) {
        return !!epic.completedDate;
      })
      .map(function(epic) {
        return {
          date: epic.completedDate,
          value: epic.cycleTime,
          epic: epic
        };
      })
      .sortBy(function(value) {
        return value.date.valueOf();
      })
      .value();
    timeChart.addSeries({
      key: 'cycle_time',
      color: 'red',
      circle: true,
      axisOrientation: 'left',
      data: cycleTimeData  
    });
    timeChart.draw(target);
    // var events = computeEvents(epics);
//     $(target).append(
//       eventsReportTemplate({ events: events })
//     );
  };

  return this.jiraClient
    .getEpics()
    .then(loadEpics)
    .then(renderReport);
}

