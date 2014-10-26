var $ = require('jquery');

var ChartMenu = require('./ui/chart_menu');
var Chart = require('./ui/chart');


$(function() {
  var chart = new Chart({
    title: 'Test Chart',
    menuItemId: 'test-chart'
  });
	var chartMenu = new ChartMenu({
	  charts: [chart]
	})
  chartMenu.bind($("body"));
});
