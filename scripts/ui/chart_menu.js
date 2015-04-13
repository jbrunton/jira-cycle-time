var _ = require('lodash');
var $ = require('jquery');
var Validator = require('../shared/validator');
var menuItemTemplate = require('./templates/menu_item.hbs');

module.exports = ChartMenu;

function ChartMenu(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.menuItems, 'opts.menuItems');
    
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
  _.each(this.menuItems, this._appendMenuItem);
  var menuItemSelector = '#subnav-opts-report .subnav-section li';
  var menuItems = $(this._target).find(menuItemSelector);
  // menuItems.click(menuItemClickHandler);
  // findChartNav(this._target).append(menuItems);
  this._addListeners();
}

ChartMenu.prototype._appendMenuItem = function(chart) {
  var chartNav = findChartNav(this._target);
  var menuItem = this._findMenuItemFor(chart);
  if (menuItem.size() > 0) {
    chartNav.append(menuItem);
    menuItem.off('click.jira-cycle-time');
  } else {
    menuItem = $(menuItemTemplate(chart));
    chartNav.append(menuItem);
  }
  menuItem.on('click.jira-cycle-time', clickHandlerFor(chart));
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
  _.each(this.menuItems, function(chart) {
    if (target.find('#' + chart.menuItemId).size() === 0) {
      menuItems = menuItems.add($(menuItemTemplate(chart)));      
    }
  });
  return menuItems;
}

function clickHandlerFor(chart) {
  return function() {
    //$(this).closest('#subnav-opts-report').find('li.' + ChartMenu.SELECTED_CLASS).removeClass(ChartMenu.SELECTED_CLASS);
    //$(this).addClass(ChartMenu.SELECTED_CLASS);
    
    $('body').find('#ghx-chart-panel-content').hide();
    
    var content = $('<div>').appendTo($('body').find('.aui-page-panel-inner'));
  
    // var report = $('body').find('#ghx-report');
    // report.find('#ghx-chart-message').empty();
    // report.find('#ghx-chart-intro').empty();
    // report.find('#ghx-chart-selector').empty();
    // report.find('#ghx-chart-snapshot').empty();
    // report.find('#ghx-chart-content').empty();
    // report.find('#ghx-chart-header-secondary').hide();
    //
    // var title = report.find('#ghx-chart-title h2');
    // title.text(chart.report.title);
    //
    // var content = report.find('#ghx-chart-content');
    content.append("<p id='loading-indicator'></p>");
    //
    chart.report.render(content.get(0));
  }
}

function chartNavExists(target) {
  return findChartNav(target).size() > 0;
}

function findChartNav(target) {
  return $(target).find('#subnav-opts-report .subnav-section:first');
}

function findViewModeButtons(target) {
  return $(target).find('#ghx-view-modes .aui-button');
}
