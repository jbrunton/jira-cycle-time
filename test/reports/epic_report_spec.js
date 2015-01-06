var moment = require('moment');

var EpicReport = require('../../scripts/reports/epic_report');
var FilterWidget = require('../../scripts/ui/filter_widget');
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
    var epic;
    
    beforeEach(function() {
      epic = {
        key: 'DEMO-101',
        completedDate: moment('1 Jun 2014')
      };
      spyOn(report, 'loadEpics').and.returnValue(Q([epic]));
    });
    
    it ("renders a list of issues", function(done) {
      report.render(dom).then(function() {      
        expect(dom.find('#epics-by-size-holder')).toContainText(epic.key);
        done();
      });
    });
    
    it ("adds a filter widget", function(done) {
      report.render(dom).then(function() {      
        expect(dom).toContainElement('#filter-holder .filter-widget');
        done();
      });
    });
    
    it ("filters the epics by the exclusion filter", function(done) {
      report.render(dom).then(function() {
        dom.find('#' + FilterWidget.EXCLUSION_FILTER_ID).val(epic.key).blur();
        expect(dom.find('#epic-list-holder')).not.toContainText(epic.key);
        done();
      });      
    });

    it ("filters the epics by the date completed", function(done) {
      report.render(dom).then(function() {
        dom.find('#' + FilterWidget.SAMPLE_START_DATE_ID).val(epic.completedDate.clone().add(1, 'day')).blur();
        expect(dom.find('#epic-list-holder')).not.toContainText(epic.summary);
        done();
      });      
    });
  });
});
