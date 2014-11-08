var Handlebars = require('hbsfy/runtime');

Handlebars.registerHelper('date', function(date) {
  if (date) {
    var dateString = Handlebars.Utils.escapeExpression(date.format('MMMM Do YYYY, h:mm:ss a'));
    return new Handlebars.SafeString(dateString);
  }
});
