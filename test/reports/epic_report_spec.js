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
    var epicOne, epicTwo;
    
    beforeEach(function() {
      epicOne = {
        key: 'DEMO-101',
        completedDate: moment('1 Jun 2014'),
        cycleTime: 1
      };
      epicTwo = {
        key: 'DEMO-102',
        completedDate: moment('1 Jul 2014'),
        cycleTime: 2
      };
      spyOn(report, 'loadEpics').and.returnValue(Q([epicOne, epicTwo]));
    });
    
    it ("renders a list of issues", function(done) {
      report.render(dom).then(function() {      
        expect(dom.find('#epics-by-size-holder')).toContainText(epicOne.key);
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
        dom.find('#' + FilterWidget.EXCLUSION_FILTER_ID).val(epicOne.key).blur();
        expect(dom.find('#epic-list-holder')).not.toContainText(epicOne.key);
        done();
      });      
    });

    it ("filters the epics by the date completed", function(done) {
      report.render(dom).then(function() {
        dom.find('#' + FilterWidget.SAMPLE_START_DATE_ID).val(epicOne.completedDate.clone().add(1, 'day')).blur();
        expect(dom.find('#epic-list-holder')).not.toContainText(epicOne.summary);
        done();
      });      
    });
    
    it ("displays the mean cycle time", function(done) {
      report.render(dom).then(function() {
        expect(dom.find('#mean-cycle-time').text()).toBe('1.5');
        done();
      });
    });
    
    it ("excludes fitlered epics from cycle time calculations", function(done) {
      report.render(dom).then(function() {
        dom.find('#' + FilterWidget.EXCLUSION_FILTER_ID).val(epicOne.key).blur();
        expect(dom.find('#mean-cycle-time').text()).toBe('2');
        done();
      });
    });
  });
});
