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
    it ("renders a list of issues", function(done) {
      var expectedEpics = [{
        key: 'DEMO-101', completedDate: moment()
      }];
      spyOn(report, 'loadEpics').and.returnValue(Q(expectedEpics));
      report.render(dom).then(function() {      
        expect(dom.find('#epic-list-holder')).toContainText('DEMO-101');
        done();
      });
    });
    
    it ("adds a filter widget", function(done) {
      var expectedEpics = [{
        key: 'DEMO-101', completedDate: moment()
      }];
      spyOn(report, 'loadEpics').and.returnValue(Q(expectedEpics));
      report.render(dom).then(function() {      
        expect(dom).toContainElement('#filter-holder .filter-widget');
        done();
      });
    });
    
    it ("filters the epics by the exclusion filter", function(done) {
      var expectedEpics = [{
        key: 'DEMO-101', completedDate: moment()
      }];
      spyOn(report, 'loadEpics').and.returnValue(Q(expectedEpics));
      report.render(dom).then(function() {
        dom.find('#' + FilterWidget.EXCLUSION_FILTER_ID).val('DEMO-101').blur();
        expect(dom.find('#epic-list-holder')).not.toContainText('DEMO-101');
        done();
      });      
    });

    it ("filters the epics by the date completed", function(done) {
      var expectedEpics = [{
        key: 'DEMO-101', completedDate: moment('1 Jun 2014')
      }];
      spyOn(report, 'loadEpics').and.returnValue(Q(expectedEpics));
      report.render(dom).then(function() {
        dom.find('#' + FilterWidget.SAMPLE_START_DATE_ID).val('1 Jul 2014').blur();
        expect(dom.find('#epic-list-holder')).not.toContainText('DEMO-101');
        done();
      });      
    });
  });
});
