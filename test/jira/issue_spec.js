var moment = require('moment');
var Issue = require('../../scripts/jira/issue');

describe ('Issue', function() {
  var issue;
  
  beforeEach(function() {
    issue = new Issue({
      key: 'DEMO-101',
      fields: {
        summary: 'Some Issue'
      },
      changelog: {
        histories: [
          {
            created: "2014-01-01T12:30:00.000+0100",
            items: [
              {
                field: "status",
                toString: "In Progress"
              }
            ]
          },
          {
            created: "2014-01-02T12:30:00.000+0100",
            items: [
              {
                field: "status",
                toString: "Done"
              }
            ]
          },
          {
            created: "2014-01-03T12:30:00.000+0100",
            items: [
              {
                field: "status",
                toString: "In Progress"
              }
            ]
          },
          {
            created: "2014-01-04T12:30:00.000+0100",
            items: [
              {
                field: "status",
                toString: "Done"
              }
            ]
          }
        ]
      }
    })
  });
  
  describe ('constructor', function() {
    it ("initialises the instance", function() {
      expect(issue.key).toBe('DEMO-101');
      expect(issue.summary).toBe('Some Issue');
    });
    
    it ("calculates the started date", function() {
      var expectedDate = moment("2014-01-01T12:30:00.000+0100");
      expect(issue.startedDate).toBeSameTimeAs(expectedDate);
    });
    
    it ("calculates the completed date", function() {
      var expectedDate = moment("2014-01-04T12:30:00.000+0100");
      expect(issue.completedDate).toBeSameTimeAs(expectedDate);
    });
  });
});
