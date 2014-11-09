var _ = require('lodash');

module.exports = computeCycleTimeSeries;

function computeCycleTimeSeries(epics) {
  return _(epics)
        .filter(function(epic) {
          return !!epic.completedDate;
        })
        .map(function(epic) {
          return {
            date: epic.completedDate,
            value: epic.cycleTime,
            epic: epic
          };
        })
        .sortBy(function(value) {
          return value.date.valueOf();
        })
        .value();
}
