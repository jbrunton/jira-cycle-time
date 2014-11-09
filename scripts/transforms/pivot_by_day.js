var _ = require('lodash');

module.exports = pivotByDay;

function pivotByDay(data) {
  function momentEpoch(date) {
    return date.valueOf();
  }

  var dates = _(data)
    .pluck('date')
    .sortBy(momentEpoch)
    .value();
  
  var minDate = dates[0].clone().startOf('day'),
    maxDate = dates[dates.length - 1].clone().startOf('day').add(1, 'day');
  
  // TODO: no need to sort twice in this function
  var sortedData = _(data)
    .sortBy(function(datum) {
      return momentEpoch(datum.date);
    })
    .value();
  
  var results = [],
    index = 0,
    value;
  for (var date = minDate.clone(); date.isBefore(maxDate); date.add(1, 'day')) {
    for (var datum = sortedData[index];
      index < sortedData.length && datum.date.isBefore(date);
      datum = sortedData[++index])
    {
      value = datum.value;
    }
    if (_.isNumber(value)) {
      results.push({
        date: date.clone(),
        value: value
      });
    }
  }
  
  return results;
}
