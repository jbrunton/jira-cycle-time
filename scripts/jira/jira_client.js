var _ = require('lodash');
var $ = require('jquery');

var Issue = require('./issue');
var Validator = require('../shared/validator');

module.exports = JiraClient;

function JiraClient(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.domain, 'opts.domain');
    
  _.assign(this, opts);
}

JiraClient.prototype.search = function(opts) {
  var url = this.domain + '/rest/api/2/search';
  if (opts) {
    if (opts.query || opts.expand) {
      url += '?';
    }
    
    if (opts.expand) {
      url += 'expand=' + opts.expand.join();
    }
    
    if (opts.query) {
      if (opts.expand) {
        url += '&';
      }
      url += 'jql=' + opts.query;
    }
  }
  
  return $.ajax({
		type: 'GET',
		url: url,
    contentType: 'application/json'
  }).then(function(response) {
    return _(response.issues)
      .map(Issue.fromJson)
      .value();
  });
}