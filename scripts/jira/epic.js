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
    this.startedDate = this.computeStartedDate();
    this.completedDate = this.computeCompletedDate();
    this.cycleTime = this.computeCycleTime('days');
    return Q(this);
  }, this);
  
  return this.jiraClient.search(searchOpts)
    .then(assignIssues);
};

Epic.prototype.computeStartedDate = function() {
  var startedDates = _(this.issues)
    .map(function(issue) {
      return issue.startedDate;
    })
    .compact();
    
  if (startedDates.any()) {
    var startedDate = startedDates
      .min(function(date) {
        return date.unix();
      })
      .value();
      
    return startedDate;
  } else {
    return null;
  }
};

Epic.prototype.computeCompletedDate = function() {
  var completedDates = _(this.issues)
    .map(function(issue) {
      return issue.completedDate;
    })
    .compact();
    
  if (completedDates.any() && completedDates.all()) {
    var completedDate = completedDates
      .max(function(date) {
        return date.unix();
      })
      .value();
      
    return completedDate;
  } else {
    return null;
  }
};

Epic.prototype.computeCycleTime = function(unit) {
  if (this.startedDate && this.completedDate) {
    return this.completedDate.diff(this.startedDate, unit, true);
  }
}

Epic.fromJson = function(jiraClient, json) {
  return new Epic(jiraClient, json);
};

// TODO: look this up dynamically
Epic.EPIC_LINK_ID = 10008;
