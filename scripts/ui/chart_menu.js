var _ = require('lodash');
var $ = require('jquery');
var Validator = require('../shared/validator');
var menuItemTemplate = require('./templates/menu_item.hbs');

module.exports = ChartMenu;

function ChartMenu(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.charts, 'opts.charts');
    
  _.assign(this, opts);
  
  _.bindAll(this);
}

ChartMenu.prototype.bind = function(target) {
  if (chartNavExists(target)) {
    this.appendMenuItems(target);
  } else {
    var waitForChartMenu = _.bind(function() {
      if (chartNavExists(target)) {
        $(target).off('DOMNodeInserted', waitForChartMenu);
        this.appendMenuItems(target);
      }      
    }, this);
    $(target).on('DOMNodeInserted', waitForChartMenu);
  }
}

ChartMenu.prototype.appendMenuItems = function(target) {
  findChartNav(target).append(this.inflateMenuItems());
}

ChartMenu.prototype.inflateMenuItems = function() {
  return _.map(this.charts, function(chart) {
    return $(menuItemTemplate(chart));
  });
}

function chartNavExists(target) {
  return findChartNav(target).size() > 0;
}

function findChartNav(target) {
  return $(target).find('#ghx-chart-nav');
}
