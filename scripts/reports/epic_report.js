var $ = require('jquery');
var _ = require('lodash');
var Q = require('q');

var Class = require('../shared/class');
var BaseReport = require('./base_report');
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
    $(target).append(
      epicReportTemplate({ epics: epics })
    );    
  };
  
  return this.loadEpics(target).then(renderReport);  
}

