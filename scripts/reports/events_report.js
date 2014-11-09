var $ = require('jquery');
var _ = require('lodash');
var Q = require('q');

var Class = require('../shared/class');
var BaseReport = require('./base_report');
var eventsReportTemplate = require('./templates/events_report.hbs');
var computeEvents = require('../transforms/compute_events');

module.exports = EventsReport;

Class(EventsReport).extends(BaseReport);

function EventsReport(jiraClient) {
  BaseReport.call(this, {
    jiraClient: jiraClient,
    title: 'Events Report'
  });
}

EventsReport.prototype.render = function(target) {
  var renderReport = function(epics) {
    var events = computeEvents(epics);
    $(target).append(
      eventsReportTemplate({ events: events })
    );
  };

  return this.loadEpics(target).then(renderReport);
}

