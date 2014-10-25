var Validator = require('../shared/validator');
var _ = require('lodash');

function Chart(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.title, 'opts.title');
  
  _.assign(this, opts);
}

module.exports = Chart;
