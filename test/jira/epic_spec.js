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
        summary: 'Some Epic'
      }
    });
  });
  
  describe ('#load', function() {
    var promise, request, issue;
    
    beforeEach(function() {
      issue = new Issue({
        key: 'DEMO-102',
        fields: {
          summary: 'Some Issue'
        }
      });
      spyOn(jiraClient, 'search').and.returnValue(Q([issue]));
      promise = epic.load();
      request = jasmine.Ajax.requests.mostRecent();
    });
    
    it ("searches for issues in the epic", function() {
      var expectedSearchOptions = {
        query: 'cf[' + Epic.EPIC_LINK_ID + ']=DEMO-101',
        expand: ['changelog']
      };
      expect(jiraClient.search).toHaveBeenCalledWith(expectedSearchOptions);
    });
    
    it ("assigns the issues loaded", function(done) {
      promise.then(function() {
        expect(epic.issues).toEqual([issue]);
        done();
      });
    });
  });
});
