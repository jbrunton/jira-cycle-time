var Handlebars = require('hbsfy/runtime');
var epicListTemplate = require('./templates/epic_list.hbs');

Handlebars.registerHelper('epic_list', function(epics) {
  return new Handlebars.SafeString(epicListTemplate(epics));
});
