var moment = require('moment');

var EpicReport = require('../../scripts/reports/epic_report');
var JiraClient = require('../../scripts/jira/jira_client'); // TODO: factory this
var Validator = require('../../scripts/shared/validator');
require('../../scripts/ui/helpers/epic_list_helper');

describe ('EpicReport', function() {
  
  var report, dom, jiraClient;
  
  beforeEach(function() {
    jiraClient = new JiraClient({
      domain: 'http://www.example.com' 
    });
    report = new EpicReport(jiraClient);
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
    it ("renders a list of issues", function(done) {
      var expectedEpics = [{
        key: 'DEMO-101 [S]', completedDate: moment()
      }];
      spyOn(report, 'loadEpics').and.returnValue(Q(expectedEpics));

      report.render(dom).then(function() {      
        expect(dom).toContainText('DEMO-101');
        done();
      });
    });
  });
});
