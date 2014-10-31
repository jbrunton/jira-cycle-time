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
  this._target = target;
  if (chartNavExists(this._target)) {
    this._appendMenuItems();
  } else {
    var waitForChartMenu = _.bind(function() {
      if (chartNavExists(this._target)) {
        $(target).off('DOMNodeInserted', waitForChartMenu);
        this._appendMenuItems();
      }      
    }, this);
    $(target).on('DOMNodeInserted', waitForChartMenu);
  }
}

ChartMenu.prototype._appendMenuItems = function() {
  var menuItems = this._inflateMenuItems();
  _(menuItems).each(function(menuItem) {
    menuItem.click(function() {
      var selectedClass = 'aui-nav-selected';
      var menuItemSelector = '#ghx-chart-nav li';
      $(this).closest(menuItemSelector).addClass(selectedClass);      
    });
  });
  findChartNav(this._target).append(menuItems);
  this._configureListeners();
}

ChartMenu.prototype._configureListeners = function() {
  findViewModeButtons(this._target).off('click', this._appendMenuItems);
  findViewModeButtons(this._target).on('click', this._appendMenuItems);
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

function findViewModeButtons(target) {
  return $(target).find('#ghx-view-modes .aui-button');
}
