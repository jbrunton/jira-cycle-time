var _ = require('lodash');
var Q = require('q');

var Issue = require('./issue');
var Class = require('../shared/class');

module.exports = Epic;

Class(Epic).extends(Issue);

function Epic(jiraClient, json) {
  this.jiraClient = jiraClient;
  this._json = json;
  Issue.call(this, json);
}

Epic.prototype.load = function() {
  var updateStatus = this.jiraClient.getEpicStatusFieldId().then(_.bind(function(fieldId) {
    this.status = this._json.fields['customfield_' + fieldId].value;
    return Q(this);
  }, this));
  
  var assignIssues = _.bind(function(issues) {
    this.issues = issues;
    this.startedDate = this.computeStartedDate();
    this.completedDate = this.computeCompletedDate();
    this.cycleTime = this.computeCycleTime('days');
    return Q(this);
  }, this);
  
  var searchForIssues = this.jiraClient.getEpicLinkFieldId().then(_.bind(function(epicLinkId) {
    var searchOpts = {
      query: 'cf[' + epicLinkId + ']=' + this.key,
      expand: ['changelog']
    };
    return this.jiraClient.search(searchOpts);
  }, this));
  
  return updateStatus
    .then(function() {
      return searchForIssues.then(assignIssues);
    });
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
  if (this.status != "Done") {
    return null;
  }
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
// Epic.EPIC_LINK_ID = 10008;
// Epic.EPIC_LINK_ID = 10800;
