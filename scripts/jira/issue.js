var _ = require('lodash');
var moment = require('moment');

module.exports = Issue;

function Issue(json) {
  // _.assign(this, json);
  this.key = json.key;
  this.summary = json.fields.summary;
  
  if (json.changelog) {
    this.startedDate = getStartedDate(json.changelog);
    this.completedDate = getCompletedDate(json.changelog);
  }
}

Issue.fromJson = function(json) {
  return new Issue(json);
};

function isStatusTransition(item) {
  return item.field == "status";  
}

function isStartedTransition(item) {
  // TODO: allow this to be configured
  return isStatusTransition(item)
    && (item.toString == "In Progress" || item.toString == "Started");
}

function isCompletedTransition(item) {
  // TODO: allow this to be configured
  return isStatusTransition(item)
    && (item.toString == "Done" || item.toString == "Closed");  
}

function getStartedDate(changelog) {
  var startedTransitions = _(changelog.histories)
    .filter(function(history) {
      return _(history.items).any(function(item) {
        return isStatusTransition(item);
      });
    });

  if (startedTransitions.any()) {
    return moment(startedTransitions.first().created);
  } else {
    return null;
  }
}

function getCompletedDate(changelog) {
  var lastTransition = _(changelog.histories)
    .filter(function(entry) {
      return _(entry.items)
        .any(isStatusTransition);
    }).last();

  if (lastTransition && _(lastTransition.items)
    .any(isCompletedTransition)) {
    return moment(lastTransition.created);
  } else {
    return null;
  }
}