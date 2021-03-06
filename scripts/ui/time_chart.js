var _ = require('lodash');
var d3 = require('d3');
var moment = require('moment');
var $ = require('jquery');

function TimeChart() {
  this._series = [];
  _.bindAll(this);
}

TimeChart.prototype.addSeries = function(series) {
  this._series.push(series);
}

TimeChart.prototype.getSeries = function(key) {
  return _(this._series).find(function(series) {
    return series.key == key;
  });
}

TimeChart.prototype.getXDomain = function() {
  if (!this._xDomain) {
    function momentEpoch(moment) {
      return moment.valueOf();
    }

    var seriesDomains = _(this._series)
      .map(function(series) {
        var seriesDates = _(series.data)
          .pluck('date');

        return {
          startDate: _(seriesDates)
            .min(momentEpoch)
            .value(),
          endDate: _(seriesDates)
            .max(momentEpoch)
            .value()
        };
      });

    var startDate = seriesDomains
      .pluck('startDate')
      .min(momentEpoch)
      .value();

    var endDate = seriesDomains
      .pluck('endDate')
      .max(momentEpoch)
      .value();
      
    if (moment(startDate).isValid() && moment(endDate).isValid()) {
      this._xDomain = [
        startDate.clone().add('days', -1),
        endDate.clone().add('days', 1)
      ];
    } else {
      // this may happen if all the series are empty
      this._xDomain = [
        moment().add('days', -1),
        moment().add('days', 1)
      ];
    }
  }

  return this._xDomain;
}

TimeChart.prototype.draw = function(target) {
  var w = $(target).width();
	var h = w * 0.4;
	var padding = 60;
	
	
	var xScale = d3.time.scale()
	  .domain(this.getXDomain())
		.range([padding, w - padding * 2]);

	var xAxis = d3.svg.axis()
	  .scale(xScale)
	  .orient("bottom")
    .ticks(5)
    .tickFormat(function(d) {
		  return moment(d).format("DD MMM YYYY");
	  });

	var svg = d3.select(target)
		.append("svg")
		.attr("width", w)
		.attr("height", h);
		
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);

  var inlineDialogTemplate = require('./templates/inline_dialog.hbs');
		
	var drawSeries = _.bind(function(series) {
    var yDomain = [0, d3.max(series.data, function(d) { return d.value; })];

    var yScale = d3.scale.linear()
      .domain(yDomain)
      .range([h - padding, padding]);

    var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient(series.axisOrientation)
      .ticks(5);
      
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (series.axisOrientation == "left" ? padding : (w - padding * 2)) + ",0)")
      .call(yAxis);


    var lineFunction = d3.svg.line()
      .x(function(d) {
        return xScale(d.date.toDate());
      })
      .y(function(d) {
        return yScale(d.value);
      })
      .interpolate("basis");

    svg.append("path")
      .attr("d", lineFunction(series.data))
      .attr("stroke", series.color)
      .attr("stroke-width", 2)
      .attr("fill", "none");

    if (series.circle) {
      svg.selectAll("circle.aui-inline-dialog-trigger." + series.key)
        .data(series.data)
        .enter()
        .append("circle")
        .classed(series.key, true)
        .classed('aui-inline-dialog-trigger', true)
        .style("fill", series.color)
        .attr("cx", function(d) {
           return xScale(d.date.toDate());
        })
        .attr("cy", function(d) {
           return yScale(d.value);
        })
        .attr("r", 4)
        .style("cursor", "pointer")
        .on("click", function(d) {
          $(".jira-reporting.aui-inline-dialog").remove();

          var dialog = $(inlineDialogTemplate(d.epic)).appendTo(target);
          var arrow = dialog.find(".arrow");

          var left = d3.event.clientX + 7;
          var top = d3.event.clientY - dialog.height() / 2;
          
          if (left + 300 > w - 10) {
            // align to the left of the data point if the dialog will otherwise go off the edge of the chart
            left -= 315;
            dialog.find('#left-arrow').remove();
          } else {
            dialog.find('#right-arrow').remove();
          }
          
          dialog.offset({ left: left, top: top});

          var arrowTop = (dialog.height() - arrow.height()) / 2;
          arrow.css({ top: arrowTop });
        });
    }
      
  }, this);
		
	_(this._series)
	  .each(drawSeries);
		
		// TODO: figure out why CSS isn't being loaded for the extension
		svg.selectAll('.axis path, .axis path')
		  .style({fill: 'none', stroke: 'black', 'shape-rendering': 'crispEdges'});
}

function hideInlineDialogs(e) {
  var wasDialog = $(e.target).closest(".jira-reporting.aui-inline-dialog").length > 0;
  var wasDialogTrigger = $(e.target).closest(".cycle_time.aui-inline-dialog-trigger").length > 0;
  
  if (!(wasDialog || wasDialogTrigger)) {
    $(".jira-reporting.aui-inline-dialog").hide();
  }
}

$("body").on('click', hideInlineDialogs);

module.exports = TimeChart;
