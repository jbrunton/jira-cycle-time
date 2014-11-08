var _ = require('lodash');

var Validator = require('../shared/validator');

module.exports = BaseReport;

function BaseReport(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.jiraClient, 'JiraClient')
    .requires(opts.title, 'title');  
  
  _.assign(this, opts);
}

