var _ = require('lodash');
var Validator = require('../shared/validator');

function ChartMenu(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.charts, 'opts.charts');
    
  _.assign(this, opts);
}

ChartMenu.prototype.bind = function(target) {
  function createMenuItem(chart) {
    return $("<li id='" + chart.menuItemId + "' original-title=''><a href='#'>" + chart.title + "</a></li>");
  }
  
  var jiraChartNav = $(target).find('#ghx-chart-nav');
  
  _(this.charts).each(function(chart) {
    createMenuItem(chart).appendTo(jiraChartNav);
  });
}

module.exports = ChartMenu;
