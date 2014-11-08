var $ = require('jquery');

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
  $(target).html('<p>' + EpicReport.CHART_CONTENT + '</p>');
}
