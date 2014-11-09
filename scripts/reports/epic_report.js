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
  var getEpics = function(rapidView) {
    return rapidView.getEpics();
  };
  
  var loadEpics = function(epics) {
    return Q.all(
        _(epics).map(function(epic) {
          return epic.load();
        }).value()
      );
  };
  
  var renderReport = function(epics) {
    $(target).append(
      epicReportTemplate({ epics: epics })
    );    
  };

  return this.jiraClient
    .getCurrentRapidView()
    .then(getEpics)
    .then(loadEpics)
    .then(renderReport);
}

