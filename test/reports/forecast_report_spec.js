var ForecastReport = require('../../scripts/reports/forecast_report');
var JiraClient = require('../../scripts/jira/jira_client'); // TODO: factory this

describe ('ForecastReport', function() {
  var report, dom;
  
  beforeEach(function() {
    var jiraClient = new JiraClient({
      domain: 'http://www.example.com' 
    });
    report = new ForecastReport(jiraClient);
    dom = createEmptyReport();
  });
  
  describe ('#_validateBacklog', function() {
    var target, backlogDescription;
    
    beforeEach(function() {
      target = $("<div>");
      backlogDescription = {
        S: 1,
        M: 1,
        L: 1
      };
    });
    
    it ("returns true if the sample data set includes epics for all required sizes", function() {
      // validation checks are based on the lengths of the arrays, so empty objects suffice as dummy objects
      var sampleData = {
        S: [{}],
        M: [{}],
        L: [{}]
      };
      expect(report._validateBacklog(target, backlogDescription, sampleData)).toBe(true);
    });
    
    it ("fails validation if a required size is missing from the backlog description", function() {
      var sampleData = {
        S: [{}],
        M: [],
        L: [{}]
      };
      expect(report._validateBacklog(target, backlogDescription, sampleData)).toBe(false);
      expect(target).toContainText("Cannot forecast for [M] epics as there were none in the sample set");
    });
  });
});
