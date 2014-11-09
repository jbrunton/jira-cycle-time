var _ = require('lodash');

module.exports = computeEvents;

function computeEvents(epics) {
  function concatEvents(events, epic) {
    function eventsFor(key) {
      var fieldName = key + 'Date';
      var date = epic[fieldName];
      if (date) {
        return [{ key: key, date: date, dateEpoch: date.valueOf(), epic: epic }]
      } else {
        return [];
      }
    }
    
    return events
      .concat(eventsFor('started'))
      .concat(eventsFor('completed'));
  }
  
  var events = _(epics)
    .reduce(concatEvents, []);
    
  var sortedEvents = _(events)
    .sortBy(function(event) {
      return event.date.valueOf();
    })
    .value();
    
  var wip = 0;
  
  for (i = 0; i < sortedEvents.length; ++i) {
    var event = sortedEvents[i];
    if (event.key == 'started') {
      ++wip;
    } else {
      --wip;
    }
    event.wip = wip;
  }
  
  return sortedEvents;
}