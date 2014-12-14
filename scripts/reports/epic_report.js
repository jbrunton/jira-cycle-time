var $ = require('jquery');
var _ = require('lodash');
var Q = require('q');

var Class = require('../shared/class');
var BaseReport = require('./base_report');
var computeCycleTimeSeries = require('../transforms/compute_cycle_time_series');
var categorizeCycleTimeData = require('../transforms/categorize_cycle_time_data');
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
  var renderReport = function(epics) {
    var epicsBySize = categorizeCycleTimeData(computeCycleTimeSeries(epics));
    _(['S', 'M', 'L']).each(function(size) {
      epicsBySize[size] = _.map(epicsBySize[size], function(x) {
        return x.epic;
      });
    });
    $(target).append(
      epicReportTemplate(epicsBySize)
    );    
  };
  
  return this.loadEpics(target).then(renderReport);  
}

