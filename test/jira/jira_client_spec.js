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
      expect(request.url).toBe(domain + '/rest/api/2/search?maxResults=9999');      
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
      expect(request.url).toBe(domain + '/rest/api/2/search?maxResults=9999&jql=issuetype=Epic');
    });
    
    it ("expands the given query parameters, if provided", function() {
      client.search({
        query: 'issuetype=Epic',
        expand: ['transitions', 'changelog']
      });
      request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe(domain + '/rest/api/2/search?maxResults=9999&expand=transitions,changelog&jql=issuetype=Epic');
    });
  });
  
  // describe ('#getEpics', function() {
  //   var promise, request;
  //
  //   beforeEach(function() {
  //     promise = client.getEpics();
  //     request = jasmine.Ajax.requests.mostRecent();
  //   });
  //
  //   it ("searches for epics in Jira", function() {
  //     expect(request.method).toBe('GET');
  //     expect(request.contentType()).toBe('application/json');
  //     expect(request.url).toBe(domain + '/rest/api/2/search?jql=issuetype=Epic');
  //   });
  //
  //   it ("returns the epics in the response", function(done) {
  //     var expectedKey = 'DEMO-101';
  //     var expectedSummary = 'Some Epic';
  //
  //     request.response(createSuccessfulResponse({
  //       issues: [{
  //         key: expectedKey,
  //         fields: {
  //           summary: expectedSummary,
  //           issuetype: {
  //             name: 'Epic'
  //           }
  //         }
  //       }]
  //     }));
  //
  //     promise.then(function(epics) {
  //       expect(epics[0].key).toEqual(expectedKey);
  //       expect(epics[0].summary).toEqual(expectedSummary);
  //       done();
  //     });
  //   });
  // });
  
  describe ('#getFields', function() {
    var promise, request;
    
    beforeEach(function() {
      promise = client.getFields();
      request = jasmine.Ajax.requests.mostRecent();
    });
    
    it ("searches for fields in Jira", function() {
      expect(request.method).toBe('GET');
      expect(request.contentType()).toBe('application/json');
      expect(request.url).toBe(domain + '/rest/api/2/field');      
    });
    
    it ("returns the fields in the response", function(done) {
      var expectedId = 10010;
      var expectedName = 'Epic Link';

      request.response(createSuccessfulResponse([
        {
          id: "customfield_10010",
          name: expectedName,
          custom: true,
          schema: {
            customId: expectedId
          }
        }
      ]));
    
      promise.then(function(fields) {
        expect(fields[0].name).toEqual(expectedName);
        expect(fields[0].schema.customId).toEqual(expectedId);
        done();
      });
    });
    
  });
  
  describe ('#getEpicLinkFieldId', function() {
    it ("returns a promise for the Epic Link custom field id", function(done) {
      spyOn(client, 'getFields').and.returnValue(Q([
        {
          id: "customfield_10001",
          name: 'Some Field',
          custom: true,
          schema: {
            customId: 10001
          }
        },
        {
          id: "customfield_10010",
          name: 'Epic Link',
          custom: true,
          schema: {
            customId: 10010
          }
        }
      ]));
      
      client.getEpicLinkFieldId().then(function(id) {
        expect(id).toBe(10010);
        done();
      });
    });
  });
  
  describe ('#getEpicStatusFieldId', function() {
    it ("returns a promise for the Epic Status custom field id", function(done) {
      spyOn(client, 'getFields').and.returnValue(Q([
        {
          id: "customfield_10001",
          name: 'Some Field',
          custom: true,
          schema: {
            customId: 10001
          }
        },
        {
          id: "customfield_10020",
          name: 'Epic Status',
          custom: true,
          schema: {
            customId: 10020
          }
        }
      ]));
      
      client.getEpicStatusFieldId().then(function(id) {
        expect(id).toBe(10020);
        done();
      });
    });
  });
  
  describe ('#getRapidViews', function() {
    var promise, request;
    
    beforeEach(function() {
      promise = client.getRapidViews();
      request = jasmine.Ajax.requests.mostRecent();
    });
    
    it ("requests all rapid views from Jira", function() {
      expect(request.method).toBe('GET');
      expect(request.contentType()).toBe('application/json');
      expect(request.url).toBe(domain + '/rest/greenhopper/1.0/rapidviews/list');    
    });
    
    it ("returns a promise which resolves to a list of rapidviews", function(done) {
      request.response(createSuccessfulResponse({
        views: [
          {
            id: 101,
            name: "Some Project",
            filter: {
              id: 10001,
              name: "Filter for Some Project",
              query: 'project = "Another Project" ORDER BY Rank ASC'
            }
          }
        ]
      }));
    
      promise.then(function(rapidViews) {
        expect(rapidViews[0].name).toEqual("Some Project");
        expect(rapidViews[0].id).toEqual(101);
        done();
      });
    });
  });
});
