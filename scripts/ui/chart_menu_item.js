var _ = require('lodash');
var Validator = require('../shared/validator');

module.exports = ChartMenuItem;

function ChartMenuItem(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.report, 'opts.report')
    .requires(opts.menuItemId, 'opts.menuItemId')
    .requires(opts.tooltip, 'opts.tooltip');
  
  _.assign(this, opts);
}
