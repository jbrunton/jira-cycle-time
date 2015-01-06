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

FilterWidget.EXCLUSION_FILTER_ID = 'forecast-exclusion-filter';
FilterWidget.SAMPLE_START_DATE_ID = 'forecast-sample-start-date';
FilterWidget.SAMPLE_END_DATE_ID = 'forecast-sample-end-date';

FilterWidget.prototype.bind = function(dom) {
  var filterChanged = _.bind(function(e) {
    this._refreshFilter();
    this._saveFilterCookie();
    this._blurCallback();
  }, this);
  
  this._inflateLayout(dom);
  this._readFilterCookie();
  
  $(dom).find('input').blur(filterChanged);
  
  var filterShortcutApplied = _.bind(function(e) {
    var monthsOffset = $(e.target).data('months');
    var sampleStart = moment().subtract(monthsOffset, 'months');
    this._sampleEndDateInput.val('');
    this._sampleStartDateInput.val(sampleStart.format('D MMM YYYY')).blur();
  }, this);

  $(dom).find('button.filter-shortcut').click(filterShortcutApplied);
}

FilterWidget.prototype.includeEpic = function(epic) {
  return !_(this._excludedKeys).contains(epic.key)
    && this._includeDatedItem(epic, 'completedDate');
}

FilterWidget.prototype.includeDatedItem = function(item) {
  return this._includeDatedItem(item, 'date');
}

FilterWidget.prototype._includeDatedItem = function(item, dateField) {
return (!this._sampleStart.isValid() || this._sampleStart.isBefore(item[dateField]))
  && (!this._sampleEnd.isValid() || this._sampleEnd.isAfter(item[dateField]));  
};

FilterWidget.prototype._inflateLayout = function(dom) {
  var widget = $(dom).html(filterWidgetTemplate());
  this._exclusionFilterInput = widget.find('#' + FilterWidget.EXCLUSION_FILTER_ID);
  this._sampleStartDateInput = widget.find('#' + FilterWidget.SAMPLE_START_DATE_ID);
  this._sampleEndDateInput = widget.find('#' + FilterWidget.SAMPLE_END_DATE_ID);
}

FilterWidget.prototype._saveFilterCookie = function() {
  $.cookie('jira-cycle-time-filter',
    {
      excludedKeys: this._exclusionFilterInput.val(),
      sampleStartDate: this._sampleStartDateInput.val(),
      sampleEndDate: this._sampleEndDateInput.val()
    },
    { expires: 9999 }
  );
}

FilterWidget.prototype._readFilterCookie = function() {
  var cookie = $.cookie('jira-cycle-time-filter');
  if (cookie) {
    this._exclusionFilterInput.val(cookie.excludedKeys);
    this._sampleStartDateInput.val(cookie.sampleStartDate);
    this._sampleEndDateInput.val(cookie.sampleEndDate);
    this._refreshFilter();
  }
}

FilterWidget.prototype._refreshFilter = function() {
  this._excludedKeys = this._exclusionFilterInput.val().split(',');
  this._sampleStart = moment(this._sampleStartDateInput.val());
  this._sampleEnd = moment(this._sampleEndDateInput.val());
}
