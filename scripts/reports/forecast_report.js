var $ = require('jquery');
var _ = require('lodash');
var Q = require('q');
var moment = require('moment');

var Class = require('../shared/class');
var BaseReport = require('./base_report');
var TimeChart = require('../ui/time_chart');
var computeCycleTimeSeries = require('../transforms/compute_cycle_time_series');
var computeWipSeries = require('../transforms/compute_wip_series');
var categorizeCycleTimeData = require('../transforms/categorize_cycle_time_data');
var forecastReportTemplate = require('./templates/forecast_report.hbs');
var Simulator = require('../simulator/simulator');
var Randomizer = require('../simulator/randomizer');
var FilterWidget = require('../ui/filter_widget');

module.exports = ForecastReport;

Class(ForecastReport).extends(BaseReport);

function ForecastReport(jiraClient) {
  BaseReport.call(this, {
    jiraClient: jiraClient,
    title: 'Epic Forecasting'
  });
}

ForecastReport.prototype.render = function(target) {
  var renderReport = _.bind(function(epics) {
    var content = forecastReportTemplate();
    $(target).append(content);
    
    var drawChart = _.bind(function() {
      var includedEpics = _(epics).filter(filter.includeEpic).value();
      var cycleTimeData = computeCycleTimeSeries(includedEpics);
      
      var sampleCycleTimeData = _(cycleTimeData).filter(filter.includeDatedItem).value();
      var sampleWipData = _(wipData).filter(filter.includeDatedItem).value();
      
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
    
      var backlogSize = {
        'S': Number(backlogSizeSmallInput.val()),
        'M': Number(backlogSizeMediumInput.val()),
        'L': Number(backlogSizeLargeInput.val())
      };
      var categorizedCycleTimeData = categorizeCycleTimeData(sampleCycleTimeData);
      
      var forecastSection = $(target).find('#forecast-output');
      forecastSection.empty();
      
      if (this._validateBacklog(forecastSection, backlogSize, categorizedCycleTimeData)) {
        var simulator = new Simulator(new Randomizer());
        var forecastResult = simulator.forecast({
          backlogSize: backlogSize,
          cycleTimeData: categorizedCycleTimeData,
          workInProgressData: sampleWipData
        });        
        var forecastTemplate = require('./templates/forecast_output.hbs');
        forecastSection.html(forecastTemplate(forecastResult));
      }      
    }, this);
    
    var filter = new FilterWidget({
      blur: drawChart
    });
    filter.bind($(target).find('#forecast-filter'));
    
    var wipData = computeWipSeries(epics);
    
    var backlogSizeSmallInput = $(target).find('#forecast-backlog-size-small');    
    var backlogSizeMediumInput = $(target).find('#forecast-backlog-size-medium');    
    var backlogSizeLargeInput = $(target).find('#forecast-backlog-size-large');    
    
    backlogSizeSmallInput.blur(drawChart);
    backlogSizeMediumInput.blur(drawChart);
    backlogSizeLargeInput.blur(drawChart);
    
    drawChart();
  }, this);

  return this.loadEpics(target).then(renderReport);  
}

ForecastReport.prototype._validateBacklog = function(forecastSection, backlogSize, categorizedCycleTimeData) {
  var validBacklog = true;
  _(['S', 'M', 'L']).each(function(epicSize) {
    if (backlogSize[epicSize] > 0 && categorizedCycleTimeData[epicSize].length === 0) {
      validBacklog = false;
      forecastSection.append("<div class='ghx-error'>Cannot forecast for [" + epicSize + "] epics as there were none in the sample set</div>");          
    }
  });
  return validBacklog;
};


