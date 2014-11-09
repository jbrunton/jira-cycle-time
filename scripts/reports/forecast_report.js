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
  var indicator = $("<p>Loading epics...</p>").appendTo(target);
  
  var loadEpics = function(epics) {
    var loaded = 0;
    return Q.all(
        _(epics).map(function(epic) {
          return epic.load().then(function(epic) {
            ++loaded;
            indicator.text('Loaded ' + loaded + ' of ' + epics.length);
            return epic;
          });
        }).value()
      );
  };
  
  var renderReport = function(epics) {
    indicator.remove();
    var content = forecastReportTemplate();
    $(target).append(content);
    
    //var cycleTimeData = computeCycleTimeSeries(epics);
    //var wipData = computeWipSeries(epics);
    
    var wipData = computeWipSeries(epics);
    
    
    var backlogSizeInput = $(target).find('#forecast-backlog-size');    
    var exclusionFilterInput = $(target).find('#forecast-exclusion-filter');    
    var sampleStartDateInput = $(target).find('#forecast-sample-start-date');
    var sampleEndDateInput = $(target).find('#forecast-sample-end-date');
    backlogSizeInput.blur(render);
    exclusionFilterInput.blur(render);
    sampleStartDateInput.blur(render);
    sampleEndDateInput.blur(render);
    
    function render() {
      var startDate = wipData[0].date.clone(),
        endDate = wipData[wipData.length - 1].date.clone();
        
      var sampleStartDate = moment(sampleStartDateInput.val()),
        sampleEndDate = moment(sampleEndDateInput.val());
      if (sampleStartDate.isValid()) {
        startDate = sampleStartDate;
      }
      if (sampleEndDate.isValid()) {
        endDate = sampleEndDate;
      }
        
      var dateExclusionFilter = function(datum) {
        return !datum.date.isBefore(startDate)
          && !datum.date.isAfter(endDate);
      };
      var epicExclusionKeys = exclusionFilterInput.val().split(',');
      var epicExclusionFilter = function(epic) {
        return !_(epicExclusionKeys).contains(epic.key);
      };
      
      var includedEpics = _(epics).filter(epicExclusionFilter).value();
      var cycleTimeData = computeCycleTimeSeries(includedEpics);
      
      var sampleCycleTimeData = _(cycleTimeData).filter(dateExclusionFilter).value();
      var sampleWipData = _(wipData).filter(dateExclusionFilter).value();
      
      var timeChart = new TimeChart();
      timeChart.addSeries({
        key: 'cycle_time',
        color: 'red',
        circle: true,
        axisOrientation: 'left',
        data: sampleCycleTimeData  
      });
      timeChart.addSeries({
        key: 'wip',
        color: 'blue',
        axisOrientation: 'right',
        data: sampleWipData
      });
      timeChart.draw($(target).find('#time-chart').empty().get(0));      
    
      var backlogSize = Number(backlogSizeInput.val());
      var simulator = new Simulator(new Randomizer());
      var forecastResult = simulator.forecast({
        backlogSize: backlogSize,
        cycleTimeData: sampleCycleTimeData,
        workInProgressData: sampleWipData
      });

      var forecastTemplate = require('./templates/forecast_output.hbs');
      var forecastSection = $(target).find('#forecast-output');
      forecastSection.html(forecastTemplate(forecastResult));
    }
    
    render();
  };

  return this.jiraClient
    .getEpics()
    .then(loadEpics)
    .then(renderReport);
}

