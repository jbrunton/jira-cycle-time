var $ = require('jquery');
var _ = require('lodash');
var Q = require('q');

var Class = require('../shared/class');
var BaseReport = require('./base_report');
var FilterWidget = require('../ui/filter_widget');
var TimeChart = require('../ui/time_chart');
var computeCycleTimeSeries = require('../transforms/compute_cycle_time_series');
var categorizeCycleTimeData = require('../transforms/categorize_cycle_time_data');
var stdDev = require('../transforms/std_dev');
var computeWipSeries = require('../transforms/compute_wip_series');
var epicsBySizeTemplate = require('./templates/epics_by_size.hbs');
var epicReportTemplate = require('./templates/epic_report.hbs');

module.exports = EpicReport;

Class(EpicReport).extends(BaseReport);

function EpicReport(jiraClient) {
  BaseReport.call(this, {
    jiraClient: jiraClient,
    title: 'Epic Cycle Time'
  });
}

EpicReport.prototype.render = function(target) {
  function renderReport(epics) {
    $(target).html(epicReportTemplate());
    
    var wipData = computeWipSeries(epics);
  
    var refreshReport = function() {
      var includedEpics = _(epics).filter(filter.includeEpic).value();
      var epicsBySize = categorizeCycleTimeData(computeCycleTimeSeries(includedEpics));
      _(['S', 'M', 'L']).each(function(size) {
        epicsBySize[size] = _.map(epicsBySize[size], function(x) {
          return x.epic;
        });
      });
      $(target).find('#epics-by-size-holder').html(
        epicsBySizeTemplate(epicsBySize)
      );
      
      var cycleTimeData = computeCycleTimeSeries(includedEpics);
      
      var sampleCycleTimeData = _(cycleTimeData).filter(filter.includeDatedItem).value();
      var sampleWipData = _(wipData).filter(filter.includeDatedItem).value();
      
      var meanCycleTime = _(sampleCycleTimeData).reduce(function(sum, item) {
        return sum + item.value;
      }, 0) / sampleCycleTimeData.length;
      $(target).find('#mean-cycle-time').text(meanCycleTime.toFixed(2));
      
      var stddev = stdDev(sampleCycleTimeData.map(function(item) {
        return item.value;
      }));
      $(target).find('#cycle-time-stddev').text(stddev.toFixed(2));
      
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
      timeChart.draw($(target).find('#cycle-time-chart-holder').empty().get(0));
    };
  
    var filter = new FilterWidget({
      blur: refreshReport
    });
    filter.bind($(target).find('#filter-holder'));    
    
    refreshReport();
  }

  return this.loadEpics(target).then(renderReport);  
}

