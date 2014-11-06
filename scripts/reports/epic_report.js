var Validator = require('../shared/validator');

module.exports = EpicReport;

function EpicReport(jiraClient) {
  new Validator()
    .requires(jiraClient, 'JiraClient');
  
  this._jiraClient = jiraClient;
}

EpicReport.prototype.render = function(target) {
  $('#ghx-chart-title').html('<h2>Epic Cycle Time</h2>');
}
