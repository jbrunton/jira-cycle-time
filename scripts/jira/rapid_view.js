var _ = require('lodash');

var QueryBuilder = require('./query_builder');

module.exports = RapidView;

function RapidView(jiraClient, json) {
  this.jiraClient = jiraClient;
  _.assign(this, json);
  _.bindAll(this);
}

RapidView.prototype.getEpics = function() {
  var queryBuilder = new QueryBuilder("issuetype=Epic");
  queryBuilder.and(this.filter.query);
  
  return this.jiraClient.search({
    query: queryBuilder.getQuery()
  });
};