var $ = require('jquery');
var _ = require('lodash');
var Q = require('q');
var moment = require('moment');

var Class = require('../shared/class');
var BaseReport = require('./base_report');
var TimeChart = require('../ui/time_chart');
var computeCycleTimeSeries = require('../transforms/compute_cycle_time_series');
var computeWipSeries = require('../transforms/compute_wip_series');
var forecastReportTemplate = require('./templates/forecast_report.hbs');
var Simulator = require('../simulator/simulator');
var Randomizer = require('../simulator/randomizer');

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
    var content = forecastReportTemplate();
    $(target).append(content);
    
    var cycleTimeData = computeCycleTimeSeries(epics);
    var wipData = computeWipSeries(epics);

    function drawChart() {
      var timeChart = new TimeChart();
      timeChart.addSeries({
        key: 'cycle_time',
        color: 'red',
        circle: true,
        axisOrientation: 'left',
        data: cycleTimeData  
      });
      timeChart.addSeries({
        key: 'wip',
        color: 'blue',
        axisOrientation: 'right',
        data: wipData
      });
      timeChart.draw($(target).find('#time-chart').get(0));      
    }
    drawChart();
    
    function forecast() {
      var backlogSize = Number(backlogSizeInput.val());
      var simulator = new Simulator(new Randomizer());
      var forecastResult = simulator.forecast({
        backlogSize: backlogSize,
        cycleTimeData: cycleTimeData,
        workInProgressData: wipData
      });
  
      var forecastTemplate = require('./templates/forecast_output.hbs');
      var forecastSection = $(target).find('#forecast-output');
      forecastSection.html(forecastTemplate(forecastResult));
    }
    
    var backlogSizeInput = $(target).find('#forecast-backlog-size');    
    backlogSizeInput.blur(forecast);
  };

  return this.jiraClient
    .getEpics()
    .then(loadEpics)
    .then(renderReport);
}

