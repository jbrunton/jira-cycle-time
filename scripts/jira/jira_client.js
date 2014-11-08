var _ = require('lodash');
var $ = require('jquery');

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
  if (opts && opts.query) {
    url += '?' + opts.query;
  }
  return $.ajax({
		type: 'GET',
		url: url,
    contentType: 'application/json'
  }).then(function(response) {
    return response.issues;
  });
}