var $ = require('jquery');
var _ = require('lodash');

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

EpicReport.CHART_CONTENT = 'Hello';

EpicReport.prototype.render = function(target) {
  return this.jiraClient.getEpics().then(function(epics) {
    $(target).append(epicReportTemplate({
      epics: epics
    }));
  });
}

