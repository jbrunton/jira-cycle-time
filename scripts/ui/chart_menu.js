var _ = require('lodash');
var $ = require('jquery');
var Validator = require('../shared/validator');

function ChartMenu(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.charts, 'opts.charts');
    
  _.assign(this, opts);
  
  _.bindAll(this);
}

ChartMenu.prototype.bind = function(target) {
  // this._target = target;
  
  var jiraChartNav = $(target).find('#ghx-chart-nav');
  if (jiraChartNav.size()) {
    this.inflate(target);
  } else {
    var domNodeInserted = _.bind(function() {
      var jiraChartNav = $(target).find('#ghx-chart-nav');
      if (jiraChartNav.size()) {
        $(target).off('DOMNodeInserted', domNodeInserted);
        this.inflate(target);
      }      
    }, this);
    $(target).on('DOMNodeInserted', domNodeInserted);
  }
}

ChartMenu.prototype.inflate = function(target) {
  function createMenuItem(chart) {
    return $("<li id='" + chart.menuItemId + "' original-title=''><a href='#'>" + chart.title + "</a></li>");
  }
  
  var jiraChartNav = $(target).find('#ghx-chart-nav');
  _(this.charts).each(function(chart) {
    createMenuItem(chart).appendTo(jiraChartNav);
  });
}

module.exports = ChartMenu;
