var $ = require('jquery');
var _ = require('lodash');

var Class = require('../shared/class');
var BaseReport = require('./base_report');

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
  var appendIssue = function(issue) {
    $(target).append('<p>' + issue.key + '</p>');
  };
  
  return this.jiraClient.search().then(function(issues) {
    _(issues).each(appendIssue);
  });
}

