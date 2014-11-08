var _ = require('lodash');
var Q = require('q');

var Issue = require('./issue');
var Class = require('../shared/class');

module.exports = Epic;

Class(Epic).extends(Issue);

function Epic(jiraClient, json) {
  this.jiraClient = jiraClient;
  Issue.call(this, json);
}

Epic.prototype.load = function() {
  var searchOpts = {
    query: 'cf[' + Epic.EPIC_LINK_ID + ']=' + this.key,
    expand: ['changelog']
  };
  
  var assignIssues = _.bind(function(issues) {
    this.issues = issues;
    return Q(this);
  }, this);
  
  return this.jiraClient.search(searchOpts)
    .then(assignIssues);
};

Epic.fromJson = function(jiraClient, json) {
  return new Epic(jiraClient, json);
};

// TODO: look this up dynamically
Epic.EPIC_LINK_ID = 10008;
