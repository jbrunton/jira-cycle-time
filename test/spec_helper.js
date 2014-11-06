var reportTemplate = require('./fixtures/templates/report.hbs');

global._ = require('lodash');
global.$ = require('jquery');
global.q = require('q');

beforeEach(function() {
  jasmine.Ajax.install();
  jasmine.Ajax.requests.reset();
});

global.createSuccessfulResponse = function(responseData) {
  var response = {
    status: 200,
    responseText: JSON.stringify(responseData)
  };

  return response;
}

global.createEmptyReport = function() {
  return jasmine.getFixtures().set(reportTemplate());
}
