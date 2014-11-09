var _ = require('lodash');

var computeEvents = require('./compute_events');
var pivotByDay = require('./pivot_by_day');

module.exports = computeWipSeries;

function computeWipSeries(epics) {
  var events = computeEvents(epics);

  var wipValues = _(events)
    .map(function(event) {
      return {
        date: event.date,
        value: event.wip
      };
    })
    .value();

  var wipValuesByDay = pivotByDay(wipValues);

  return wipValuesByDay;
}
