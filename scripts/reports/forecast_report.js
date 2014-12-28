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
  var renderReport = function(epics) {
    var content = forecastReportTemplate();
    $(target).append(content);
    
    var filter = new FilterWidget({
      blur: render
    });
    filter.bind($(target).find('#forecast-filter'));
    
    //var cycleTimeData = computeCycleTimeSeries(epics);
    //var wipData = computeWipSeries(epics);
    
    var wipData = computeWipSeries(epics);
    
    var backlogSizeSmallInput = $(target).find('#forecast-backlog-size-small');    
    var backlogSizeMediumInput = $(target).find('#forecast-backlog-size-medium');    
    var backlogSizeLargeInput = $(target).find('#forecast-backlog-size-large');    
    backlogSizeSmallInput.blur(render);
    backlogSizeMediumInput.blur(render);
    backlogSizeLargeInput.blur(render);
    
    
    function render() {
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
    
      var simulator = new Simulator(new Randomizer());
      var backlogSize = {
        'S': Number(backlogSizeSmallInput.val()),
        'M': Number(backlogSizeMediumInput.val()),
        'L': Number(backlogSizeLargeInput.val())
      };
      var categorizedCycleTimeData = categorizeCycleTimeData(sampleCycleTimeData);
      var forecastResult = simulator.forecast({
        backlogSize: backlogSize,
        cycleTimeData: categorizedCycleTimeData,
        workInProgressData: sampleWipData
      });

      var forecastTemplate = require('./templates/forecast_output.hbs');
      var forecastSection = $(target).find('#forecast-output');
      forecastSection.html(forecastTemplate(forecastResult));
    }
    
    render();
  };

  return this.loadEpics(target).then(renderReport);  
}

