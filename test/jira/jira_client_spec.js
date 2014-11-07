var JiraClient = require('../../scripts/jira/jira_client');
var Validator = require('../../scripts/shared/validator');

describe ('JiraClient', function() {
  var client, domain, validOpts;
  
  beforeEach(function() {
    domain = 'http://www.example.com';

    var validOpts = {
      domain: domain
    };

    client = new JiraClient(validOpts);
  });
  
  describe ('constructor', function() {
    it ("initialises the instance", function() {
      expect(client.domain).toBe(domain);
    });
    
    it ("requires an opts param", function() {
      expect(function() {
        new JiraClient();
      }).toThrow(Validator.messages.requires('opts'));
    });
    
    it ("requires a title", function() {
      expect(function() {
        var opts = _.omit(validOpts, 'domain');
        new JiraClient(opts);
      }).toThrow(Validator.messages.requires('opts.domain'));
    });
  });
  
  describe ('#search', function() {
    var promise, request;
    
    beforeEach(function() {
      promise = client.search({ query: 'issuetype=Epic' });
      request = jasmine.Ajax.requests.mostRecent();
    });
    
    it ("requests all issues matching the search query", function() {
      expect(request.method).toBe('GET');
      expect(request.contentType()).toBe('application/json');
      expect(request.url).toBe(domain + '/rest/api/2/search?issuetype=Epic');
    });
    
    it ("returns the issues in the response", function(done) {
      var expectedIssues = [
        { key: 'DEMO-101' }
      ];

      request.response(createSuccessfulResponse({
        issues: expectedIssues
      }));
      
      promise.then(function(issues) {
        expect(issues).toEqual(expectedIssues);
        done();
      });
    });
  });
});