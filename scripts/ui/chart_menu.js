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
    this._appendMenuItems(target);
  } else {
    var waitForChartMenu = _.bind(function() {
      if (chartNavExists(target)) {
        $(target).off('DOMNodeInserted', waitForChartMenu);
        this._appendMenuItems(target);
      }      
    }, this);
    $(target).on('DOMNodeInserted', waitForChartMenu);
  }
}

ChartMenu.prototype._appendMenuItems = function(target) {
  findChartNav(target).append(this._inflateMenuItems());
}

ChartMenu.prototype._inflateMenuItems = function() {
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
