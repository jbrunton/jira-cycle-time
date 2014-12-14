var _ = require('lodash');

module.exports = categorizeCycleTimeData;

function categorizeCycleTimeData(cycleTimeData) {
  var sortedData = _(cycleTimeData)
    .sortBy(function(x) { return x.value; })
    .value();
  
  var quartileSize = Math.round(sortedData.length / 4);
  var interquartileSize = sortedData.length - quartileSize * 2;
  var firstQuartile = _.take(sortedData, quartileSize);
  var interquartile = _.take(_.rest(sortedData, quartileSize), interquartileSize);
  var lastQuartile = _.rest(sortedData, quartileSize + interquartileSize);
  
  function getSize(epic) {
    epic = epic || {};
    var matches = /\[(S|M|L)\]/.exec(epic.summary);
    if (matches) {
      return matches[1];
    } else {
      return false;
    }
  }

  var smallEpics = _.filter(sortedData, function(x) {
    var size = getSize(x.epic);
    return size == 'S' || (!size && _.contains(firstQuartile, x));
  });
  
  var mediumEpics = _.filter(sortedData, function(x) {
    var size = getSize(x.epic);
    return size == 'M' || (!size && _.contains(interquartile, x));
  });
  
  var largeEpics = _.filter(sortedData, function(x) {
    var size = getSize(x.epic);
    return size == 'L' || (!size && _.contains(lastQuartile, x));
  });
  
  return {
    'S': smallEpics,
    'M': mediumEpics,
    'L': largeEpics
  };
};