var _ = require('lodash');
var Validator = require('../shared/validator');

function Chart(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.title, 'opts.title')
    .requires(opts.menuItemId, 'opts.menuItemId');
  
  _.assign(this, opts);
}

module.exports = Chart;
