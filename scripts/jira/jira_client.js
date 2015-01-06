var _ = require('lodash');
var $ = require('jquery');
var Q = require('q');

var Issue = require('./issue');
var Epic = require('./epic');
var RapidView = require('./rapid_view');
var Validator = require('../shared/validator');

module.exports = JiraClient;

function JiraClient(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.domain, 'opts.domain');
    
  _.assign(this, opts);
}

JiraClient.prototype.search = function(opts) {
  var url = this.domain + '/rest/api/2/search?maxResults=9999';
  if (opts) {
    if (opts.expand) {
      url += '&expand=' + opts.expand.join();
    }
    
    if (opts.query) {
      url += '&jql=' + opts.query;
    }
  }
  
  var fromJson = _.bind(function(json) {
    if (json.fields.issuetype.name == 'Epic') {
      return Epic.fromJson(this, json);
    } else {
      return Issue.fromJson(json);
    }    
  }, this);
  
  return Q(
      $.ajax({
		    type: 'GET',
		    url: url,
        contentType: 'application/json'
      })
  ).then(function(response) {
    return _(response.issues)
      .map(fromJson)
      .value();
  });
}

// JiraClient.prototype.getEpics = function() {
//   return this.search({ query: 'issuetype=Epic' });
// }

JiraClient.prototype.getFields = function() {
  if (!this._getFieldsPromise) {
    this._getFieldsPromise = Q(
      $.ajax({
        type: 'GET',
        url: this.domain + '/rest/api/2/field',
        contentType: 'application/json'
      })
    );    
  }
  return this._getFieldsPromise;
};

JiraClient.prototype.getEpicLinkFieldId = function() {
  return this.getFields()
    .then(function(fields) {
      return _(fields).find(function(field) {
        return field.name == 'Epic Link';
      });
    })
    .then(function(field) {
      return field.schema.customId;
    });
};

JiraClient.prototype.getEpicStatusFieldId = function() {
  return this.getFields()
    .then(function(fields) {
      return _(fields).find(function(field) {
        return field.name == 'Epic Status';
      });
    })
    .then(function(field) {
      return field.schema.customId;
    });
};

JiraClient.prototype.getRapidViews = function() {
  var createRapidView = _.bind(function(json) {
    return new RapidView(this, json);
  }, this);
  
  return Q(
    $.ajax({
      type: 'GET',
      url: this.domain + '/rest/greenhopper/1.0/rapidviews/list',
      contentType: 'application/json'
    })
  ).then(function(response) {
    return _(response.views)
      .map(createRapidView)
      .value();
  });
};

//TODO: test this
JiraClient.prototype.getRapidViewById = function(rapidViewId) {
  return this.getRapidViews().then(function(views) {
    return _(views).find(function(view) {
      return view.id == rapidViewId;
    });
  });
}

//TODO: test this
JiraClient.prototype.getCurrentRapidView = function() {
  var rapidViewId = /rapidView=(\d*)/.exec(window.location.href)[1];
  return this.getRapidViewById(rapidViewId);
}