var _ = require('lodash');
var $ = require('jquery');
var moment = require('moment');

var Validator = require('../shared/validator');
var filterWidgetTemplate = require('./templates/filter_widget.hbs');

module.exports = FilterWidget;

function FilterWidget(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.blur, 'opts.blur');
    
  this._blurCallback = opts.blur;
  
  // initialize with invalid dates
  this._sampleStart = moment('');
  this._sampleEnd = moment('');
  
  _.bindAll(this);
}

FilterWidget.prototype.bind = function(dom) {
  var blur = _.bind(function(e) {
    this._refreshFilter();
    this._blurCallback();
    $.cookie('jira-cycle-time-filter',
      {
        excludedKeys: this._widget.find('#forecast-exclusion-filter').val(),
        sampleStartDate: this._widget.find('#forecast-sample-start-date').val(),
        sampleEndDate: this._widget.find('#forecast-sample-end-date').val()
      },
      { expires: 9999 }
    );
  }, this);
  
  this._widget = $(dom).html(filterWidgetTemplate());
  
  var cookie = $.cookie('jira-cycle-time-filter');
  if (cookie) {
    this._widget.find('#forecast-exclusion-filter').val(cookie.excludedKeys);
    this._widget.find('#forecast-sample-start-date').val(cookie.sampleStartDate);
    this._widget.find('#forecast-sample-end-date').val(cookie.sampleEndDate);
  }
  
  $(dom).find('input').blur(blur);
}

FilterWidget.prototype.includeEpic = function(epic) {
  return !_(this._excludedKeys).contains(epic.key);
}

FilterWidget.prototype.includeDatedItem = function(item) {
  return (!this._sampleStart.isValid() || this._sampleStart.isBefore(item.date))
    && (!this._sampleEnd.isValid() || this._sampleEnd.isAfter(item.date));
}

FilterWidget.prototype._refreshFilter = function() {
  this._excludedKeys = this._widget.find('#forecast-exclusion-filter').val().split(',');
  this._sampleStart = moment(this._widget.find('#forecast-sample-start-date').val());
  this._sampleEnd = moment(this._widget.find('#forecast-sample-end-date').val());
}