var EpicReport = require('../../scripts/reports/epic_report');
var JiraClient = require('../../scripts/jira/jira_client'); // TODO: factory this
var Validator = require('../../scripts/shared/validator');

describe ('EpicReport', function() {
  
  var report, dom;
  
  beforeEach(function() {
    report = new EpicReport(new JiraClient({
      domain: 'http://www.example.com' 
    }));
    dom = createEmptyReport();
  });
  
  describe ('constructor', function() {
    it ("requires an JiraClient", function() {
      expect(function() {
        new EpicReport();
      }).toThrow(Validator.messages.requires('JiraClient'));
    });
  });
  
  describe ('render', function() {
    it ("renders the report title", function() {
      report.render(dom);
      expect(dom).toHaveText(EpicReport.CHART_CONTENT);
    });
  });
});
