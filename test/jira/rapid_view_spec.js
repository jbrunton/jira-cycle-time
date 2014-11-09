var RapidView = require('../../scripts/jira/rapid_view');
var JiraClient = require('../../scripts/jira/jira_client');

describe ('RapidView', function() {
  var jiraClient, rapidView, rapidViewFilter;
  
  beforeEach(function() {
    jiraClient = new JiraClient({
      domain: 'http://www.example.com'
    });
    rapidViewFilter = "board filter";
    rapidView = new RapidView(jiraClient, {
      filter: {
        query: rapidViewFilter
      }
    });
  });
  
  describe ('#getEpics', function() {
    var promise, request;
    
    beforeEach(function() {
      promise = rapidView.getEpics();
      request = jasmine.Ajax.requests.mostRecent();
    });
    
    it ("requests epics for the rapidview board", function() {
      expect(request.method).toBe('GET');
      expect(request.contentType()).toBe('application/json');
      expect(request.url).toBe(jiraClient.domain + '/rest/api/2/search?maxResults=9999&jql=(issuetype=Epic) AND (' + rapidViewFilter + ')');    
    });
    
    xit ("returns the epics for the board", function() {
      
    });
  });
});
