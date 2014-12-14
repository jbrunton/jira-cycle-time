var categorizeCycleTimeData = require('../../scripts/transforms/categorize_cycle_time_data');

describe ('categorizeCycleTimeData', function() {
  it ("categorizes data points according to the quartile ranges, by default", function() {
    var data = [
      { value: 4 }, { value: 2 }, { value: 1 }, { value: 3 }
    ];
    var categorizedData = categorizeCycleTimeData(data);
    expect(categorizedData).toEqual({
      S: [{ value: 1 }],
      M: [{ value: 2 }, {value: 3}],
      L: [{ value: 4 }]
    });
  });
  
  it ("categorizes data points by the size of the epic, if defined", function() {
    var smallEpic = { value: 3, epic: { summary: 'Some Epic [S]'} };
    var mediumEpic = { value: 4, epic: { summary: 'Some Epic [M]' } };
    var largeEpic = { value: 2, epic: { summary: 'Some Epic [L]'} };
    var data = [
      mediumEpic, largeEpic, smallEpic, { value: 1 }
    ];
    var categorizedData = categorizeCycleTimeData(data);
    expect(categorizedData).toEqual({
      S: [{ value: 1 }, smallEpic],
      M: [mediumEpic],
      L: [largeEpic]
    });  
  });
});
