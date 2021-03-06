var moment = require('moment');

var JiraClient = require('../../scripts/jira/jira_client');
var Epic = require('../../scripts/jira/epic');
var Issue = require('../../scripts/jira/issue');

describe ('Epic', function() {
  var epic, jiraClient;
  
  beforeEach(function() {
    jiraClient = new JiraClient({
      domain: 'http://www.example.com' 
    });
    epic = new Epic(jiraClient, {
      key: 'DEMO-101',
      fields: {
        summary: 'Some Epic',
        customfield_10002: {
          value: "Done"
        }
      }
    });
    spyOn(jiraClient, 'getEpicLinkFieldId').and.returnValue(Q(10001));
    spyOn(jiraClient, 'getEpicStatusFieldId').and.returnValue(Q(10002));
  });
  
  describe ('#load', function() {
    var promise, request, issue;
    
    beforeEach(function() {
      issue = new Issue({
        key: 'DEMO-102',
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
            }
          ]
        }
      });
      spyOn(jiraClient, 'search').and.returnValue(Q([issue]));
      promise = epic.load();
      request = jasmine.Ajax.requests.mostRecent();
    });
    
    it ("searches for issues in the epic", function(done) {
      var expectedSearchOptions = {
        query: 'cf[' + 10001 + ']=DEMO-101',
        expand: ['changelog']
      };
      promise.then(function() {
        expect(jiraClient.search).toHaveBeenCalledWith(expectedSearchOptions);
        done();
      });
    });
    
    it ("assigns the issues loaded", function(done) {
      promise.then(function() {
        expect(epic.issues).toEqual([issue]);
        done();
      });
    });
    
    it ("assigns the date and cycle time of the epic", function() {
      var expectedStartedDate = moment("2014-01-01T12:30:00.000+0100");
      var expectedCompletedDate = moment("2014-01-02T12:30:00.000+0100");
      
      // spyOn(epic, 'computeStartedDate').and.returnValue(expectedStartedDate);
      // spyOn(epic, 'computeCompletedDate').and.returnValue(expectedCompletedDate);
      
      promise.then(function() {
        expect(epic.startedDate).toBeSameTimeAs(expectedStartedDate);
        expect(epic.completedDate).toBeSameTimeAs(expectedCompletedDate);
      })
    });
    
    it ("doesn't assign a completed date if the epic is incomplete in Greenhopper", function(done) {
      epic._json.fields.customfield_10002.value = "To Do";
      jiraClient.search.and.returnValue(Q([issue]));
      epic.load().then(function() {
        expect(epic.completedDate).toBeNull();
        done();
      });      
    });
  });
});
