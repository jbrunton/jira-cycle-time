var _ = require('lodash');
var $ = require('jquery');
var Q = require('q');

var Validator = require('../shared/validator');

module.exports = BaseReport;

var loadEpicsPromise;

function BaseReport(opts) {
  new Validator()
    .requires(opts, 'opts')
    .requires(opts.jiraClient, 'JiraClient')
    .requires(opts.title, 'title');  
  
  _.assign(this, opts);
}

BaseReport.prototype.loadEpics = function() {
  function getIndicator() {
    return $('body').find('#ghx-report #loading-indicator');
  }
  
  function getEpics(rapidView) {
    return rapidView.getEpics();
  }
  
  function removeIndicator(epics) {
    getIndicator().remove();
    return epics;
  }
  
  function loadEpics(epics) {
    var loaded = 0;
    
    return Q.all(
      _(epics).map(function(epic) {
        return epic.load().then(function(epic) {
          ++loaded;
          getIndicator().text('Loaded ' + loaded + ' of ' + epics.length + ' epics');
          return epic;
        });
      }).value()
    );
  };
  
  if (loadEpicsPromise) {
    return loadEpicsPromise;
  } else {  
    getIndicator().text('Loading epics...');

    loadEpicsPromise = this.jiraClient
      .getCurrentRapidView()
      .then(getEpics)
      .then(loadEpics)
      .then(removeIndicator);
    
    return loadEpicsPromise;
  }
}