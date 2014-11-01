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

ChartMenu.SELECTED_CLASS = 'aui-nav-selected';

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
  this._removeListeners();
  _.each(this.charts, this._appendMenuItem);
  var menuItemSelector = '#ghx-chart-nav li';
  var menuItems = $(this._target).find(menuItemSelector);
  menuItems.click(function() {
    $(this).closest('#ghx-chart-nav').find('li.' + ChartMenu.SELECTED_CLASS).removeClass(ChartMenu.SELECTED_CLASS);
    $(this).closest(menuItemSelector).addClass(ChartMenu.SELECTED_CLASS);      
    $(this).closest('#ghx-report').find('#ghx-chart-message').empty();
    $(this).closest('#ghx-report').find('#ghx-chart-intro').empty();
    $(this).closest('#ghx-report').find('#ghx-chart-header').empty();
    $(this).closest('#ghx-report').find('#ghx-chart-content').empty();
  });
  findChartNav(this._target).append(menuItems);
  this._addListeners();
}

ChartMenu.prototype._appendMenuItem = function(chart) {
  var chartNav = findChartNav(this._target);
  var menuItem = this._findMenuItemFor(chart);
  if (menuItem.size() > 0) {
    chartNav.append(menuItem);
  } else {
    menuItem = menuItemTemplate(chart);
    chartNav.append(menuItem);
  }
}

ChartMenu.prototype._findMenuItemFor = function(chart) {
  return findChartNav(this._target).find('li#' + chart.menuItemId);
}

ChartMenu.prototype._removeListeners = function() {
  findViewModeButtons(this._target).off('click', this._appendMenuItems);
  findChartNav(this._target).off('DOMNodeInserted', this._appendMenuItems);  
}

ChartMenu.prototype._addListeners = function() {
  findViewModeButtons(this._target).on('click', this._appendMenuItems);
  findChartNav(this._target).on('DOMNodeInserted', this._appendMenuItems);
}

ChartMenu.prototype._inflateMenuItems = function() {
  var menuItems = $();
  var target = this._target;
  _.each(this.charts, function(chart) {
    if (target.find('#' + chart.menuItemId).size() === 0) {
      menuItems = menuItems.add($(menuItemTemplate(chart)));      
    }
  });
  return menuItems;
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
