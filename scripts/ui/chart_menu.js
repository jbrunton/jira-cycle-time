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
  if (chartNavExists(target)) {
    this.inflate(target);
  } else {
    var waitForChartMenu = _.bind(function() {
      if (chartNavExists(target)) {
        $(target).off('DOMNodeInserted', waitForChartMenu);
        this.inflate(target);
      }      
    }, this);
    $(target).on('DOMNodeInserted', waitForChartMenu);
  }
}

ChartMenu.prototype.inflate = function(target) {
  function createMenuItem(chart) {
    return $("<li id='" + chart.menuItemId + "' original-title=''><a href='#'>" + chart.title + "</a></li>");
  }
  
  var jiraChartNav = findChartNav(target);
  _(this.charts).each(function(chart) {
    createMenuItem(chart).appendTo(jiraChartNav);
  });
}

function chartNavExists(target) {
  return findChartNav(target).size() > 0;
}

function findChartNav(target) {
  return $(target).find('#ghx-chart-nav');
}

module.exports = ChartMenu;
