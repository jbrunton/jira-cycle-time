var Validator = require('../shared/validator');

module.exports = EpicReport;

function EpicReport(jiraClient) {
  new Validator()
    .requires(jiraClient, 'JiraClient');
  
  this._jiraClient = jiraClient;
}

EpicReport.CHART_TITLE_SELECTOR = '#ghx-chart-title h2';
EpicReport.CHART_TITLE = 'Epic Cycle Time';

EpicReport.prototype.render = function(target) {
  $(target).find(EpicReport.CHART_TITLE_SELECTOR).text(EpicReport.CHART_TITLE);
}
