var Handlebars = require('hbsfy/runtime');
var moment = require('moment');

Handlebars.registerHelper('duration', function(duration, unit) {
  var durationString = Handlebars.Utils.escapeExpression(moment.duration(duration, 'days').as(unit).toFixed(2) + " " + unit);
  return new Handlebars.SafeString(durationString);
});
