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
  
  return {
    'S': firstQuartile,
    'M': interquartile,
    'L': lastQuartile
  };
};