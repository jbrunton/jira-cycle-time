var _ = require('lodash');
var Validator = require('../shared/validator');
var filterWidgetTemplate = require('./templates/filter_widget.hbs');

module.exports = FilterWidget;

function FilterWidget(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.blur, 'opts.blur');
    
  this._blurCallback = opts.blur;
  
  _.bindAll(this);
}

FilterWidget.prototype.bind = function(dom) {
  var blur = _.bind(function(e) {
    this._refreshFilter();
    this._blurCallback();
  }, this);
  
  this._widget = $(dom).html(filterWidgetTemplate());
  $(dom).find('input').blur(blur);
}

FilterWidget.prototype.includeEpic = function(epic) {
  return !_(this._excludedKeys).contains(epic.key);
}

FilterWidget.prototype._refreshFilter = function() {
  this._excludedKeys = this._widget.find('#forecast-exclusion-filter').val().split(',');
}