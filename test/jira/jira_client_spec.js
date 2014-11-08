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
      promise = client.search();
      request = jasmine.Ajax.requests.mostRecent();
    });
    
    it ("searches for Jira issues", function() {
      expect(request.method).toBe('GET');
      expect(request.contentType()).toBe('application/json');
      expect(request.url).toBe(domain + '/rest/api/2/search');      
    });      
    
    it ("returns the issues in the response", function(done) {
      var expectedKey = 'DEMO-101';
      var expectedSummary = 'Some Issue';

      request.response(createSuccessfulResponse({
        issues: [{
          key: expectedKey,
          fields: {
            summary: expectedSummary,
            issuetype: {
              name: 'Story'
            }
          }
        }]
      }));
    
      promise.then(function(issues) {
        expect(issues[0].key).toEqual(expectedKey);
        expect(issues[0].summary).toEqual(expectedSummary);
        done();
      });
    });
    
    it ("searches by the given query, if one is provided", function() {
      client.search({ query: 'issuetype=Epic' })
      request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe(domain + '/rest/api/2/search?jql=issuetype=Epic');
    });
    
    it ("expands the given query parameters, if provided", function() {
      client.search({
        query: 'issuetype=Epic',
        expand: ['transitions', 'changelog']
      });
      request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe(domain + '/rest/api/2/search?expand=transitions,changelog&jql=issuetype=Epic');
    });
  });
  
  describe ('#getEpics', function() {
    var promise, request;
    
    beforeEach(function() {
      promise = client.getEpics();
      request = jasmine.Ajax.requests.mostRecent();
    });
    
    it ("searches for epics in Jira", function() {
      expect(request.method).toBe('GET');
      expect(request.contentType()).toBe('application/json');
      expect(request.url).toBe(domain + '/rest/api/2/search?jql=issuetype=Epic');      
    });
    
    it ("returns the epics in the response", function(done) {
      var expectedKey = 'DEMO-101';
      var expectedSummary = 'Some Epic';

      request.response(createSuccessfulResponse({
        issues: [{
          key: expectedKey,
          fields: {
            summary: expectedSummary,
            issuetype: {
              name: 'Epic'
            }
          }
        }]
      }));
    
      promise.then(function(epics) {
        expect(epics[0].key).toEqual(expectedKey);
        expect(epics[0].summary).toEqual(expectedSummary);
        done();
      });
    });
  });
});
